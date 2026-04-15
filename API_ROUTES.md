# API Routes Documentation

Complete API reference for the **Account Management Ledger System**.

## 📑 Table of Contents

- [Base Information](#base-information)
- [Authentication](#authentication-module)
- [Accounts](#accounts-module)
- [Transactions](#transactions-module)
- [Invoices](#invoices-module)
- [Customers](#customers-module)
- [Ledger](#ledger-module)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Best Practices](#best-practices)

---

## Base Information

### Base URL
```
http://localhost:5000/api/v1
```

### API Version
```
v1
```

### Authentication Header (Required for all endpoints unless noted)
```
Authorization: Bearer <JWT_TOKEN>
```

### Response Format

All responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Optional success message",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional context"
  }
}
```

### Available Roles

- `ADMIN` - Full system access, can manage all resources
- `ACCOUNTANT` - Can create/modify transactions and view ledgers
- `MANAGER` - Read-only access with limited report capabilities
- `USER` - Basic account access and transaction viewing

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions for resource |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists or constraint violation |
| 422 | Unprocessable Entity | Invalid data format or validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error, check logs |
| 503 | Service Unavailable | Database unreachable |

---

## Authentication Module

### 1. User Registration

**Endpoint:**
```
POST /api/v1/auth/register
```

**Role Access:** Public (no authentication required)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "companyId": "optional-company-id"
}
```

**Validation Rules:**
- `email` - Valid email format, must be unique
- `password` - Minimum 8 characters, at least 1 uppercase, 1 number, 1 special char
- `name` - Required, minimum 2 characters
- `companyId` - Optional, if provided must exist

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id_here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2026-04-15T10:30:00Z"
  }
}
```

---

### 2. User Login

**Endpoint:**
```
POST /api/v1/auth/login
```

**Role Access:** Public (no authentication required)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "companyId": "company_id"
    },
    "expiresIn": "7d"
  }
}
```

---

## Transactions Module

### 1. Create Transaction (Journal Entry)

**Endpoint:**
```
POST /api/v1/transaction/
```

**Aliases:**
- `POST /api/v1/transaction/create-transaction` (legacy, deprecated)

**Role Access:** `ADMIN`, `ACCOUNTANT`

**Request Body:**
```json
{
  "description": "Office Expense",
  "paymentMode": "CASH",
  "expenseCategory": "REGULAR",
  "transactionCategory": "NORMAL",
  "date": "2026-04-15",
  "entries": [
    {
      "accountId": "69cfaffe4a2906a4037adbca",
      "type": "DEBIT",
      "amount": 1000
    },
    {
      "accountId": "69cfaffe4a2906a4037adbcb",
      "type": "CREDIT",
      "amount": 1000
    }
  ]
}
```

**Validation Rules:**
- `entries` - Minimum 2 entries required
- Debit total **must equal** Credit total (double-entry principle)
- `type` - Must be `DEBIT` or `CREDIT`
- `amount` - Must be numeric and positive
- All accounts must belong to logged-in user's company

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "69d630a840173478b4740b0b",
    "description": "Office Expense",
    "paymentMode": "CASH",
    "entries": [
      { "_id": "69d630a840173478b4740b10" },
      { "_id": "69d630a840173478b4740b11" }
    ],
    "date": "2026-04-15T10:40:40.642Z",
    "status": "POSTED"
  }
}
```

---

### 2. Transaction History by Account

**Endpoint:**
```
GET /api/v1/ledger/accounts/:accountId/transaction-history?page=1&limit=10
```

**Aliases:**
- `GET /api/v1/ledger/transactions/history/:accountId` (legacy)

**Role Access:** `ADMIN`, `ACCOUNTANT`, `MANAGER`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `startDate` - Filter from date (optional)
- `endDate` - Filter to date (optional)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "_id": "69d630a840173478b4740b10",
        "accountId": {
          "_id": "69cfaffe4a2906a4037adbca",
          "name": "Cash Account"
        },
        "type": "DEBIT",
        "amount": 1000,
        "createdAt": "2026-04-08T10:40:40.655Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}
```

---

### 3. Ledger by Account (Running Balance)

**Endpoint:**
```
GET /api/v1/ledger/accounts/:accountId/ledger
```

**Role Access:** `ADMIN`, `ACCOUNTANT`, `MANAGER`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-04-08T10:40:40.655Z",
      "description": "Office Expense",
      "debit": 1000,
      "credit": 0,
      "balance": 1000
    },
    {
      "date": "2026-04-08T11:12:10.001Z",
      "description": "Bank Deposit",
      "debit": 0,
      "credit": 300,
      "balance": 700
    }
  ]
}
```

---

## Accounts Module

### 1. Create Account

**Endpoint:**
```
POST /api/v1/accounts
```

**Role Access:** `ADMIN`, `ACCOUNTANT`

**Request Body:**
```json
{
  "name": "Cash Account",
  "accountType": "ASSET",
  "accountCode": "1000",
  "description": "Main cash account",
  "openingBalance": 5000,
  "currency": "USD"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "69cfaffe4a2906a4037adbca",
    "name": "Cash Account",
    "accountType": "ASSET",
    "balance": 5000,
    "createdAt": "2026-04-15T10:30:00Z"
  }
}
```

---

### 2. List Accounts

**Endpoint:**
```
GET /api/v1/accounts?page=1&limit=10
```

**Role Access:** `ADMIN`, `ACCOUNTANT`, `MANAGER`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `accountType` - Filter by type (optional)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [ /* account array */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

---

## Invoices Module

### 1. Create Invoice

**Endpoint:**
```
POST /api/v1/invoices
```

**Role Access:** `ADMIN`, `ACCOUNTANT`

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "69d630a840173478b4740b0b",
    "invoiceNumber": "INV-2026-001",
    "status": "DRAFT"
  }
}
```

---

### 2. List Invoices

**Endpoint:**
```
GET /api/v1/invoices?page=1&limit=10
```

**Role Access:** `ADMIN`, `ACCOUNTANT`, `MANAGER`

---

## Customers Module

### 1. Create Customer

**Endpoint:**
```
POST /api/v1/customers
```

**Role Access:** `ADMIN`, `ACCOUNTANT`

---

### 2. List Customers

**Endpoint:**
```
GET /api/v1/customers?page=1&limit=10
```

**Role Access:** All authenticated users

---

## Error Handling

### Error Code Reference

| Error Code | HTTP Status | Meaning |
|-----------|------------|---------|
| `AUTH_INVALID` | 401 | Invalid credentials |
| `AUTH_UNAUTHORIZED` | 401 | No valid token |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | User lacks required role |
| `VALIDATION_ERROR` | 422 | Input validation failed |
| `LEDGER_IMBALANCE` | 422 | Debit ≠ Credit |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

---

## Rate Limiting

### Default Limits

- **15 requests per minute** for authentication endpoints
- **100 requests per 15 minutes** for general API endpoints
- **1000 requests per hour** for list endpoints

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 97
X-RateLimit-Reset: 1681234567
```

---

## Best Practices

✅ Include `Authorization` header with JWT token  
✅ Use pagination for large datasets  
✅ Check `response.success` before processing data  
✅ Handle specific error codes appropriately  
✅ Implement exponential backoff for retries
