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
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const delivery_mode_entity_1 = require("../../../shared/entities/delivery-mode.entity");
let DeliveryService = class DeliveryService {
    constructor(deliveryRepo) {
        this.deliveryRepo = deliveryRepo;
    }
    async create(dto) {
        const delivery = this.deliveryRepo.create(dto);
        return this.deliveryRepo.save(delivery);
    }
    async findAll(activeOnly = true) {
        const where = activeOnly ? { isActive: true } : {};
        return this.deliveryRepo.find({ where, order: { name: 'ASC' } });
    }
    async findOne(id) {
        const delivery = await this.deliveryRepo.findOne({ where: { id } });
        if (!delivery)
            throw new common_1.NotFoundException('Delivery mode not found');
        return delivery;
    }
    async update(id, dto) {
        const delivery = await this.findOne(id);
        Object.assign(delivery, dto);
        return this.deliveryRepo.save(delivery);
    }
    async remove(id) {
        const delivery = await this.findOne(id);
        await this.deliveryRepo.remove(delivery);
        return { message: 'Delivery mode removed successfully' };
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(delivery_mode_entity_1.DeliveryMode)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map