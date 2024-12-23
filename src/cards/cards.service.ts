import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './schemas/card.schema';

@Injectable()
export class CardsService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  // Генерация карточек
  async generateCards(): Promise<{ total: number; hash: string }> {
    const totalCards = 1000;
    const prizes = [
      { count: 1, amount: 300 }, // 1 карточка с выигрышем 300
      { count: 5, amount: 20 }, // 5 карточек с выигрышем 20
      { count: 50, amount: 2 }, // 50 карточек с выигрышем 2
      { count: 300, amount: 1 }, // 300 карточек с выигрышем 1
    ];

    const cards = [];
    let idCounter = 1;

    // Функция для форматирования номера карточки
    const formatId = (num: number): string => num.toString().padStart(4, '0'); // Формат строго 4 символа

    // Создаём карточки с выигрышами
    for (const prize of prizes) {
      for (let i = 0; i < prize.count; i++) {
        cards.push({
          id: `${formatId(idCounter++)}`, // Форматируем ID в строгом виде
          prize: prize.amount,
          isClaimed: false,
        });
      }
    }

    // Создаём карточки без выигрышей
    const remainingCards = totalCards - cards.length;
    for (let i = 0; i < remainingCards; i++) {
      cards.push({
        id: `${formatId(idCounter++)}`, // Форматируем ID для оставшихся карточек
        prize: 0,
        isClaimed: false,
      });
    }

    // Функция для перемешивания массива (алгоритм Fisher-Yates)
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Меняем местами элементы
      }
    };

    // Перемешиваем карточки
    shuffleArray(cards);

    // Удаляем старые карточки и добавляем новые
    await this.cardModel.deleteMany({}).exec(); // Очистка коллекции перед добавлением
    await this.cardModel.insertMany(cards);

    // Хэш массива карточек для проверки честности
    const crypto = await import('crypto');
    const cardsString = JSON.stringify(
      cards.map((card) => ({ id: card.id, prize: card.prize })),
    );
    const hash = crypto.createHash('sha256').update(cardsString).digest('hex');

    return {
      total: cards.length,
      hash, // Хэш можно сохранить или опубликовать
    };
  }

  // Остальные методы, такие как create, findAll, findOne, update и т.д.

  // Получение всех карточек в порядке возрастания ID
  async findAllOrdered(isClaimed?: boolean): Promise<Omit<Card, 'prize'>[]> {
    const filter = isClaimed !== undefined ? { isClaimed } : {};
    return this.cardModel
      .find(filter, '-prize') // Исключаем поле `prize` из результатов
      .sort({ id: 1 }) // Сортировка по полю id
      .exec();
  }

  async findById(_id: string): Promise<Omit<Card, 'prize'>> {
    const card = await this.cardModel
      .findById(_id, '-prize') // Исключаем поле `prize`
      .exec();
    if (!card) {
      throw new NotFoundException(`Card with _id ${_id} not found`);
    }
    return card;
  }

  // Погашение карточки после открытия
  async claimCard(_id: string): Promise<Card> {
    const card = await this.cardModel.findById(_id).exec();
    if (!card) {
      throw new NotFoundException(`Card with _id ${_id} not found`);
    }

    if (card.isClaimed) {
      throw new Error(`Card with _id ${_id} has already been claimed`);
    }

    card.isClaimed = true;
    await card.save(); // Сохраняем обновление в базе данных

    // Возвращаем полную информацию о карточке, включая выигрыш
    return card;
  }
}
