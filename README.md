# MegaBead

MegaBead is a web application designed for bead enthusiasts to explore, upload, and manage bead-related products. The platform provides a seamless experience for users to register, manage their profiles, upload products, and interact with a virtual bead jar.

## Features

### Frontend

- **Product Management**: Users can upload and edit bead-related products with details like name, price, type, description, and image.
- **Profile Management**: Users can update their profile information, manage shipping and payment options, and delete their accounts.
- **Registration and Login**: Secure user registration and login functionality.
- **Interactive Bead Jar**: A visually appealing bead jar interface with responsive design.

### Backend

- **User Authentication**: Secure authentication using JWT.
- **Product Services**: APIs for creating, updating, and retrieving products.
- **Cart Services**: APIs for managing user carts, including adding and removing items.
- **Database Integration**: MongoDB for storing user and product data.

## Technologies Used

### Frontend

- **React**: For building the user interface.
- **React Router**: For navigation.
- **Axios**: For API calls.
- **CSS**: Custom styles for a visually appealing design.

### Backend

- **Node.js**: For server-side scripting.
- **Express.js**: For building RESTful APIs.
- **MongoDB**: For database management.
- **JWT**: For secure authentication.

## Installation

### Prerequisites

- Node.js
- MongoDB

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MegaBead.git
   ```
2. Navigate to the project directory:
   ```bash
   cd MegaBead
   ```
3. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```
4. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```
5. Set up environment variables:
   - Create `.env` files in both `backend` and `frontend` directories.
   - Add necessary variables like `REACT_APP_API_URL` and `JWT_SECRET`.
6. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
7. Start the frontend server:
   ```bash
   cd ../frontend
   npm start
   ```

## Folder Structure

### Backend

- **auth**: Authentication services.
- **config**: Configuration files.
- **DB**: Database connection services.
- **logger**: Logging utilities.
- **middlewares**: Middleware functions.
- **products**: Product-related services and routes.
- **router**: Main router.
- **users**: User-related services and routes.
- **utils**: Utility functions.

### Frontend

- **public**: Static assets.
- **src**: Source code.
  - **components**: Reusable UI components.
  - **context**: Context API for state management.
  - **pages**: Application pages.
  - **services**: API service functions.
  - **style**: CSS files.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your forked repository:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries, please contact [your-email@example.com](mailto:your-email@example.com).
