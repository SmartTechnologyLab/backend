import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { CurrencyExchangeModule } from './currencyExchange/currencyExchange.module';
import { NormalizeTradesModule } from './normalizeTrades/normalizeTrades.module';
import { NormalizeReportsModule } from './normalizeReports/normalizeReports.module';
import { HealthController } from './health/health.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/User';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        type: configService.get('DB_TYPE'),
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User],
        // TODO: not for production
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ReportModule,
    CurrencyExchangeModule,
    NormalizeTradesModule,
    NormalizeReportsModule,
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
