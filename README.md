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

I implemented soft deletes to preserve data integrity and enable potential recovery of deleted items. Instead of permanently removing clothing items from the database, the DELETE endpoint sets a `deleted_at` timestamp on the item.

**Why:**

- Prevents accidental data loss
- Maintains historical records for potential audit requirements
- Allows for future "restore" functionality
- Aligns with production-grade data management practices

**How it works:**

- Added a `deleted_at: Date | null` field to the `ClothingItem` entity (defaults to `null`)
- The `DELETE /items/:id` endpoint sets `deleted_at` to the current timestamp
- Repository layer filters out soft-deleted items in `findAll()` and `findById()` queries
- Soft-deleted items cannot be updated (returns 404)
- Items remain in the JSON storage file but are excluded from regular queries

This approach balances the need for data safety with the simplicity required for a take-home test timeframe.

### 2. **No User Authorization or Permission Checks**

I have not implemented any checks on who can access or modify clothing items. Since the task does not include a user management system, there are no checks about whether a user is allowed to perform specific actions.

**What this means:**

- Any client can view, create, update, or delete any clothing item
- No restrictions on field modifications (e.g., anyone can change the `user_id` of a clothing item)
- No user-scoped filtering (users can see all items, not just their own)

**Core restrictions that remain:**

- The `id` field cannot be updated via PATCH requests (enforced at the application level, as changing IDs would break referential integrity)
- Standard validation rules apply (required fields, data types, enum values, etc.)

**In a real-world scenario, I would implement:**

- End-user permissions: Users can only view/modify their own items (filtered by `user_id`)
- Admin permissions: Special roles can modify any item or restricted fields
- Field-level access control: Regular users cannot change ownership (`user_id`), admins can
- See "Improvements I Would Implement Given More Time" section for authentication/authorization details

### 3. **Strict Separation of Concerns**

I implemented a clear layered architecture to maintain clean separation between presentation, business, and data access logic.

**Controller Layer (Presentation):**

- Serves exclusively as the interface between HTTP clients and the application
- Responsibilities:
  - Input validation (DTOs with class-validator decorators)
  - Calling appropriate service methods
  - Mapping entities to DTOs before returning responses
  - Handling HTTP-specific concerns (status codes, exceptions)
- Does NOT contain business logic or database logic
- Ensures no internal entity data escapes to clients (all responses are DTOs)

**Service Layer (Business Logic):**

- Contains business rules and orchestration logic
- Accepts parameters (not DTOs) and returns entities or primitives
- Returns `null` or `boolean` values to indicate failure, letting the controller decide how to handle HTTP responses
- In this application, the service layer is thin due to simple requirements and can therefore look empty or pointless. This structure however allows business logic to be easily added as requirements grow (e.g., validation rules, complex workflows)

**Repository Layer (Data Access):**

- Handles all database-related application logic
- Responsibilities:
  - ID generation (UUIDs/timestamps)
  - Filtering soft-deleted items from queries
  - Entity instantiation and persistence
  - Data transformation between storage format and entities
- Provides clean methods: `createEntity()` (instantiation) and `save()` (persistence)
- Encapsulates storage implementation details (currently JSON file)

**Benefits of this approach:**

- Easy to test each layer in isolation
- Business logic can evolve without changing HTTP or database layers
- Database can be swapped (JSON → PostgreSQL) without affecting services/controllers
- Clear responsibilities make the codebase easier to navigate and maintain

### 4. **Simple Error Handling with Logging**

I implemented straightforward error handling at the service layer to prevent database errors from leaking to clients while maintaining debuggability.

**Implementation:**

- All service methods wrapped in try-catch blocks
- Caught errors are logged with full details (stack traces, error objects) using NestJS Logger
- Service throws `InternalServerErrorException` with sanitized messages
- NestJS automatically converts these to proper HTTP 500 responses

**What clients see:**

```json
{
  "statusCode": 500,
  "message": "Failed to retrieve clothing item"
}
```

**What gets logged (for debugging):**

- Full error stack trace
- Error context (which item ID, which operation)
- Underlying database/file system errors

**Why this approach:**

- Prevents sensitive implementation details from leaking (file paths, database structure, etc.)
- Maintains security by returning generic error messages to clients
- Preserves debuggability with comprehensive server-side logging
- Simple to implement - no custom exceptions or filters needed
- Appropriate for a time-constrained challenge while still being production-aware

## Improvements I Would Implement Given More Time

### 1. **Optimistic Locking for Concurrency Control**

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

### 2. **Authentication & Authorization**

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

### 3. **Additional Enhancements**

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
