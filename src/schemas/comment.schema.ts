import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { NewsItem } from './news.schema';



export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {

  @ApiProperty({
    example:1,
    description:'Идентификатор комментария'
  })
  @Prop()
  id: number;

  @ApiProperty({
    example:"Комментарий",
    description:'Это текст комментария'
  })
  @Prop({ required: true })
  message: string;


  @ApiProperty({
    description:'Дата создания комментария'
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    description:'Дата обновления комментария'
  })
  @Prop()
  updatedAt: Date;

  // @ApiProperty({description:'Связь с таблицей пользователей многие-к-одному'})
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user?: User;

  // @ApiProperty({description:'Связь с таблицей новостей многие-к-одному'})
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'NewsItem' })
  news?: NewsItem;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);