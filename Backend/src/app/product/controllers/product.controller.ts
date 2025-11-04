import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto, PercentageDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Roles } from 'src/app/auth/decorators/role.decorator';
import { UserRole } from 'src/shared/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/shared/entities/user.entity';
import { ProductService } from '../services/product.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { FilterProductDto } from '../dto/filter-product.dto';
import { ProductStatus } from 'src/shared/entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Supplier creates a new product with one image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new product with image upload',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Wireless Headphones' },
        description: {
          type: 'string',
          example: 'Bluetooth over-ear headphones',
        },
        basePrice: { type: 'number', example: 120 },
        stock: { type: 'number', example: 50 },
        categoryId: { type: 'string', example: 'uuid-of-category' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: [
        'name',
        'description',
        'basePrice',
        'stock',
        'categoryId',
        'image',
      ],
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() supplier: User,
  ) {
    if (!file) {
      throw new BadRequestException('Product image is required');
    }

    const product = await this.productsService.create(dto, supplier, file);
    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  }

  @Roles(UserRole.SUPPLIER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all products by supplier (paginated)' })
  @Get('my')
  getSupplierProducts(
    @CurrentUser() user: User,
    @Query() pagination: PaginationDto,
  ) {
    return this.productsService.findAllBySupplier(user, pagination);
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

  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all products (with filters)',
    description: 'Allows admin to view and filter products by status.',
  })
  @ApiQuery({
    name: 'status',
    enum: ProductStatus,
    required: false,
    description: 'Filter products by status (active, inactive, pending)',
  })
  @Get('admin')
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: ProductStatus,
  ) {
    return this.productsService.adminFindAllFiltered(pagination, status);
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
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Deapprove product' })
  @Patch(':id/deapprove')
  deapprove(
    @Param('id', IsValidUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.productsService.deapprove(id, user);
  }
}
