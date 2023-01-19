import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { NewsItem } from './news.schema';



export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {

  @ApiProperty({
    example:"Cats",
    description:'Название категории'
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description:'Дата создания категории'
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    description:'Дата обновления категории'
  })
  @Prop()
  updatedAt: Date;

  // @ApiProperty({description:'Связь с таблицей новостей один-ко-многим'})
  @Prop({type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'NewsItem' }]})
  news?: NewsItem[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);