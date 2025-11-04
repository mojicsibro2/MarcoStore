import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, PercentageDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { User, UserRole } from 'src/shared/entities/user.entity';
import { CategoryService } from 'src/app/category/services/category.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductStatus } from 'src/shared/entities/product.entity';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ProductImage } from 'src/shared/entities/product-image.entity';
import { FilterProductDto } from '../dto/filter-product.dto';
import { CloudinaryService } from '../cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    dto: CreateProductDto,
    supplier: User,
    file?: Express.Multer.File,
  ): Promise<Product> {
    if (supplier.role !== UserRole.SUPPLIER) {
      throw new ForbiddenException('Only suppliers can create products');
    }

    const category = await this.categoryService.findOne(dto.categoryId);
    if (!category) throw new BadRequestException('Invalid category');

    // ✅ automatic transaction management (no try/catch)
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const product = manager.create(Product, {
        ...dto,
        basePrice: dto.basePrice,
        supplier,
        category,
        status: ProductStatus.PENDING,
      });

      const savedProduct = await manager.save(Product, product);

      if (file) {
        const imageEntity = await this.uploadSingleImage(
          manager,
          savedProduct,
          file,
        );
        savedProduct.image = imageEntity;
        await manager.save(Product, savedProduct);
      }

      return await manager.findOne(Product, {
        where: { id: savedProduct.id },
        relations: ['supplier', 'category', 'image'],
      });
    });
  }

  // ✅ Safe upload – only saves when Cloudinary upload succeeds
  private async uploadSingleImage(
    manager: EntityManager,
    product: Product,
    file: Express.Multer.File,
  ): Promise<ProductImage> {
    const result = await this.cloudinaryService.uploadImage(file);

    if (!result || !result.secure_url) {
      throw new BadRequestException('Image upload failed');
    }

    const imageEntity = manager.create(ProductImage, {
      imageUrl: result.secure_url,
      product,
    });

    return await manager.save(ProductImage, imageEntity);
  }

  public async findOneByOption(
    where: FindOptionsWhere<Product>,
  ): Promise<Product | null> {
    return await this.productRepository.findOne({ where });
  }

  // ✅ Supplier: Get all their products (paginated)
  async findAllBySupplier(supplier: User, pagination: PaginationDto) {
    if (supplier.role !== UserRole.SUPPLIER) {
      throw new ForbiddenException('Only suppliers can view their products');
    }

    const { page = 1, pageSize = 10 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .leftJoinAndSelect('product.image', 'image')
      .where('product.supplierId = :id', { id: supplier.id })
      .skip(skip)
      .take(pageSize)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    const lastPage = Math.ceil(total / pageSize);
    const currentPage = skip / pageSize + 1;

    return {
      data: data.map((p) => ({
        ...p,
        basePrice: p.basePrice, // 👈 add explicitly
      })),
      meta: { total, currentPage, lastPage },
    };
  }

  async pendingProducts(pagination: PaginationDto) {
    const { page = 1, pageSize = 10 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.productRepository.findAndCount({
      where: { status: ProductStatus.PENDING },
      relations: ['category', 'supplier', 'image'],
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    const lastPage = Math.ceil(total / pageSize);
    const currentPage = skip / pageSize + 1;
    return { data, meta: { total, currentPage, lastPage } };
  }

  async findAllFiltered(filter: FilterProductDto) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = filter;

    const skip = (page - 1) * limit;

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoinAndSelect('product.image', 'image')
      .addSelect(['category.name'])
      .where('product.status = :status', { status: ProductStatus.ACTIVE });

    if (search)
      query.andWhere('product.name LIKE :search', { search: `%${search}%` });
    if (category)
      query.andWhere('category.name LIKE :category', {
        category: `%${category}%`,
      });
    if (minPrice)
      query.andWhere('product.finalPrice >= :minPrice', { minPrice });
    if (maxPrice)
      query.andWhere('product.finalPrice <= :maxPrice', { maxPrice });

    query.orderBy('product.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();
    const lastPage = Math.ceil(total / limit);
    const currentPage = skip / limit + 1;

    return { data, meta: { total, currentPage, lastPage } };
  }

  async adminFindAllFiltered(
    pagination: PaginationDto,
    status?: ProductStatus, // explicitly ensuring it's ProductStatus
  ) {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 10;
    const skip = (page - 1) * pageSize;

    // Make sure `status` is a valid ProductStatus value if it's provided
    const validStatus = Object.values(ProductStatus).includes(status)
      ? status
      : undefined;

    const where = validStatus ? { status: validStatus } : {};

    const [products, totalProducts] = await this.productRepository.findAndCount(
      {
        where,
        skip,
        take: pageSize,
        order: { createdAt: 'DESC' },
        relations: ['supplier', 'category'],
        select: [
          'id',
          'name',
          'description',
          'basePrice',
          'finalPrice',
          'stock',
          'status',
          'supplier',
          'category',
          'createdAt',
        ],
      },
    );

    return {
      data: products,
      meta: {
        total: totalProducts,
        currentPage: page,
        lastPage: Math.ceil(totalProducts / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'supplier'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return { ...product, basePrice: product.basePrice };
  }

  async update(id: string, dto: UpdateProductDto, user: User) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('product.id = :id', { id })
      .select([
        'product.id',
        'product.name',
        'product.description',
        'product.basePrice',
        'product.finalPrice',
        'product.status',
        'product.stock',
        'category.id',
        'category.name',
        'supplier.id',
        'supplier.name',
        'image.id',
        'image.imageUrl',
      ])
      .getOne();

    if (user.role === UserRole.SUPPLIER && product.supplier.id !== user.id)
      throw new ForbiddenException('You can only update your own products');

    if (dto.categoryId) {
      const category = await this.categoryService.findOne(dto.categoryId);
      if (!category) throw new BadRequestException('Invalid category');
      product.category = category;
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: string, user: User) {
    const product = await this.findOne(id);

    if (user.role === UserRole.SUPPLIER && product.supplier.id !== user.id)
      throw new ForbiddenException('You can only delete your own products');

    await this.productRepository.remove(product);
    return { message: `Product '${product.name}' deleted successfully` };
  }

  async approve(id: string, approver: User, dto: PercentageDto) {
    if (![UserRole.ADMIN, UserRole.EMPLOYEE].includes(approver.role))
      throw new ForbiddenException('Only employees or admins can approve');

    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');

    const basePrice = Number(product.basePrice);
    if (isNaN(basePrice))
      throw new BadRequestException('Invalid base price value');

    const finalPrice = basePrice + (basePrice * dto.percentage) / 100;

    product.finalPrice = Number(finalPrice.toFixed(2));
    product.status = ProductStatus.ACTIVE;

    return this.productRepository.save(product);
  }

  async deapprove(id: string, approver: User) {
    if (![UserRole.ADMIN, UserRole.EMPLOYEE].includes(approver.role))
      throw new ForbiddenException('Only employees or admins can approve');

    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');

    let finalPrice = Number(product.finalPrice);
    if (isNaN(finalPrice))
      throw new BadRequestException('Invalid base price value');
    const basePrice = Number(product.basePrice);
    if (isNaN(basePrice))
      throw new BadRequestException('Invalid base price value');

    finalPrice = null;

    product.finalPrice = finalPrice;
    product.status = ProductStatus.INACTIVE;

    return this.productRepository.save(product);
  }
}
