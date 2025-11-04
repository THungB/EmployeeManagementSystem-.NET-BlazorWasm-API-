# Employee Management System (EMS)

A comprehensive employee management system built with Blazor WebAssembly and ASP.NET Core.

## 🏗️ Architecture Overview
```mermaid
graph TB
    Client[Blazor WebAssembly Client]
    ClientLib[Client Library]
    Server[ASP.NET Core API]
    ServerLib[Server Library]
    BaseLib[Base Library]
    DB[(SQL Server)]
    
    Client --> ClientLib
    ClientLib --> BaseLib
    Client --> Server
    Server --> ServerLib
    ServerLib --> BaseLib
    ServerLib --> DB
    
    style Client fill:#e1f5ff
    style Server fill:#fff4e1
    style DB fill:#e8f5e9
```

## 📊 Entity Relationship Diagram

### Core Entities
```mermaid
erDiagram
    COUNTRY ||--o{ CITY : contains
    CITY ||--o{ TOWN : contains
    TOWN ||--o{ EMPLOYEE : "located in"
    
    GENERAL-DEPARTMENT ||--o{ DEPARTMENT : contains
    DEPARTMENT ||--o{ BRANCH : contains
    BRANCH ||--o{ EMPLOYEE : "works in"
    
    EMPLOYEE ||--o{ VACATION : requests
    EMPLOYEE ||--o{ OVERTIME : records
    EMPLOYEE ||--o{ SANCTION : receives
    EMPLOYEE ||--o{ DOCTOR : "medical records"
    
    VACATION-TYPE ||--|| VACATION : categorizes
    OVERTIME-TYPE ||--o{ OVERTIME : categorizes
    SANCTION-TYPE ||--o{ SANCTION : categorizes
    
    COUNTRY {
        int Id PK
        string Name
    }
    
    CITY {
        int Id PK
        int CountryId FK
        string Name
    }
    
    TOWN {
        int Id PK
        int CityId FK
        string Name
    }
    
    EMPLOYEE {
        int Id PK
        string CivilId
        string FileNumber
        string FullName
        string JobName
        string Address
        string TelephoneNumber
        string Photo
        int BranchId FK
        int TownId FK
    }
    
    GENERAL-DEPARTMENT {
        int Id PK
        string Name
    }
    
    DEPARTMENT {
        int Id PK
        int GeneralDepartmentId FK
        string Name
    }
    
    BRANCH {
        int Id PK
        int DepartmentId FK
        string Name
    }
```

## 🔐 Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as Auth API
    participant DB as Database
    
    U->>C: Enter credentials
    C->>A: POST /api/authentication/login
    A->>DB: Validate user
    DB-->>A: User data
    A->>A: Generate JWT + Refresh Token
    A-->>C: Return tokens
    C->>C: Store in localStorage
    
    Note over C: Subsequent requests
    C->>A: API Request + JWT
    A->>A: Validate token
    
    alt Token expired
        A-->>C: 401 Unauthorized
        C->>A: POST /refresh-token
        A-->>C: New JWT + Refresh Token
        C->>A: Retry with new token
    end
    
    A-->>C: Response data
```

## 📦 Class Diagram - Domain Entities
```mermaid
classDiagram
    %% Location Hierarchy
    class Country {
        +int Id
        +string Name
        +List~City~ Cities
    }
    
    class City {
        +int Id
        +string Name
        +int CountryId
        +Country Country
        +List~Town~ Towns
    }
    
    class Town {
        +int Id
        +string Name
        +int CityId
        +City City
        +List~Employee~ Employees
    }
    
    %% Department Hierarchy
    class GeneralDepartment {
        +int Id
        +string Name
        +List~Department~ Departments
    }
    
    class Department {
        +int Id
        +string Name
        +int GeneralDepartmentId
        +GeneralDepartment GeneralDepartment
        +List~Branch~ Branches
    }
    
    class Branch {
        +int Id
        +string Name
        +int DepartmentId
        +Department Department
        +List~Employee~ Employees
    }
    
    %% Employee
    class Employee {
        +int Id
        +string CivilId
        +string FileNumber
        +string FullName
        +string JobName
        +string Address
        +string TelephoneNumber
        +string Photo
        +string Other
        +int BranchId
        +int TownId
        +Branch Branch
        +Town Town
    }
    
    %% Relationships
    Country "1" --> "*" City
    City "1" --> "*" Town
    Town "1" --> "*" Employee
    
    GeneralDepartment "1" --> "*" Department
    Department "1" --> "*" Branch
    Branch "1" --> "*" Employee
    
    %% HR Modules
    class Vacation {
        +int Id
        +string CivilId
        +string FileNumber
        +DateTime StartDate
        +int NumberOfDays
        +DateTime EndDate
        +int VacationTypeId
        +VacationType VacationType
    }
    
    class VacationType {
        +int Id
        +string Name
    }
    
    class Overtime {
        +int Id
        +string CivilId
        +string FileNumber
        +DateTime StartDate
        +DateTime EndDate
        +int NumberOfDays
        +int OvertimeTypeId
        +OvertimeType OvertimeType
    }
    
    class OvertimeType {
        +int Id
        +string Name
    }
    
    class Sanction {
        +int Id
        +string CivilId
        +string FileNumber
        +DateTime Date
        +string Punishment
        +DateTime PunishmentDate
    }
    
    class Doctor {
        +int Id
        +string CivilId
        +string FileNumber
        +DateTime Date
        +string MedicalDiagnose
        +string MedicalRecommendation
    }
    
    VacationType "1" --> "*" Vacation
    OvertimeType "1" --> "*" Overtime
```

## 🔄 API Request Flow
```mermaid
flowchart LR
    A[Client Request] --> B{Has Token?}
    B -->|Yes| C[Add Bearer Token]
    B -->|No| D[Public Endpoint]
    
    C --> E[Send to API]
    D --> E
    
    E --> F{Valid Token?}
    F -->|Yes| G[Process Request]
    F -->|No| H{Can Refresh?}
    
    H -->|Yes| I[Get New Token]
    H -->|No| J[Return 401]
    
    I --> E
    G --> K[Return Response]
    
    style A fill:#e3f2fd
    style K fill:#c8e6c9
    style J fill:#ffcdd2
```

## 🛠️ Technologies Used
```mermaid
mindmap
  root((EMS Stack))
    Frontend
      Blazor WebAssembly
      Bootstrap 5
      Blazored LocalStorage
    Backend
      ASP.NET Core 9.0
      Entity Framework Core
      SQL Server
    Security
      JWT Bearer
      BCrypt Password Hashing
      Refresh Tokens
    Architecture
      Clean Architecture
      Repository Pattern
      Generic CRUD
```

## 🚀 Getting Started

### Prerequisites
- .NET 9.0 SDK
- SQL Server LocalDB
- Visual Studio 2022 or VS Code

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/EMS.git
cd EMS
```

2. Update database connection string in `Server/appsettings.json`

3. Apply migrations
```bash
cd Server
dotnet ef database update
```

4. Run the application
```bash
dotnet run --project Server
dotnet run --project Client
```

## 📁 Project Structure
```mermaid
graph TD
    A[EMS Solution] --> B[BaseLibrary]
    A --> C[ClientLibrary]
    A --> D[Client]
    A --> E[ServerLibrary]
    A --> F[Server]
    
    B --> B1[DTOs]
    B --> B2[Entities]
    B --> B3[Responses]
    
    C --> C1[Services]
    C --> C2[Helpers]
    
    E --> E1[Repositories]
    E --> E2[Data]
    
    F --> F1[Controllers]
    F --> F2[Migrations]
    
    style A fill:#fff9c4
    style B fill:#e1bee7
    style C fill:#b2dfdb
    style D fill:#ffccbc
    style E fill:#d1c4e9
    style F fill:#c5e1a5
```

## 🔑 API Endpoints

### Authentication
- `POST /api/authentication/register` - Register new user
- `POST /api/authentication/login` - User login
- `POST /api/authentication/refresh-token` - Refresh JWT token

### General Department
- `GET /api/generaldepartment/all` - Get all departments
- `GET /api/generaldepartment/single/{id}` - Get by ID
- `POST /api/generaldepartment/add` - Create new
- `PUT /api/generaldepartment/update` - Update existing
- `DELETE /api/generaldepartment/delete/{id}` - Delete

### Similar endpoints for:
- Department
- Branch
- Country
- City
- Town

## 📊 Database Schema
```mermaid
graph LR
    subgraph Location
        A[Country] --> B[City]
        B --> C[Town]
    end
    
    subgraph Organization
        D[GeneralDepartment] --> E[Department]
        E --> F[Branch]
    end
    
    subgraph Employee Data
        G[Employee]
        H[Vacation]
        I[Overtime]
        J[Sanction]
        K[Doctor]
    end
    
    C -.-> G
    F -.-> G
    G --> H
    G --> I
    G --> J
    G --> K
    
    style A fill:#e3f2fd
    style D fill:#fff3e0
    style G fill:#f3e5f5
```

## 👥 User Roles
```mermaid
stateDiagram-v2
    [*] --> Anonymous
    Anonymous --> User: Register/Login
    User --> Admin: Role Assignment
    
    state User {
        [*] --> ViewData
        ViewData --> RequestLeave
        ViewData --> ViewProfile
    }
    
    state Admin {
        [*] --> ManageUsers
        ManageUsers --> ManageDepartments
        ManageDepartments --> ViewReports
        ViewReports --> ApproveRequests
    }
```

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Blazor and ASP.NET Core**
