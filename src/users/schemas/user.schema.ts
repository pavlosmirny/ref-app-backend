import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User extends Document {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @Prop({ required: true })
  id: string;

  @ApiProperty({ description: 'Wallet address of the user' })
  @Prop({ required: true })
  wallet: string;

  @ApiProperty({ description: 'Balance of the user', default: 0 })
  @Prop({ required: true, default: 0 })
  balance: number;

  @ApiProperty({ description: 'Count of clicks made by the user', default: 0 })
  @Prop({ required: true, default: 0 })
  countClicker: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
