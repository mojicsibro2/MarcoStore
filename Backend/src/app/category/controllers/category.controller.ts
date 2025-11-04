import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Roles } from 'src/app/auth/decorators/role.decorator';
import { UserRole } from 'src/shared/entities/user.entity';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'create new category' })
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiBearerAuth()
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'List all categories' })
  @Public()
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.categoryService.findAll(pagination);
  }

  @ApiOperation({ summary: 'get a category' })
  @Public()
  @Get(':id')
  findOne(@Param('id', IsValidUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: 'update a category' })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @Patch(':id')
  update(
    @Param('id', IsValidUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'remove a category' })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', IsValidUUIDPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
