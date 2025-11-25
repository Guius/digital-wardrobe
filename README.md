# Digital Wardrobe API

A RESTful API for managing clothing items in a digital wardrobe, built with NestJS and TypeScript.

## Description

This application provides a complete API for cataloging and managing clothing items. It supports CRUD operations for clothing items with proper validation, error handling, and a clean architectural structure following NestJS best practices.

## Features

- ✅ Create, read, update, and delete clothing items
- ✅ Support for multiple clothing categories (tops, bottoms, dresses, outerwear, shoes, accessories)
- ✅ Input validation using class-validator
- ✅ Clean separation of concerns (Controllers, Services, Repository)
- ✅ Type-safe TypeScript implementation
- ✅ Postman collection included for API testing

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## Installation

```bash
$ npm install
```

## Running the Application

```bash
# development mode
$ npm run start

# watch mode (recommended for development)
$ npm run start:dev

# production mode
$ npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:3000`

| Method   | Endpoint     | Description                      |
| -------- | ------------ | -------------------------------- |
| `GET`    | `/items`     | List all clothing items          |
| `GET`    | `/items/:id` | Get a single clothing item by ID |
| `POST`   | `/items`     | Create a new clothing item       |
| `PATCH`  | `/items/:id` | Update a clothing item           |
| `DELETE` | `/items/:id` | Delete a clothing item           |

## Testing with Postman

Import the `Digital-Wardrobe.postman_collection.json` file into Postman to test all available endpoints with pre-configured requests.

## Example Request

**POST /items**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "category": "tops",
  "colour": "blue",
  "user_id": "user-123",
  "brand": "Brooks Brothers",
  "size": "M",
  "image_url": "https://example.com/shirt.jpg",
  "purchase_date": "2024-01-15",
  "purchase_price": 89.99
}
```

## Project Structure

```
src/
├── clothing-items/
│   ├── controllers/        # HTTP request handlers
│   ├── services/           # Business logic
│   ├── entities/           # Data models
│   └── dto/                # Data transfer objects
├── database/               # Data persistence layer
└── main.ts                 # Application entry point
```

## Decisions and Assumptions Made

### 1. **Soft Delete Implementation**

DELETE operations set a `deleted_at` timestamp instead of permanently removing items. This prevents accidental data loss, maintains historical records, and allows for future restore functionality. Soft-deleted items are filtered from all queries and cannot be updated.

### 2. **No User Authorization**

Any client can view, create, update, or delete any clothing item. The only restrictions are core restrictions such as `id` fields cannot be updated. In production, this would include user-scoped filtering and role-based access control. This was not implemented as I considered it too complex for the task at hand.

### 3. **Layered Architecture**

- **Controllers**: Handle HTTP requests, validate input (DTOs), and map responses
- **Services**: Contain business logic and orchestrate operations
- **Repository**: Manage data persistence, ID generation, and entity instantiation

This separation enables independent testing, allows swapping the database without affecting other layers, and makes the codebase maintainable as requirements grow.

### 4. **Error Handling**

All service methods use try-catch blocks to log detailed errors server-side while returning sanitized error messages to clients, preventing sensitive implementation details from leaking.

## Improvements I Would Implement Given More Time

- **Optimistic Locking**: Add a `version` field to prevent lost updates during concurrent modifications (return 409 Conflict on version mismatch)
- **Authentication & Authorization**: Implement JWT-based auth with user-scoped queries or role-based access control for admins
- **Pagination**: Add limit/offset or cursor-based pagination for listing items
- **Filtering & Sorting**: Allow filtering by category, colour, brand with sorting options
- **Database**: Replace JSON file storage with PostgreSQL or MongoDB
- **Additional Features**: Caching, rate limiting, OpenAPI/Swagger docs, structured logging, error monitoring

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer
- **Storage**: JSON file (in-memory persistence)

## License

MIT
