# REST API with TypeScript

A modern REST API built with TypeScript, Express, and PostgreSQL, following best practices and including Swagger documentation.

## Features

- TypeScript for type safety
- Express.js web framework
- PostgreSQL database
- Docker containerization
- Swagger/OpenAPI documentation
- Error handling middleware
- Request validation
- Logging with Winston
- Environment configuration
- Health check endpoint

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd rest-api-typescript
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the PostgreSQL database:
```bash
docker-compose up -d
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation

Swagger documentation is available at `http://localhost:3000/api-docs`

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm test`: Run tests

## Project Structure

```
src/
├── config/         # Configuration files
├── middleware/     # Express middleware
├── routes/         # API routes
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## Best Practices Implemented

1. **Security**
   - Helmet for security headers
   - CORS configuration
   - Environment variables for sensitive data

2. **Error Handling**
   - Centralized error handling
   - Custom error classes
   - Proper error logging

3. **API Documentation**
   - Swagger/OpenAPI integration
   - Detailed endpoint documentation

4. **Code Quality**
   - TypeScript for type safety
   - ESLint for code linting
   - Proper project structure

5. **Development Experience**
   - Hot reloading with nodemon
   - Docker for consistent development environment
   - Clear project documentation

## License

MIT # REST
