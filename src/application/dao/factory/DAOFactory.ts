import { ClassDAO } from '../ClassDAO';
import { ExamDAO } from '../ExamDAO';
import { QuestionDAO } from '../QuestionDAO';
import { UserDAO } from '../UserDAO';

export interface DAOFactory {
  createUserDAO(): UserDAO;
  createQuestionDAO(): QuestionDAO;
  createExamDAO(): ExamDAO;
  createClassDAO(): ClassDAO;
}
