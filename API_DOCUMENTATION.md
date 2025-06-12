# QuickTest API - Documentação

## Introdução

A QuickTest API é um sistema de gerenciamento de testes online que permite a criação de exames com questões de múltipla escolha, gerenciamento de turmas, alunos e professores, além de avaliação automática de respostas.

## Configuração e Execução

### Pré-requisitos

- Node.js (v16+)
- npm ou yarn
- PostgreSQL

### Instalação

```bash
# Instalar dependências
npm install

# Executar migrations do banco de dados
npx prisma migrate dev

# Iniciar servidor em modo desenvolvimento
npm run dev
```

O servidor será iniciado na porta 3000 por padrão. A documentação do Swagger estará disponível em: http://localhost:3000/api/docs

## Estrutura do Projeto

O projeto segue uma arquitetura limpa (Clean Architecture) com as seguintes camadas:

- **Presentation**: Controladores e DTOs
- **Application**: Casos de uso e DAOs
- **Domain**: Entidades, repositórios e regras de negócio
- **Infrastructure**: Implementação concreta dos repositórios e serviços

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para acessar endpoints protegidos, você deve:

1. Registrar um usuário ou fazer login
2. Receber o token JWT
3. Incluir o token em todas as requisições subsequentes no cabeçalho `Authorization: Bearer {token}`

## Endpoints Principais

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | /user/register | Registrar novo usuário | Não |
| POST | /user/login | Fazer login | Não |
| GET | /user | Obter informações do usuário atual | Sim |
| PUT | /user | Atualizar informações do usuário atual | Sim |
| DELETE | /user | Excluir a conta do usuário atual | Sim |
| GET | /user/:page | Listar usuários (paginado) | Sim |

### Questões

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | /question | Criar nova questão | Sim |
| GET | /question/:id | Obter questão específica | Sim |
| PUT | /question/:id | Atualizar questão existente | Sim |
| DELETE | /question/:id | Excluir questão | Sim |
| GET | /question | Listar questões (paginado) | Sim |

### Turmas

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | /class | Criar nova turma | Sim |
| GET | /class/:id | Obter turma específica | Sim |
| PUT | /class/:id | Atualizar turma existente | Sim |
| DELETE | /class/:id | Excluir turma | Sim |
| GET | /class | Listar turmas (paginado) | Sim |
| POST | /class/:id/student | Adicionar aluno à turma | Sim |
| DELETE | /class/:id/student/:studentId | Remover aluno da turma | Sim |

### Exames

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | /exam | Criar novo exame | Sim |
| GET | /exam/:id | Obter exame específico | Sim |
| PUT | /exam/:id | Atualizar exame existente | Sim |
| DELETE | /exam/:id | Excluir exame | Sim |
| GET | /exam | Listar exames (paginado) | Sim |

### Tentativas de Exame

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | /exam-attempt | Iniciar tentativa de exame | Sim |
| GET | /exam-attempt/:id | Obter detalhes de tentativa de exame | Sim |
| POST | /exam-attempt/:id/answer | Adicionar resposta à tentativa de exame | Sim |
| POST | /exam-attempt/:id/grade | Corrigir e atribuir nota | Sim |

## Modelos de Dados

### Usuário

```json
{
  "id": "uuid",
  "name": "Nome do usuário",
  "email": "email@exemplo.com",
  "role": "TEACHER ou STUDENT"
}
```

### Questão

```json
{
  "id": "uuid",
  "description": "Texto da questão",
  "authorId": "uuid",
  "choices": [
    {
      "id": "uuid",
      "text": "Alternativa 1",
      "isCorrect": true
    },
    {
      "id": "uuid",
      "text": "Alternativa 2",
      "isCorrect": false
    }
  ]
}
```

### Turma

```json
{
  "id": "uuid",
  "title": "Título da turma",
  "description": "Descrição da turma",
  "teacherId": "uuid",
  "students": [
    {
      "id": "uuid",
      "name": "Nome do aluno"
    }
  ]
}
```

### Exame

```json
{
  "id": "uuid",
  "title": "Título do exame",
  "description": "Descrição do exame",
  "authorId": "uuid",
  "classId": "uuid",
  "openDate": "2025-06-01T10:00:00Z",
  "closeDate": "2025-06-01T12:00:00Z",
  "questions": [
    {
      "id": "uuid"
    }
  ]
}
```

### Tentativa de Exame

```json
{
  "id": "uuid",
  "examId": "uuid",
  "studentId": "uuid",
  "startedAt": "2025-06-01T10:30:00Z",
  "finishedAt": "2025-06-01T11:15:00Z",
  "finished": true,
  "score": 80,
  "answers": [
    {
      "questionId": "uuid",
      "choiceId": "uuid"
    }
  ]
}
```

### Adicionar Resposta à Tentativa de Exame

**Request:**
```http
POST /exam-attempt/550e8400-e29b-41d4-a716-446655440000/answer
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "questionId": "550e8400-e29b-41d4-a716-446655440003",
  "choiceId": "550e8400-e29b-41d4-a716-446655440004"
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "examId": "550e8400-e29b-41d4-a716-446655440001",
  "studentId": "550e8400-e29b-41d4-a716-446655440002",
  "questionId": "550e8400-e29b-41d4-a716-446655440003",
  "choiceId": "550e8400-e29b-41d4-a716-446655440004",
  "message": "Resposta adicionada com sucesso"
}
```

## Exemplos de Uso

### Registro de Usuário

**Request:**
```http
POST /user/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "TEACHER"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Criação de Questão

**Request:**
```http
POST /question
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "description": "Qual é a capital do Brasil?",
  "choices": [
    {
      "text": "Rio de Janeiro",
      "isCorrect": false
    },
    {
      "text": "São Paulo",
      "isCorrect": false
    },
    {
      "text": "Brasília",
      "isCorrect": true
    },
    {
      "text": "Salvador",
      "isCorrect": false
    }
  ]
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "description": "Qual é a capital do Brasil?",
  "authorId": "550e8400-e29b-41d4-a716-446655440001",
  "choices": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "text": "Rio de Janeiro",
      "isCorrect": false
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "text": "São Paulo",
      "isCorrect": false
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "text": "Brasília",
      "isCorrect": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "text": "Salvador",
      "isCorrect": false
    }
  ]
}
```

## Tratamento de Erros

A API retorna códigos de status HTTP apropriados para cada situação:

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos enviados
- `401 Unauthorized`: Autenticação necessária ou token inválido
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `409 Conflict`: Conflito (ex.: e-mail já registrado)
- `500 Internal Server Error`: Erro interno do servidor

## Paginação

Endpoints de listagem suportam paginação com os seguintes parâmetros:

- `page`: Número da página (começa em 1)
- `pageLength`: Número de itens por página (padrão: 10)

Exemplo:
```
GET /question?page=2&pageLength=20
```

A resposta contém metadados de paginação:
```json
{
  "items": [...],
  "total": 47,
  "page": 2,
  "pageLength": 20
}
```
