import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false,
  })
  name?: string;
  
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com',
    required: false,
  })
  email?: string;
  
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'novaSenha123',
    required: false,
  })
  password?: string;
}
