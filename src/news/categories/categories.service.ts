import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {
  }
  async create(createCategoryDto: CreateCategoryDto):Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    createdCategory.name= createCategoryDto.name;
    createdCategory.createdAt= new Date();
    createdCategory.updatedAt= new Date();
    return createdCategory.save();

  }

  async findAll():Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async findOne(id: string):Promise<Category> {
    const category = await this.categoryModel.findOne({ _id:id });

    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto):Promise<Category> {
    let category = await this.categoryModel.findOne({ id });

    if (!category) {
      throw new NotFoundException();
    }

      category.name= updateCategoryDto.name ? updateCategoryDto.name : category.name;
      category.updatedAt= new Date();

    await category.save();
    return category;
  }

  async remove(id: string):Promise<Category[]> {
    const category = await this.categoryModel.findOne({ _id:id });
    if (!category) {
      throw new NotFoundException();
    }
    await this.categoryModel.deleteOne(category._id);
    return await this.categoryModel.find().exec();
  }
}
