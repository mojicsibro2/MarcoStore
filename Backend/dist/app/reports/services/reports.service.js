"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../../shared/entities/order.entity");
const order_entity_2 = require("../../../shared/entities/order.entity");
const order_item_entity_1 = require("../../../shared/entities/order-item.entity");
let ReportsService = class ReportsService {
    constructor(orderRepo, orderItemRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
    }
    async getTotalProfit() {
        const orders = await this.orderRepo.find({
            where: { status: order_entity_2.OrderStatus.DELIVERED },
            relations: ['items', 'items.product'],
        });
        let totalRevenue = 0;
        let totalProfit = 0;
        for (const order of orders) {
            for (const item of order.items) {
                const revenue = Number(item.product.finalPrice) * item.quantity;
                const profit = (Number(item.product.finalPrice) - Number(item.product.basePrice)) *
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
    async getMonthlyReport(year, month, page = 1, pageSize = 10) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        const skip = (page - 1) * pageSize;
        const [orders, total] = await this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.product', 'product')
            .where('order.status = :status', { status: order_entity_2.OrderStatus.DELIVERED })
            .andWhere('order.createdAt BETWEEN :start AND :end', { start, end })
            .skip(skip)
            .take(pageSize)
            .getManyAndCount();
        let monthlyRevenue = 0;
        let monthlyProfit = 0;
        for (const order of orders) {
            for (const item of order.items) {
                const revenue = Number(item.product.finalPrice) * item.quantity;
                const profit = (Number(item.product.finalPrice) - Number(item.product.basePrice)) *
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
    async getTopSellingProducts(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const rawData = await this.orderItemRepo
            .createQueryBuilder('item')
            .leftJoin('item.order', 'order')
            .leftJoin('item.product', 'product')
            .where('order.status = :status', { status: order_entity_2.OrderStatus.DELIVERED })
            .select('product.id', 'productId')
            .addSelect('product.name', 'productName')
            .addSelect('SUM(item.quantity)', 'totalSold')
            .addSelect('SUM(item.quantity * product.finalPrice)', 'totalRevenue')
            .groupBy('product.id')
            .orderBy('totalSold', 'DESC')
            .offset(skip)
            .limit(pageSize)
            .getRawMany();
        const totalCount = await this.orderItemRepo
            .createQueryBuilder('item')
            .leftJoin('item.order', 'order')
            .where('order.status = :status', { status: order_entity_2.OrderStatus.DELIVERED })
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
    async getBestSuppliers(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const rawData = await this.orderItemRepo
            .createQueryBuilder('item')
            .leftJoin('item.order', 'order')
            .leftJoin('item.product', 'product')
            .leftJoin('product.supplier', 'supplier')
            .where('order.status = :status', { status: order_entity_2.OrderStatus.DELIVERED })
            .select('supplier.id', 'supplierId')
            .addSelect('supplier.name', 'supplierName')
            .addSelect('SUM(item.quantity * product.finalPrice)', 'totalRevenue')
            .addSelect('SUM((product.finalPrice - product.basePrice) * item.quantity)', 'totalProfit')
            .groupBy('supplier.id')
            .orderBy('totalRevenue', 'DESC')
            .offset(skip)
            .limit(pageSize)
            .getRawMany();
        const totalCount = await this.orderItemRepo
            .createQueryBuilder('item')
            .leftJoin('item.order', 'order')
            .leftJoin('item.product', 'product')
            .leftJoin('product.supplier', 'supplier')
            .where('order.status = :status', { status: order_entity_2.OrderStatus.DELIVERED })
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
    async getSupplierEarnings(supplierId, start, end) {
        const query = this.orderItemRepo
            .createQueryBuilder('item')
            .leftJoin('item.order', 'order')
            .leftJoin('item.product', 'product')
            .where('product.supplierId = :supplierId', { supplierId })
            .andWhere('order.status = :status', { status: order_entity_2.OrderStatus.DELIVERED });
        if (start && end) {
            query.andWhere('order.createdAt BETWEEN :start AND :end', { start, end });
        }
        const result = await query
            .select('SUM(item.quantity * product.finalPrice)', 'totalRevenue')
            .addSelect('SUM(item.quantity * product.basePrice)', 'supplierEarnings')
            .addSelect('SUM((product.finalPrice - product.basePrice) * item.quantity)', 'companyProfit')
            .getRawOne();
        return {
            supplierId,
            supplierEarnings: Number(result?.supplierEarnings || 0),
            totalRevenue: Number(result?.totalRevenue || 0),
            companyProfit: Number(result?.companyProfit || 0),
        };
    }
    async getSupplierMonthlyEarnings(supplierId, year, page = 1, pageSize = 6) {
        const result = await this.orderItemRepo
            .createQueryBuilder('item')
            .leftJoin('item.order', 'order')
            .leftJoin('item.product', 'product')
            .where('product.supplierId = :supplierId', { supplierId })
            .andWhere('order.status = :status', { status: order_entity_2.OrderStatus.DELIVERED })
            .andWhere('YEAR(order.createdAt) = :year', { year })
            .select('MONTH(order.createdAt)', 'month')
            .addSelect('SUM(item.quantity * product.finalPrice)', 'totalRevenue')
            .addSelect('SUM(item.quantity * product.basePrice)', 'supplierEarnings')
            .addSelect('SUM((product.finalPrice - product.basePrice) * item.quantity)', 'companyProfit')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map