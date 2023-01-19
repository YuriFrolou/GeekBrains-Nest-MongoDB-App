import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './news/comments/comments.module';
import { CategoriesModule } from './news/categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';

// @ts-ignore
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(`mongodb://127.0.0.1:27017/MongoConnection`,
    {dbName:'gb_news'}),
    UsersModule,
    MailModule,
    NewsModule,
    CategoriesModule,
    CommentsModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports:[AppService]
})
export class AppModule {}
