# Garage AI API

A Node.js backend API for managing garage operations with user authentication and car management features.

## Project Structure

```
garage_backend/
├── app.js                      # Main application entry point
├── package.json                # Project dependencies and scripts
├── src/
│   ├── controllers/           # Business logic handlers
│   │   ├── auth_controller.js # Authentication operations (login, register, verify email)
│   │   └── car_controller.js  # Car management operations
│   ├── models/                # Data access layer
│   │   ├── auth_model.js      # User authentication database operations
│   │   └── car_model.js       # Car database operations
│   ├── routes/                # API route definitions
│   │   ├── auth_route.js      # Authentication endpoints (/auth/*)
│   │   └── car_route.js       # Car endpoints (/car/*)
│   ├── middlewares/           # Express middleware functions
│   │   └── auth.js            # JWT authentication middleware
│   └── utilities/             # Shared utility modules
│       ├── mysql_database.js  # MySQL connection pool
│       └── email_service.js   # Email sending service (Nodemailer)
└── test/                      # Test files
    └── mysql_db.js            # Database connection test
```

## Architecture

### MVC Pattern

The project follows the **Model-View-Controller (MVC)** architectural pattern:

- **Models** (`src/models/`): Handle all database operations and data access logic
- **Controllers** (`src/controllers/`): Process requests, validate input, and coordinate between models and responses
- **Routes** (`src/routes/`): Define API endpoints and map them to controller functions

### Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: MySQL (using mysql2 with connection pooling)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Email Service**: Nodemailer
- **Utilities**: lodash, morgan (logging)

### Request Flow

1. **Request** → Express app (`app.js`)
2. **Routing** → Route handlers (`src/routes/`)
3. **Middleware** → Authentication middleware (`src/middlewares/auth.js`) for protected routes
4. **Controller** → Business logic (`src/controllers/`)
   - Input validation (Joi)
   - Business rules processing
5. **Model** → Database operations (`src/models/`)
   - SQL queries via MySQL connection pool
6. **Response** → JSON response sent back to client

### API Endpoints

#### Authentication Routes (`/auth`)

- `POST /auth/register` - User registration with email verification
- `POST /auth/login` - User login (returns JWT token)
- `POST /auth/verify-email` - Email verification with code

#### Car Routes (`/car`)

- `POST /car/add` - Add a new car (protected route, requires JWT)

### Security Features

- **JWT Authentication**: Token-based authentication for protected routes
- **Password Hashing**: bcrypt for secure password storage
- **Email Verification**: Code-based email verification system
- **Input Validation**: Joi schema validation for request data

### Database Connection

- Uses MySQL connection pooling (`src/utilities/mysql_database.js`)
- Environment variables for database configuration
- Connection pool management for efficient database access

### Environment Variables

The project requires the following environment variables (configured via `.env`):

- `PORT` - Server port number
- Database connection variables
- `ACCESS_TOKEN_SECRET` - JWT secret key
- Email service configuration
