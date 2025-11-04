import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../shared/entities/product.entity';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { CategoryModule } from '../category/category.module';
import { ProductImage } from 'src/shared/entities/product-image.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    CategoryModule,
    ConfigModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryProvider, CloudinaryService],
  exports: [ProductService],
})
export class ProductModule {}
