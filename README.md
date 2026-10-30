# Secure Art Gallery

A secure web-based application for managing visitors, employees, gallery access, and room occupancy. The system records gallery and room activities, manages user permissions, and maintains audit logs to support accountability and security monitoring.

## 1. Project Purpose

The Secure Art Gallery Web Application is developed as part of the CS 4/53401 – Secure Programming BIBIFI Project.

The application is designed to manage people entering and leaving an art gallery and individual rooms. It provides authentication, role-based access control, event management, occupancy tracking, and audit logging.

The project follows the Build It, Break It, Fix It (BIBIFI) approach:

- **Build It:** Design and implement a functional and secure application.
- **Break It:** Test the application to identify security vulnerabilities and functional defects.
- **Fix It:** Correct identified issues and verify the security improvements.

## 2. Team Members

| Name | Role |
|---|---|
| Minh Hieu Dang | Developer |

## 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | ReactJS, TypeScript, CSS |
| Backend | NestJS, Node.js, TypeScript |
| Database | PostgreSQL 16 |
| Audit Logging | C++ |
| API Communication | REST API |
| Authentication | JWT and session management |
| Email Testing | Mailtrap SMTP |
| Containerization | Docker, Docker Compose |
| API Documentation | Swagger / OpenAPI |
| API Testing | Postman |
| Web Server / Reverse Proxy | Nginx |

## 4. System Architecture

The application uses a client-server architecture.

### Architecture Overview

```text
             User / Browser
                   |
                   v
            React Frontend
                   |
                   v
              Nginx Server
                   |
              /api/ requests
                   |
                   v
             NestJS Backend
               /         \
              v           v
        PostgreSQL     C++ Audit
         Database      Component
                           |
                     Audit Records
```

### Main Components

**Frontend**

- Provides the user interface.
- Allows users to log in and access authorized features.
- Supports gallery events, room management, and dashboard views.

**Backend**

- Handles API requests and business logic.
- Performs authentication and authorization.
- Validates input data.
- Communicates with PostgreSQL and the C++ audit component.

**Database**

- Stores user accounts, sessions, rooms, gallery events, and audit records.

**C++ Audit Component**

- Provides `append()` for recording audit information.
- Provides `read()` for retrieving audit information.

**Nginx**

- Serves the frontend application.
- Forwards requests under `/api/` to the NestJS backend.

## 5. Main Features

- User authentication and session management.
- Role-based access control.
- User and employee management.
- Gallery entry and exit event recording.
- Room entry and exit event recording.
- Room occupancy management.
- Dashboard displaying room and activity information.
- Administrative audit log access.
- Audit logging through the C++ component.
- Input validation and secure API handling.

## 6. User Roles and Permissions

The application uses role-based access control (RBAC).

| Role | Main Permissions |
|---|---|
| User / Guest | Log in and access information permitted by the application. |
| Employee | Record authorized gallery and room activities and access permitted information. |
| Administrator | Manage users, roles, rooms, and administrative information; view audit logs. |

Authorization must be enforced by the backend. Frontend visibility restrictions alone are not sufficient to protect API endpoints.

## 7. Installation and Configuration

### Prerequisites

Install the following tools:

- Docker Desktop
- Docker Compose
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/minhhieu3101/secure_art_gallery.git
cd secure_art_gallery
```

### Step 2: Configure Environment Variables

Create a `.env` file in the project root.

Example configuration:

```env
DB_HOST=db
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=art_gallery_db

DATABASE_URL=postgresql://your_db_user:your_db_password@db:5432/art_gallery_db

MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM=artgallery@example.com

JWT_SECRET=your_strong_jwt_secret
JWT_ACCESS_TOKEN_EXPIRATION_TIME=336000s
JWT_REFRESH_TOKEN_EXPIRATION_TIME=2d
```

Use your own credentials and strong secrets. Do not commit `.env` files or real credentials to GitHub.

The `.env.example` file provides an example of the required environment variables.

### Step 3: Build and Start the Application

Run the following command from the project root:

```bash
docker compose up --build -d
```

This command builds and starts the application services:

- PostgreSQL database
- NestJS backend
- React frontend with Nginx

Check the running containers:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs -f
```

### Step 4: Access the Application

After starting the application successfully, open your web browser and navigate directly to the Login page:

**Login Page:**

http://localhost:8080/login

The following services are available:

| Service | Address |
|---|---|
| Frontend / Login Page | http://localhost:8080/login |
| Frontend Home | http://localhost:8080 |
| Swagger UI | http://localhost:8080/api/api |
| PostgreSQL | localhost:5432 |

The backend container listens on port `3000` inside the Docker network. It is accessed through the Nginx reverse proxy.

**To log in:**

1. Open http://localhost:8080/login.
2. Enter your account credentials.
3. Click the Login button.
4. After successful authentication, access the features permitted by your user role.

### Stop the Application

To stop the containers:

```bash
docker compose down
```

Database data may be stored in a Docker volume. Do not remove volumes unless you intend to delete the persisted database data.

## 8. Database Setup

The application uses PostgreSQL 16 as its relational database.

The database contains the following main tables:

- `user`
- `session`
- `room`
- `gallery_event`
- `audit_logs`

### Database Configuration

Database connection settings are provided through environment variables.

The Docker Compose database service uses the configured database name, username, and password.

### Connect to PostgreSQL

You can access the database container using:

```bash
docker compose exec db psql -U your_db_user -d art_gallery_db
```

Replace the username and database name with the values configured in `.env`.

### Database Schema

The database schema is maintained in:

```text
database/schema.sql
```

This file contains the SQL schema used to describe the database structure, including tables, columns, and relationships.

The Docker Compose configuration mounts this schema file into the PostgreSQL initialization directory. PostgreSQL executes initialization scripts when creating a new database volume.

Use the schema file as a reference when setting up or reviewing the database.

## 9. API Endpoints

The backend provides REST API endpoints for authentication, dashboard information, user management, rooms, gallery events, and audit logging.

The following are known API examples:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/refresh` | Refresh authentication credentials |
| GET | `/api/dashboard/room` | Retrieve room dashboard information |
| GET | `/api/dashboard/log` | Retrieve dashboard activity logs |
| GET | `/api/dashboard/user` | Retrieve user dashboard information |
| POST | `/api/events/gallery/enter` | Record a gallery entry event |

The `/api/` prefix is handled by Nginx and forwarded to the backend. The backend route itself may not include this prefix.

Additional endpoints for logout, account management, room operations, gallery exit, room entry, and room exit should be documented using the actual controller routes.

### 9.1 API Documentation with Swagger

The project uses Swagger (OpenAPI), integrated with NestJS, to provide interactive API documentation.

Swagger UI allows developers and testers to explore available API endpoints, review request and response formats, and execute API requests directly from a web browser.

#### Accessing Swagger UI

1. Start the application using Docker Compose:

   ```bash
   docker compose up --build -d
   ```

2. Open a web browser.
3. Navigate to:

   ```text
   http://localhost:8080/api/api
   ```

The Swagger path is configured in the NestJS application using `SwaggerModule.setup('api', app, document)`. Nginx forwards requests under `/api/` to the backend.

#### Using Swagger UI

1. **Explore API Groups:** Expand the available API tags to view endpoints organized by functionality.
2. **View Endpoint Details:** Select an endpoint to review its HTTP method, URL, description, parameters, and request body.
3. **Review Request and Response:** Check the expected input format, response structure, and documented HTTP status codes.
4. **Authorize:** For protected endpoints, click the **Authorize** button and provide a valid access token.
5. **Execute API Requests:** Click **Try it out**, enter the required parameters or request body, and click **Execute**.
6. **Review Results:** Swagger displays the request URL, HTTP response status, response body, and other available response information.

#### Authentication

The application configures Bearer authentication in Swagger.

For protected endpoints, click **Authorize** and enter a valid access token:

```text
Bearer <access_token>
```

Access permissions are enforced by the backend according to the user's role.

#### Notes

- Swagger documentation is generated from NestJS controllers, DTOs, and Swagger decorators.
- Available endpoints and their documentation depend on the metadata defined in the source code.
- Protected endpoints should be marked with the appropriate Swagger authentication decorators.
- Swagger is intended for API exploration and functional testing. Postman and security test cases are also used for security verification.

### API Authentication

Protected endpoints require valid authentication credentials.

Requests may include authentication information, such as a Bearer access token, when required by the endpoint.

Example:

```http
Authorization: Bearer <access_token>
```

The required authentication method should be checked for each endpoint.

## 10. Testing

Postman is used to test the application's REST API and security behavior.

Swagger UI is also available for exploring and executing API requests.

### Testing Environment

- Application running through Docker Compose.
- Backend API accessed through `http://localhost:8080/api`.
- PostgreSQL running in the Docker network.
- Postman used to send requests and inspect responses.
- Swagger UI used to explore and test documented API endpoints.

### Security Testing Areas

| Test Area | Testing Objective |
|---|---|
| Authentication | Verify valid and invalid login attempts. |
| Input Validation | Verify that invalid or missing input is rejected. |
| SQL Injection | Check whether malicious input can affect database queries. |
| Authorization | Verify that users cannot access administrator-only resources. |
| Token Security | Test missing, invalid, and expired authentication tokens. |
| Room Validation | Verify that invalid room data is rejected. |
| Business Logic | Verify that gallery and room events follow the required sequence. |
| Audit Logging | Verify that important activities are recorded and protected. |

### Running Tests with Postman

1. Start the application using Docker Compose.
2. Open Postman.
3. Import the project's Postman collection.
4. Configure the `baseURL` environment variable as:

   ```text
   http://localhost:8080/api
   ```

5. Run the login request to obtain authentication credentials.
6. Save the access token in the Postman environment when the login response provides it.
7. Execute the test requests.
8. Record the HTTP status code and actual response.
9. Save screenshots as testing evidence.

Test results should be recorded as Pass, Fail, Blocked, or Not Tested based on actual execution.

## 11. Security Controls

The application is designed to address the following security requirements:

### Authentication

- Validate user credentials.
- Use secure password storage.
- Manage access and refresh tokens.

### Authorization

- Enforce role-based access control.
- Protect administrator-only operations.
- Validate permissions on the backend.

### Input Validation

- Validate incoming request data.
- Reject invalid or unexpected values.
- Use DTO validation in the backend.

### SQL Injection Prevention

- Use safe database query practices.
- Validate input before database operations.
- Avoid constructing SQL queries directly from untrusted input.

### Session and Token Security

- Validate authentication tokens.
- Enforce token expiration.
- Manage session refresh and logout behavior.

### Audit Logging

- Record important application and security activities.
- Use the C++ audit component for append and read operations.
- Restrict audit log access to authorized administrators.
- Avoid recording passwords, OTP values, and authentication tokens.

### Error Handling

- Return appropriate error responses.
- Avoid exposing sensitive internal implementation details.

### Secrets Management

- Store sensitive configuration in environment variables.
- Exclude real credentials and secrets from source control.

## 12. Known Limitations

The following items should be reviewed and updated based on the final implementation and testing results:

- Security testing coverage depends on the test cases that have actually been executed.
- API endpoint documentation must be kept synchronized with the backend controllers and Swagger metadata.
- Email delivery in the development environment may use Mailtrap sandbox rather than a production email service.
- Deployment configuration is currently intended for a Docker-based development environment.
- Security controls should be verified through code review and reproducible security tests.
- Any unresolved vulnerabilities or incomplete features should be documented before final submission.

## 13. Repository Structure

The project is organized into separate directories for the frontend, backend, database schema, security testing, and automated tests.

```text
SECURE-ART-GALLERY/
│
├── .vscode/                  # Visual Studio Code configuration
├── frontend/                 # React frontend application
├── security-testing/         # Security testing resources and evidence
├── src/                      # NestJS backend source code
├── test/                     # Automated backend tests
├── database/                 # Database schema
│   └── schema.sql
│
├── .dockerignore             # Docker build exclusions
├── .env                      # Local environment configuration (not committed)
├── .env.example              # Example environment configuration
├── .gitignore                # Git ignored files
├── compose.yaml              # Docker Compose configuration
├── Dockerfile                # Backend Docker build configuration
├── jest.config.ts            # Jest testing configuration
├── nest-cli.json             # NestJS CLI configuration
├── package.json              # Backend dependencies and scripts
├── package-lock.json         # Dependency lock file
├── README.md                 # Project documentation
├── tsconfig.build.json       # TypeScript build configuration
└── tsconfig.json             # TypeScript configuration
```

### Main Directories

- **frontend/**: Contains the React-based user interface.
- **src/**: Contains the NestJS backend, API controllers, services, entities, and application logic.
- **database/**: Contains the SQL database schema.
- **security-testing/**: Contains Postman security testing resources, test results, and evidence.
- **test/**: Contains automated tests configured with Jest.

### Configuration Files

- **compose.yaml**: Defines the Docker Compose services used to run the application.
- **Dockerfile**: Defines the backend container build process.
- **.env.example**: Provides an example of the environment variables required by the application.
- **package.json**: Defines backend dependencies and available scripts.
- **jest.config.ts**: Configures the Jest testing framework.

## 14. Additional Documentation

Additional project documentation includes:

- System Architecture Diagram
- Entity-Relationship Diagram (ERD)
- Data Flow Diagram (DFD)
- STRIDE Threat Model
- Security Requirements
- Security Test Results and Evidence
- Swagger API Documentation

Refer to the `docs/` directory and Swagger UI for the corresponding project documentation, where available.

## 15. License

This project was developed for the CS 4/53401 – Secure Programming BIBIFI Project at Kent State University.