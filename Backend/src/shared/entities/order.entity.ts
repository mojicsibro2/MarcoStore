import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { DeliveryMode } from './delivery-mode.entity';
import { Payment } from './payment.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  customer: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @ManyToOne(() => DeliveryMode, { eager: true })
  deliveryMode: DeliveryMode;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'REJECTED';

  @CreateDateColumn()
  createdAt: Date;
}
