import { Controller, Get, Query } from '@nestjs/common';
import { User, UserRole } from 'src/shared/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { Roles } from 'src/app/auth/decorators/role.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get dashboard overview (users, products, orders summary)',
  })
  @Get('overview')
  async getOverview() {
    return this.reportsService.getOverview();
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get total revenue and profit' })
  @Get('total')
  getTotal() {
    return this.reportsService.getTotalProfit();
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get top-selling products' })
  @Get('top-products')
  getTopSelling(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.reportsService.getTopSellingProducts(
      Number(page),
      Number(pageSize),
    );
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get best suppliers' })
  @Get('best-suppliers')
  getBestSuppliers(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.reportsService.getBestSuppliers(Number(page), Number(pageSize));
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get monthly revenue and profit' })
  @Get('monthly')
  getMonthly(
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.reportsService.getMonthlyReport(
      year,
      month,
      Number(page),
      Number(pageSize),
    );
  }

  @Roles(UserRole.SUPPLIER)
  @ApiOperation({ summary: 'Get supplier earnings report' })
  @ApiQuery({
    name: 'start',
    required: false,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'end',
    required: false,
    type: String,
    description: 'End date (YYYY-MM-DD)',
  })
  @Get('suppliers/earnings')
  getSupplierEarnings(
    @CurrentUser() user: User,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.reportsService.getSupplierEarnings(
      user,
      start ? new Date(start) : undefined,
      end ? new Date(end) : undefined,
    );
  }

  @Roles(UserRole.SUPPLIER)
  @ApiOperation({
    summary: 'Get supplier monthly earnings breakdown for a year (paginated)',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    type: String,
    description: 'Year (e.g. 2025)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: String,
    description: 'Page size (default: 6)',
  })
  @Get('suppliers/earnings/monthly')
  getSupplierMonthlyEarnings(
    @CurrentUser() user: User,
    @Query('year') year: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.reportsService.getSupplierMonthlyEarnings(
      user,
      Number(year),
      Number(page) || 1,
      Number(pageSize) || 6,
    );
  }
}
