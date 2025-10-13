import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/shared/entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Create a new category
   */
  async create(dto: CreateCategoryDto) {
    const exists = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });
    if (exists) throw new BadRequestException('Category name already exists');

    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  /**
   * Find all categories (paginated)
   */
  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 10 } = pagination;

    const [data, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { name: 'ASC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Find a category by ID
   */
  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'], // if you want to show linked products
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  /**
   * Update a category
   */
  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    Object.assign(category, dto);

    return this.categoryRepository.save(category);
  }

  /**
   * Delete a category
   */
  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);

    return { message: `Category '${category.name}' deleted successfully` };
  }
}
