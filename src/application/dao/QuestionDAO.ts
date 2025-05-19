export interface QuestionDAO {
  findAll(
    page: number,
    pageLength: number,
  ): Promise<
    {
      id: string;
      authorId: string;
      description: string;
      choices: {
        id: string;
        text: string;
        isCorrect?: boolean;
      }[];
    }[]
  >;
}
