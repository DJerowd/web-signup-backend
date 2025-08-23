# API de Autenticação com Node.js e MySQL

Este repositório contém o código-fonte do back-end para um sistema de autenticação de usuários completo. A API foi construída com Node.js, Express e MySQL, seguindo as melhores práticas de segurança e arquitetura de software para APIs RESTful.

## ✨ Features

- **Cadastro de Usuários:** Rota para registro de novos usuários com validação de dados.
- **Segurança de Senhas:** As senhas são criptografadas usando bcryptjs antes de serem salvas no banco de dados.
- **Autenticação Stateless com JWT:** Geração de JSON Web Tokens (jsonwebtoken) no login para autenticação segura e sem estado.
- **Rotas Protegidas:** Uso de middleware para garantir que apenas usuários autenticados possam acessar rotas específicas.
- **Validação de Dados:** Camada de validação com express-validator para garantir a integridade dos dados de entrada.
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
git clone https://github.com/seu-usuario/seu-repo.git
```

2. Navegue até a pasta do back-end:
```
Bash
cd nome-do-repo/backend
```

3. Instale as dependências:
```
Bash
npm install
```

4. Configure as Variáveis de Ambiente:
- Crie uma cópia do arquivo .env.example e renomeie para .env.
- Preencha as variáveis no arquivo .env com suas credenciais do MySQL e um segredo para o JWT.

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
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

6. Rode o servidor de desenvolvimento:
```
Bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida no seu `.env`).

## Endpoints da API

**Autenticação**

`POST /api/register`

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

`POST /api/login`

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

`GET /api/profile`

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
