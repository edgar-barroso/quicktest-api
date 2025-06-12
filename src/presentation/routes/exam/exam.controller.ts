import { CreateExam } from '@/application/usecase/Exam/CreateExam';
import { DeleteExam } from '@/application/usecase/Exam/DeleteExam';
import { GetExam } from '@/application/usecase/Exam/GetExam';
import { UpdateExam } from '@/application/usecase/Exam/UpdateExam';
import { FetchExams } from '@/application/query/FetchExams';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { ExamDAO } from '@/application/dao/ExamDAO';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateExamDto } from './dto/create-exam.dto';
import { FetchExamsDto } from './dto/fetch-exams.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ClassRepository } from '@/domain/repository/ClassRepository';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';

@ApiTags('Exames')
@Controller('exam')
export class ExamController {
  constructor(
    @Inject('EXAM_REPOSITORY')
    private readonly examRepository: ExamRepository,
    @Inject('QUESTION_REPOSITORY')
    private readonly questionRepository: QuestionRepository,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    @Inject('CLASS_REPOSITORY')
    private readonly classRepository: ClassRepository,
    @Inject('EXAM_DAO')
    private readonly examDAO: ExamDAO,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar um novo exame' })
  @ApiResponse({ 
    status: 201, 
    description: 'Exame criado com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        authorId: { type: 'string' },
        classId: { type: 'string' },
        openDate: { type: 'string', format: 'date-time' },
        closeDate: { type: 'string', format: 'date-time' },
        questions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma ou questões não encontradas' })
  async create(@Request() req, @Body() createExamDto: CreateExamDto) {
    const authorId = req.user.sub;
    const useCase = new CreateExam(this.classRepository,this.userRepository,this.examRepository,this.questionRepository);
    return useCase.execute({ ...createExamDto, authorId });
  }

  @Get('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter um exame específico pelo ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Exame encontrado com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        authorId: { type: 'string' },
        author: { 
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        classId: { type: 'string' },
        openDate: { type: 'string', format: 'date-time' },
        closeDate: { type: 'string', format: 'date-time' },
        questions: {
          type: 'array',
          items: {
            type: 'object',
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
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Exame não encontrado' })
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    const useCase = new GetExam(this.examRepository, this.userRepository,this.questionRepository);
    return useCase.execute({ id, userId });
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar exames (paginado)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de exames recuperada com sucesso',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              authorId: { type: 'string' },
              authorName: { type: 'string' },
              classId: { type: 'string' },
              className: { type: 'string' },
              openDate: { type: 'string', format: 'date-time' },
              closeDate: { type: 'string', format: 'date-time' },
              questionsCount: { type: 'number' }
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
  async fetchExams(@Query() query: FetchExamsDto) {
    const fetchExams = new FetchExams(this.examDAO);
    return fetchExams.execute(query);
  }

  @Put('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar um exame existente' })
  @ApiResponse({ 
    status: 200, 
    description: 'Exame atualizado com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        authorId: { type: 'string' },
        classId: { type: 'string' },
        openDate: { type: 'string', format: 'date-time' },
        closeDate: { type: 'string', format: 'date-time' },
        questions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Exame não encontrado' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
  ) {
    const userId = req.user.sub;
    const useCase = new UpdateExam(this.examRepository);
    return useCase.execute({ id, userId, ...updateExamDto });
  }

  @Delete('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Excluir um exame' })
  @ApiResponse({ status: 200, description: 'Exame excluído com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Exame não encontrado' })
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    const useCase = new DeleteExam(this.userRepository, this.examRepository);
    return useCase.execute({ id, userId });
  }
}