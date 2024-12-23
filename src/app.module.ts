import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://payalnic:CL0UiQyslvkeNtHv@cluster0.ph2sw.mongodb.net/ref-app-db?retryWrites=true&w=majority',
    ),
    UsersModule,
    CardsModule,
  ],
})
export class AppModule {}
