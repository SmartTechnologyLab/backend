import { FileType } from 'src/reportReader/types';
import { ReportType } from '../types/types/report.type';
import { StockExchangeEnum } from 'src/normalizeTrades/constants/enums';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReportTypeEnum } from '../consts/enums';
import { FileTypeEnum } from 'src/reportReader/consts';
import { ApiProperty } from '@nestjs/swagger';

export class ReportDealsDto {
  @ApiProperty({ enum: ReportTypeEnum, description: 'Type of the report' })
  @IsEnum(ReportTypeEnum)
  @IsNotEmpty({ message: 'Report type query param is required' })
  reportType: ReportType;

  @ApiProperty({ enum: FileTypeEnum, description: 'Type of the report' })
  @IsEnum(FileTypeEnum)
  @IsNotEmpty({ message: 'File type query param is required' })
  fileType: FileType;

  @ApiProperty({ enum: StockExchangeEnum, description: 'Type of the report' })
  @IsEnum(StockExchangeEnum)
  @IsNotEmpty({ message: 'Stock exchange query param is required' })
  stockExchange: StockExchangeEnum;
}
