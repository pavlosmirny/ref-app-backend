import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { Card } from './schemas/card.schema';

@ApiTags('Cards') // Группа для Swagger
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: 'Генерация всех карточек' })
  @ApiResponse({
    status: 201,
    description: 'Карточки успешно сгенерированы.',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 1000 },
        hash: { type: 'string', example: 'e3b0c44298fc1...' },
      },
    },
  })
  @Post('generate')
  async generateCards() {
    return this.cardsService.generateCards();
  }

  @ApiOperation({
    summary: 'Получение всех карточек (с фильтром по isClaimed)',
  })
  @ApiQuery({
    name: 'isClaimed',
    required: false,
    description: 'Фильтр по статусу погашения карточек. Значения: true, false',
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Возвращает список всех карточек без поля "prize".',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64b8d4a5c3b7a77c4b5e4f12' },
          id: { type: 'string', example: '0001' },
          isClaimed: { type: 'boolean', example: false },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  @Get()
  async findAllOrdered(@Query('isClaimed') isClaimed?: string) {
    const claimedFilter =
      isClaimed === 'true' ? true : isClaimed === 'false' ? false : undefined;
    return this.cardsService.findAllOrdered(claimedFilter);
  }

  @ApiOperation({
    summary: 'Получение карточки по _id (без информации о выигрыше)',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ID карточки',
    example: '64b8d4a5c3b7a77c4b5e4f12',
  })
  @ApiResponse({
    status: 200,
    description: 'Возвращает карточку по её _id без поля "prize".',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '64b8d4a5c3b7a77c4b5e4f12' },
        id: { type: 'string', example: 'card_0001' },
        isClaimed: { type: 'boolean', example: false },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Карточка не найдена.' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.cardsService.findById(id);
  }

  @ApiOperation({ summary: 'Погашение карточки после открытия' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ID карточки',
    example: '64b8d4a5c3b7a77c4b5e4f12',
  })
  @ApiResponse({
    status: 200,
    description: 'Возвращает карточку с выигрышем после её погашения.',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '64b8d4a5c3b7a77c4b5e4f12' },
        id: { type: 'string', example: 'card_0001' },
        prize: { type: 'number', example: 20 },
        isClaimed: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-01T00:10:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Карточка не найдена.',
  })
  @ApiResponse({
    status: 400,
    description: 'Карточка уже погашена.',
  })
  @Post(':id/claim')
  async claimCard(@Param('id') id: string): Promise<Card> {
    return this.cardsService.claimCard(id);
  }
}
