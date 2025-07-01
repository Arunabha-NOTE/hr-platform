# 🧑‍💼 HR Platform Backend (Spring Boot + JWT)

A secure multi-tenant HR platform backend that supports organization-based access control using Spring Boot and JWT authentication. Each organization can have multiple users assigned roles such as **Admin**, **Manager**, or **Employee**, each with scoped permissions.

---

## 📦 Tech Stack

| Layer          | Technology                      |
|----------------|----------------------------------|
| Language       | Java 17+                         |
| Framework      | Spring Boot 3.5.x                |
| ORM            | Spring Data JPA                  |
| Auth           | Spring Security, JWT (jjwt)      |
| Database       | PostgreSQL (NeonDB)              |
| Build Tool     | Gradle                           |
| Dev Tools      | Spring DevTools, Lombok          |
| Frontend       | Next.js, TypeScript, Axios, shadcn/ui |

---

## 📁 Project Structure

```
platform/
├── build.gradle
├── gradlew*
├── settings.gradle
├── README.md
├── src/
│   ├── main/
│   │   ├── java/org/hr/platform/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── enums/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   └── service/
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/org/hr/platform/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   └── lib/
│   ├── components.json
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   └── README.md
└── ...
```

### Frontend Details

- **Framework:** [Next.js](https://nextjs.org/) (React-based, App Router)
- **Language:** TypeScript
- **HTTP Client:** [Axios](https://axios-http.com/)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind CSS)
- **Structure:**
  - `frontend/src/app/` – Next.js app directory (pages, layouts, etc.)
  - `frontend/src/lib/` – Shared utilities
  - `frontend/public/` – Static assets
  - `frontend/components.json` – shadcn/ui component registry
- **Styling:** Tailwind CSS (configured via `postcss.config.mjs`)
- **Linting:** ESLint (see `eslint.config.mjs`)

---

## 🔐 Role-Based Access Control (RBAC)

| Role        | Permissions                                                                 |
|-------------|------------------------------------------------------------------------------|
| SuperAdmin  | [Optional] Can create organizations and first Admins                        |
| Admin       | Can create/update/delete Managers and Employees in their organization       |
| Manager     | Can view Employees in their organization                                    |
| Employee    | Can view only their own profile                                             |

---

## 🔑 JWT Authentication

- **Token claims** include: `userId`, `organizationId`, and `role`
- Token is generated during login and must be sent in the `Authorization: Bearer <token>` header

---

## 🧪 Manual Setup (Initial Seed)

1. Manually add organizations to the database
2. Add at least one Admin per organization:

```sql
INSERT INTO organizations (id, name) VALUES (1, 'Acme Corp');

-- Password: 123456 (bcrypt)
INSERT INTO users (id, email, password, role, organization_id)
VALUES (
  1,
  'admin@acme.com',
  '$2a$10$QSVWjK3OtUlgHvZHZSkXheOg/WRn9Xhl6AWKw56Q5taFb6TFB8IRq',
  'ADMIN',
  1
);
```

Optional:
```sql
-- Add a SuperAdmin (optional for testing)
INSERT INTO users (id, email, password, role)
VALUES (
999,
'super@admin.com',
'$2a$10$QSVWjK3OtUlgHvZHZSkXheOg/WRn9Xhl6AWKw56Q5taFb6TFB8IRq',
'SUPERADMIN'
);
```
## 📜 API Endpoints
/auth/login POST
Logs in a user and returns a JWT.

/auth/create-user POST
(Admin-only) Creates users (Admin, Manager, Employee) within the same organization.

🔧 Configuration
.env
Store sensitive properties securely (use dotenv plugin or IDE support):

```ini
DATABASE_URL=jdbc:postgresql://...
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=86400000
```

```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
```

🚧 To Do (Later Phases)
Add @PreAuthorize annotations for finer control

Create dashboard views per role (Admins see all users, Managers see employees, etc.)

Add audit logging (optional)

Add organization-level dashboard for SuperAdmin (optional)

🧠 Design Decisions
Layered architecture: controller ↔ service ↔ repository

All users are scoped to one organization

JWT-based stateless session with embedded org/role claims

No account self-signup: Admin-only user creation for tight org boundaries

SuperAdmin is hardcoded/test-only for bootstrapping
