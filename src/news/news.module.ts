import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsItem, NewsItemSchema } from '../schemas/news.schema';
import { Comment,CommentSchema } from '../schemas/comment.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Category, CategorySchema } from '../schemas/category.schema';

@Module({
  imports: [MailModule,UsersModule,CategoriesModule,CommentsModule,
    MongooseModule.forFeature([{ name: NewsItem.name, schema: NewsItemSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema }])
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports:[NewsService]
})
export class NewsModule {}
