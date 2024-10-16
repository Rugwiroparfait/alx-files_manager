# 0x04. Files Manager

## Project Overview

This project is part of the back-end development curriculum and covers various key concepts including authentication, Node.js, MongoDB, Redis, pagination, and background processing. The objective is to create a file management system that allows users to upload, view, and manage files. This project is built by a team of two, NSANZIMANA RUGWIRO Dominique Parfait, and will require a combination of technologies learned throughout the trimester.

### Key Features:
- User authentication via token
- File management (list, upload, and change file permissions)
- View uploaded files
- Generate thumbnails for images
- Backend architecture utilizing MongoDB for data storage, Redis for temporary storage, and Kue for background task processing

## Learning Objectives

By the end of this project, you should be able to:
1. Create a REST API using Express.js
2. Implement user authentication using tokens
3. Store and manage data in MongoDB
4. Handle temporary data using Redis
5. Use background workers with Kue for processing tasks

## Requirements

- **Editors:** vi, vim, emacs, Visual Studio Code
- **Environment:** All code will run on Ubuntu 18.04 LTS, using Node.js version 12.x.x
- **Linting:** Code must adhere to ESLint standards
- **Languages:** JavaScript (ES6)
- **File Extensions:** All files should end with `.js`
- **Version Control:** GitHub repository required with appropriate commits

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/<your_username>/alx-files_manager.git
   cd alx-files_manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the server:
   ```bash
   npm run dev
   ```

4. Ensure that Redis and MongoDB are properly set up and running on your system.

## Features

### 1. **Redis Utils**
   A utility class (`RedisClient`) that manages communication with a Redis server. This includes methods for:
   - Connecting to the Redis server
   - Checking the Redis server's status
   - Storing, retrieving, and deleting data

### 2. **MongoDB Utils**
   A utility class (`DBClient`) that manages interaction with a MongoDB database. Key functionalities include:
   - Connecting to MongoDB
   - Checking MongoDB connection status
   - Counting the number of users and files in the database

### 3. **API Endpoints**
   - **GET `/status`**: Returns the status of Redis and MongoDB.
   - **GET `/stats`**: Returns the number of users and files in the database.
   - **POST `/users`**: Creates a new user with an email and password.
   - **GET `/connect`**: Logs in a user using Basic Authentication and returns an authentication token.
   - **GET `/disconnect`**: Logs out the user by invalidating the token.
   - **GET `/users/me`**: Retrieves user information based on the token.
   - **POST `/files`**: Uploads a file or folder.

## Background Worker

This project uses `Kue` to handle background tasks such as generating image thumbnails. Background workers run asynchronously and manage these tasks efficiently.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for building the API
- **MongoDB**: NoSQL database for persistent storage
- **Redis**: In-memory data store for caching and session management
- **Kue**: A priority job queue for background processing
- **Mocha**: Testing framework for unit tests
- **Nodemon**: Development tool for automatically restarting the server

## How to Contribute

- Fork the repository
- Create a feature branch:
  ```bash
  git checkout -b new-feature
  ```
- Commit your changes:
  ```bash
  git commit -m "Add some feature"
  ```
- Push to the branch:
  ```bash
  git push origin new-feature
  ```
- Open a Pull Request

## Authors

- NSANZIMANA RUGWIRO Dominique Parfait
