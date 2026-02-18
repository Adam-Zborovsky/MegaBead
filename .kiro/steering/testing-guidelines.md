---
inclusion: fileMatch
fileMatchPattern: "*.test.js|*.spec.js|*test*"
---

# Testing Guidelines for MegaBead

## Frontend Testing

- Use React Testing Library for component tests
- Test user interactions and API integrations
- Mock API calls using axios mock adapter
- Test authentication flows and protected routes

## Backend Testing

- Use Jest for unit and integration tests
- Test all API endpoints with different scenarios
- Mock MongoDB connections for unit tests
- Test authentication middleware and error handling

## Test Structure

- Arrange, Act, Assert pattern
- Descriptive test names explaining the scenario
- Clean up after each test (database, mocks)
- Use beforeEach/afterEach for setup/teardown
