# 🧑‍💼 HR Platform - Full Stack Application

A secure multi-tenant HR platform with role-based access control supporting Super Admins, Organization Admins, Managers, and Employees. Built with Spring Boot backend and Next.js frontend.

---

## 📦 Tech Stack

### Backend
| Component      | Technology                      | Version    |
|----------------|---------------------------------|------------|
| Language       | Java                           | 17+        |
| Framework      | Spring Boot                    | 3.5.x      |
| Security       | Spring Security + JWT          | Latest     |
| ORM            | Spring Data JPA                | Latest     |
| Database       | PostgreSQL                     | 15+        |
| Build Tool     | Gradle                         | 8.x        |
| JWT Library    | jjwt                          | 0.11.x     |
| Dev Tools      | Spring DevTools, Lombok        | Latest     |

### Frontend
| Component      | Technology                      | Version    |
|----------------|---------------------------------|------------|
| Framework      | Next.js                        | 15.3.4     |
| Language       | TypeScript                     | Latest     |
| UI Library     | shadcn/ui                      | Latest     |
| HTTP Client    | Axios                          | Latest     |
| State Mgmt     | React Context API              | Latest     |
| Styling        | Tailwind CSS                   | Latest     |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Login     │ │ Super Admin │ │ Manager/Employee    │   │
│  │   Page      │ │ Dashboard   │ │ Dashboards          │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS + JWT
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                Spring Boot Backend                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Auth        │ │ Super Admin │ │ Organization        │   │
│  │ Controller  │ │ Controller  │ │ Controllers         │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ JWT Service │ │ Auth        │ │ User Management     │   │
│  │             │ │ Service     │ │ Services            │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │             Spring Data JPA                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ super_admin │ │ organization│ │ users               │   │
│  │ table       │ │ table       │ │ table               │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗃️ Database Schema

### Tables

#### `super_admin`
```sql
CREATE TABLE super_admin (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    first_login BOOLEAN DEFAULT true,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `organization`
```sql
CREATE TABLE organization (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `users`
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'EMPLOYEE')),
    organization_id BIGINT REFERENCES organization(id) ON DELETE CASCADE,
    first_login BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure

#### User Token Claims
```json
{
  "sub": "user@techcorp.com",
  "userId": 1,
  "orgId": 1,
  "role": "MANAGER",
  "userType": "USER",
  "firstLogin": false,
  "iat": 1641234567,
  "exp": 1641321567
}
```

#### Super Admin Token Claims
```json
{
  "sub": "superadmin@platform.com",
  "superAdminId": 1,
  "role": "SUPERADMIN",
  "userType": "SUPERADMIN",
  "firstLogin": false,
  "iat": 1641234567,
  "exp": 1641321567
}
```

### Role Hierarchy
- **SUPERADMIN**: Full system access, manage all organizations and users
- **ADMIN**: Organization-level admin, manage users within organization
- **MANAGER**: Team management, view organization users
- **EMPLOYEE**: Basic access, personal data only

---

## 🚀 API Documentation

### Base URL
```
Backend: https://n844s8s80skwc0k8gso480ck.arunabha.in
Frontend: http://localhost:3000 (development)
```

### Authentication Endpoints

#### POST `/auth/login`
**Request:**
```json
{
  "email": "user@techcorp.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "firstLogin": false
}
```

#### POST `/auth/refresh`
**Request:**
```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440001"
}
```

### Super Admin Endpoints

#### GET `/api/superadmin/users`
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "admin@techcorp.com",
    "role": "ADMIN",
    "firstLogin": false,
    "organization": {
      "id": 1,
      "name": "Tech Corp"
    }
  }
]
```

#### POST `/api/superadmin/users/organization/{orgId}`
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "email": "newuser@techcorp.com",
  "password": "password123",
  "role": "EMPLOYEE"
}
```

**Response:**
```json
{
  "id": 5,
  "email": "newuser@techcorp.com",
  "role": "EMPLOYEE",
  "firstLogin": true,
  "organization": {
    "id": 1,
    "name": "Tech Corp"
  }
}
```

#### GET `/api/superadmin/organizations`
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tech Corp",
    "description": "A leading technology company"
  }
]
```

#### POST `/api/superadmin/organizations`
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "name": "New Corp",
  "description": "A new organization"
}
```

**Response:**
```json
{
  "id": 4,
  "name": "New Corp",
  "description": "A new organization"
}
```

#### PUT `/api/superadmin/organizations/{id}`
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "name": "Updated Corp Name",
  "description": "Updated description"
}
```

#### DELETE `/api/superadmin/organizations/{id}`
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`

#### PUT `/api/superadmin/users/{id}`
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "email": "updated@techcorp.com",
  "role": "MANAGER"
}
```

#### DELETE `/api/superadmin/users/{id}`
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** `200 OK`

---

## 🎨 Frontend Architecture

### Project Structure
```
frontend/src/
├── app/
│   ├── dashboard/
│   │   ├── super-admin/
│   │   │   ├── page.tsx               # Super Admin Dashboard
│   │   │   ├── users/page.tsx         # User Management
│   │   │   └── organizations/page.tsx # Organization Management
│   │   ├── manager/page.tsx           # Manager Dashboard
│   │   ├── admin/page.tsx             # Admin Dashboard
│   │   └── employee/page.tsx          # Employee Dashboard
│   ├── login/page.tsx                 # Login Page
│   └── layout.tsx                     # Root Layout
├── components/
│   ├── RoleProtectedRoute.tsx         # Route Protection
│   └── ui/                           # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx               # Authentication Context
└── lib/
    ├── api.ts                        # API Client
    ├── auth.ts                       # Auth Service
    └── utils.ts                      # Utility Functions
```

### Key Components

#### AuthContext
```typescript
interface AuthContextType {
  user: DecodedToken | null;
  login: (credentials: authRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

#### API Client
```typescript
// Auto-attaches JWT token to requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Route Protection
```typescript
<RoleProtectedRoute allowedRoles={[Role.SUPER_ADMIN]}>
  <SuperAdminDashboard />
</RoleProtectedRoute>
```

---

## 🛠️ Development Setup

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Git

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd platform

# Configure database
# Update src/main/resources/application.properties

# Run application
./gradlew bootRun
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL

# Run development server
npm run dev
```

### Environment Variables

#### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hrplatform
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your-super-secret-jwt-key-that-is-at-least-256-bits
jwt.expiration=86400000
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://n844s8s80skwc0k8gso480ck.arunabha.in
```

---

## 🧪 Test Data (Data Seeding)

The application automatically seeds test data on startup:

### Organizations
- **Tech Corp** (techcorp.com)
- **Health Plus** (healthplus.com)  
- **Edu Systems** (edusystems.com)

### Test Accounts

#### Super Admin
- Email: `superadmin@platform.com`
- Password: `superadmin123`

#### Tech Corp Users
- Admin: `admin@techcorp.com` / `admin123`
- Manager: `manager@techcorp.com` / `manager123`
- Manager 2: `manager2@techcorp.com` / `manager123`
- Employee 1: `employee1@techcorp.com` / `employee123`
- Employee 2: `employee2@techcorp.com` / `employee123`
- Employee 3: `employee3@techcorp.com` / `employee123`

#### Health Plus Users
- Admin: `admin@healthplus.com` / `admin123`
- Manager: `manager@healthplus.com` / `manager123`
- Employee 1-3: `employee[1-3]@healthplus.com` / `employee123`

#### Edu Systems Users
- Admin: `admin@edusystems.com` / `admin123`
- Manager: `manager@edusystems.com` / `manager123`
- Employee 1-3: `employee[1-3]@edusystems.com` / `employee123`

---

## 🔒 Security Features

### JWT Implementation
- **Stateless Authentication**: No server-side session storage
- **Role-based Access Control**: Fine-grained permissions
- **Refresh Token Support**: Automatic token renewal
- **Token Expiration**: Configurable expiration times
- **CORS Protection**: Cross-origin request handling

### Password Security
- **BCrypt Hashing**: Industry-standard password encryption
- **First Login Flow**: Force password change on first login

### API Security
- **Request Validation**: Input sanitization and validation
- **Role-based Endpoints**: Access control by user role
- **Error Handling**: Secure error responses

---

## 🚀 Deployment

### Backend Deployment
- Platform: Railway/Heroku/AWS
- Database: NeonDB (PostgreSQL)
- Environment: Production-ready configuration

### Frontend Deployment
- Platform: Vercel/Netlify
- Build: Static site generation
- Environment: Production API endpoints

---

## 📝 API Response Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## 🐛 Common Issues & Solutions

### CORS Errors
- Ensure frontend domain is added to backend CORS configuration
- Check for double slashes in API URLs

### JWT Token Issues
- Verify token expiration times
- Check JWT secret key configuration
- Ensure proper token format in Authorization header

### Database Connection
- Verify PostgreSQL connection string
- Check database credentials and permissions
- Ensure database exists and is accessible

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
