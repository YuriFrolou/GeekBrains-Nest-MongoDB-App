import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render, Req,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoad } from '../../utils/HelperFileLoad';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Comment, CommentDocument } from '../../schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';


const PATH_NEWS = '/static/';
HelperFileLoad.path = PATH_NEWS;

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService,
              @InjectModel(User.name) private userModel: Model<UserDocument>,
              @InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new comment' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    description: 'create new comment',
    type: Comment,
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req, @UploadedFile() cover: Express.Multer.File = null): Promise<Comment> {
    const userId = req.user.userId;
    if (cover?.filename) {
      createCommentDto.cover = PATH_NEWS + cover.filename;
    } else {
      createCommentDto.cover = 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg';
    }
    return await this.commentsService.create(createCommentDto.newsId, createCommentDto.message, userId);

  }


  @Get('/:newsId')
  @ApiOperation({ summary: 'Get all comments by news id' })
  @ApiResponse({
    status: 200,
    description: 'get all comments by news id',
    type: [Comment],
  })
  async findAll(@Param('newsId') newsId: string): Promise<Comment[]> {
    return this.commentsService.findAll(newsId);
  }

  @Get('/ws/:newsId')
  @ApiOperation({ summary: 'Get all comments by news id' })
  @ApiResponse({
    status: 200,
    description: 'get all comments by news id',
    type: [Comment],
  })
  async findAllWS(@Param('newsId') newsId: string): Promise<any[]> {
    const _comments = await this.commentModel.find({ news: { _id: newsId } });
    const _users = await this.userModel.find().exec();
    return _comments.map((i, k) => {
      const _user = _users.find(j => j._id.toString() == i.user.toString());
      if (_user) {
        return {
          message: _comments[k].message,
          firstName: _user.firstName,
          lastName: _user.lastName,
          commentId:i._id.toString(),
          userId:_user._id.toString()
        };
      }
    });
  }


  @Get('/all/:newsId')
  @ApiOperation({ summary: 'Render all comments by news id' })
  @ApiResponse({
    status: 200,
    description: 'render all comments by news id',
  })
  @Render('comments-list')
  async renderAll(@Param('newsId') newsId: string): Promise<Object> {
    const _comments = await this.commentsService.findAll(newsId);
    return {
      comments:
        _comments.map((i, k) => {
          return {
            message: _comments[k].message,
          };
        }),
    };

  }

  @Get('/:newsId/:commentId')
  @ApiOperation({ summary: 'Get comment by newsId and commentId' })
  @ApiResponse({
    status: 200,
    description: 'get comment by newsId and commentId',
    type: Comment,
  })
  async findOne(@Param('commentId') commentId: string): Promise<Comment> {
    return await this.commentsService.findOne(commentId);
  }

  @Patch('/:commentId')
  @ApiOperation({ summary: 'Update comment' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: 200,
    description: 'update comment',
    type: Comment,
  })
  async update(@Param('commentId') commentId: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return await this.commentsService.update(commentId, updateCommentDto.message);
  }

  @Delete('/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({
    status: 200,
    description: 'delete comment',
    type: [Comment],
  })
  async remove(@Param('commentId') commentId: string, @Req() req): Promise<Comment[]> {
    const userId = req.user.userId;
    return await this.commentsService.remove(commentId, userId);
  }
}
