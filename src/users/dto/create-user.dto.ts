import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  id: string;

  @ApiProperty({ description: 'Wallet address of the user' })
  wallet: string;

  @ApiProperty({ description: 'Balance of the user', default: 0 })
  balance?: number;

  @ApiProperty({ description: 'Count of clicks made by the user', default: 0 })
  countClicker?: number;
}
