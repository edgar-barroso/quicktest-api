import { DAOFactory } from '@/application/dao/factory/DAOFactory';
import { FetchUsers } from '@/application/query/FetchUsers';
import { AuthorizeUser } from '@/application/usecase/User/AuthorizeUser';
import { CreateUser } from '@/application/usecase/User/CreateUser';
import { DeleteUser } from '@/application/usecase/User/DeleteUser';
import { GetUser } from '@/application/usecase/User/GetUser';
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory';
import { Public } from '@/presentation/auth/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthorizeUserDto } from './dto/authorize-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUser } from '@/application/usecase/User/UpdateUser';
import { UserRepository } from '@/domain/repository/UserRepository';
import { UserDAO } from '@/application/dao/UserDAO';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    @Inject('USER_DAO')
    private readonly userDAO: UserDAO,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso',
    schema: {
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 409, description: 'Usuário já existe' })
  async create(@Body() createUserDto: CreateUserDto) {
    const useCase = new CreateUser(this.userRepository);
    const { email, id } = await useCase.execute(createUserDto);

    const payload = { sub: id, email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Fazer login no sistema' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login bem-sucedido',
    schema: {
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() authorizeUserDto: AuthorizeUserDto) {
    const useCase = new AuthorizeUser(this.userRepository);
    const { email, id, role } = await useCase.execute(authorizeUserDto);
    const payload = { sub: id, email, role };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  @Get('/:page')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todos os usuários (paginado)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários recuperada com sucesso',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
            }
          }
        },
        total: { type: 'number' },
        page: { type: 'number' },
        pageLength: { type: 'number' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(
    @Param('page') page: number,
    @Query('pageLength') pageLength?: number,
  ) {
    const fetchUsers = new FetchUsers(this.userDAO);

    return fetchUsers.execute({ page, pageLength });
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter informações do usuário atual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Informações do usuário recuperadas com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Request() req) {
    const id = req.user.sub;
    const useCase = new GetUser(this.userRepository);
    return useCase.execute({ id });
  }

  @Put()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar informações do usuário atual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário atualizado com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.sub;
    const useCase = new UpdateUser(this.userRepository);

    return useCase.execute({ id, ...updateUserDto });
  }

  @Delete()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Excluir a conta do usuário atual' })
  @ApiResponse({ status: 200, description: 'Usuário excluído com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Request() req) {
    const id = req.user.sub;
    const useCase = new DeleteUser(this.userRepository);

    return useCase.execute({ id });
  }
}
