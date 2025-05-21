# API REST para Gerenciamento de Tarefas com Autenticação JWT

Esta é uma API RESTful para gerenciamento de tarefas, que utiliza autenticação JWT (JSON Web Token) para proteger os endpoints.

## Pré-requisitos

*   Node.js (v18 ou superior)
*   MongoDB

## Instalação

1.  Clone o repositório:

    ```bash
    git clone <repositório>
    ```

2.  Instale as dependências:

    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente:

    *   Crie um arquivo `.env` na raiz do projeto.
    *   Adicione as seguintes variáveis:

        ```
        PORT=3000
        MONGODB_URI=mongodb://localhost:27017/task-management
        JWT_SECRET=seu_jwt_secret_super_seguro
        JWT_EXPIRATION=3600
        ```

        Substitua os valores pelos seus próprios.

## Execução

1.  Inicie o servidor MongoDB.
2.  Execute a API:

    ```bash
    npm start
    ```

A API estará disponível em `http://localhost:3000`.

## Endpoints

### Autenticação

*   `POST /api/auth/register`: Registra um novo usuário.
*   `POST /api/auth/login`: Autentica um usuário e retorna um token JWT.

### Tarefas

*   `GET /api/tasks`: Lista todas as tarefas do usuário autenticado.
*   `GET /api/tasks/:id`: Retorna uma tarefa específica do usuário autenticado.
*   `POST /api/tasks`: Cria uma nova tarefa para o usuário autenticado.
*   `PUT /api/tasks/:id`: Atualiza uma tarefa existente do usuário autenticado.
*   `DELETE /api/tasks/:id`: Remove uma tarefa do usuário autenticado.

## Testes

Para executar os testes, utilize o seguinte comando:

```bash
npm test
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

## Licença

MIT
