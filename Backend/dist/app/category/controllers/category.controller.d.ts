import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("../../../shared/entities/category.entity").Category>;
    findAll(pagination: PaginationDto): Promise<{
        data: import("../../../shared/entities/category.entity").Category[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<import("../../../shared/entities/category.entity").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("../../../shared/entities/category.entity").Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
