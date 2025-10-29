import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/shared/entities/order.entity';
import { OrderStatus } from 'src/shared/entities/order.entity';
import { OrderItem } from 'src/shared/entities/order-item.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  // 🧾 TOTAL PROFIT (All time)
  async getTotalProfit() {
    const orders = await this.orderRepo.find({
      where: { status: OrderStatus.DELIVERED },
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

  // 📆 MONTHLY REPORT (with pagination)
  async getMonthlyReport(year: number, month: number, page = 1, pageSize = 10) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const skip = (page - 1) * pageSize;

    const [orders, total] = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
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

  // 🏆 TOP-SELLING PRODUCTS (Paginated)
  async getTopSellingProducts(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const rawData = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
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
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
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
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
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
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
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

  // 💰 SUPPLIER EARNINGS (revenue, profit, etc.)
  async getSupplierEarnings(supplierId: string, start?: Date, end?: Date) {
    const query = this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .where('product.supplierId = :supplierId', { supplierId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED });

    if (start && end) {
      query.andWhere('order.createdAt BETWEEN :start AND :end', { start, end });
    }

    const result = await query
      .select('SUM(item.quantity * product.finalPrice)', 'totalRevenue')
      .addSelect('SUM(item.quantity * product.basePrice)', 'supplierEarnings')
      .addSelect(
        'SUM((product.finalPrice - product.basePrice) * item.quantity)',
        'companyProfit',
      )
      .getRawOne();

    return {
      supplierId,
      supplierEarnings: Number(result?.supplierEarnings || 0),
      totalRevenue: Number(result?.totalRevenue || 0),
      companyProfit: Number(result?.companyProfit || 0),
    };
  }

  // 💰 SUPPLIER MONTHLY EARNINGS (breakdown by month, with pagination)
  async getSupplierMonthlyEarnings(
    supplierId: string,
    year: number,
    page = 1,
    pageSize = 6, // 6 months per page (2 pages total for 12 months)
  ) {
    const result = await this.orderItemRepo
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .where('product.supplierId = :supplierId', { supplierId })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
      .andWhere('YEAR(order.createdAt) = :year', { year })
      .select('MONTH(order.createdAt)', 'month')
      .addSelect('SUM(item.quantity * product.finalPrice)', 'totalRevenue')
      .addSelect('SUM(item.quantity * product.basePrice)', 'supplierEarnings')
      .addSelect(
        'SUM((product.finalPrice - product.basePrice) * item.quantity)',
        'companyProfit',
      )
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Fill missing months with zeros
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = result.find((r) => Number(r.month) === month);
      return {
        month,
        totalRevenue: Number(found?.totalRevenue || 0),
        supplierEarnings: Number(found?.supplierEarnings || 0),
        companyProfit: Number(found?.companyProfit || 0),
      };
    });

    // Apply pagination manually
    const total = allMonths.length;
    const skip = (page - 1) * pageSize;
    const paginated = allMonths.slice(skip, skip + pageSize);

    return {
      supplierId,
      year,
      data: paginated,
      meta: {
        total,
        currentPage: page,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }
}
