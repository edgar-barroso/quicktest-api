<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# QuickTest Backend

Sistema backend para gerenciamento de provas, questões, turmas e tentativas de exames. Desenvolvido com NestJS, Prisma e PostgreSQL.

## Funcionalidades
- Cadastro e autenticação de usuários (professor/aluno)
- Gerenciamento de turmas
- Criação e listagem de questões
- Criação, edição, listagem e remoção de provas (exams)
- Tentativas de exames por alunos
- Testes automatizados (E2E, integração e unidade)

## Tecnologias
- Node.js
- NestJS
- Prisma ORM
- PostgreSQL
- Docker (opcional)
- JWT Auth

## Pré-requisitos
- Node.js >= 18
- Yarn ou npm
- PostgreSQL rodando localmente (ou use Docker)

## Configuração do ambiente

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/quicktest.git
   cd quicktest/backend
   ```

2. **Configure o banco de dados:**
   - Altere a variável `DATABASE_URL` no arquivo `.env` para apontar para seu banco PostgreSQL.
   - Exemplo padrão já incluso:
     ```env
     DATABASE_URL="postgresql://root:root@localhost:5432/quicktest?schema=public"
     ```
   - Se quiser rodar via Docker, use:
     ```sh
     docker-compose up -d
     ```

3. **Instale as dependências:**
   ```sh
   yarn install
   # ou
   npm install
   ```

4. **Rode as migrations do Prisma:**
   ```sh
   npx prisma migrate dev
   # ou
   yarn prisma migrate dev
   ```

5. **Gere o client do Prisma:**
   ```sh
   npx prisma generate
   # ou
   yarn prisma generate
   ```

6. **Inicie o servidor:**
   ```sh
   yarn start:dev
   # ou
   npm run start:dev
   ```
   O backend estará disponível em `http://localhost:3001`.

## Rodando os testes

- **Testes E2E:**
  ```sh
  yarn test:e2e
  # ou
  npm run test:e2e
  ```
- **Testes unitários:**
  ```sh
  yarn test
  # ou
  npm test
  ```

## Estrutura de Pastas
- `src/` - Código-fonte principal
- `prisma/` - Migrations e schema do banco
- `test/` - Testes automatizados

## Observações
- O projeto utiliza autenticação JWT. Para acessar rotas protegidas, obtenha um token via login.
- O arquivo `.env` já está configurado para ambiente local, mas pode ser ajustado conforme necessário.

---

Desenvolvido por [Seu Nome](https://github.com/seu-usuario)
