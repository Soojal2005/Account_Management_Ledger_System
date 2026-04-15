# Account Management Ledger System

Backend service for account management and double-entry ledger workflows, built with Node.js, Express, and MongoDB.

## Overview

- JWT-based authentication and protected APIs
- Role-gated operations for accounting-critical routes
- Company-aware data operations through authenticated user context
- Modules for accounts, transactions, ledger reports, customers, and invoices

## Tech Stack

- Node.js
- Express 5
- MongoDB + Mongoose
- bcryptjs, jsonwebtoken
- helmet, cors, morgan

## Project Structure

```text
src/
  app.js
  server.js
  Auth/
    auth.controller.js
    auth.middleware.js
    auth.routes.js
    auth.service.js
  config/
    db.js
  middleware/
    error.middleware.js
  model/
    company.model.js
    employee.model.js
    user.model.js
  modules/
    accounts/
    Customers/
    invoices/
    ledger/
    transactions/
  utils/
    AppError.js
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment

Create .env from .env.example and ensure the following are set:

- PORT=5000
- MONGODB_URI=mongodb://localhost:27017/jerry-accounts
- JWT_SECRET=<strong-secret>
- JWT_EXPIRES_IN=7d

3. Start development server

```bash
npm run dev
```

Base URL:

```text
http://localhost:5000/api/v1
```

## Scripts

- npm run dev
- npm test
- npm run autopush

## Authentication

Public routes:

- POST /api/v1/auth/register
- POST /api/v1/auth/login

Protected routes require:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Implemented Endpoints

### Auth

- POST /api/v1/auth/register
- POST /api/v1/auth/login

### Accounts

- POST /api/v1/account/creation
- GET /api/v1/account/company/:companyId
- GET /api/v1/account/:accountId
- PUT /api/v1/account/update/:accountId
- DELETE /api/v1/account/:accountId

### Transactions

- POST /api/v1/transaction/create-transaction
- GET /api/v1/transaction/petty-cash
- POST /api/v1/transaction/receive
- POST /api/v1/transaction/send

### Ledger

- GET /api/v1/ledger/accounts/:accountId/entries
- GET /api/v1/ledger/accounts/:accountId/balance
- GET /api/v1/ledger/accounts/:accountId/ledger
- GET /api/v1/ledger/transactions/history/:accountId
- GET /api/v1/ledger/trial-balance
- GET /api/v1/ledger/reports/petty-cash
- GET /api/v1/ledger/reports/profit-loss
- GET /api/v1/ledger/reports/balance-sheet

### Customers

- POST /api/v1/customers/create
- GET /api/v1/customers/company/:companyId
- GET /api/v1/customers/:customerId
- PUT /api/v1/customers/:customerId
- DELETE /api/v1/customers/:customerId

### Invoices

- POST /api/v1/invoices/create
- POST /api/v1/invoices/:invoiceId/pay

## API Documentation

See API_ROUTES.md for request samples and response behavior aligned to current implementation.

## Postman Collection

Jerry API.postman_collection.json is aligned with the implemented routes and includes:

- grouped folders per module
- token capture after auth
- id variable capture for chaining requests

## License

ISC. See LICENSE.
