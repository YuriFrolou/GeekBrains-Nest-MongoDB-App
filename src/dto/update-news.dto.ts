import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateNewsDto } from './create-news.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';
import { Comment } from '../schemas/comment.schema';

export class UpdateNewsDto {
  @ApiPropertyOptional({example:"Новость",description:'Заголовок новости'})
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional({example:"Содержание новости",description:'Это текст новости'})
  @IsString({
    message:'Поле description должно быть строкой'
  })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({example:"https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg",description:'Обложка новости'})
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiPropertyOptional()
  @IsOptional()
  comment?: Comment;
}

