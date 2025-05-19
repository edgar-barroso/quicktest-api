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
  async create(@Body() createUserDto: CreateUserDto) {
    const useCase = new CreateUser(this.userRepository);
    const { email, id } = await useCase.execute(createUserDto);

    const payload = { sub: id, email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  @Public()
  @Post('/login')
  async login(@Body() authorizeUserDto: AuthorizeUserDto) {
    const useCase = new AuthorizeUser(this.userRepository);
    const { email, id, role } = await useCase.execute(authorizeUserDto);
    const payload = { sub: id, email, role };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  @Get('/:page')
  async findAll(
    @Param('page') page: number,
    @Query('pageLength') pageLength?: number,
  ) {
    const fetchUsers = new FetchUsers(this.userDAO);

    return fetchUsers.execute({ page, pageLength });
  }

  @Get()
  async findOne(@Request() req) {
    const id = req.user.sub;
    const useCase = new GetUser(this.userRepository);
    return useCase.execute({ id });
  }

  @Put()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.sub;
    const useCase = new UpdateUser(this.userRepository);

    return useCase.execute({ id, ...updateUserDto });
  }

  @Delete()
  async remove(@Request() req) {
    const id = req.user.sub;
    const useCase = new DeleteUser(this.userRepository);

    return useCase.execute({ id });
  }
}
