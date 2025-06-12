import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FetchQuestionsDto {
  @ApiProperty({
    description: 'Número da página',
    default: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    default: 10,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageLength?: number = 10;
}