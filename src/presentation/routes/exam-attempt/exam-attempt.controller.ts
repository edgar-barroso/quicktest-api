import { Body, Controller, Get, HttpCode, Inject, Param, Post, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateExamAttempt } from '@/application/usecase/ExamAttempt/CreateExamAttempt';
import { GetExamAttempt } from '@/application/usecase/ExamAttempt/GetExamAttempt';
import { GradeExamAttempt } from '@/application/usecase/ExamAttempt/GradeExamAttempt';
import { AddAnswerToExamAttempt } from '@/application/usecase/ExamAttempt/AddAnswerToExamAttempt';
import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { CreateExamAttemptDto } from './dto/create-exam-attempt.dto';
import { UpdateExamAttemptDto } from './dto/update-exam-attempt.dto';
import { AddAnswerDto } from './dto/add-answer.dto';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';

@ApiTags('Tentativas de Exame')
@Controller('exam-attempt')
export class ExamAttemptController {
  constructor(
    @Inject('EXAMATTEMPT_REPOSITORY')
    private readonly examAttemptRepository: ExamAttemptRepository,
    @Inject('EXAM_REPOSITORY')
    private readonly examRepository: ExamRepository,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    @Inject('QUESTION_REPOSITORY')
    private readonly questionRepository: QuestionRepository,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Iniciar uma tentativa de exame' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tentativa de exame criada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        examId: { type: 'string' },
        studentId: { type: 'string' },
        startedAt: { type: 'string', format: 'date-time' },
        finished: { type: 'boolean' },
        score: { type: 'number', nullable: true },
        answers: { type: 'array', items: { type: 'object' } }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Exame não encontrado' })
  async create(@Request() req, @Body() createExamAttemptDto: CreateExamAttemptDto) {
    const studentId = req.user.sub;
    const useCase = new CreateExamAttempt(this.examAttemptRepository, this.examRepository, this.userRepository);
    return useCase.execute({ ...createExamAttemptDto, studentId });
  }

  @Get('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter detalhes de uma tentativa de exame' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tentativa de exame recuperada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        examId: { type: 'string' },
        studentId: { type: 'string' },
        startedAt: { type: 'string', format: 'date-time' },
        finishedAt: { type: 'string', format: 'date-time', nullable: true },
        score: { type: 'number', nullable: true },
        finished: { type: 'boolean' },
        answers: { 
          type: 'array', 
          items: { 
            type: 'object',
            properties: {
              questionId: { type: 'string' },
              choiceId: { type: 'string' }
            }
          } 
        },
        exam: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Tentativa de exame não encontrada' })
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    const useCase = new GetExamAttempt(this.examAttemptRepository,this.examRepository);
    return useCase.execute({ id, userId });
  }


  @Post('/:id/answer')
  @HttpCode(201)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Adicionar uma resposta a uma tentativa de exame' })
  @ApiResponse({ 
    status: 201, 
    description: 'Resposta adicionada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        examId: { type: 'string' },
        studentId: { type: 'string' },
        questionId: { type: 'string' },
        choiceId: { type: 'string' },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Tentativa de exame ou questão não encontrada' })
  async addAnswer(
    @Request() req, 
    @Param('id') id: string, 
    @Body() addAnswerDto: AddAnswerDto
  ) {
    const userId = req.user.sub;
    const useCase = new AddAnswerToExamAttempt(this.examAttemptRepository, this.userRepository,this.questionRepository,this.examRepository);
    return useCase.execute({ 
      id, 
      questionId: addAnswerDto.questionId, 
      choiceId: addAnswerDto.choiceId, 
      userId 
    });
  }

  @Post('/:id/grade')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Corrigir e atribuir nota a uma tentativa de exame' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tentativa de exame corrigida com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        examId: { type: 'string' },
        studentId: { type: 'string' },
        score: { type: 'number' },
        totalQuestions: { type: 'number' },
        correctAnswers: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Tentativa de exame não está finalizada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Tentativa de exame não encontrada' })
  async grade(@Param('id') id: string) {
    const useCase = new GradeExamAttempt(this.examAttemptRepository,this.examRepository,this.questionRepository);
    return useCase.execute({ id });
    
  }
}