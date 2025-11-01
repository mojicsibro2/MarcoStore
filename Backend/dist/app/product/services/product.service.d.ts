import { CreateProductDto, PercentageDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { User } from 'src/shared/entities/user.entity';
import { CategoryService } from 'src/app/category/services/category.service';
import { Product } from 'src/shared/entities/product.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ProductImage } from 'src/shared/entities/product-image.entity';
import { FilterProductDto } from '../dto/filter-product.dto';
export declare class ProductService {
    private readonly categoryService;
    private readonly productRepository;
    private readonly productImageRepository;
    constructor(categoryService: CategoryService, productRepository: Repository<Product>, productImageRepository: Repository<ProductImage>);
    create(dto: CreateProductDto, supplier: User): Promise<Product>;
    pendingProducts(pagination: PaginationDto): Promise<{
        data: Product[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findAllFiltered(filter: FilterProductDto): Promise<{
        data: Product[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<Product>;
    findOneByOption(where: FindOptionsWhere<Product>): Promise<Product | null>;
    update(id: string, dto: UpdateProductDto, user: User): Promise<Product>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    approve(id: string, approver: User, dto: PercentageDto): Promise<Product>;
    uploadImages(productId: string, files: Express.Multer.File[]): Promise<Product>;
}
