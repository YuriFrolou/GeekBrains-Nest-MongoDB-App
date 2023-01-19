import {IsString} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Comment} from '../schemas/comment.schema';

export class UpdateCommentDto {

  @ApiPropertyOptional({ example: 'Новый комментарий', description: 'Новый текст комментария' })
  @IsString({
    message: 'Поле message должно быть строкой'
  })
  message: string;

  @ApiPropertyOptional()
  comment: Comment;
}
