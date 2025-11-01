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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_config_service_1 = require("../shared/services/typeorm/typeorm-config.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const cart_module_1 = require("./cart/cart.module");
const category_module_1 = require("./category/category.module");
const product_module_1 = require("./product/product.module");
const payment_module_1 = require("./payment/payment.module");
const orders_module_1 = require("./orders/orders.module");
const delivery_module_1 = require("./delivery/delivery.module");
const users_service_1 = require("./users/services/users.service");
const reports_module_1 = require("./reports/reports.module");
let AppModule = class AppModule {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async onModuleInit() {
        await this.usersService.seedAdmin();
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: typeorm_config_service_1.TypeOrmConfigService,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            cart_module_1.CartModule,
            category_module_1.CategoryModule,
            product_module_1.ProductModule,
            payment_module_1.PaymentModule,
            orders_module_1.OrdersModule,
            delivery_module_1.DeliveryModule,
            reports_module_1.ReportsModule,
        ],
        controllers: [],
        providers: [],
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AppModule);
//# sourceMappingURL=app.module.js.map