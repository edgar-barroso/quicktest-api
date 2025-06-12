import { ApiProperty } from '@nestjs/swagger';

export class UserSchema {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva'
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com'
  })
  email: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    example: 'TEACHER',
    enum: ['STUDENT', 'TEACHER']
  })
  role: string;
}

export class UserWithTokenSchema {
  @ApiProperty({
    description: 'Token de autenticação JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;
}
