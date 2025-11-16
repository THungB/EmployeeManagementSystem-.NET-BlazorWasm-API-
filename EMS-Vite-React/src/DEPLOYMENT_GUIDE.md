# Employee Management System - Deployment Guide

## Overview
This document provides guidance on deploying the Employee Management System to Visual Studio 2026 and integrating ASP.NET backend with database connectivity.

---

## 1. Deploying to Visual Studio 2026

### Prerequisites
- **Visual Studio 2026** (or Visual Studio 2022/2025)
- **Node.js** (v18 or higher)
- **.NET SDK** (v8.0 or higher for ASP.NET Core)
- **Git** for version control

### Steps to Import the Project

#### Option 1: Create New Project with Existing Frontend

1. **Open Visual Studio 2026**
   - Launch Visual Studio
   - Select `File` → `New` → `Project`

2. **Create ASP.NET Core with React Template**
   - Search for "ASP.NET Core with React"
   - Select the template and click `Next`
   - Name your project (e.g., "EmployeeManagementSystem")
   - Choose location and click `Create`

3. **Replace Frontend Code**
   - Navigate to the `ClientApp` folder in your project
   - Delete the existing React files
   - Copy all files from this project to `ClientApp`:
     - `/App.tsx`
     - `/components/` folder
     - `/styles/` folder
     - `package.json` dependencies

4. **Install Dependencies**
   - Open Terminal in Visual Studio (`View` → `Terminal`)
   - Navigate to `ClientApp` folder:
     ```bash
     cd ClientApp
     npm install
     ```

5. **Configure Startup**
   - Open `Properties/launchSettings.json`
   - Ensure the React development server is configured
   - Set appropriate ports (e.g., Backend: 5000, Frontend: 3000)

#### Option 2: Integrate into Existing ASP.NET Project

1. **Add React to Existing Project**
   - Right-click on your project in Solution Explorer
   - Select `Add` → `Client-Side Library`
   - Install React packages via npm

2. **Configure Program.cs**
   ```csharp
   var builder = WebApplication.CreateBuilder(args);
   
   // Add services
   builder.Services.AddControllersWithViews();
   builder.Services.AddSpaStaticFiles(configuration =>
   {
       configuration.RootPath = "ClientApp/build";
   });
   
   var app = builder.Build();
   
   // Configure middleware
   if (!app.Environment.IsDevelopment())
   {
       app.UseExceptionHandler("/Error");
       app.UseHsts();
   }
   
   app.UseHttpsRedirection();
   app.UseStaticFiles();
   app.UseSpaStaticFiles();
   app.UseRouting();
   
   app.MapControllerRoute(
       name: "default",
       pattern: "{controller}/{action=Index}/{id?}");
   
   app.UseSpa(spa =>
   {
       spa.Options.SourcePath = "ClientApp";
       
       if (app.Environment.IsDevelopment())
       {
           spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
       }
   });
   
   app.Run();
   ```

3. **Update Project File (.csproj)**
   ```xml
   <PropertyGroup>
     <TargetFramework>net8.0</TargetFramework>
     <TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>
     <SpaRoot>ClientApp\</SpaRoot>
     <DefaultItemExcludes>$(DefaultItemExcludes);$(SpaRoot)node_modules\**</DefaultItemExcludes>
   </PropertyGroup>
   ```

### Running the Project

1. **Set Multiple Startup Projects**
   - Right-click on Solution in Solution Explorer
   - Select `Properties` → `Multiple startup projects`
   - Set both Backend and Frontend to `Start`

2. **Run Application**
   - Press `F5` or click `Start` button
   - Backend will run on configured port (e.g., https://localhost:5001)
   - Frontend will run on React dev server (e.g., http://localhost:3000)

---

## 2. Using ASP.NET for Backend API and Database Connectivity

### Yes, ASP.NET is Ideal for Backend API and Database Integration

ASP.NET Core provides excellent support for building RESTful APIs and connecting to databases. Here's how to implement it:

### Architecture Overview

```
Frontend (React/TypeScript)
    ↓
ASP.NET Core Web API
    ↓
Entity Framework Core
    ↓
Database (SQL Server/PostgreSQL/MySQL)
```

### Step-by-Step Implementation

#### 1. Create API Controllers

Create a `Controllers` folder and add API controllers:

**EmployeesController.cs**
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        public EmployeesController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees.ToListAsync();
        }
        
        // GET: api/employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            
            if (employee == null)
            {
                return NotFound();
            }
            
            return employee;
        }
        
        // POST: api/employees
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }
        
        // PUT: api/employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            if (id != employee.Id)
            {
                return BadRequest();
            }
            
            _context.Entry(employee).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                throw;
            }
            
            return NoContent();
        }
        
        // DELETE: api/employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }
            
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
        
        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }
    }
}
```

#### 2. Create Data Models

**Models/Employee.cs**
```csharp
using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.Models
{
    public class Employee
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Phone]
        public string Phone { get; set; }
        
        public string Department { get; set; }
        
        public string Position { get; set; }
        
        public string Branch { get; set; }
        
        public string City { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        public DateTime StartDate { get; set; }
        
        public string Status { get; set; }
        
        public string Role { get; set; } = "employee";
    }
    
    public class Query
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string Type { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public string Response { get; set; }
        
        public Employee Employee { get; set; }
    }
    
    public class TodoItem
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Completed { get; set; }
        public string Priority { get; set; }
        public DateTime DueDate { get; set; }
        
        public Employee Employee { get; set; }
    }
}
```

#### 3. Setup Entity Framework Core Database Context

**Data/ApplicationDbContext.cs**
```csharp
using Microsoft.EntityFrameworkCore;
using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Query> Queries { get; set; }
        public DbSet<TodoItem> TodoItems { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure relationships
            modelBuilder.Entity<Query>()
                .HasOne(q => q.Employee)
                .WithMany()
                .HasForeignKey(q => q.EmployeeId);
            
            modelBuilder.Entity<TodoItem>()
                .HasOne(t => t.Employee)
                .WithMany()
                .HasForeignKey(t => t.EmployeeId);
        }
    }
}
```

#### 4. Configure Database Connection

**appsettings.json**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=EmployeeManagementDB;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

**For SQL Server:**
```
Server=localhost;Database=EmployeeManagementDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True
```

**For PostgreSQL:**
```
Host=localhost;Database=EmployeeManagementDB;Username=postgres;Password=YourPassword
```

**For MySQL:**
```
Server=localhost;Database=EmployeeManagementDB;User=root;Password=YourPassword
```

#### 5. Register Services in Program.cs

```csharp
using Microsoft.EntityFrameworkCore;
using EmployeeManagementSystem.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();
```

#### 6. Create and Apply Database Migrations

**Package Manager Console:**
```bash
Add-Migration InitialCreate
Update-Database
```

**Or using .NET CLI:**
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### 7. Update React Frontend to Call API

**Example API Service (Frontend):**

Create `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://localhost:5001/api';

export const employeeApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/employees`);
    return response.json();
  },
  
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`);
    return response.json();
  },
  
  create: async (employee: any) => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    return response.json();
  },
  
  update: async (id: number, employee: any) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    return response.ok;
  },
  
  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  },
};
```

### Database Options

| Database | NuGet Package | Connection String |
|----------|---------------|-------------------|
| SQL Server | `Microsoft.EntityFrameworkCore.SqlServer` | `Server=...;Database=...;` |
| PostgreSQL | `Npgsql.EntityFrameworkCore.PostgreSQL` | `Host=...;Database=...;` |
| MySQL | `Pomelo.EntityFrameworkCore.MySql` | `Server=...;Database=...;` |
| SQLite | `Microsoft.EntityFrameworkCore.Sqlite` | `Data Source=app.db` |

### Authentication & Authorization

For secure API endpoints, implement JWT authentication:

```csharp
// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
```

---

## Summary

**Yes, it is absolutely possible and recommended to:**

1. ✅ Deploy this React/TypeScript frontend to Visual Studio 2026
2. ✅ Use ASP.NET Core for building RESTful backend APIs
3. ✅ Connect to SQL Server, PostgreSQL, MySQL, or other databases
4. ✅ Use Entity Framework Core for database operations
5. ✅ Implement authentication and authorization
6. ✅ Deploy to Azure, IIS, or other hosting platforms

The architecture provides a clean separation between frontend and backend, making it maintainable, scalable, and production-ready.

---

## Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [React with ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react)
- [Visual Studio Documentation](https://docs.microsoft.com/en-us/visualstudio/)

---

**Last Updated:** November 2025
**Version:** 1.0
