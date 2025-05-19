import { Question, Choice } from "@/domain/entity/Question";
import { ValidationError } from "@/domain/error/ValidationError";
import { dummyQuestionProps } from "../../utils";

describe("Question", () => {
  test("Deve criar uma questão com escolhas válidas", () => {
    const questionProps = dummyQuestionProps();
    const question = Question.create(questionProps);

    expect(question.getId()).toEqual(expect.any(String));
    expect(question.getAuthorId()).toBe(questionProps.authorId);
    expect(question.getDescription()).toBe(questionProps.description);
    expect(question.getChoices()).toHaveLength(questionProps.choices.length);
    expect(question.getChoices()[0].getText()).toBe(questionProps.choices[0].getText());
    expect(question.getChoices()[0].getIsCorrect()).toBe(questionProps.choices[0].getIsCorrect());
  });

  test("Deve lançar erro ao criar uma questão sem escolhas", () => {
    const questionProps = dummyQuestionProps({ choices: [] });

    expect(() => Question.create(questionProps)).toThrow(ValidationError);
  });

  test("Deve lançar erro ao criar uma questão com descricao inválida", () => {
    const questionProps = dummyQuestionProps({ description: " " });

    expect(() => Question.create(questionProps)).toThrow(ValidationError);
  });

  test("Deve retornar as informações da questão corretamente", () => {
    const questionProps = dummyQuestionProps();
    const question = Question.create(questionProps);

    expect(question.getId()).toEqual(expect.any(String));
    expect(question.getAuthorId()).toBe(questionProps.authorId);
    expect(question.getDescription()).toBe(questionProps.description);
    expect(question.getChoices()).toEqual(questionProps.choices);
    expect(question.getCreatedAt()).toEqual(expect.any(Date));
  });

  test("Deve validar corretamente as escolhas da questão", () => {
    const choices = [
      new Choice("Option 1", true),
      new Choice("Option 2", false),
    ];
    const questionProps = dummyQuestionProps({ choices });
    const question = Question.create(questionProps);

    expect(question.getChoices()).toHaveLength(2);
    expect(question.getChoices()[0].getText()).toBe("Option 1");
    expect(question.getChoices()[0].getIsCorrect()).toBe(true);
    expect(question.getChoices()[1].getText()).toBe("Option 2");
    expect(question.getChoices()[1].getIsCorrect()).toBe(false);
  });
});