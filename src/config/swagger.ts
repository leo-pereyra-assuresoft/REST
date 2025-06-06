export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API with TypeScript',
      version: '1.0.0',
      description: 'A REST API built with TypeScript, Express, and PostgreSQL',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
}; 