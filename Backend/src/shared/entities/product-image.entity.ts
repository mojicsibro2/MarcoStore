import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @OneToOne(() => Product, (product) => product.image)
  product: Product;
}
