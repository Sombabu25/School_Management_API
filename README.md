# 🏫 School Management API

A lightweight **Node.js + Express + MySQL** REST API that lets you add schools and retrieve them sorted by proximity to any location.

---

🌐 Live API

Base URL

https://school-management-api-fdm4.onrender.com

Endpoints

POST /addSchool
GET  /listSchools
GET  /

## 📁 Project Structure

```
school-management-api/
├── index.js                    # App entry point
├── package.json
├── .env.example                # Environment variable template
├── config/
│   ├── db.js                   # MySQL connection pool
│   └── setup.js                # One-time DB + table creation
├── controllers/
│   └── schoolController.js     # Business logic (addSchool, listSchools)
├── routes/
│   └── schools.js              # Express route definitions
├── utils/
│   └── distance.js             # Haversine distance formula
└── postman/
    └── School_Management_API.postman_collection.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js ≥ 16
- MySQL 8+ (local or remote)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 4. Create the database & table
```bash
npm run setup-db
```

### 5. Start the server
```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

The server starts on **http://localhost:3000** by default.

---

## 📡 API Reference

### `POST /addSchool`

Adds a new school to the database.

**Request Body** (`application/json`)

| Field       | Type   | Required | Description                    |
|-------------|--------|----------|--------------------------------|
| `name`      | string | ✅        | School name (non-empty)        |
| `address`   | string | ✅        | Full address (non-empty)       |
| `latitude`  | float  | ✅        | Decimal degrees (-90 to 90)    |
| `longitude` | float  | ✅        | Decimal degrees (-180 to 180)  |

**Example Request**
```json
POST /addSchool
{
  "name": "Delhi Public School",
  "address": "Mathura Road, New Delhi, Delhi 110019",
  "latitude": 28.5355,
  "longitude": 77.3910
}
```

**Success Response** `201 Created`
```json
{
  "success": true,
  "message": "School added successfully.",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi, Delhi 110019",
    "latitude": 28.5355,
    "longitude": 77.391
  }
}
```

**Validation Error** `400 Bad Request`
```json
{
  "success": false,
  "errors": [
    "name is required and must be a non-empty string.",
    "latitude must be a valid number between -90 and 90."
  ]
}
```

---

### `GET /listSchools`

Returns all schools sorted by distance from the user's location (closest first).

**Query Parameters**

| Parameter   | Type  | Required | Description                   |
|-------------|-------|----------|-------------------------------|
| `latitude`  | float | ✅        | User's latitude (-90 to 90)   |
| `longitude` | float | ✅        | User's longitude (-180 to 180)|

**Example Request**
```
GET /listSchools?latitude=19.0760&longitude=72.8777
```

**Success Response** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "user_location": { "latitude": 19.076, "longitude": 72.8777 },
  "data": [
    {
      "id": 2,
      "name": "Bombay Scottish School",
      "address": "Mahim, Mumbai, Maharashtra 400016",
      "latitude": 19.0375,
      "longitude": 72.8466,
      "distance_km": 4.8721
    },
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi, Delhi 110019",
      "latitude": 28.5355,
      "longitude": 77.391,
      "distance_km": 1153.9812
    }
  ]
}
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE schools (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255)  NOT NULL,
  address    VARCHAR(500)  NOT NULL,
  latitude   FLOAT(10, 6)  NOT NULL,
  longitude  FLOAT(10, 6)  NOT NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📐 Distance Calculation

Schools are sorted using the **Haversine formula**, which calculates the great-circle distance between two coordinates on Earth's surface. The result (`distance_km`) is included in every item of the `listSchools` response.

---

## 📬 Postman Collection

Import `postman/School_Management_API.postman_collection.json` into Postman.

- Set the `baseUrl` collection variable to your server (default `http://localhost:3000`).
- Includes happy-path and error-path examples for every endpoint.

---

## ☁️ Deployment

###  Render/Railway 
1. Push your code to GitHub.
2. Connect the repo to your hosting platform.
3. Set the environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`).
4. Run `npm run setup-db` once (or via a release command) to create the schema.
5. Start command: `npm start`.

### Environment Variables

| Variable      | Default              | Description               |
|---------------|----------------------|---------------------------|
| `DB_HOST`     | `localhost`          | MySQL host                |
| `DB_USER`     | `root`               | MySQL user                |
| `DB_PASSWORD` | *(empty)*            | MySQL password            |
| `DB_NAME`     | `school_management`  | MySQL database name       |
| `PORT`        | `3000`               | HTTP port                 |
