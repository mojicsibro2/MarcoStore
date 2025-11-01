import { CreateProductDto, PercentageDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { User } from 'src/shared/entities/user.entity';
import { ProductService } from '../services/product.service';
import { FilterProductDto } from '../dto/filter-product.dto';
export declare class ProductController {
    private readonly productsService;
    constructor(productsService: ProductService);
    create(dto: CreateProductDto, user: User): Promise<import("../../../shared/entities/product.entity").Product>;
    pendingProducts(pagination: PaginationDto): Promise<{
        data: import("../../../shared/entities/product.entity").Product[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findAllFiltered(filter: FilterProductDto): Promise<{
        data: import("../../../shared/entities/product.entity").Product[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<import("../../../shared/entities/product.entity").Product>;
    update(id: string, dto: UpdateProductDto, user: User): Promise<import("../../../shared/entities/product.entity").Product>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    approve(id: string, user: User, percentage: PercentageDto): Promise<import("../../../shared/entities/product.entity").Product>;
    uploadImages(id: string, files: Express.Multer.File[]): Promise<import("../../../shared/entities/product.entity").Product>;
}
