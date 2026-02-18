---
inclusion: always
---

# MegaBead Project Standards

## Code Style Guidelines

- Use ES6+ features consistently across frontend and backend
- Follow React functional components with hooks pattern
- Use async/await for API calls instead of .then()
- Maintain consistent error handling patterns

## API Standards

- All API endpoints should follow RESTful conventions
- Use proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Include proper error messages in response format: `{ error: "message" }`
- Validate all inputs using Joi schemas

## Frontend Patterns

- Use React Context for global state (Auth, Cart)
- Components should be in PascalCase
- Use CSS modules or styled-components for styling
- Handle loading states and error boundaries

## Backend Patterns

- Use middleware for authentication, logging, and error handling
- Separate business logic into service files
- Use proper MongoDB schema validation
- Environment variables for all configuration

## Security Requirements

- Never commit sensitive data (.env files)
- Validate and sanitize all user inputs
- Use JWT for authentication with proper expiration
- Implement rate limiting for API endpoints

## File Organization

- Backend: Separate routes, controllers, services, and models
- Frontend: Organize by feature (components, pages, services, context)
- Use descriptive file and function names
