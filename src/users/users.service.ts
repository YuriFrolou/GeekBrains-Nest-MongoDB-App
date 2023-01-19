import {Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { hash } from '../utils/crypto';
import { Role } from '../auth/role/role.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {


  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async createUser(createUserDto: CreateUserDto):Promise<User> {
    const user = new this.userModel(createUserDto);
    user.firstName= createUserDto.firstName;
    user.lastName= createUserDto.lastName;
    user.email= createUserDto.email;
    user.password= createUserDto.password;
    user.cover = createUserDto.cover||'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg';
    user.roles= createUserDto.role;
    user.password = await hash(user.password);
    user.createdAt= new Date();
    user.updatedAt= new Date();

    return await user.save();
  }

  async getUsers():Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getUserById(id: string):Promise<User> {
    const user = await this.userModel.findOne({_id:id});

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByEmail(email): Promise<User> {
    return this.userModel.findOne({email});
  }

  async setModerator(id): Promise<User> {
    const _user = await this.userModel.findOne({_id:id});
    if (!_user) {
      throw new UnauthorizedException();
    }
    if(_user.roles!==Role.Admin){
      _user.roles = Role.Moderator;
    }
    return await _user.save();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto):Promise<User> {
    const user = await this.userModel.findOne({ _id:id });
    user.firstName= updateUserDto.firstName?updateUserDto.firstName : user.firstName;
    user.lastName=updateUserDto.lastName? updateUserDto.lastName : user.lastName;
    user.email= updateUserDto.email?updateUserDto.email : user.email;
    user.password= updateUserDto.password ? await hash(updateUserDto.password) : user.password;
    user.cover= updateUserDto.cover?updateUserDto.cover:user.cover;
    user.updatedAt= new Date();


    return await user.save();
  }


  async removeUser(id: string):Promise<User[]> {
    const user = await this.userModel.findOne({ _id:id });
    if (!user) {
      throw new NotFoundException();
    }
    await this.userModel.deleteOne(user._id);
    return await this.userModel.find().exec();
  }

}
