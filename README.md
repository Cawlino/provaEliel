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
    *   **Request Body:**
        ```json
        {
            "email": "string (required)",
            "password": "string (required)"
        }
        ```
    *   **Response:**
        ```json
        {
            "_id": "string",
            "email": "string"
        }
        ```
    *   **Example Usage:**
        ```bash
        curl -X POST -H "Content-Type: application/json" -d '{
            "email": "test@example.com",
            "password": "password123"
        }' http://localhost:3000/api/auth/register
        ```
*   `POST /api/auth/login`: Autentica um usuário e retorna um token JWT.
    *   **Request Body:**
        ```json
        {
            "email": "string (required)",
            "password": "string (required)"
        }
        ```
    *   **Response:**
        ```json
        {
            "token": "string"
        }
        ```
    *   **Example Usage:**
        ```bash
        curl -X POST -H "Content-Type: application/json" -d '{
            "email": "test@example.com",
            "password": "password123"
        }' http://localhost:3000/api/auth/login
        ```

### Tarefas

*   `GET /api/tasks`: Lista todas as tarefas do usuário autenticado.
    *   **Request Headers:**
        ```
        Authorization: Bearer <token>
        ```
    *   **Response:**
        ```json
        [
            {
                "_id": "string",
                "title": "string",
                "description": "string",
                "status": "string",
                "userId": "string"
            }
        ]
        ```
    *   **Example Usage:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:3000/api/tasks
        ```
*   `GET /api/tasks/:id`: Retorna uma tarefa específica do usuário autenticado.
    *   **Request Headers:**
        ```
        Authorization: Bearer <token>
        ```
    *   **Response:**
        ```json
        {
            "_id": "string",
            "title": "string",
            "description": "string",
            "status": "string",
            "userId": "string"
        }
        ```
    *   **Example Usage:**
        ```bash
        curl -X GET -H "Authorization: Bearer <token>" http://localhost:3000/api/tasks/123
        ```
*   `POST /api/tasks`: Cria uma nova tarefa para o usuário autenticado.
    *   **Request Headers:**
        ```
        Authorization: Bearer <token>
        ```
    *   **Request Body:**
        ```json
        {
            "title": "string (required)",
            "description": "string",
            "status": "string (optional)"
        }
        ```
    *   **Response:**
        ```json
        {
            "_id": "string",
            "title": "string",
            "description": "string",
            "status": "string",
            "userId": "string"
        }
        ```
    *   **Example Usage:**
        ```bash
        curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{
            "title": "Test Task",
            "description": "Test Description",
            "status": "open"
        }' http://localhost:3000/api/tasks
        ```
*   `PUT /api/tasks/:id`: Atualiza uma tarefa existente do usuário autenticado.
    *   **Request Headers:**
        ```
        Authorization: Bearer <token>
        ```
    *   **Request Body:**
        ```json
        {
            "title": "string (optional)",
            "description": "string (optional)",
            "status": "string (optional)"
        }
        ```
    *   **Response:**
        ```json
        {
            "_id": "string",
            "title": "string",
            "description": "string",
            "status": "string",
            "userId": "string"
        }
        ```
    *   **Example Usage:**
        ```bash
        curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{
            "title": "Updated Task",
            "description": "Updated Description",
            "status": "in progress"
        }' http://localhost:3000/api/tasks/123
        ```
*   `DELETE /api/tasks/:id`: Remove uma tarefa do usuário autenticado.
    *   **Request Headers:**
        ```
        Authorization: Bearer <token>
        ```
    *   **Response:**
        ```
        (No content)
        ```
    *   **Example Usage:**
        ```bash
        curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:3000/api/tasks/123
        ```

## Testes

Para executar os testes, utilize o seguinte comando:

```bash
npm test
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

## Licença

MIT
