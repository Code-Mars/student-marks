# Student Marksheet Manager

This repository contains a full-stack application for managing student marksheets.

## Technologies

- **Frontend**: React 18, Vite, PrimeReact, Bootstrap, Axios, SheetJS
- **Backend**: Spring Boot 3.1+, Java 17, Spring Data JPA, Validation, Lombok, Springdoc OpenAPI, MySQL, Apache POI
- **Storage**: Local disk under `Marksheets/{rollNumber}`
- **Database**: MySQL (local installation)

## Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 16+
- npm
  -- MySQL Server (install locally)

## Setup

### Database Setup

1. Install and start MySQL Server.
2. In a MySQL client, execute:
   ```sql
   CREATE DATABASE students;
   ```
3. Open `backend/src/main/resources/application.yml` and update `spring.datasource` username/password to match your MySQL setup.

### Backend

1. Build and run the Spring Boot application:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
2. The API base URL is `http://localhost:8080/api/v1`.
3. Swagger/OpenAPI UI: http://localhost:8080/swagger-ui.html

### Frontend

1.  In the project root, create a `.env` file containing:
    ```env
    VITE_API_BASE_URL=http://localhost:8080/api/v1
    ```
2.  Install dependencies and start the Vite dev server:
    ```bash
    npm install
    npm run dev
    ```
3.  Open the app: http://localhost:5173

## API Endpoints (base: `/api/v1`)

### Students

- `POST /students` Create a new student
- `GET /students` List with pagination, sorting, and filtering
- `PUT /students/{id}` Update an existing student
- `DELETE /students/{id}` Delete a student
- `POST /students/bulk/upload` Bulk upload students via Excel

### Templates & Marksheets

- `GET  /students/template` Download blank student template (Excel)
- `GET  /students/marksheet/template` Download marksheet template (subjects Excel)
- `POST /students/{id}/marksheet/upload` Upload filled marksheet for a student
- `GET  /students/{id}/marksheet/download` Download processed marksheet for a student
- `POST /students/{id}/marks/upload` Upload simple marks list for a student
- `GET  /students/marksheets/{rollNumber}/download` Legacy: download stored marksheet

## Postman Collection

Import `postman_collection.json` to test all endpoints.
