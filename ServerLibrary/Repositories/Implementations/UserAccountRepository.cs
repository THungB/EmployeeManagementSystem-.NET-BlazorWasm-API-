using BaseLibrary.DTOs;
using Microsoft.AspNetCore.Http;
using BaseLibrary.Entities;
using BaseLibrary.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ServerLibrary.Data;
using ServerLibrary.Helpers;
using ServerLibrary.Repositories.Contract;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Constants = ServerLibrary.Helpers.Constants;


namespace ServerLibrary.Repositories.Implementations
{
    public class UserAccountRepository(IOptions<JwtSection> config, AppDbContext appDbContext) : IUserAccount
    {
        public async Task<GeneralResponse> CreateAsync(Register user)
        {
            if (user is null)
            {
                return new GeneralResponse(false, "Model is empty");
            }

            var checkUser = await FindUserByEmail(user.Email!);
            if (checkUser != null)
            {
                return new GeneralResponse(false, "User with this email already exists.");
            }

            // Save user
            var applicationUser = await AddToDatabase(new ApplicationUser()
            {
                Fullname = user.Fullname,
                Email = user.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(user.Password)
            });

            // Check, create and assign role
            var checkAdminRole = await appDbContext.SystemRoles.FirstOrDefaultAsync(_ => _.Name!.Equals(Constants.Admin));
            if (checkAdminRole is null)
            {
                var createAdminRole = await AddToDatabase(new SystemRole() { Name = Constants.Admin });
                await AddToDatabase(new UserRole()
                {
                    RoleId = createAdminRole.Id,
                    UserId = applicationUser.Id
                });
                return new GeneralResponse(true, "Account created!");
            }

            var checkUserRole = await appDbContext.SystemRoles.FirstOrDefaultAsync(_ => _.Name!.Equals(Constants.User));
            SystemRole response = new();
            if (checkUserRole is null)
            {
                response = await AddToDatabase(new SystemRole() { Name = Constants.User });
                await AddToDatabase(new UserRole() { RoleId = response.Id, UserId = applicationUser.Id });
            }
            else
            {
                await AddToDatabase(new UserRole() { RoleId = checkUserRole.Id, UserId = applicationUser.Id });
            }
            return new GeneralResponse(true, "Account created!");
        }
        public async Task<LoginWithCookieResponse> SignInAsync(Login user, HttpContext httpContext)
        {
            if (user is null) return new LoginWithCookieResponse { Success = false, Message = "Model is empty" };

            var applicationUser = await FindUserByEmail(user.Email!);
            if (applicationUser is null) return new LoginWithCookieResponse { Success = false, Message = "User not found" };

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(user.Password, applicationUser.Password))
                return new LoginWithCookieResponse { Success = false, Message = "Email or Password not valid" };

            var getUserRole = await FindUserRole(applicationUser.Id);
            if (getUserRole is null) return new LoginWithCookieResponse { Success = false, Message = "User role not found" };

            var getRoleName = await FindRoleName(getUserRole.RoleId);
            if (getRoleName is null) return new LoginWithCookieResponse { Success = false, Message = "User role not found" };

            // Generate tokens
            string jwtToken = GenerateToken(applicationUser, getRoleName.Name!);
            string refreshToken = GenerateRefreshToken();

            // Save the Refresh token to database
            var findUser = await appDbContext.RefreshTokenInfos.FirstOrDefaultAsync(_ => _.UserId == applicationUser.Id);
            if (findUser is not null)
            {
                findUser.Token = refreshToken;
                await appDbContext.SaveChangesAsync();
            }
            else
            {
                await AddToDatabase(new RefreshTokenInfo() { Token = refreshToken, UserId = applicationUser.Id });
            }

            // Set refresh token in HTTP-only cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/api/authentication/refresh-token"
            };

            httpContext.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

            // Return response with access token (refresh token is in cookie)
            return new LoginWithCookieResponse
            {
                Success = true,
                Message = "Login successful",
                Token = jwtToken,
                Roles = new[] { getRoleName.Name! }
            };
        }
        private string GenerateToken(ApplicationUser user, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.Value.Key!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var userClaims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Fullname!),
        new Claim(ClaimTypes.Email, user.Email!),
        new Claim(ClaimTypes.Role, role!)
            };

            var token = new JwtSecurityToken(
                issuer: config.Value.Issuer,
                audience: config.Value.Audience,
                claims: userClaims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private async Task<UserRole> FindUserRole(int userId) => 
            await appDbContext.UserRoles.FirstOrDefaultAsync(_ => _.UserId == userId);
        private async Task<SystemRole> FindRoleName(int roleId) => 
            await appDbContext.SystemRoles.FirstOrDefaultAsync(_ => _.Id == roleId);
        private static string GenerateRefreshToken() => Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        private async Task<ApplicationUser> FindUserByEmail(string email) =>
            await appDbContext.ApplicationUsers.FirstOrDefaultAsync(_ => _.Email!.ToLower()!.Equals(email!.ToLower()));
        private async Task<T> AddToDatabase<T>(T model)
        {
            var result = appDbContext.Add(model!);
            await appDbContext.SaveChangesAsync();
            return (T)result.Entity;
        }
        public async Task<LoginWithCookieResponse> RefreshTokenAsync(HttpContext httpContext)
        {
            // Get refresh token from cookie
            var refreshToken = httpContext.Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return new LoginWithCookieResponse { Success = false, Message = "Refresh token is required" };

            var findToken = await appDbContext.RefreshTokenInfos
                .FirstOrDefaultAsync(rt => rt.Token!.Equals(refreshToken));
                
            if (findToken is null) 
                return new LoginWithCookieResponse { Success = false, Message = "Invalid refresh token" };

            // Get user details
            var user = await appDbContext.ApplicationUsers
                .FirstOrDefaultAsync(u => u.Id == findToken.UserId);
                
            if (user is null) 
                return new LoginWithCookieResponse { Success = false, Message = "User not found" };

            var userRole = await FindUserRole(user.Id);
            if (userRole is null) 
                return new LoginWithCookieResponse { Success = false, Message = "User role not found" };

            var roleName = await FindRoleName(userRole.RoleId);
            if (roleName is null) 
                return new LoginWithCookieResponse { Success = false, Message = "Role not found" };

            // Generate new tokens
            string newJwtToken = GenerateToken(user, roleName.Name!);
            string newRefreshToken = GenerateRefreshToken();

            // Update the refresh token in database
            findToken.Token = newRefreshToken;
            await appDbContext.SaveChangesAsync();

            // Set new refresh token in HTTP-only cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/api/authentication/refresh-token"
            };

            httpContext.Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

            return new LoginWithCookieResponse
            {
                Success = true,
                Message = "Token refreshed successfully",
                Token = newJwtToken,
                Roles = new[] { roleName.Name! }
            };
        }

        public async Task<List<ManageUser>> GetUsers()
        {
            var allUsers = await GetApplicationUsers();
            var allUserRoles = await UserRoles();
            var allRoles = await SystemRoles();

            if (allUsers.Count == 0 || allRoles.Count == 0) return null!;

            var users = new List<ManageUser>();

            foreach (var user in allUsers)
            {
                var userRole = allUserRoles.FirstOrDefault(u => u.UserId == user.Id);
                var roleName = allRoles.FirstOrDefault(r => r.Id == userRole!.RoleId);

                users.Add(new ManageUser
                {
                    UserId = user.Id,
                    Name = user.Fullname!,
                    Email = user.Email!,
                    Role = roleName!.Name!
                });
            }

            return users;
        }

        public async Task<GeneralResponse> UpdateUser(ManageUser user)
        {
            var getRole = (await SystemRoles()).FirstOrDefault(r => r.Name!.Equals(user.Role));
            var userRole = await appDbContext.UserRoles.FirstOrDefaultAsync(u => u.UserId == user.UserId);
            userRole!.RoleId = getRole!.Id;
            await appDbContext.SaveChangesAsync();
            return new GeneralResponse(true, "User role updated successfully");
        }

        public async Task<List<SystemRole>> GetRoles() => await SystemRoles();

        public async Task<GeneralResponse> DeleteUser(int id)
        {
            var user = await appDbContext.ApplicationUsers.FirstOrDefaultAsync(u => u.Id == id);
            appDbContext.ApplicationUsers.Remove(user!);
            await appDbContext.SaveChangesAsync();
            return new GeneralResponse(true, "User successfully deleted");
        }

        private async Task<List<SystemRole>> SystemRoles() => await appDbContext.SystemRoles.AsNoTracking().ToListAsync();
        private async Task<List<UserRole>> UserRoles() => await appDbContext.UserRoles.AsNoTracking().ToListAsync();
        private async Task<List<ApplicationUser>> GetApplicationUsers() => await appDbContext.ApplicationUsers.AsNoTracking().ToListAsync();
    }
}
