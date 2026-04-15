# Jerry Accounts API Routes

Base URL
- `http://localhost:5000/api/v1`

Authentication
- Header required on all routes below:
- `Authorization: Bearer <JWT_TOKEN>`

## 1) Create Transaction

Route
- `POST /api/v1/transaction/`
- Legacy alias (still works): `POST /api/v1/transaction/create-transaction`

Role Access
- `ADMIN`, `ACCOUNTANT`

Request Body
```json
{
  "description": "Office Expense",
  "paymentMode": "CASH",
  "expenseCategory": "REGULAR",
  "transactionCategory": "NORMAL",
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

Rules
- `entries` must contain at least 2 lines.
- Debit total must equal Credit total.
- `type` must be `DEBIT` or `CREDIT`.
- `amount` must be numeric and positive.
- Accounts should belong to the same company as the logged-in user.

Success Response (example)
```json
{
  "success": true,
  "data": {
    "_id": "69d630a840173478b4740b0b",
    "description": "Office Expense",
    "paymentMode": "CASH",
    "expenseCategory": "REGULAR",
    "transactionCategory": "NORMAL",
    "companyId": "69ce5fd53dce7bacfb369a8f",
    "entries": [
      { "_id": "69d630a840173478b4740b10" },
      { "_id": "69d630a840173478b4740b11" }
    ],
    "date": "2026-04-08T10:40:40.642Z"
  }
}
```

## 2) Transaction History By Account ID

Route
- `GET /api/v1/ledger/accounts/:accountId/transaction-history`
- Legacy alias (still works): `GET /api/v1/ledger/transactions/history/:accountId`

Query Params (optional)
- `page` (default: `1`)
- `limit` (default: `10`)

Example
- `GET /api/v1/ledger/accounts/69cfaffe4a2906a4037adbca/transaction-history?page=1&limit=10`

Success Response (example)
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

Empty Response (meaning no entries in your company for this account)
```json
{
  "success": true,
  "message": "No transaction entries found for this account in your company.",
  "data": {
    "entries": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0
    }
  }
}
```

## 3) Ledger By Account ID (Running Balance)

Route
- `GET /api/v1/ledger/accounts/:accountId/ledger`

Example
- `GET /api/v1/ledger/accounts/69cfaffe4a2906a4037adbca/ledger`

Success Response (example)
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

Common Error Responses
```json
{ "success": false, "message": "Unauthorized" }
```
```json
{ "success": false, "message": "Invalid token" }
```
```json
{ "success": false, "message": "Invalid Account ID" }
```
```json
{ "success": false, "message": "Account not found" }
```
```json
{ "success": false, "message": "Account does not belong to your company" }
```
