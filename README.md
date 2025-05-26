# AI Integrated Facility Booking System with Node.js, Express, and PostgreSQL

## Project Overview

- **Developed By**: GenAI Course Group 15 Members
- **Date**: Started on 20/05/2025

## Technologies Used

- **Node.js**: JavaScript Runtime to create JavaScript applications.
- **Express.js**: JavaScript web application framework to Restful APIs.
- **PostgreSQL**: Database management system for storing data securely.
- **pg**: A library for interfacing with PostgreSQL database.
- **Prisma**: An ORM for writing query easily.

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

2. Create .env file.

```bash
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/room-management?schema=public
JWT_SECRET=your-secret

POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=room-management
```

3. Install dependencies:

   ```bash
   cd server
   npm install
   npx prisma generate
   ```

4. Set up PostgreSQL database:

   - Create a new PostgreSQL database.

5. Run the application:

   ```bash
   npm run dev
   ```

6. Access the application in your web browser at `http://localhost:3000`.

## Usage

- Navigate to the signup page (`/user/signup`) to create a new account.
- Once signed up, you can log in using your credentials on the login page (`/user/login`).

## Contributing

Contributions are welcome! If you have suggestions, feature requests, or found a bug, please open an issue or submit a pull request.
