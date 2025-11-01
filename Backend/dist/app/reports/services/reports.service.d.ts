import { Repository } from 'typeorm';
import { Order } from 'src/shared/entities/order.entity';
import { OrderItem } from 'src/shared/entities/order-item.entity';
export declare class ReportsService {
    private readonly orderRepo;
    private readonly orderItemRepo;
    constructor(orderRepo: Repository<Order>, orderItemRepo: Repository<OrderItem>);
    getTotalProfit(): Promise<{
        totalRevenue: number;
        totalProfit: number;
    }>;
    getMonthlyReport(year: number, month: number, page?: number, pageSize?: number): Promise<{
        year: number;
        month: number;
        monthlyRevenue: number;
        monthlyProfit: number;
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    getTopSellingProducts(page?: number, pageSize?: number): Promise<{
        data: {
            id: any;
            name: any;
            totalSold: number;
            totalRevenue: number;
        }[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    getBestSuppliers(page?: number, pageSize?: number): Promise<{
        data: {
            id: any;
            name: any;
            totalRevenue: number;
            totalProfit: number;
        }[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
    getSupplierEarnings(supplierId: string, start?: Date, end?: Date): Promise<{
        supplierId: string;
        supplierEarnings: number;
        totalRevenue: number;
        companyProfit: number;
    }>;
    getSupplierMonthlyEarnings(supplierId: string, year: number, page?: number, pageSize?: number): Promise<{
        supplierId: string;
        year: number;
        data: {
            month: number;
            totalRevenue: number;
            supplierEarnings: number;
            companyProfit: number;
        }[];
        meta: {
            total: number;
            currentPage: number;
            lastPage: number;
        };
    }>;
}
