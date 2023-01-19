import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { Comment, CommentDocument } from '../../schemas/comment.schema';
import { UsersService } from '../../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NewsItem, NewsItemDocument } from '../../schemas/news.schema';


@Injectable()
export class CommentsService {

  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
              @InjectModel(NewsItem.name) private newsItemModel: Model<NewsItemDocument>,
              @Inject(forwardRef(() => NewsService))
              private readonly newsService: NewsService,
              private readonly usersService: UsersService,
              private readonly eventEmitter: EventEmitter2,
  ) {
  }

  async create(newsId: string, message: string, userId: string): Promise<Comment> {
    const _news = await this.newsService.findOneById(newsId);
    const _user = await this.usersService.getUserById(userId);

    if (!_user) {
      throw new HttpException(
        'Не существует такого автора', HttpStatus.BAD_REQUEST,
      );
    }
    if (!_news) {
      throw new HttpException(
        'Не существует такой новости', HttpStatus.BAD_REQUEST,
      );
    }
    console.log(_news.comments);
    const comment = new this.commentModel();
    comment.message = message;
    comment.createdAt = new Date();
    comment.updatedAt = new Date();
    comment.user = _user;
    comment.news = _news;
    await comment.save();
    const news = await this.newsItemModel.findOne({ _id: newsId });
    news.comments = [..._news.comments, comment];
    news.save();
    return comment;

  }


  async findAll(newsId: string): Promise<Comment[]> {
    return this.commentModel.find({ news: { _id: newsId } });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findOne({ _id: id });
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  async update(commentId: string, message: string): Promise<Comment> {
    let _comment = await this.commentModel.findOne({ _id: commentId });
    _comment.message = message ? message : _comment.message;
    _comment.updatedAt = new Date();
    await _comment.save();
    this.eventEmitter.emit('comment.update', {
      commentId: _comment.id,
      newsId: _comment.news.id,
      comment: _comment,
    });
    return _comment;
  }


  async remove(commentId: string,userId:string):Promise<Comment[]> {
    const _comment=await this.commentModel.findOne({ _id: commentId });
    const _user=await this.usersService.getUserById(userId);
    if(_comment.user.toString()==userId||_user.roles==='admin'){
      this.eventEmitter.emit('comment.remove', { commentId: _comment.id,
        newsId: _comment.news.id,
      });
      await this.commentModel.deleteOne(_comment._id);
      return await this.commentModel.find().exec();
    } else{
      throw new HttpException(
        'Нет прав для операции', HttpStatus.FORBIDDEN,
      );
    }
  }
}
