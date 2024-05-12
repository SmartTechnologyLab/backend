import { Injectable } from '@nestjs/common';
import {
  PostgrestResponse,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY,
    );
  }

  // Method for getting data from particulary column of table
  async findData(table: string, findParam: string, findValue: string) {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select('*')
        .eq(findParam, findValue);

      if (error) {
        console.error(error);
        throw new Error('Failed while finding data: ' + error.message);
      }

      if (data && data.length > 0) {
        return data[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed while finding data: ' + error.message);
    }
  }

  // Method for setting data to table
  async insertData<T>(tableName: string, data: T) {
    try {
      const { error } = await this.supabase.from(tableName).insert(data);

      if (error) {
        throw new Error('Failed while setting the data to DB' + error.message);
      }
    } catch (error) {
      throw new Error('Failed to set data to DB' + error);
    }
  }

  // Method for updating data at table, where:
  // updateData - data that we want to pass,
  // filterParam - param of finding entity we want to update
  // filterValue - entity value for filtering
  async updateData<T>(
    tableName: string,
    updateData: Partial<T>,
    filterParam: string,
    filterValue: string,
  ) {
    try {
      const { data, error }: PostgrestResponse<T> = await this.supabase
        .from(tableName)
        .update(updateData)
        .eq(filterParam, filterValue);

      if (error) {
        throw new Error('Failed while updating the data in DB' + error.message);
      }

      return data;
    } catch (error) {
      throw new Error('Failed to update data in DB' + error);
    }
  }
}
