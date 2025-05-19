import { Body, Controller, Get, HttpCode, Inject, Param, Post, Put, Request } from '@nestjs/common';
import { CreateExamAttempt } from '@/application/usecase/ExamAttempt/CreateExamAttempt';
import { GetExamAttempt } from '@/application/usecase/ExamAttempt/GetExamAttempt';
import { GradeExamAttempt } from '@/application/usecase/ExamAttempt/GradeExamAttempt';
import { ExamAttemptRepository } from '@/domain/repository/ExamAttemptRepository';
import { ExamRepository } from '@/domain/repository/ExamRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { CreateExamAttemptDto } from './dto/create-exam-attempt.dto';
import { UpdateExamAttemptDto } from './dto/update-exam-attempt.dto';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';

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
  async create(@Request() req, @Body() createExamAttemptDto: CreateExamAttemptDto) {
    const studentId = req.user.sub;
    const useCase = new CreateExamAttempt(this.examAttemptRepository, this.examRepository, this.userRepository);
    return useCase.execute({ ...createExamAttemptDto, studentId });
  }

  @Get('/:id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    const useCase = new GetExamAttempt(this.examAttemptRepository,this.examRepository);
    return useCase.execute({ id, userId });
  }


  @Post('/:id/grade')
  @HttpCode(200)
  async grade(@Param('id') id: string) {
    const useCase = new GradeExamAttempt(this.examAttemptRepository,this.examRepository,this.questionRepository);
    return useCase.execute({ id });
    
  }
}