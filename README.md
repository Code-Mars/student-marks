# Student Marksheet Manager

This repository contains a full-stack application for managing student marksheets.

## Technologies

- **Frontend**: React 18, Vite, PrimeReact, Bootstrap, Axios, SheetJS
- **Backend**: Spring Boot 3.1+, Java 17, Spring Data JPA, Validation, Lombok, Springdoc OpenAPI, MySQL, Apache POI
- **Storage**: Local disk under `Marksheets/{rollNumber}`
- **Container**: Docker Compose for MySQL

## Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 16+
- npm
- Docker (optional for MySQL)

## Setup

### Backend

1. Ensure a local MySQL server is running on `localhost:3306` with a database named `students`.
   - Default credentials in `application.yml` are `root` / `root`; update as needed.
2. Build and run the application:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
3. Access Swagger UI: http://localhost:8080/swagger-ui.html

### Frontend

1.  Create a `.env` file in the project root with:
    ```env
    VITE_API_BASE_URL=http://localhost:8080/api/v1
    ```
2.  Install and start:
    ```bash
    npm install
    npm run dev
    ```
3.  Open: http://localhost:5173

## API Endpoints (base: `/api/v1`)

### Students

- `POST /students` Create a new student
- `GET /students` List with pagination, sorting, and filtering
- `PUT /students/{id}` Update an existing student
- `DELETE /students/{id}` Delete a student
- `POST /students/bulk/upload` Bulk upload students via Excel

### Templates & Marksheets

- `GET /students/template` Download Excel template
- `POST /students/{id}/marks/upload` Upload marks for a student
- `GET /students/marksheets/{rollNumber}/download` Download stored marksheet

## Postman Collection

Import `postman_collection.json` to test all endpoints.
