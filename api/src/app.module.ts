// Import core libraries
import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { MongooseModule } from '@nestjs/mongoose'
import * as Joi from 'joi'

// Import config files
import { ConfigModule, ConfigService } from '@nestjs/config'
import { throttlerConfig } from '@config/index'
import { mongoConfig } from '@config/mongo.config'

// Import own app files
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './features/users/users.module'
import { AuthModule } from './features/auth/auth.module'
import { EmailsModule } from './features/emails/emails.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TicketsModule } from './features/tickets/tickets.module'
import { CategoriesModule } from './features/categories/categories.module'
import { HttpExceptionFilter } from 'filters/http-exception.filter'
import { APP_FILTER } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [throttlerConfig, mongoConfig],
      validationSchema: Joi.object({
        LISTENING_PORT: Joi.number().valid(4000).required(),
        THROTTLE_TTL: Joi.number().required(),
        THROTTLE_LIMIT: Joi.number().less(15).required(),
        MONGODB_URI: Joi.string().required()
      })
    }),
    // Rate limit protection
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('throttler.ttl'),
          limit: configService.get<number>('throttler.limit'),
        },
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    EmailsModule,
    EventEmitterModule.forRoot(),
    TicketsModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }, AppService],
})
export class AppModule {}
