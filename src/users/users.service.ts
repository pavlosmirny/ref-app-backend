import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(wallet: string): Promise<User> {
    // Проверка валидности параметра wallet
    // if (typeof wallet !== 'string' || !wallet.trim()) {
    //   throw new BadRequestException(
    //     'Invalid wallet format. Must be a non-null, non-empty string.',
    //   );
    // }
    const existingUser = await this.userModel.findOne({ wallet }).exec();
    if (existingUser) {
      return existingUser;
    }
    const newUser = new this.userModel({
      id: uuidv4(),
      wallet: wallet,
      balance: 0,
      countClicker: 0,
    });

    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    console.log('firstname');
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ id }).exec();
  }

  async findByWallet(wallet: string): Promise<User | null> {
    return this.userModel.findOne({ wallet }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findOneAndUpdate({ id }, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findOneAndDelete({ id }).exec();
  }

  async incrementClickerAndBalance(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      return { message: 'apiKey is invalid' };
    }

    user.countClicker += 1;
    user.balance += 0.1;
    await user.save();

    return { message: 'The transaction was successful' };
  }

  async claimBalance(address: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ address }).exec();
    if (!user) {
      return { message: 'apiKey is invalid' };
    }

    user.countClicker = 0;
    user.balance = 0;
    await user.save();

    return { message: 'User balance and click count have been reset to 0' };
  }
}
