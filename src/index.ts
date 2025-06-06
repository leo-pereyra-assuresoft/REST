import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { config } from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { swaggerOptions } from './config/swagger';
import routes from './routes';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Configure Helmet with CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  })
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'REST API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    defaultModelsExpandDepth: 3,
    defaultModelExpandDepth: 3,
    displayRequestDuration: true,
  }
}));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`Swagger documentation available at http://localhost:${port}/api-docs`);
}); 