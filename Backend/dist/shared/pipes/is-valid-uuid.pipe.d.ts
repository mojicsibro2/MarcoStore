import { ArgumentMetadata } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
export declare class IsValidUUIDPipe extends ParseUUIDPipe {
    constructor();
    transform(value: any, metadata: ArgumentMetadata): Promise<string>;
}
