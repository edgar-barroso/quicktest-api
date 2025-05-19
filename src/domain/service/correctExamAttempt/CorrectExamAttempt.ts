import { Answer } from "@/domain/entity/ExamAttempt";
import { Question } from "@/domain/entity/Question";

export interface CorrectExamAttempt{
    getScore: (answer:Answer[],questions:Question[]) => number;
}