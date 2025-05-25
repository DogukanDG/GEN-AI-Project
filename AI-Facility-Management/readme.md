# AI Integrated Facility Booking System with Node.js, Express, and PostgreSQL

## Project Overview

- **Developed By**: GenAI Course Group 2 Members
- **Date**: Started on 20/05/2025

## Technologies Used

- **EJS**: Templating engine for dynamically generating HTML content.
- **CSS and JavaScript**: Frontend styling and interactivity.
- **Bootstrap**: Used for creating forms for signup and login, providing a responsive and visually appealing design.
- **PostgreSQL**: Database management system for storing user data securely.
- **Node.js and Express**: Backend framework and server for handling HTTP requests and responses.
- **pg**: Node.js library for interfacing with PostgreSQL database.
- **bcrypt**: Library for hashing and salting passwords before storing them in the database.
- **Passport**: Middleware for authentication and session management, along with cookie storage.

## Features

- **Signup**: Users can create a new account by providing necessary details such as username, email, and password.
- **Login**: Registered users can log in securely using their credentials.
- **Password Hashing**: User passwords are hashed and salted using bcrypt before storing them in the database to enhance security.
- **Session Management**: Passport.js is used for managing user sessions and storing session data in cookies.
- **Account Management**: Authenticated users can update their account information, including changing passwords.
- **Security**: Secure transmission of data between client and server using HTTPS. Implementation of rate limiting and logging mechanisms for enhanced security.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/DogukanDG/GEN-AI-Project.git
   ```

2. Install dependencies:
   ```bash
   cd AI-Facility-Management
   npm install
   ```

3. Set up PostgreSQL database:
   - Create a new PostgreSQL database.

4. Run the application:
   ```bash
   npm start
   ```

5. Access the application in your web browser at `http://localhost:3000`.

## Usage

- Navigate to the signup page (`/user/signup`) to create a new account.
- Once signed up, you can log in using your credentials on the login page (`/user/login`).

## Contributing

Contributions are welcome! If you have suggestions, feature requests, or found a bug, please open an issue or submit a pull request.
