import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Deal } from './types/interfaces/deal.interface';
import { DealReport } from './types/interfaces/deal-report.interface';
import { ReportDealsDto } from './dto/report-deals.dto';

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('deals')
  @UseInterceptors(FilesInterceptor('file', 10))
  @ApiOperation({ summary: 'Getting deals' })
  @ApiQuery({ name: 'type', description: 'Report type', required: false })
  @ApiBody({
    description: 'Loading trades report in JSON format for getting deals',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'JSON file containing trades report',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns deals',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDeals(
    @Query() reportDealsDto: ReportDealsDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<DealReport<Deal>> {
    try {
      const { reportType, fileType, stockExchange } = reportDealsDto;

      return this.reportService.handleReports({
        files,
        reportType,
        stockExchange,
        fileType,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
