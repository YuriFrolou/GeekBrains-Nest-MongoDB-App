import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { CategoriesService } from './categories/categories.service';
import { NewsItem, NewsItemDocument } from '../schemas/news.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NewsService {

  constructor(@InjectModel(NewsItem.name) private newsItemModel: Model<NewsItemDocument>,
              private readonly mailService: MailService,
              private readonly usersService: UsersService,
              private readonly categoriesService: CategoriesService,
  ) {
  }

  async createNews(createNewsDto: CreateNewsDto): Promise<NewsItem> {
    const _user = await this.usersService.getUserById(createNewsDto.userId);
    const _category = await this.categoriesService.findOne(createNewsDto.categoryId);
    if (!_user) {
      throw new HttpException(
        'Не существует такого автора', HttpStatus.BAD_REQUEST,
      );
    }
    if (!_category) {
      throw new HttpException(
        'Не существует такой категории', HttpStatus.BAD_REQUEST,
      );
    }
    const newsEntity = new this.newsItemModel(createNewsDto);
    newsEntity.title = createNewsDto.title;
    newsEntity.description = createNewsDto.description;
    newsEntity.createdAt = new Date();
    newsEntity.updatedAt = new Date();
    newsEntity.cover = createNewsDto.cover;
    newsEntity.user = _user;
    newsEntity.category = _category;

    return await newsEntity.save();
  }

  async findAll(): Promise<NewsItem[]> {
    return await this.newsItemModel.find().exec();
  }

  async findAllByUser(userId: string): Promise<NewsItem[]> {
    return this.newsItemModel.find({}, {
      user: {
        _id: userId,
      },
    });
  }

  async findOneById(id: string):Promise<NewsItem>{
      const news = await this.newsItemModel.findOne({ _id:id});
      const comments = await this.newsItemModel.aggregate([{$unwind : "$comments" }])
    console.log(comments);
    if (!news) {
      throw new NotFoundException();
    }
    return news;
  }


  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<NewsItem> {
    console.log(updateNewsDto);
    const news = await this.newsItemModel.findOne({ _id: id });
    const prevNews:any = { ...news };
    if (!news) {
      throw new NotFoundException();
    }
    news.title = updateNewsDto.title ? updateNewsDto.title : news.title;
    news.description = updateNewsDto.description ? updateNewsDto.description : news.description;
    news.updatedAt = new Date();
    await news.save();
    await this.mailService.updateNewsLogMessage('yf_dev_test@mail.ru', [prevNews, news]);
    return news;
  }


  async remove(id: string):Promise<NewsItem[]> {
    const news = await this.newsItemModel.findOne({ _id:id });
    if (!news) {
      throw new NotFoundException();
    }
    await this.newsItemModel.deleteOne(news._id);
    return await this.newsItemModel.find().exec();
  }
}
