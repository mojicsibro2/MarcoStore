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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../../shared/entities/user.entity");
const category_service_1 = require("../../category/services/category.service");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../../../shared/entities/product.entity");
const typeorm_2 = require("typeorm");
const product_image_entity_1 = require("../../../shared/entities/product-image.entity");
const cloudinary_1 = require("cloudinary");
let ProductService = class ProductService {
    constructor(categoryService, productRepository, productImageRepository) {
        this.categoryService = categoryService;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
    }
    async create(dto, supplier) {
        if (supplier.role !== user_entity_1.UserRole.SUPPLIER) {
            throw new common_1.ForbiddenException('Only suppliers can create products');
        }
        const category = await this.categoryService.findOne(dto.categoryId);
        if (!category)
            throw new common_1.BadRequestException('Invalid category');
        const product = this.productRepository.create({
            ...dto,
            basePrice: dto.price,
            supplier,
            category,
            status: product_entity_1.ProductStatus.PENDING,
        });
        return this.productRepository.save(product);
    }
    async pendingProducts(pagination) {
        const { page = 1, pageSize = 10 } = pagination;
        const skip = (page - 1) * pageSize;
        const [data, total] = await this.productRepository.findAndCount({
            where: {
                status: product_entity_1.ProductStatus.PENDING,
            },
            relations: ['category'],
            skip,
            take: pageSize,
            order: { createdAt: 'DESC' },
        });
        const lastPage = Math.ceil(total / pageSize);
        const currentPage = skip / pageSize + 1;
        return {
            data,
            meta: {
                total,
                currentPage,
                lastPage,
            },
        };
    }
    async findAllFiltered(filter) {
        const { search, category, minPrice, maxPrice, page = 1, limit = 10, } = filter;
        const skip = (page - 1) * limit;
        const query = this.productRepository
            .createQueryBuilder('product')
            .leftJoin('product.category', 'category')
            .addSelect(['category.name'])
            .where('product.status = :status', { status: product_entity_1.ProductStatus.ACTIVE });
        if (search) {
            query.andWhere('product.name LIKE :search', { search: `%${search}%` });
        }
        if (category) {
            query.andWhere('category.name LIKE :category', {
                category: `%${category}%`,
            });
        }
        if (minPrice) {
            query.andWhere('product.finalPrice >= :minPrice', { minPrice });
        }
        if (maxPrice) {
            query.andWhere('product.finalPrice <= :maxPrice', { maxPrice });
        }
        query.orderBy('product.createdAt', 'DESC').skip(skip).take(limit);
        const [data, total] = await query.getManyAndCount();
        const lastPage = Math.ceil(total / limit);
        const currentPage = skip / limit + 1;
        return {
            data,
            meta: {
                total,
                currentPage,
                lastPage,
            },
        };
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findOneByOption(where) {
        return await this.productRepository.findOne({ where });
    }
    async update(id, dto, user) {
        const product = await this.findOne(id);
        if (user.role === user_entity_1.UserRole.SUPPLIER && product.supplier.id !== user.id)
            throw new common_1.ForbiddenException('You can only update your own products');
        if (dto.categoryId) {
            const category = await this.categoryService.findOne(dto.categoryId);
            if (!category)
                throw new common_1.BadRequestException('Invalid category');
            product.category = category;
        }
        Object.assign(product, dto);
        return this.productRepository.save(product);
    }
    async remove(id, user) {
        const product = await this.findOne(id);
        if (user.role === user_entity_1.UserRole.SUPPLIER && product.supplier.id !== user.id)
            throw new common_1.ForbiddenException('You can only delete your own products');
        await this.productRepository.remove(product);
        return { message: `Product '${product.name}' deleted successfully` };
    }
    async approve(id, approver, dto) {
        if (![user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.EMPLOYEE].includes(approver.role))
            throw new common_1.ForbiddenException('Only employees or admins can approve');
        const product = await this.findOne(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const basePrice = Number(product.basePrice);
        if (isNaN(basePrice))
            throw new common_1.BadRequestException('Invalid base price value');
        const finalPrice = basePrice + (basePrice * dto.percentage) / 100;
        product.finalPrice = Number(finalPrice.toFixed(2));
        product.status = product_entity_1.ProductStatus.ACTIVE;
        return this.productRepository.save(product);
    }
    async uploadImages(productId, files) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['images'],
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const uploadedImages = [];
        for (const file of files) {
            const result = await cloudinary_1.v2.uploader.upload(file.path, {
                folder: 'macrostore/products',
            });
            const imageEntity = this.productImageRepository.create({
                imageUrl: result.secure_url,
                product,
            });
            uploadedImages.push(await this.productImageRepository.save(imageEntity));
        }
        product.images = [...(product.images || []), ...uploadedImages];
        return this.productRepository.save(product);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __metadata("design:paramtypes", [category_service_1.CategoryService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map