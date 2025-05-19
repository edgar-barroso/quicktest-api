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
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionRepository } from '@/domain/repository/QuestionRepository';
import { QuestionDAO } from '@/application/dao/QuestionDAO';
import { UserRepository } from '@/domain/repository/UserRepository';
import { FetchQuestionsDto } from './dto/fetch-questions.dto';

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
  async create(@Request() req, @Body() createQuestionDto: CreateQuestionDto) {
    const authorId = req.user.sub;
    const useCase = new CreateQuestion(
      this.questionRepository,
      this.userRepository,
    );
    return useCase.execute({ ...createQuestionDto, authorId });
  }

  @Get('/:id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    const useCase = new GetQuestion(
      this.questionRepository,
      this.userRepository,
    );
    return useCase.execute({ id, userId });
  }

  @Get()
  async fetchQuestions(@Request() req,@Query() query: FetchQuestionsDto) {
    const role = req.user.role;
    const fetchQuestions = new FetchQuestions(this.questionDAO);
    return fetchQuestions.execute({...query, role });
  }

  @Put('/:id')
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
  async remove(@Request() req, @Param('id') id: string) {
    const authorId = req.user.sub;
    const useCase = new DeleteQuestion(this.questionRepository);

    return useCase.execute({ id, authorId });
  }
}
