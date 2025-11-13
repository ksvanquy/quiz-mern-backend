import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz MERN Backend API",
      version: "1.0.0",
      description: "API documentation for the Quiz MERN backend - Node, Assessment, Question, Answer system"
    },
    servers: [
      { url: "http://localhost:5000/api", description: "Local development server" }
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token"
        }
      }
    }
  },
  // Scan route files and controllers for JSDoc annotations
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
