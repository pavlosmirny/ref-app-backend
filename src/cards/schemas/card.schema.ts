import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Интерфейс карточки для TypeScript
export type CardDocument = Card & Document;

@Schema({ timestamps: true }) // Автоматически добавляет createdAt и updatedAt
export class Card {
  @Prop({ required: true, unique: true })
  id: string; // Уникальный идентификатор карточки (например, card_0001)

  @Prop({ required: true, default: 0 })
  prize: number; // Сумма выигрыша (0 для невыигрышных карточек)

  @Prop({ required: true, default: false })
  isClaimed: boolean; // Получен ли выигрыш
}

// Генерация схемы Mongoose
export const CardSchema = SchemaFactory.createForClass(Card);
