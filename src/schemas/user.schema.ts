import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../auth/role/role.enum';
import * as mongoose from 'mongoose';
import { NewsItem } from './news.schema';



export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

  @ApiProperty({
    example:"Иван",
    description:'Имя пользователя'
  })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({
    example:"Сидоров",
    description:'Фамилия пользователя'
  })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({
    example:"example@mail.ru",
    description:'Email пользователя'
  })
  @Prop({ required: true })
  email: string;

  @ApiProperty({
    example:"22222",
    description:'Пароль пользователя'
  })
  @Prop({ required: true })
  password:string


  @ApiProperty({
    example:"https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg",
    description:'Аватар пользователя'
  })
  @Prop()
  cover: string;

  @ApiProperty({
    example:"user",
    description:'Роль пользователя'
  })
  @Prop()
  @IsEnum(Role)
  roles: Role;

  @ApiProperty({
    description:'Дата создания пользователя'
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    description:'Дата обновления пользователя'
  })
  @Prop()
  updatedAt: Date;

  // @ApiProperty({description:'Связь с таблицей новостей один-ко-многим'})
  @Prop({type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'NewsItem' }]})
  news?: NewsItem[];

  // @ApiProperty({description:'Связь с таблицей комментариев один-ко-многим'})
  @Prop({type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]})
  comments?: Comment[];
}

export const UserSchema = SchemaFactory.createForClass(User);