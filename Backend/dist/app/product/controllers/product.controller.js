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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const create_product_dto_1 = require("../dto/create-product.dto");
const update_product_dto_1 = require("../dto/update-product.dto");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
const role_decorator_1 = require("../../auth/decorators/role.decorator");
const user_entity_1 = require("../../../shared/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
const user_entity_2 = require("../../../shared/entities/user.entity");
const product_service_1 = require("../services/product.service");
const current_user_decorator_1 = require("../../../shared/decorators/current-user.decorator");
const public_decorator_1 = require("../../../shared/decorators/public.decorator");
const path_1 = require("path");
const multer_1 = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
const is_valid_uuid_pipe_1 = require("../../../shared/pipes/is-valid-uuid.pipe");
const filter_product_dto_1 = require("../dto/filter-product.dto");
let ProductController = class ProductController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(dto, user) {
        return this.productsService.create(dto, user);
    }
    pendingProducts(pagination) {
        return this.productsService.pendingProducts(pagination);
    }
    findAllFiltered(filter) {
        return this.productsService.findAllFiltered(filter);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    update(id, dto, user) {
        return this.productsService.update(id, dto, user);
    }
    remove(id, user) {
        return this.productsService.remove(id, user);
    }
    approve(id, user, percentage) {
        return this.productsService.approve(id, user, percentage);
    }
    async uploadImages(id, files) {
        return this.productsService.uploadImages(id, files);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.SUPPLIER),
    (0, swagger_1.ApiOperation)({ summary: 'Supplier create product' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, user_entity_2.User]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
__decorate([
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.EMPLOYEE),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all pending products (paginated)' }),
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "pendingProducts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search and filter active products' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_product_dto_1.FilterProductDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAllFiltered", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get product details' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPPLIER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supplier/Admin update product' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto,
        user_entity_2.User]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPPLIER),
    (0, swagger_1.ApiOperation)({ summary: 'Supplier/Admin delete product' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Approve product' }),
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User,
        create_product_dto_1.PercentageDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "approve", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.SUPPLIER),
    (0, swagger_1.ApiOperation)({ summary: 'Upload product images' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)(':id/images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/temp',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "uploadImages", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map