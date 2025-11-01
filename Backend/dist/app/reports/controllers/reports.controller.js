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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../../shared/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("../services/reports.service");
const role_decorator_1 = require("../../auth/decorators/role.decorator");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getTotal() {
        return this.reportsService.getTotalProfit();
    }
    getTopSelling(page = 1, pageSize = 10) {
        return this.reportsService.getTopSellingProducts(Number(page), Number(pageSize));
    }
    getBestSuppliers(page = 1, pageSize = 10) {
        return this.reportsService.getBestSuppliers(Number(page), Number(pageSize));
    }
    getMonthly(year, month, page = 1, pageSize = 10) {
        return this.reportsService.getMonthlyReport(year, month, Number(page), Number(pageSize));
    }
    getSupplierEarnings(id, start, end) {
        return this.reportsService.getSupplierEarnings(id, start ? new Date(start) : undefined, end ? new Date(end) : undefined);
    }
    getSupplierMonthlyEarnings(id, year, page, pageSize) {
        return this.reportsService.getSupplierMonthlyEarnings(id, Number(year), Number(page) || 1, Number(pageSize) || 6);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get total revenue and profit' }),
    (0, common_1.Get)('total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getTotal", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get top-selling products' }),
    (0, common_1.Get)('top-products'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getTopSelling", null);
__decorate([
    (0, common_1.Get)('best-suppliers'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getBestSuppliers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly revenue and profit' }),
    (0, common_1.Get)('monthly'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMonthly", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get supplier earnings report' }),
    (0, common_1.Get)('suppliers/:id/earnings'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('start')),
    __param(2, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSupplierEarnings", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get supplier monthly earnings breakdown for a year (paginated)',
    }),
    (0, common_1.Get)('suppliers/:id/earnings/monthly'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSupplierMonthlyEarnings", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.EMPLOYEE),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map