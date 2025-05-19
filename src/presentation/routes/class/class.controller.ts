import { CreateClass } from '@/application/usecase/Class/CreateClass';
import { DeleteClass } from '@/application/usecase/Class/DeleteClass';
import { GetClass } from '@/application/usecase/Class/GetClass';
import { UpdateClass } from '@/application/usecase/Class/UpdateClass';
import { FetchClasses } from '@/application/query/FetchClasses';
import { ClassRepository } from '@/domain/repository/ClassRepository';
import { UserRepository } from '@/domain/repository/UserRepository';
import { ClassDAO } from '@/application/dao/ClassDAO';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Request } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class';
import { FetchClassesDto } from './dto/fetch-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AddStudentToClass } from '@/application/usecase/Class/AddStudentToClass';
import { RemoveStudentFromClass } from '@/application/usecase/Class/RemoveStudentFromClass';
import { AddStudentToClassDto } from './dto/add-student-to-class.dto';
import { ExamRepository } from '@/domain/repository/ExamRepository';

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
  async create(@Request() req, @Body() createClassDto: CreateClassDto) {
    const teacherId = req.user.sub;
    const useCase = new CreateClass(this.classRepository, this.userRepository);
    return useCase.execute({ ...createClassDto, teacherId });
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const useCase = new GetClass(this.classRepository,this.userRepository,this.examRepository);
    return useCase.execute({ id });
  }

  @Get()
  async fetchClasses(@Query() query: FetchClassesDto) {
    const fetchClasses = new FetchClasses(this.classDAO);
    return fetchClasses.execute(query);
  }

  @Put('/:id')
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
  async remove(@Request() req, @Param('id') id: string) {
    const teacherId = req.user.sub;
    const useCase = new DeleteClass(this.classRepository);
    return useCase.execute({ id, teacherId });
  }

  @Post('/:id/student')
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