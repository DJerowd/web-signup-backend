# API de Autenticação com Node.js e MySQL

Este repositório contém o código-fonte do back-end para um sistema de autenticação de usuários completo. A API foi construída com Node.js, Express e MySQL, seguindo as melhores práticas de segurança e arquitetura de software para APIs RESTful.

## ✨ Features

- **Autenticação Stateless com JWT:** Geração de JSON Web Tokens (`jsonwebtoken`) no login para autenticação segura e sem estado.
- **Segurança de Senhas:** As senhas são criptografadas usando `bcryptjs` antes de serem salvas no banco de dados.
- **CRUD de Usuários:** Funcionalidades completas para Criar, Ler, Atualizar e Deletar usuários.
- **Controle de Acesso Baseado em Roles (Cargos):** Sistema de permissões que diferencia usuários comuns (`user`) de administradores (`admin`).
- **Listagem Avançada:** A rota de listagem de usuários inclui funcionalidades de paginação e pesquisa por nome.
- **Rotas Protegidas:** Uso de middleware para garantir que apenas usuários autenticados (e com a `role` correta) possam acessar rotas específicas.
- **Validação de Dados:** Camada de validação com `express-validator` para garantir a integridade dos dados de entrada.
- **Tratamento de Erros Centralizado:** Um middleware dedicado para capturar e formatar todos os erros da aplicação.
- **Respostas da API Padronizadas:** Respostas JSON consistentes para sucesso e erro, facilitando a integração com o front-end.

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **MySQL** como banco de dados
- **Sequelize** como ORM para interação com o banco de dados
- **jsonwebtoken (JWT)** para gerenciamento de tokens
- **bcryptjs** para hashing de senhas
- **express-validator** para validação de dados de entrada
- **dotenv** para gerenciamento de variáveis de ambiente
- **cors** para permitir requisições de diferentes origens

## 🚀 Como Rodar o Projeto

**Pré-requisitos**

- Node.js (v18+)
- MySQL

**Passos para Instalação**

1. Clone o repositório:

```
Bash
git clone https://github.com/DJerowd/web-signup-backend/.git
```

2. Navegue até a pasta do back-end:

```
Bash
cd web-signup-backend
```

3. Instale as dependências:

```
Bash
npm install
```

4. Configure as Variáveis de Ambiente:

- Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
- Preencha as variáveis no arquivo `.env` com suas credenciais do MySQL e um segredo para o JWT.

5. Configure o Banco de Dados:

- Execute o script SQL abaixo para criar o banco de dados e a tabela `users`:

```
SQL
CREATE DATABASE auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auth_db;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

6. (Opcional) Crie um usuário Admin: Para testar as rotas de administrador, promova um usuário manualmente no banco de dados:

```
SQL
UPDATE users SET role = 'admin' WHERE email = 'seu-email-de-admin@exemplo.com';
```

7. Rode o servidor de desenvolvimento:

```
Bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida no seu `.env`).

## 📖 Endpoints da API

### Autenticação

#### `POST /api/register`

Registra um novo usuário.
**Corpo da Requisição:**

```
JSON
{
    "name": "Seu Nome",
    "email": "email@exemplo.com",
    "password": "senhaComMinimo8Caracteres"
}
```

**Resposta de Sucesso (201 Created):**

```
JSON
{
    "status": "success",
    "data": {
        "message": "Usuário registrado com sucesso!",
        "userId": 1
    }
}
```

**Respostas de Erro:**

- `409 Conflict:` Se o e-mail já estiver em uso.
- `422 Unprocessable Entity:` Se os dados de entrada falharem na validação (ex: senha curta).

#### `POST /api/login`

Autentica um usuário e retorna um token JWT.
**Corpo da Requisição:**

```
JSON
{
    "email": "email@exemplo.com",
    "password": "suaSenha"
}
```

**Resposta de Sucesso (200 OK):**

```
JSON
{
    "status": "success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**Respostas de Erro:**

- `401 Unauthorized:` Se as credenciais forem inválidas.
- `422 Unprocessable Entity:` Se os dados de entrada forem malformatados.

#### `GET /api/profile`

Retorna as informações do usuário autenticado. Rota protegida.
**Cabeçalho da Requisição (Header):**

- `Authorization: Bearer <seu_token_jwt>`
  **Resposta de Sucesso (200 OK):**

```
JSON
{
    "status": "success",
    "data": {
        "user": {
            "id": 1,
            "name": "Seu Nome",
            "email": "email@exemplo.com",
            "createdAt": "...",
            "updatedAt": "..."
        }
    }
}
```

**Respostas de Erro:**

- `401 Unauthorized:` Se o token não for fornecido ou for inválido.

### Gerenciamento de Usuários (Requer Autenticação)

#### `GET /api/users`

Retorna uma lista paginada de todos os usuários. **Requer role de 'admin'**.
**Parâmetros de Query (Opcionais):**

- `page` (número, padrão: 1): Página desejada.
- `limit` (número, padrão: 10): Quantidade de usuários por página.
- `name` (string): Filtra usuários por nome (busca parcial).
  **Exemplo de Resposta (200 OK):**

```json
{
    "status": "success",
    "data": {
        "users": [...],
        "pagination": {
            "totalUsers": 50,
            "totalPages": 5,
            "currentPage": 1,
            "limit": 10
        }
    }
}
```

#### `PUT /api/users/:id`

Atualiza as informações de um usuário específico. Permissão: 'admin' ou o próprio usuário.
**Parâmetros da URL:**

- `id` (número): ID do usuário a ser atualizado.
  **Corpo da Requisição:**

```
JSON
{
  "name": "Novo Nome",
  "email": "novoemail@exemplo.com"
}
```

#### `DELETE /api/users/:id`

Deleta um usuário específico. Permissão: 'admin' ou o próprio usuário.
**Parâmetros da URL:**

- `id` (número): ID do usuário a ser deletado.
