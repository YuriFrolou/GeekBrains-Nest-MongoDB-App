import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Category } from './category.schema';
import { Comment, CommentDocument} from '../schemas/comment.schema';



export type NewsItemDocument = HydratedDocument<NewsItem>;

@Schema()
export class NewsItem {

  @ApiProperty({
    example:1,
    description:'Идентификатор новости'
  })
  @Prop()
  id: number;

  @ApiProperty({
    example:'Новая новость',
    description:'Заголовок новости'
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example:"Это описание новости",
    description:'Описание новости'
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example:"https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg",
    description:'Обложка новости'
  })
  @Prop()
  cover: string;

  @ApiProperty({
    description:'Дата создания новости'
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    description:'Дата обновления новости'
  })
  @Prop()
  updatedAt: Date;

  // @ApiProperty({description:'Связь с таблицей пользователей многие-к-одному'})
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user?: User;

  // @ApiProperty({description:'Связь с таблицей категорий многие-к-одному'})
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category?: Category;

  // @ApiProperty({description:'Связь с таблицей комментариев один-ко-многим'})
  @Prop({type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]})
  comments?:Comment[];
}

export const NewsItemSchema = SchemaFactory.createForClass(NewsItem);