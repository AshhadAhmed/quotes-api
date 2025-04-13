# Quotes API

## Overview

**Quotes API** is a RESTful service built with Node.js and Express. It allows users to fetch random quotes, filter them by category and perform CRUD operations with proper authentication and error handling.

## Features

- Retrieve random quotes or filter by category.
- CRUD operations for quotes.
- Authentication for adding quotes, updating and deleting quotes.
- Structured folder architecture.
- Robust error handling.

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
yarn add
```

## Configuration

- Create a `.env` file in the root directory and set the following environment variables:

```sh
PORT=port
MONGODB_URI=database_url
JWT_SECRET=jwt_secret_key
JWT_EXPIRATION=jwt_expiration
REFRESH_TOKEN_SECRET=refresh_token_secret_key
REFRESH_TOKEN_EXPIRATION=refresh_token_expiration
```

## Usage

### Start the server:

```sh
yarn dev
```

## API Endpoints

### GET **_/api/v1/quotes_**

Retrieve all quotes or filter quotes by category.

### GET **_/api/v1/quotes/random_**

Retrieve a random quote.

### GET **_/api/v1/quotes/random/category_**

Retrieve a random quote by category.

### POST **_/api/v1/quotes_**

Create a new quote (requires authentication).

### PUT **_/api/v1/quotes/{id}_**

Update a quote by ID.

### DELETE **_/api/v1/quotes/{id}_**

Delete a quote by ID.

## Folder Structure

The project is structured as follows:

```
quotes-api/
├── config/
│   ├── db.js
│   └── env.js
├── controllers/
│   ├── auth.controller.js
│   ├── quote.controller.js
│   └── token.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
├── models/
│   ├── quote.model.js
│   ├── user.model.js
├── routes
│   ├── auth.routes.js
│   ├── quote.routes.js
│   └── token.routes.js
├── utils
│   ├── HttpError.js
├── .env
├── eslint.config.js
├── package.json
├── README.md
├── server.js
├── yarn.lock
```
