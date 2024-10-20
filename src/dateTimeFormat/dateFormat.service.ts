import { format } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { DateFormatType } from './types/types/date-format-type';

@Injectable()
export class DateTimeFormatService {
  constructor() {}

  format(date: string | Date, dateFormat: DateFormatType): string {
    return format(date, dateFormat);
  }
}
