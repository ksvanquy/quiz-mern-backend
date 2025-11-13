"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
