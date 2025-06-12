import { DAOFactory } from '@/application/dao/factory/DAOFactory';
import { FetchQuestions } from '@/application/query/FetchQuestions';
import { CreateQuestion } from '@/application/usecase/Question/CreateQuestion';
import { DeleteQuestion } from '@/application/usecase/Question/DeleteQuestion';
import { GetQuestion } from '@/application/usecase/Question/GetQuestion';
import { UpdateQuestion } from '@/application/usecase/Question/UpdateQuestion';
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { QuestionDAO } from '@/application/dao/QuestionDAO';
import { UserRepository } from '@/domain/repository/UserRepository';
import { FetchQuestionsDto } from './dto/fetch-questions.dto';

@ApiTags('Questões')
@Controller('question')
export class QuestionController {
  constructor(
    @Inject('QUESTION_REPOSITORY')
    private readonly questionRepository: QuestionRepository,
    @Inject('QUESTION_DAO')
    private readonly questionDAO: QuestionDAO,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar nova questão' })
  @ApiResponse({ 
    status: 201, 
    description: 'Questão criada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        description: { type: 'string' },
        choices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              text: { type: 'string' },
              isCorrect: { type: 'boolean' }
            }
          }
        },
        authorId: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@Request() req, @Body() createQuestionDto: CreateQuestionDto) {
    const authorId = req.user.sub;
    const useCase = new CreateQuestion(
      this.questionRepository,
      this.userRepository,
    );
    return useCase.execute({ ...createQuestionDto, authorId });
  }

  @Get('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter uma questão específica pelo ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Questão encontrada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        description: { type: 'string' },
        choices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              text: { type: 'string' },
              isCorrect: { type: 'boolean' }
            }
          }
        },
        authorId: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Questão não encontrada' })
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    const useCase = new GetQuestion(
      this.questionRepository,
      this.userRepository,
    );
    return useCase.execute({ id, userId });
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar questões (paginado)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de questões recuperada com sucesso',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              description: { type: 'string' },
              authorId: { type: 'string' },
              authorName: { type: 'string' },
              choicesCount: { type: 'number' }
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
  async fetchQuestions(@Request() req,@Query() query: FetchQuestionsDto) {
    const role = req.user.role;
    const fetchQuestions = new FetchQuestions(this.questionDAO);
    return fetchQuestions.execute({...query, role });
  }

  @Put('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar uma questão existente' })
  @ApiResponse({ 
    status: 200, 
    description: 'Questão atualizada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        description: { type: 'string' },
        choices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              text: { type: 'string' },
              isCorrect: { type: 'boolean' }
            }
          }
        },
        authorId: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Questão não encontrada' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const authorId = req.user.sub;
    const useCase = new UpdateQuestion(this.questionRepository);

    return useCase.execute({ id, authorId, ...updateQuestionDto });
  }

  @Delete('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Excluir uma questão' })
  @ApiResponse({ status: 200, description: 'Questão excluída com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Questão não encontrada' })
  async remove(@Request() req, @Param('id') id: string) {
    const authorId = req.user.sub;
    const useCase = new DeleteQuestion(this.questionRepository);

    return useCase.execute({ id, authorId });
  }
}
