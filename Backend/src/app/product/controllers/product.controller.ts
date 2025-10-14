// src/app/products/controllers/products.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProductDto, PercentageDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Roles } from 'src/app/auth/decorators/role.decorator';
import { UserRole } from 'src/shared/entities/user.entity';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/shared/entities/user.entity';
import { ProductService } from '../services/product.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { FilterProductDto } from '../dto/filter-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @ApiBearerAuth()
  @Roles(UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Supplier create product' })
  @Post()
  create(@Body() dto: CreateProductDto, @CurrentUser() user: User) {
    return this.productsService.create(dto, user);
  }

  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all pending products (paginated)' })
  @Get('pending')
  pendingProducts(@Query() pagination: PaginationDto) {
    return this.productsService.pendingProducts(pagination);
  }

  @Public()
  @ApiOperation({ summary: 'Search and filter active products' })
  @Get()
  findAllFiltered(@Query() filter: FilterProductDto) {
    return this.productsService.findAllFiltered(filter);
  }

  @Public()
  @ApiOperation({ summary: 'Get product details' })
  @Get(':id')
  findOne(@Param('id', IsValidUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supplier/Admin update product' })
  @Patch(':id')
  update(
    @Param('id', IsValidUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productsService.update(id, dto, user);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Supplier/Admin delete product' })
  @Delete(':id')
  remove(@Param('id', IsValidUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.productsService.remove(id, user);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Approve product' })
  @Patch(':id/approve')
  approve(
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Query() percentage: PercentageDto,
  ) {
    return this.productsService.approve(id, user, percentage);
  }

  @ApiBearerAuth()
  @Roles(UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Upload product images' })
  @ApiConsumes('multipart/form-data')
  @Post(':id/images')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads/temp', // temporary folder before cloud upload
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImages(
    @Param('id', IsValidUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.uploadImages(id, files);
  }
}
