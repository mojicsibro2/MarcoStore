import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/shared/entities/order.entity';
import { OrderStatus } from 'src/shared/entities/order.entity';
import { OrderItem } from 'src/shared/entities/order-item.entity';
import { User, UserRole } from 'src/shared/entities/user.entity';
import { Product, ProductStatus } from 'src/shared/entities/product.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // TOTAL PROFIT (All time)
  async getTotalProfit() {
    const orders = await this.orderRepo.find({
      where: { status: OrderStatus.PAID },
      relations: ['items', 'items.product'],
    });

    let totalRevenue = 0;
    let totalProfit = 0;

    for (const order of orders) {
      for (const item of order.items) {
        const revenue = Number(item.product.finalPrice) * item.quantity;
        const profit =
          (Number(item.product.finalPrice) - Number(item.product.basePrice)) *
          item.quantity;

        totalRevenue += revenue;
        totalProfit += profit;
      }
    }

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
    };
  }

  // MONTHLY REPORT (with pagination)
  async getMonthlyReport(year: number, month: number, page = 1, pageSize = 10) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const skip = (page - 1) * pageSize;

    const [orders, total] = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.status = :status', { status: OrderStatus.PAID })
      .andWhere('order.createdAt BETWEEN :start AND :end', { start, end })
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    let monthlyRevenue = 0;
    let monthlyProfit = 0;

    for (const order of orders) {
      for (const item of order.items) {
        const revenue = Number(item.product.finalPrice) * item.quantity;
        const profit =
          (Number(item.product.finalPrice) - Number(item.product.basePrice)) *
          item.quantity;

        monthlyRevenue += revenue;
        monthlyProfit += profit;
      }
    }

    return {
      year,
      month,
      monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
      monthlyProfit: Number(monthlyProfit.toFixed(2)),
      meta: {
        total,
        currentPage: page,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  //TOP-SELLING PRODUCTS (Paginated)
  async getTopSellingProducts(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const rawData = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .where('order.status = :status', { status: OrderStatus.PAID })
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(item.quantity)', 'totalSold')
      .addSelect('SUM(item.quantity * product.finalPrice)', 'totalRevenue')
      .groupBy('product.id')
      .orderBy('totalSold', 'DESC')
      .offset(skip)
      .limit(pageSize)
      .getRawMany();

    // total count for pagination
    const totalCount = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .where('order.status = :status', { status: OrderStatus.PAID })
      .select('COUNT(DISTINCT item.product)', 'count')
      .getRawOne();

    const total = Number(totalCount.count) || rawData.length;

    return {
      data: rawData.map((p) => ({
        id: p.productId,
        name: p.productName,
        totalSold: Number(p.totalSold),
        totalRevenue: Number(p.totalRevenue),
      })),
      meta: {
        total,
        currentPage: page,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  // 🧑‍🏭 BEST SUPPLIERS (by total revenue) - Paginated
  async getBestSuppliers(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const rawData = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .leftJoin('product.supplier', 'supplier')
      .where('order.status = :status', { status: OrderStatus.PAID })
      .select('supplier.id', 'supplierId')
      .addSelect('supplier.name', 'supplierName')
      .addSelect('SUM(item.quantity * product.finalPrice)', 'totalRevenue')
      .addSelect(
        'SUM((product.finalPrice - product.basePrice) * item.quantity)',
        'totalProfit',
      )
      .groupBy('supplier.id')
      .orderBy('totalRevenue', 'DESC')
      .offset(skip)
      .limit(pageSize)
      .getRawMany();

    // count suppliers for pagination
    const totalCount = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .leftJoin('product.supplier', 'supplier')
      .where('order.status = :status', { status: OrderStatus.PAID })
      .select('COUNT(DISTINCT supplier.id)', 'count')
      .getRawOne();

    const total = Number(totalCount.count) || rawData.length;

    return {
      data: rawData.map((s) => ({
        id: s.supplierId,
        name: s.supplierName,
        totalRevenue: Number(s.totalRevenue),
        totalProfit: Number(s.totalProfit),
      })),
      meta: {
        total,
        currentPage: page,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }
  /**
   * Get total delivered orders (that include this supplier's products)
   * and totals (revenue from finalPrice, earnings from basePrice) for a date range.
   */
  async getSupplierEarnings(supplier: User, start?: Date, end?: Date) {
    const supplierId = supplier.id;

    // 1) Count distinct delivered orders containing this supplier's products
    const orderCountQuery = this.orderRepo
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .where('product.supplierId = :supplierId', { supplierId });

    if (start && end) {
      orderCountQuery.andWhere('order.createdAt BETWEEN :start AND :end', {
        start,
        end,
      });
    }

    const { totalOrders } = (await orderCountQuery
      .select('COUNT(DISTINCT order.id)', 'totalOrders')
      .getRawOne()) || { totalOrders: 0 };

    // 2) Sum revenue and supplier earnings from order items (finalPrice & basePrice)
    const itemsQuery = this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .where('product.supplierId = :supplierId', { supplierId });

    if (start && end) {
      itemsQuery.andWhere('order.createdAt BETWEEN :start AND :end', {
        start,
        end,
      });
    }

    const itemsResult = (await itemsQuery
      .select('SUM(item.quantity * product.basePrice)', 'totalEarnings')
      .getRawOne()) || { totalEarnings: 0 };

    return {
      totalOrders: Number(totalOrders || 0),
      totalEarnings: Number(itemsResult.totalEarnings || 0),
      startDate: start ?? null,
      endDate: end ?? null,
    };
  }

  /**
   * Monthly breakdown for supplier earnings for a year.
   * Returns months 1..12 (fills missing months with zeros) and supports manual pagination.
   */
  async getSupplierMonthlyEarnings(
    supplier: User,
    year: number,
    page = 1,
    pageSize = 6,
  ) {
    const supplierId = supplier.id;

    // Query per-month aggregates (only months that have data)
    const result = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .where('product.supplierId = :supplierId', { supplierId })
      .andWhere('YEAR(order.createdAt) = :year', { year })
      .select('MONTH(order.createdAt)', 'month')
      .addSelect('COUNT(DISTINCT order.id)', 'totalOrders')
      .addSelect('SUM(item.quantity * product.basePrice)', 'totalEarnings')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Build full 12-month array and fill missing months with zeros
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = result.find((r) => Number(r.month) === month);
      return {
        month,
        totalOrders: Number(found?.totalOrders || 0),
        totalEarnings: Number(found?.totalEarnings || 0),
      };
    });

    // Manual pagination
    const total = allMonths.length; // 12
    const skip = (page - 1) * pageSize;
    const paginated = allMonths.slice(skip, skip + pageSize);

    return {
      year,
      data: paginated,
      meta: {
        total,
        currentPage: page,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  async getOverview() {
    const totalUsers = await this.userRepo.count();
    const pendingUsers = await this.userRepo.count({
      where: { role: UserRole.PENDING },
    });

    const totalProducts = await this.productRepo.count();
    const pendingProducts = await this.productRepo.count({
      where: { status: ProductStatus.PENDING },
    });

    const totalOrders = await this.orderRepo.count();
    const deliveredOrders = await this.orderRepo.count({
      where: { status: OrderStatus.DELIVERED },
    });

    return {
      totalUsers,
      pendingUsers,
      totalProducts,
      pendingProducts,
      totalOrders,
      deliveredOrders,
    };
  }
}
