import { CreateClass } from '@/application/usecase/Class/CreateClass';
import { DeleteClass } from '@/application/usecase/Class/DeleteClass';
import { GetClass } from '@/application/usecase/Class/GetClass';
import { UpdateClass } from '@/application/usecase/Class/UpdateClass';
import { FetchClasses } from '@/application/query/FetchClasses';
import { ClassRepository } from '@/domain/repository/ClassRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { ClassDAO } from '@/application/dao/ClassDAO';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateClassDto } from './dto/create-class';
import { FetchClassesDto } from './dto/fetch-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AddStudentToClass } from '@/application/usecase/Class/AddStudentToClass';
import { RemoveStudentFromClass } from '@/application/usecase/Class/RemoveStudentFromClass';
import { AddStudentToClassDto } from './dto/add-student-to-class.dto';
import { ExamRepository } from '@/domain/repository/ExamRepository';

@ApiTags('Turmas')
@Controller('class')
export class ClassController {
  constructor(
    @Inject('CLASS_REPOSITORY')
    private readonly classRepository: ClassRepository,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    @Inject('CLASS_DAO')
    private readonly classDAO: ClassDAO,
    @Inject('EXAM_REPOSITORY')
    private readonly examRepository: ExamRepository,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar uma nova turma' })
  @ApiResponse({ 
    status: 201, 
    description: 'Turma criada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        teacherId: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@Request() req, @Body() createClassDto: CreateClassDto) {
    const teacherId = req.user.sub;
    const useCase = new CreateClass(this.classRepository, this.userRepository);
    return useCase.execute({ ...createClassDto, teacherId });
  }

  @Get('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter detalhes de uma turma específica' })
  @ApiResponse({ 
    status: 200, 
    description: 'Turma encontrada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        teacherId: { type: 'string' },
        teacher: { 
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        students: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' }
            }
          }
        },
        exams: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              openDate: { type: 'string', format: 'date-time' },
              closeDate: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  async findOne(@Param('id') id: string) {
    const useCase = new GetClass(this.classRepository,this.userRepository,this.examRepository);
    return useCase.execute({ id });
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar turmas (paginado)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de turmas recuperada com sucesso',
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
              teacherId: { type: 'string' },
              teacherName: { type: 'string' },
              studentsCount: { type: 'number' }
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
  async fetchClasses(@Query() query: FetchClassesDto) {
    const fetchClasses = new FetchClasses(this.classDAO);
    return fetchClasses.execute(query);
  }

  @Put('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar uma turma existente' })
  @ApiResponse({ 
    status: 200, 
    description: 'Turma atualizada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        teacherId: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    const teacherId = req.user.sub;
    const useCase = new UpdateClass(this.classRepository);
    return useCase.execute({ id, teacherId, ...updateClassDto });
  }

  @Delete('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Excluir uma turma' })
  @ApiResponse({ status: 200, description: 'Turma excluída com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  async remove(@Request() req, @Param('id') id: string) {
    const teacherId = req.user.sub;
    const useCase = new DeleteClass(this.classRepository);
    return useCase.execute({ id, teacherId });
  }

  @Post('/:id/student')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Adicionar um aluno à turma' })
  @ApiResponse({ 
    status: 200, 
    description: 'Aluno adicionado à turma com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        teacherId: { type: 'string' },
        students: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma ou aluno não encontrado' })
  async addStudent(
    @Request() req,
    @Param('id') id: string,
    @Body() addStudentDto: AddStudentToClassDto,
  ) {
    const teacherId = req.user.sub;
    const useCase = new AddStudentToClass(this.classRepository, this.userRepository);
    return useCase.execute({ id, teacherId, studentId: addStudentDto.studentId });
  }

  @Delete('/:id/student/:studentId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover um aluno da turma' })
  @ApiResponse({ status: 200, description: 'Aluno removido da turma com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Turma ou aluno não encontrado' })
  async removeStudent(
    @Request() req,
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ) {
    const teacherId = req.user.sub;
    const useCase = new RemoveStudentFromClass(this.classRepository, this.userRepository);
    return useCase.execute({ id, teacherId, studentId });
  }
}