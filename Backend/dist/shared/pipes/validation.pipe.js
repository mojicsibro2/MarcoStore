"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let ValidationPipe = class ValidationPipe {
    async transform(value, metadata) {
        const metatype = metadata.metatype;
        if (!metatype || !this.toValidate(metadata)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToInstance)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            throw new common_1.HttpException({
                error: 'Validation failed',
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: this.formatErrors(errors),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        return value;
    }
    toValidate(metadata) {
        const metatype = metadata.metatype;
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
    formatErrors(errors) {
        const result = {};
        errors.forEach((error) => {
            if (error.constraints) {
                result[error.property] = Object.values(error.constraints);
            }
            if (error.children && error.children.length) {
                result[error.property] = this.formatErrors(error.children);
            }
        });
        return result;
    }
};
exports.ValidationPipe = ValidationPipe;
exports.ValidationPipe = ValidationPipe = __decorate([
    (0, common_1.Injectable)()
], ValidationPipe);
//# sourceMappingURL=validation.pipe.js.map