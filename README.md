# QcSnake E-Commerce Platform

A full-stack e-commerce application for selling games online, built with React, Express, and Sequelize.

## Features

- User authentication (login/register)
- Product browsing and search
- Product reviews and ratings
- Shopping cart functionality
- Admin dashboard for product management

## Project Requirements

This project fulfills the following requirements:

### Technical Requirements

- **Database**: MySQL for data persistence
- **Backend**: Node.js with Express
- **ORM**: Sequelize for database interaction
- **Frontend**: React with a component-based architecture
- **UI Framework**: Material UI for consistent styling

### Functional Requirements

#### Customer Features
- View multiple products on the homepage
- See detailed product information including images
- View and add product ratings/reviews
- See average ratings for products
- Add products to shopping cart
- View cart with products, quantities, and total cost

#### Admin Features
- Create, edit, and delete products
- Manage user accounts

## Installation

### Prerequisites

- Node.js (v14 or newer)
- npm/yarn
- MySQL (v8.0 or newer)

### MySQL Setup

1. **Install MySQL**
   - Download and install MySQL from [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)
   - During installation, set a root password and remember it

2. **Create a Database**
   ```sql
   CREATE DATABASE eshop;
   ```

3. **Create a User and Grant Privileges** (optional but recommended)
   ```sql
   CREATE USER 'eshop_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON eshop.* TO 'eshop_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Update Database Configuration**
   - Open `backend/config/config.json`
   - Update with your MySQL credentials:
   ```json
   {
     "development": {
       "username": "eshop_user",
       "password": "your_password",
       "database": "eshop",
       "host": "127.0.0.1",
       "dialect": "mysql"
     }
   }
   ```

### Setup Instructions

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/QcSnake-gik2xk-grupp20-projek_V2.git
   cd QcSnake-gik2xk-grupp20-projek_V2
   ```

2. **Backend Setup**
   ```
   cd backend
   npm install
   npm install mysql2
   ```
   
   > **IMPORTANT**: You must install the mysql2 package separately as shown above. Sequelize requires this package to connect to MySQL databases.

3. **Frontend Setup**
   ```
   cd frontend
   npm install
   ```

4. **Initialize Database and Seed Data**
   ```
   cd backend
   npm run seed
   ```
   This will create the necessary tables and populate them with initial data.

## Development Environment Security

When installing dependencies, you may see warnings about security vulnerabilities:

```
4 vulnerabilities (1 moderate, 3 high)
```

### Addressing Vulnerabilities

For a development environment, these vulnerabilities generally don't pose an immediate risk. However, before deploying to production, you should address them:

1. **Review the vulnerability details**:
   ```
   npm audit
   ```

2. **Fix non-breaking vulnerabilities**:
   ```
   npm audit fix
   ```

3. **For more serious fixes** (may include breaking changes):
   ```
   npm audit fix --force
   ```

> **Note**: Always review what packages would be updated before using `--force` as it may break functionality.

### Development vs. Production

- For development: You can continue working with these vulnerabilities present
- For production: All vulnerabilities should be addressed before deployment

## Running the Application

1. **Start the Backend Server**
   ```
   cd backend
   npm run dev
   ```
   The server will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```
   cd frontend
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## Usage Guide

### User Interface

1. **Homepage**: Browse all available products
2. **Product Details**: Click on any product to view details and reviews
3. **Shopping Cart**: Add products to cart and manage quantities
4. **User Account**: Register or login to access your profile

### Admin Features

1. **Login** with admin credentials (admin@example.com / Admin123)
2. **Admin Dashboard**: Access the admin dashboard to manage products and users
3. **Product Management**: Add, edit, or remove products
4. **User Management**: Manage user accounts and permissions

## API Endpoints

### Products
- GET /products - Get all products
- GET /products/:id - Get product by ID
- POST /products - Create a new product (admin only)
- PUT /products/:id - Update a product (admin only)
- DELETE /products/:id - Delete a product (admin only)

### Users
- GET /users - Get all users (admin only)
- GET /users/:id - Get user by ID
- POST /users - Create a new user
- PUT /users/:id - Update a user

### Authentication
- POST /auth/login - User login
- POST /auth/register - User registration

## Troubleshooting

### Products Not Displaying
1. Check that both frontend and backend servers are running
2. Verify the API connection in the browser console
3. Ensure the database has been seeded with initial products
4. Make sure you've set up the correct MySQL configuration

### Database Connection Issues
1. Verify MySQL is running with `sudo systemctl status mysql` (Linux) or check Services (Windows)
2. Confirm your database credentials in `config.json` are correct
3. Ensure the eshop database exists:
   ```sql
   SHOW DATABASES;
   ```
4. Check that the user has proper permissions:
   ```sql
   SHOW GRANTS FOR 'eshop_user'@'localhost';
   ```

### API Connection Problems
1. Check that backend is running on port 5000
2. Ensure frontend is configured to connect to http://localhost:5000
3. Verify CORS is properly configured in the backend
4. Test API endpoints with Postman or curl

### Reset Application State
If you need to start fresh:

1. Drop and recreate the database:
   ```sql
   DROP DATABASE eshop;
   CREATE DATABASE eshop;
   ```
2. Run the seed script again:
   ```
   cd backend
   npm run seed
   ```

## Common Code Fixes

### Backend-Frontend Port Mismatch
If your frontend can't connect to the backend:

1. Check `frontend/src/api.js` and ensure `axios.defaults.baseURL` is set to 'http://localhost:5000'
2. Verify the backend is actually running on port 5000 (check `backend/bin/www`)

### Sequelize Model Issues
If you're getting database errors:

1. Make sure your models match your database schema
2. Try running with `{force: true}` once to reset tables:
   ```javascript
   // In app.js or similar file
   db.sequelize.sync({force: true})
   ```
   (Note: This will delete all data, so use with caution!)

## Contributors
- Group 20 Team Members

