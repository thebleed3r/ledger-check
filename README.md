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

**Purpose:**  
Validates a set of movements and checkpoints for consistency. This endpoint does **not** modify any data or state on the server.

**Request Example:**
{
"movements": [
{ "id": 1, "date": "2025-06-01T00:00:00.000Z", "label": "Salary", "amount": 2500 }
],
"balances": [
{ "date": "2025-06-02T00:00:00.000Z", "balance": 1000 }
]
}

**Response Codes and Examples:**

- **200 OK**  
  - **Validation succeeded:**  
    ```
    { "message": "Accepted" }
    ```
  - **Validation failed:**  
    ```
    {
      "message": "Validation failed",
      "reasons": [
        {
          "type": "DUPLICATE",
          "message": "Duplicate movement detected",
          "details": { "movementId": 2 }
        }
      ]
    }
    ```
- **400 Bad Request**  
  - Only if the request is malformed or invalid (e.g., missing required fields, invalid JSON).

**Note:**  
This endpoint always returns 200 OK if the request is valid, even if the data fails validation. The validation result is detailed in the response body.

## Development Best Practices

- **Modular structure** for easy extension.
- **TypeScript and DTOs** for type safety and clear contracts.
- **Consistent error handling** and response formats.
- **Automated testing** (recommended for future expansion).
- **Linting and formatting** for code quality.

## Testing

Run automated tests to verify the correctness of the validation logic:

npm run test

**Tests cover:**
- **Validation of movements and checkpoints.**
- **Detection of movements outside the controlled period.**
- **Identification of duplicate movements.**
- **Balance mismatch checks between checkpoints.**
- **Handling of cases where validation is impossible (no or only one checkpoint).**

Test results help ensure the reliability and robustness of the API, making it easier to maintain and extend.

## Requirements

- **Node.js**
- **npm or yarn**
- **NestJS CLI** (optional)

## Contribution

Feel free to open issues or submit pull requests for improvements.