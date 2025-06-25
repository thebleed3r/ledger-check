# Ledger-Check

A complete NestJS API for validating financial movements against a series of checkpoints (balances), with clear error detection and consistent response structure.

## Features

- **Single, well-documented endpoint** for movement validation.
- **Comprehensive validation logic:**
  - Detects movements outside the controlled period.
  - Identifies duplicate movements.
  - Checks for balance mismatches between checkpoints.
  - Handles cases where validation is impossible (no or only one checkpoint).
- **Structured, consistent API responses** using DTOs.
- **Ready for extension** with additional endpoints or features.

## Technologies

- **NestJS** – Modern, modular Node.js framework.
- **TypeScript** – For type safety and maintainability.
- **DTOs & Validation** – Ensures data integrity and clear API contracts.

## Getting Started

1. **Clone the repository:**
git clone https://github.com/thebleed3r/ledger-check.git
cd ledger-check

2. **Install dependencies:**
npm install

3. **Run the application:**
npm run start

4. **Access the API:**
- **API endpoint:** `POST /movements/validate`

## API Reference

### **POST /movements/validate**

**Description:**  
Validates a list of movements against checkpoints (balances).

**Request Body:**
{
"movements": [
{ "id": 1, "date": "2023-01-01", "label": "Salary", "amount": 1000 },
{ "id": 2, "date": "2023-01-02", "label": "Rent", "amount": -500 }
],
"balances": [
{ "date": "2023-01-01", "balance": 1000 },
{ "date": "2023-01-02", "balance": 500 }
]
}

**Response:**
{
"message": "ACCEPTED",
"reasons": null
}

or, if errors are found:
{
"message": "FAILED",
"reasons": [
{
"type": "OUT_OF_BOUNDS",
"message": "Movement is outside the controlled period",
"details": { "movementId": 3 }
},
{
"type": "DUPLICATE",
"message": "Duplicate movement detected",
"details": { "movementId": 2 }
}
]
}

## Development Best Practices

- **Modular structure** for easy extension.
- **TypeScript and DTOs** for type safety and clear contracts.
- **Consistent error handling** and response formats.
- **Automated testing** (recommended for future expansion).
- **Linting and formatting** for code quality.

## Requirements

- **Node.js**
- **npm or yarn**
- **NestJS CLI** (optional)

## Contribution

Feel free to open issues or submit pull requests for improvements.