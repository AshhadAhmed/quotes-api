# Quotes API

## Overview

Quotes API is a RESTful service built with Node.js and Express. It allows users to fetch random quotes, filter them by category, and perform CRUD operations with proper authentication and error handling.

## Features

- Retrieve random quotes or filter by category
- CRUD operations for quotes
- Authentication for adding quotes (to be implemented)
- Admin-only access for updating and deleting quotes (to be implemented)
- Structured folder architecture
- Robust error handling

## Installation

### 1. Clone the repository:

```sh
git clone https://github.com/AshhadAhmed/quotes-api.git
```

### 2. Navigate to the project directory:

```sh
cd quotes-api
```

### 3. Install dependencies:

```sh
npm install
```

## Configuration
- Create a `.env` file in the root directory and set the following environment variables:

```sh
PORT=3000
DATABASE_URL=your_database_url
```

## Usage

### Start the server:

```sh
npm start
```

## API Endpoints

### 1. GET /api/v1/quotes

Retrieve all quotes or filter quotes by category.

### 2. GET /api/v1/quotes/random

Retrieve a random quote.

### 3. GET /api/v1/quotes/random/category

Retrieve a random quote by category.

### 4. POST /api/v1/quotes

Create a new quote (requires authentication).

### 5. PUT /api/v1/quotes/:id

Update a quote by ID (admin-only).

### 6. DELETE /api/v1/quotes/:id

Delete a quote by ID (admin-only).

## Folder Structure

The project is structured as follows:

```
quotes-api/
├── config/
│   ├── db.js
│   └── env.js
├── contollers/
│   ├── quote.controller.js
├── middlewares/
│   ├── errorHandler.js
├── models/
│   ├── quote.model.js
├── routes
│   ├── quote.routes.js
├── .env
├── error.js
├── eslint.config.js
├── package.json
├── README.md
├── server.js
├── yarn.lock
```