import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { NewsModule } from '../news.module';
import { UsersModule } from '../../users/users.module';
import { SocketCommentsGateway } from './socket-comments.gateway';
import { AuthModule } from '../../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment,CommentSchema } from '../../schemas/comment.schema';
import { NewsItem, NewsItemSchema } from '../../schemas/news.schema';
import { User, UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [forwardRef(() => NewsModule),UsersModule,AuthModule,
    MongooseModule.forFeature(
      [{ name: Comment.name, schema: CommentSchema },
        { name: NewsItem.name, schema: NewsItemSchema },
        { name: User.name, schema: UserSchema }])
  ],
  controllers: [CommentsController],
  providers: [CommentsService,SocketCommentsGateway],
  exports:[CommentsService]
})
export class CommentsModule {}
