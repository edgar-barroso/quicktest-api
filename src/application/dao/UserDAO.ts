export interface UserDAO {
  findAll(
    page: number,
    pageLength: number,
  ): Promise<{ name: string; email: string }[]>;
}
