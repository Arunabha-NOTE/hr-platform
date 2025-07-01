# 📝 Technical Design Document — HR Platform POC

## 📌 Project Overview

A multi-tenant HR platform where companies (organizations) can manage users with different roles (`Admin`, `Manager`, `Employee`). Access control is enforced using **JWT-based role-based authorization** and **org-level data isolation**.

---

## ⚙️ Architecture Overview

          [ Next.js Frontend ]
                  │
                  ▼
    [Spring Boot Backend API (hrplatform)]
                  │
        ┌─────────▼──────────┐
        │   Controller Layer │
        └─────────┬──────────┘
                  ▼
        ┌─────────▼──────────┐
        │    Service Layer   │
        └─────────┬──────────┘
                  ▼
        ┌─────────▼──────────┐
        │ Data Access Layer  │
        └─────────┬──────────┘
                  ▼
       [ PostgreSQL @ NeonDB ]


---

## 🔐 Security Model

- **Auth:** JWT Auth with Spring Security
- **Token includes:** `user_id`, `organization_id`, `role`
- **Access Control:**
    - `Admin`: Full CRUD on users in their organization
    - `Manager`: View-only access to users in their organization
    - `Employee`: View only their own profile

---

## 🧱 Backend Tech Stack

- **Framework:** Spring Boot 3.2
- **Security:** Spring Security + JWT
- **Persistence:** Spring Data JPA
- **Database:** PostgreSQL (hosted on NeonDB)
- **Build Tool:** Gradle
- **Secrets:** Loaded via `application.properties` using env variables

---

## 🧩 Frontend

- **Framework:** Next.js
- **Location:** `/frontend`
- **Purpose:** Simple UI for:
    - JWT login
    - Role-based views
    - Basic CRUD operations (based on role)

---

## 🔄 API Endpoints Overview

| Endpoint         | Method | Role           | Description              |
|------------------|--------|----------------|--------------------------|
| `/auth/register` | POST   | Public         | Register new user        |
| `/auth/login`    | POST   | Public         | Login + get JWT          |
| `/users`         | GET    | Admin, Manager | List all users in org    |
| `/users`         | POST   | Admin          | Create a user            |
| `/users/{id}`    | DELETE | Admin          | Delete a user            |
| `/users/me`      | GET    | All            | View own profile         |

---

## 🔧 Dev Notes

- Business logic is placed in the **Service Layer**
- Data access is handled via **DAL (Repositories)**
- Authorization uses `@PreAuthorize` with `hasRole(...)`
- Contextual org checks (e.g. match user’s `organizationId` in token) handled in service layer
