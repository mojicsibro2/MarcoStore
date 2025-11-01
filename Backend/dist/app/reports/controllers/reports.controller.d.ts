import { ReportsService } from '../services/reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getTotal(): Promise<{
        totalRevenue: number;
        totalProfit: number;
    }>;
    getTopSelling(page?: number, pageSize?: number): Promise<{
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
    getMonthly(year: number, month: number, page?: number, pageSize?: number): Promise<{
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
    getSupplierEarnings(id: string, start?: string, end?: string): Promise<{
        supplierId: string;
        supplierEarnings: number;
        totalRevenue: number;
        companyProfit: number;
    }>;
    getSupplierMonthlyEarnings(id: string, year: string, page?: string, pageSize?: string): Promise<{
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
