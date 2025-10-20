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
import { FindOptionsWhere, Repository } from 'typeorm';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { UploadApiResponse } from 'cloudinary';
import { ProductImage } from 'src/shared/entities/product-image.entity';
import { v2 as cloudinary } from 'cloudinary';
import { FilterProductDto } from '../dto/filter-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(dto: CreateProductDto, supplier: User) {
    if (supplier.role !== UserRole.SUPPLIER) {
      throw new ForbiddenException('Only suppliers can create products');
    }
    const category = await this.categoryService.findOne(dto.categoryId);
    if (!category) throw new BadRequestException('Invalid category');

    const product = this.productRepository.create({
      ...dto,
      basePrice: dto.price,
      supplier,
      category,
      status: ProductStatus.PENDING,
    });
    return this.productRepository.save(product);
  }

  async pendingProducts(pagination: PaginationDto) {
    const { page = 1, pageSize = 10 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.productRepository.findAndCount({
      where: {
        status: ProductStatus.PENDING,
      },
      relations: ['category'],
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    const lastPage = Math.ceil(total / pageSize);
    const currentPage = skip / pageSize + 1;
    return {
      data,
      meta: {
        total,
        currentPage,
        lastPage,
      },
    };
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
      .addSelect(['category.name'])
      .where('product.status = :status', { status: ProductStatus.ACTIVE });

    if (search) {
      query.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    if (category) {
      query.andWhere('category.name LIKE :category', {
        category: `%${category}%`,
      });
    }

    if (minPrice) {
      query.andWhere('product.finalPrice >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      query.andWhere('product.finalPrice <= :maxPrice', { maxPrice });
    }

    query.orderBy('product.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    const lastPage = Math.ceil(total / limit);
    const currentPage = skip / limit + 1;

    return {
      data,
      meta: {
        total,
        currentPage,
        lastPage,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
  public async findOneByOption(
    where: FindOptionsWhere<Product>,
  ): Promise<Product | null> {
    return await this.productRepository.findOne({ where });
  }
  async update(id: string, dto: UpdateProductDto, user: User) {
    const product = await this.findOne(id);

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

  async uploadImages(productId: string, files: Express.Multer.File[]) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['images'],
    });
    if (!product) throw new NotFoundException('Product not found');

    const uploadedImages: ProductImage[] = [];

    for (const file of files) {
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        file.path,
        {
          folder: 'macrostore/products',
        },
      );

      const imageEntity = this.productImageRepository.create({
        imageUrl: result.secure_url,
        product,
      });

      uploadedImages.push(await this.productImageRepository.save(imageEntity));
    }

    product.images = [...(product.images || []), ...uploadedImages];
    return this.productRepository.save(product);
  }
}
