# Jerry Accounts API Routes

This reference is aligned to the currently implemented Express routes.

## Base

- Base URL: http://localhost:5000/api/v1
- Auth header for protected routes: Authorization: Bearer <JWT_TOKEN>

## Auth

### Register

- Method: POST
- Path: /api/v1/auth/register
- Auth: No

Example body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "123456",
  "role": "ADMIN",
  "companyName": "Demo Pvt Ltd"
}
```

Success: 201

### Login

- Method: POST
- Path: /api/v1/auth/login
- Auth: No

Example body:

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

Success: 200

## Accounts

All routes protected.

### Create Account

- Method: POST
- Path: /api/v1/account/creation

Example body:

```json
{
  "name": "Cash",
  "type": "ASSET",
  "balance": 1000
}
```

### Get Accounts by Company

- Method: GET
- Path: /api/v1/account/company/:companyId

### Get Single Account

- Method: GET
- Path: /api/v1/account/:accountId

### Update Account

- Method: PUT
- Path: /api/v1/account/update/:accountId

Example body:

```json
{
  "name": "Cash Updated"
}
```

### Delete Account

- Method: DELETE
- Path: /api/v1/account/:accountId

## Transactions

All routes protected.

### Create Transaction

- Method: POST
- Path: /api/v1/transaction/create-transaction
- Roles: ADMIN, ACCOUNTANT

Example body:

```json
{
  "description": "Office Expense",
  "paymentMode": "CASH",
  "expenseCategory": "REGULAR",
  "transactionCategory": "NORMAL",
  "entries": [
    { "accountId": "<accountId1>", "type": "DEBIT", "amount": 1000 },
    { "accountId": "<accountId2>", "type": "CREDIT", "amount": 1000 }
  ]
}
```

Validation rules:

- entries must contain at least 2 rows
- debit total must equal credit total
- type must be DEBIT or CREDIT
- amount must be positive

### Get Petty Cash Transactions

- Method: GET
- Path: /api/v1/transaction/petty-cash

### Receive Money

- Method: POST
- Path: /api/v1/transaction/receive

### Send Money

- Method: POST
- Path: /api/v1/transaction/send

## Ledger

All routes protected.

### Entries by Account

- Method: GET
- Path: /api/v1/ledger/accounts/:accountId/entries
- Roles: ADMIN, ACCOUNTANT

### Account Balance

- Method: GET
- Path: /api/v1/ledger/accounts/:accountId/balance

### Running Ledger

- Method: GET
- Path: /api/v1/ledger/accounts/:accountId/ledger

### Transaction History by Account

- Method: GET
- Path: /api/v1/ledger/transactions/history/:accountId
- Query: page, limit

### Trial Balance

- Method: GET
- Path: /api/v1/ledger/trial-balance
- Roles: ADMIN, ACCOUNTANT

### Petty Cash Report

- Method: GET
- Path: /api/v1/ledger/reports/petty-cash
- Roles: ADMIN, ACCOUNTANT
- Query (optional): startDate, endDate

### Profit and Loss Report

- Method: GET
- Path: /api/v1/ledger/reports/profit-loss
- Roles: ADMIN, ACCOUNTANT
- Query (optional): startDate, endDate

### Balance Sheet Report

- Method: GET
- Path: /api/v1/ledger/reports/balance-sheet
- Roles: ADMIN, ACCOUNTANT
- Query (optional): startDate, endDate

## Customers

All routes protected.

### Create Customer

- Method: POST
- Path: /api/v1/customers/create

### Get Customers by Company

- Method: GET
- Path: /api/v1/customers/company/:companyId

### Get Customer

- Method: GET
- Path: /api/v1/customers/:customerId

### Update Customer

- Method: PUT
- Path: /api/v1/customers/:customerId

### Delete Customer

- Method: DELETE
- Path: /api/v1/customers/:customerId

## Invoices

All routes protected.

### Create Invoice

- Method: POST
- Path: /api/v1/invoices/create
- Roles: ADMIN, ACCOUNTANT

### Mark Invoice Paid

- Method: POST
- Path: /api/v1/invoices/:invoiceId/pay

## Common Errors

```json
{ "success": false, "message": "Unauthorized" }
```

```json
{ "success": false, "message": "Invalid token" }
```

```json
{ "success": false, "message": "Invalid Account ID" }
```
