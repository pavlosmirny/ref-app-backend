import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('users') // Это создаст категорию 'users' в Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' }) // Краткое описание метода
  @ApiResponse({ status: 200, description: 'Возвращает массив пользователей.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'Идентификатор пользователя' }) // Описание параметра
  @ApiResponse({ status: 200, description: 'Возвращает пользователя по ID.' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post(':wallet')
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiParam({ name: 'wallet', description: 'Адрес кошелька пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан.' })
  create(@Param('wallet') wallet: string) {
    return this.usersService.create(wallet);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiParam({ name: 'id', description: 'Идентификатор пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({ name: 'id', description: 'Идентификатор пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален.' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('apiKey/:id')
  @ApiOperation({ summary: 'Увеличить счетчик и баланс пользователя' })
  @ApiParam({ name: 'id', description: 'Идентификатор пользователя' })
  @ApiResponse({ status: 200, description: 'Транзакция прошла успешно.' })
  @ApiResponse({ status: 404, description: 'apiKey не верный' })
  incrementClickerAndBalance(@Param('id') id: string) {
    return this.usersService.incrementClickerAndBalance(id);
  }

  @Post('claim/:wallet')
  @ApiOperation({ summary: 'забрать награду' })
  @ApiParam({ name: 'wallet', description: 'Адрес кошелька пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно  забрал награду.',
  })
  claimBalance(@Param('wallet') wallet: string) {
    return this.usersService.claimBalance(wallet);
  }
}
