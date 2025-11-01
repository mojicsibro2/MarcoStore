import { Repository } from 'typeorm';
import { Category } from 'src/shared/entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
export declare class CategoryService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    create(dto: CreateCategoryDto): Promise<Category>;
    findAll(pagination: PaginationDto): Promise<{
        data: Category[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    findOne(id: string): Promise<Category>;
    update(id: string, dto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
