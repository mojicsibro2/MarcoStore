import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserRole } from 'src/shared/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { Roles } from 'src/app/auth/decorators/role.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Get total revenue and profit' })
  @Get('total')
  getTotal() {
    return this.reportsService.getTotalProfit();
  }

  @ApiOperation({ summary: 'Get top-selling products' })
  @Get('top-products')
  getTopSelling(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.reportsService.getTopSellingProducts(
      Number(page),
      Number(pageSize),
    );
  }

  @Get('best-suppliers')
  getBestSuppliers(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.reportsService.getBestSuppliers(Number(page), Number(pageSize));
  }

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

  @ApiOperation({ summary: 'Get supplier earnings report' })
  @Get('suppliers/:id/earnings')
  getSupplierEarnings(
    @Param('id') id: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.reportsService.getSupplierEarnings(
      id,
      start ? new Date(start) : undefined,
      end ? new Date(end) : undefined,
    );
  }

  @ApiOperation({
    summary: 'Get supplier monthly earnings breakdown for a year (paginated)',
  })
  @Get('suppliers/:id/earnings/monthly')
  getSupplierMonthlyEarnings(
    @Param('id') id: string,
    @Query('year') year: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.reportsService.getSupplierMonthlyEarnings(
      id,
      Number(year),
      Number(page) || 1,
      Number(pageSize) || 6,
    );
  }
}
