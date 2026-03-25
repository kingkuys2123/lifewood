# Lifewood Backend

Spring Boot REST API with MVC architecture, JWT authentication, role-based authorization, file upload, email notifications, WebSocket support, and OpenAPI docs.

## Stack
- Java 17
- Spring Boot 3.3.5
- Spring Security + JWT (jjwt)
- Spring Data JPA + MySQL
- Resend transactional email API (HTTPS)
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
- `GET /user/me`
- `PUT /user/me`
- `PATCH /user/me/change-password`
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
- `POST /applicant/approve`
- `POST /applicant/deny`
- `GET /notification/get/all`
- `PATCH /notification/mark/read`
- `PATCH /notification/mark/all/read`
- `POST /contact/send`

## WebSocket
- STOMP endpoint: `/ws` (SockJS)
- User queue: `/user/queue/notifications`
- Include `Authorization: Bearer <accessToken>` in STOMP CONNECT headers.

## Configuration
Set values in `src/main/resources/application.properties`:
- MySQL datasource URL, username, password
- JWT secret and token validity
- Mail sender and Resend API key/url (`APP_MAIL_FROM`, `APP_MAIL_RESEND_API_KEY`, `APP_MAIL_RESEND_API_URL`)
- Upload directory

### Production Email (Resend over HTTPS)
Required environment variables for Railway:
- `APP_MAIL_RESEND_API_KEY` (Resend API key)
- `APP_MAIL_FROM` (verified sender, e.g. `noreply@yourdomain.com`)
- `APP_MAIL_NOTIFICATION_TO` (internal notification inbox)
- `APP_FRONTEND_RESET_PASSWORD_URL` (frontend reset route)

Optional tuning:
- `APP_MAIL_RESEND_API_URL` (default: `https://api.resend.com/emails`)
- `APP_MAIL_RESEND_CONNECT_TIMEOUT_MS` (default: `6000`)
- `APP_MAIL_RESEND_READ_TIMEOUT_MS` (default: `12000`)
- `APP_MAIL_RETRY_MAX_ATTEMPTS` (default: `3`)
- `APP_MAIL_RETRY_INITIAL_DELAY_MS` (default: `800`)

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

