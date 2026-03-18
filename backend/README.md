# Lifewood Backend

Spring Boot REST API with MVC architecture, JWT authentication, role-based authorization, file upload, email notifications, WebSocket support, and OpenAPI docs.

## Stack
- Java 17
- Spring Boot 3.3.5
- Spring Security + JWT (jjwt)
- Spring Data JPA + MySQL
- Spring Mail
- Spring WebSocket (STOMP)
- Springdoc OpenAPI
- Lombok

## Package Structure
`com.lifewood.lifewood` subpackages:
- `config`
- `controller`
- `dto`
- `entity`
- `enumeration`
- `filter`
- `repository`
- `service`
- `util`

## Key Endpoints
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /user/get`
- `GET /user/get/all`
- `POST /user/create`
- `PUT /user/update`
- `PATCH /user/change-password`
- `DELETE /user/delete`
- `POST /applicant/create` (multipart)
- `GET /applicant/get`
- `GET /applicant/get/all`
- `PUT /applicant/update` (multipart)
- `DELETE /applicant/delete`
- `POST /contact/send`

## Configuration
Set values in `src/main/resources/application.properties`:
- MySQL datasource URL, username, password
- JWT secret and token validity
- Mail host/username/password
- Upload directory

## Run
```bash
./mvnw spring-boot:run
```

On Windows PowerShell:
```powershell
.\mvnw.cmd spring-boot:run
```

Swagger UI:
- `http://localhost:8080/swagger-ui.html`

## Test
```powershell
.\mvnw.cmd test
```

