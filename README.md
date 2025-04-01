# Node Backend Course

This project is a Node.js backend application built with Bun, providing authentication and character management functionalities. It includes user authentication, token-based authorization, and CRUD operations for character data.

## Installation

First, install dependencies:

```bash
bun install
```

## Running the Application

To start the server:

```bash
bun run index.ts
```

This project was created using `bun init` with Bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Technologies Used

- **Bun**: Runtime for executing JavaScript/TypeScript.
- **TypeScript**: Statically typed JavaScript for better code quality.
- **ESLint**: Linting and code quality enforcement.
- **JWT (jsonwebtoken)**: Authentication and token management.
- **bcrypt**: Password hashing for secure authentication.
- **cors**: Middleware for handling cross-origin requests.
- **Valibot**: Schema validation for request payloads.

## API Endpoints

### Authentication Routes

#### Register a New User

```
POST /auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com"
}
```

#### Login

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "accessToken": "your-jwt-token",
  "refreshToken": "your-refresh-token"
}
```

#### Logout

```
POST /auth/logout
```

### Character Management Routes

#### Get All Characters

```
GET /characters
```

#### Get Character by ID

```
GET /character/:id
```

#### Add a New Character

```
POST /characters
```

**Requires Authorization** (Admin/User role)

#### Update a Character

```
PATCH /characters/:id
```

**Requires Authorization** (Admin role)

#### Delete a Character

```
DELETE /character/:id
```

**Requires Authorization** (Admin role)

## ESLint Configuration

This project uses Airbnb's ESLint rules with TypeScript support.

To lint the code:

```bash
bun run lint
```

## License

MIT
git