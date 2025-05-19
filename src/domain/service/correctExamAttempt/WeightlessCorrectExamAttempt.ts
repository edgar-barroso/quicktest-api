import { Answer, ExamAttempt } from '@/domain/entity/ExamAttempt';
import { CorrectExamAttempt } from './CorrectExamAttempt';
import { Question } from '@/domain/entity/Question';

export class WeightlessCorrectExamAttempt implements CorrectExamAttempt {
  constructor(private readonly answer: Answer[], private readonly questions: Question[]) {}
  getScore(): number {
    let score = 0;
    this.answer.forEach((answer) => {
      const question = this.questions.find(q => q.getId() === answer.getQuestionId());
      if (question) {
        const correctChoice = question.getChoices().find(c => c.getIsCorrect());
        if (correctChoice && answer.getChoiceId() === correctChoice.getId()) {
          score++;
        }
      }
    });
    return score/this.questions.length;
  }
}
