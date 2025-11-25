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

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
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

## Improvements I Would Implement Given More Time

### 1. **Soft Deletes**

Instead of permanently deleting items, implement soft deletes with a `deleted_at` timestamp field. This would:

- Allow data recovery if items are deleted accidentally
- Maintain audit trails for compliance
- Enable "undo delete" functionality
- Keep historical data for analytics

**Implementation approach:**

- Add `deleted_at?: Date` field to the entity
- Modify repository to filter out soft-deleted items in queries
- Add a restore endpoint to recover deleted items
- Implement hard delete for admin users only

### 2. **Optimistic Locking for Concurrency Control**

Add a `version` field to handle concurrent updates and prevent lost update problems when multiple users edit the same item simultaneously.

**Implementation approach:**

- Add `version: number` field to the entity (auto-incremented on each update)
- Validate version on PATCH requests
- Return `409 Conflict` if version mismatch detected
- Force clients to fetch latest version before retrying

**Example flow:**

```typescript
// Client fetches item (version: 1)
GET /items/123 → { id: "123", colour: "blue", version: 1 }

// Client updates with version check
PATCH /items/123 { colour: "red", version: 1 } → Success (version: 2)

// Another client tries to update with stale version
PATCH /items/123 { colour: "green", version: 1 } → 409 Conflict
```

### 3. **Authentication & Authorization**

Implement proper security based on the target user persona:

**If this is an end-user API:**

- Add JWT-based authentication
- Implement user-scoped queries (users can only see their own items)
- Filter by `user_id` automatically based on authenticated user
- Prevent users from accessing or modifying other users' items

**If this is an admin API:**

- Implement role-based access control (RBAC)
- Add admin authentication
- Allow admins to view/manage all users' items
- Add audit logging for admin actions

**Implementation approach:**

- Use NestJS Guards for authentication/authorization
- Implement JWT strategy with Passport
- Add `@UseGuards(JwtAuthGuard)` to protected endpoints
- Create custom decorator to inject authenticated user
- Add tenant isolation in repository layer

### 4. **Additional Enhancements**

- **Pagination**: Add limit/offset or cursor-based pagination for `GET /items`
- **Filtering & Sorting**: Allow filtering by category, colour, brand, and sorting options
- **Database**: Replace JSON file storage with a proper database (PostgreSQL/MongoDB)
- **Caching**: Implement caching for frequently accessed items
- **Rate Limiting**: Protect API from abuse with request throttling
- **API Documentation**: Auto-generate OpenAPI/Swagger documentation
- **Logging**: Structured logging with correlation IDs for request tracing
- **Error Monitoring**: Integration with a cloud monitoring tool for error tracking

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer
- **Storage**: JSON file (in-memory persistence)

## License

MIT
