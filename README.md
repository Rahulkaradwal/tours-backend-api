### Node.js API for Tour Management

This repository contains a Node.js project using Express and MongoDB designed to manage tours, user accounts, and reviews. It supports robust authentication features using JSON Web Tokens (JWT).

## Features

# Tour Management: 
Users can view, create, update, and delete tours. Each tour includes details such as name, duration, price, and description.

# User Management: 
Handles user registration, user login, and user profile management. It includes features for password reset and update functionalities.

# Review System: 
Allows users to post reviews on tours they have attended. Users can also update or delete their reviews.

# Authentication and Authorization: 
Utilizes JWT for secure authentication and authorization. Includes middleware to protect routes and ensure that only authorized users can access certain functionalities.

# Error Handling: 
Comprehensive error handling framework to deal with expected and unexpected errors smoothly.
Database: Uses MongoDB, a NoSQL database, to store and retrieve data efficiently.

## Routes

/api/tours: Main endpoint for tour-related operations (GET, POST, PATCH, DELETE).
/api/users: Endpoint for user-related functionalities such as signup, login, and user profile operations.
/api/reviews: Endpoint for managing reviews.


Note: This project is still under work.


This will start the application on localhost:3000 by default.


