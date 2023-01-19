import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Render, UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoad } from '../utils/HelperFileLoad';
import { NewsEntity } from '../entities/news.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NewsItem } from '../schemas/news.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';


const PATH_NEWS = '/static/';
HelperFileLoad.path = PATH_NEWS;


@ApiBearerAuth()
@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService,
              @InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({summary:'Create news'})
  @ApiBody({ type: CreateNewsDto })
  @ApiResponse({
    status: 201,
    description: 'create new news',
    type: NewsItem,
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async create(@Body() createNewsDto: CreateNewsDto, @UploadedFile() cover: Express.Multer.File=null): Promise<NewsItem> {
    if (cover?.filename) {
      createNewsDto.cover = PATH_NEWS + cover.filename;
    }
    return await this.newsService.createNews(createNewsDto);
  }


  @Get('all')
  @ApiOperation({summary:'Render all news'})
  @ApiResponse({
    status: 200,
    description: 'render all news',
  })
  @Render('news-list')
  async renderAllNews(): Promise<Object> {
    const _news = await this.newsService.findAll();
    return {
      news:
        _news.map((i,k)=>{
          return {
            title: _news[k].title,
            description: _news[k].description,
            cover: _news[k].cover,
          }
        }),
      seo: {
        title: 'Список новостей',
        description: 'Самые крутые новости',
      },
    };
  }


  @Get('all/:userId')
  @ApiOperation({summary:'Render all news by user'})
  @ApiResponse({
    status: 200,
    description: 'render all news by user',
  })
  @Render('news-list')
  async findAllByUser(@Param('userId') userId: string): Promise<Object> {
    const news = await this.newsService.findAllByUser(userId);
    return {
      news: news,
      seo: {
        title: 'Список новостей',
        description: 'Самые крутые новости',
      },
    };
  }


  @Get('/detail/:id')
  @ApiOperation({summary:'Render news by id'})
  @ApiResponse({
    status: 200,
    description: 'render news by id',
  })
  @Render('news-detail')
  async renderOneNews(@Param('id') id: string): Promise<Object> {
    const _news = await this.newsService.findOneById(id);
    const _user = await this.userModel.findOne(_news.user);
    return {
      news:{
        title:_news.title,
        description:_news.description,
        cover:_news.cover,
        user:{
          firstName:_user.firstName,
          lastName:_user.lastName
        }
      },
      seo: {
        title: 'Детальная страница новости',
        description: 'Самая крутая новость',
      },
    };
  }

  @Get()
  @ApiOperation({summary:'Get all news'})
  @ApiResponse({
    status: 200,
    description: 'get all news',
    type: [NewsItem],
  })
  async findAll(): Promise<NewsItem[]> {
    return await this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary:'Get news by id'})
  @ApiResponse({
    status: 200,
    description: 'get news by id',
    type: NewsItem,
  })
  async findOne(@Param('id') id: string): Promise<NewsItem> {
    return await this.newsService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({summary:'Update news'})
  @ApiBody({ type: UpdateNewsDto })
  @ApiResponse({
    status: 200,
    description: 'update news',
    type: NewsItem,
  })
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto): Promise<NewsItem> {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @ApiOperation({summary:'Delete news'})
  @ApiResponse({
    status: 200,
    description: 'delete news by id',
    type: [NewsItem],
  })
  async remove(@Param('id') id: string): Promise<NewsItem[]> {
    return await this.newsService.remove(id);
  }
}
