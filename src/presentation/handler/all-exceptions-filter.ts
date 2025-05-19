import { 
  UnauthorizedError 
} from '@/application/error/UnauthorizedError';
import { 
  UserAlreadyExistError 
} from '@/application/error/UserAlreadyExistError';
import { 
  UserNotFoundError 
} from '@/application/error/UserNotFoundError';
import { 
  ValidationError 
} from '@/domain/error/ValidationError';
import { 
  ClassNotFoundError 
} from '@/application/error/ClassNotFoundError';
import { 
  ExamNotFoundError 
} from '@/application/error/ExamNotFoundError';
import { 
  ExamAttemptNotFoundError 
} from '@/application/error/ExamAttemptNotFoundError';
import { 
  QuestionNotFoundError 
} from '@/application/error/QuestionNotFoundError';
import { 
  QuestionAlreadyExistError 
} from '@/application/error/QuestionAlreadyExistError';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof UserAlreadyExistError) {
      response
        .status(409)
        .json({ statusCode: 409, message: exception.message });
    } else if (exception instanceof UserNotFoundError) {
      response
        .status(404)
        .json({ statusCode: 404, message: exception.message });
    } else if (exception instanceof ValidationError) {
      response
        .status(400)
        .json({ statusCode: 400, message: exception.message });
    } else if (exception instanceof UnauthorizedError) {
      response
        .status(401)
        .json({ statusCode: 401, message: exception.message });
    } else if (exception instanceof ClassNotFoundError) {
      response
        .status(404)
        .json({ statusCode: 404, message: exception.message });
    } else if (exception instanceof ExamNotFoundError) {
      response
        .status(404)
        .json({ statusCode: 404, message: exception.message });
    } else if (exception instanceof ExamAttemptNotFoundError) {
      response
        .status(404)
        .json({ statusCode: 404, message: exception.message });
    } else if (exception instanceof QuestionNotFoundError) {
      response
        .status(404)
        .json({ statusCode: 404, message: exception.message });
    } else if (exception instanceof QuestionAlreadyExistError) {
      response
        .status(409)
        .json({ statusCode: 409, message: exception.message });
    } else {
      // Fallback para exceções não tratadas
      super.catch(exception, host);
    }
  }
}