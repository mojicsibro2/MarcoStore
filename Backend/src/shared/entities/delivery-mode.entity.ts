import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class DeliveryMode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g. "Standard Shipping", "Express", "In-store Pickup"

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  fee: number;

  @OneToMany(() => Order, (order) => order.deliveryMode)
  orders: Order[];
}
