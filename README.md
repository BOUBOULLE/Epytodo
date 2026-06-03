# EPYTODO

A Todo management API built with **Node.js**, **Express 5**, and **TypeScript**, backed by a **MySQL** database. Authentication is handled via **JWT** tokens.

---

## Tech Stack

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Runtime        | Node.js >= 18.x                                 |
| Framework      | Express 5, TypeScript                           |
| Database       | MySQL >= 8.x (via `mysql2`)                     |
| Auth           | JWT (`jsonwebtoken`), password hashing (`bcryptjs`) |
| Config         | `dotenv`                                        |
| Dev tooling    | `tsx` (live run), `tsc` (build)                 |

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or pnpm / yarn)
- **MySQL** >= 8.x — a running MySQL server (local or via Docker)

---

## Installation

```bash
# 1. Clone the repository
git clone <https://github.com/EpitechPGE1-2025/G-WEB-200-NCY-2-1-epytodo-1> epytodo
cd epytodo

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)

# 4. Initialize the database
mysql -u root -p < epytodo.sql

# 5. Start the server
npm start
```

---

## Environment Variables

Create a `.env` file at the root of the project with the following variables:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_ROOT_PASSWORD=your_mysql_password
MYSQL_DATABASE=epytodo
SECRET=your_jwt_secret_key
PORT=3000
```

| Variable             | Description                            |
|----------------------|----------------------------------------|
| `MYSQL_HOST`         | MySQL server host                      |
| `MYSQL_USER`         | MySQL username                         |
| `MYSQL_ROOT_PASSWORD`| MySQL password                         |
| `MYSQL_DATABASE`     | Name of the database (`epytodo`)       |
| `SECRET`             | Secret key used to sign JWT tokens     |
| `PORT`               | Port the server listens on (default: `3000`) |

---

## Scripts

| Command       | Description                                  |
|---------------|----------------------------------------------|
| `npm start`   | Run the server directly with `tsx` (no build needed) |
| `npm run build` | Compile TypeScript to `dist/` via `tsc`    |

---

## Database Schema

The SQL schema is located in `epytodo.sql`. It creates two tables:

### `user`

| Column       | Type           | Description                    |
|--------------|----------------|--------------------------------|
| `id`         | INT UNSIGNED   | Auto-incremented primary key   |
| `email`      | VARCHAR(255)   | Unique user email              |
| `password`   | VARCHAR(255)   | Bcrypt-hashed password         |
| `name`       | VARCHAR(255)   | Last name                      |
| `firstname`  | VARCHAR(255)   | First name                     |
| `created_at` | TIMESTAMP      | Account creation date          |

### `todo`

| Column        | Type                                              | Description                         |
|---------------|---------------------------------------------------|-------------------------------------|
| `id`          | INT UNSIGNED                                      | Auto-incremented primary key        |
| `title`       | VARCHAR(255)                                      | Todo title                          |
| `description` | TEXT                                              | Todo description                    |
| `created_at`  | TIMESTAMP                                         | Creation date                       |
| `due_time`    | DATETIME                                          | Due date and time                   |
| `status`      | ENUM(`not started`, `todo`, `in progress`, `done`) | Current status (default: `not started`) |
| `user_id`     | INT UNSIGNED                                      | Foreign key referencing `user(id)`  |

---

## API Endpoints

All protected routes require an `Authorization` header with a valid JWT token:

```
Authorization: <token>
```

### Auth

| Method | Endpoint    | Auth | Description                          |
|--------|-------------|------|--------------------------------------|
| POST   | `/register` | No   | Create a new account                 |
| POST   | `/login`    | No   | Log in and receive a JWT token       |

#### `POST /register`
```json
{
  "email": "maxime@benj.com",
  "password": "secret",
  "name": "Benj",
  "firstname": "Maxime"
}
```
Returns `201` with `{ "token": "<jwt>" }`.

#### `POST /login`
```json
{
  "email": "maxime@benj.com",
  "password": "secret"
}
```
Returns `200` with `{ "token": "<jwt>" }`.

---

### Users

| Method | Endpoint         | Auth | Description                                  |
|--------|------------------|------|----------------------------------------------|
| GET    | `/user`          | Yes  | Get the currently authenticated user         |
| GET    | `/user/todos`    | Yes  | Get all todos of the authenticated user      |
| GET    | `/users/:id`     | Yes  | Get a user by ID or email                    |
| PUT    | `/users/:id`     | Yes  | Update a user by ID                          |
| DELETE | `/users/:id`     | Yes  | Delete a user by ID                          |

#### `PUT /users/:id` — Request body
```json
{
  "email": "maxime@benj.com",
  "password": "epytodo1234",
  "name": "benj",
  "firstname": "Maxime"
}
```

---

### Todos

| Method | Endpoint      | Auth | Description              |
|--------|---------------|------|--------------------------|
| GET    | `/todos`      | Yes  | Get all todos            |
| GET    | `/todos/:id`  | Yes  | Get a todo by ID         |
| POST   | `/todos`      | Yes  | Create a new todo        |
| PUT    | `/todos/:id`  | Yes  | Update a todo by ID      |
| DELETE | `/todos/:id`  | Yes  | Delete a todo by ID      |

#### `POST /todos` — Request body
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "due_time": "2025-12-31 18:00:00",
  "user_id": 1
}
```
`status` is optional and defaults to `"not started"`.

#### `PUT /todos/:id` — Request body
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "due_time": "2025-12-31 18:00:00",
  "user_id": 1,
  "status": "in progress"
}
```

Valid values for `status`: `not started` | `todo` | `in progress` | `done`

---

## Error Responses

All endpoints return errors in the following format:

```json
{ "msg": "Error description" }
```

| Status | Message                        | Meaning                               |
|--------|--------------------------------|---------------------------------------|
| 400    | `Bad parameter`                | Missing or invalid request body field |
| 401    | `No token, authorization denied` | Missing Authorization header        |
| 401    | `Token is not valid`           | Expired or tampered token             |
| 401    | `Invalid Credentials`          | Wrong email or password               |
| 404    | `Not found`                    | Resource does not exist               |
| 409    | `Account already exists`       | Email already registered              |
| 500    | `Internal server error`        | Unexpected server-side error          |

---

## Project Structure

```
epytodo/
├── src/
│   ├── index.ts                  # App entry point
│   ├── config/
│   │   └── db.ts                 # MySQL connection
│   ├── middleware/
│   │   ├── auth.ts               # JWT verification, bcrypt hashing, user checks
│   │   └── notFound.ts           # 404 fallback handler
│   ├── routes/
│   │   ├── auth/
│   │   │   └── auth.ts           # /register and /login
│   │   ├── user/
│   │   │   ├── user.ts           # User routes
│   │   │   └── user.query.ts     # User DB queries
│   │   └── todos/
│   │       ├── todos.ts          # Todo routes
│   │       └── todos.query.ts    # Todo DB queries
│   └── types/
│       ├── models.ts             # User and Todo interfaces
│       └── express.d.ts          # Express Request augmentation
├── epytodo.sql                   # Database schema
├── package.json
└── tsconfig.json
```

---

## Dependencies

### Runtime

| Package        | Version   | Role                                       |
|----------------|-----------|--------------------------------------------|
| `express`      | ^5.2.1    | HTTP server and routing                    |
| `mysql2`       | ^3.19.0   | MySQL connection and queries               |
| `jsonwebtoken` | ^9.0.3    | JWT generation and verification            |
| `bcryptjs`     | ^3.0.3    | Password hashing                           |
| `dotenv`       | ^17.3.1   | Environment variable loading               |

### Development

| Package              | Version   | Role                              |
|----------------------|-----------|-----------------------------------|
| `typescript`         | ^6.0.3    | TypeScript compiler               |
| `tsx`                | ^4.22.0   | Run TypeScript files directly     |
| `ts-node`            | ^10.9.2   | TypeScript execution for Node.js  |
| `@types/express`     | ^5.0.6    | Express type definitions          |
| `@types/bcryptjs`    | ^3.0.0    | bcryptjs type definitions         |
| `@types/jsonwebtoken`| ^9.0.10   | jsonwebtoken type definitions     |
| `@types/node`        | ^25.7.0   | Node.js type definitions          |