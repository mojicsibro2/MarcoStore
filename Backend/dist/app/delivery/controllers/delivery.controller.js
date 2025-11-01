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
exports.DeliveryController = void 0;
const common_1 = require("@nestjs/common");
const create_delivery_dto_1 = require("../dto/create-delivery.dto");
const update_delivery_dto_1 = require("../dto/update-delivery.dto");
const swagger_1 = require("@nestjs/swagger");
const role_decorator_1 = require("../../auth/decorators/role.decorator");
const user_entity_1 = require("../../../shared/entities/user.entity");
const is_valid_uuid_pipe_1 = require("../../../shared/pipes/is-valid-uuid.pipe");
const delivery_service_1 = require("../services/delivery.service");
let DeliveryController = class DeliveryController {
    constructor(deliveriesService) {
        this.deliveriesService = deliveriesService;
    }
    findAll(activeOnly) {
        return this.deliveriesService.findAll(activeOnly);
    }
    findOne(id) {
        return this.deliveriesService.findOne(id);
    }
    create(dto) {
        return this.deliveriesService.create(dto);
    }
    update(id, dto) {
        return this.deliveriesService.update(id, dto);
    }
    remove(id) {
        return this.deliveriesService.remove(id);
    }
};
exports.DeliveryController = DeliveryController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all delivery modes' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get delivery mode by ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Create delivery mode' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Update delivery mode' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_delivery_dto_1.UpdateDeliveryDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, role_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Delete delivery mode' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', is_valid_uuid_pipe_1.IsValidUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "remove", null);
exports.DeliveryController = DeliveryController = __decorate([
    (0, swagger_1.ApiTags)('Delivery Modes'),
    (0, common_1.Controller)('deliveries'),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService])
], DeliveryController);
//# sourceMappingURL=delivery.controller.js.map