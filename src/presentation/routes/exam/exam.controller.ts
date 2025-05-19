import { CreateExam } from '@/application/usecase/Exam/CreateExam';
import { DeleteExam } from '@/application/usecase/Exam/DeleteExam';
import { GetExam } from '@/application/usecase/Exam/GetExam';
import { UpdateExam } from '@/application/usecase/Exam/UpdateExam';
import { FetchExams } from '@/application/query/FetchExams';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { ExamDAO } from '@/application/dao/ExamDAO';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Request } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { FetchExamsDto } from './dto/fetch-exams.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ClassRepository } from '@/domain/repository/ClassRepository';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';

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
  async create(@Request() req, @Body() createExamDto: CreateExamDto) {
    const authorId = req.user.sub;
    const useCase = new CreateExam(this.classRepository,this.userRepository,this.examRepository,this.questionRepository);
    return useCase.execute({ ...createExamDto, authorId });
  }

  @Get('/:id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    const useCase = new GetExam(this.examRepository, this.userRepository,this.questionRepository);
    return useCase.execute({ id, userId });
  }

  @Get()
  async fetchExams(@Query() query: FetchExamsDto) {
    const fetchExams = new FetchExams(this.examDAO);
    return fetchExams.execute(query);
  }

  @Put('/:id')
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
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    const useCase = new DeleteExam(this.userRepository, this.examRepository);
    return useCase.execute({ id, userId });
  }
}