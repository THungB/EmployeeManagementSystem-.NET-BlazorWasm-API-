using BaseLibrary.DTOs;
using BaseLibrary.Entities;
using BaseLibrary.Responses;
using Microsoft.AspNetCore.Http;

namespace ServerLibrary.Repositories.Contract
{
    public interface IUserAccount
    {
        Task<GeneralResponse> CreateAsync(Register user);
        // SignIn and Refresh return LoginWithCookieResponse and accept HttpContext so implementations can set HttpOnly cookies
        Task<LoginWithCookieResponse> SignInAsync(Login user, HttpContext httpContext);
        Task<LoginWithCookieResponse> RefreshTokenAsync(HttpContext httpContext);
        Task<List<ManageUser>> GetUsers();
        Task<GeneralResponse> UpdateUser(ManageUser user);
        Task<List<SystemRole>> GetRoles();
        Task<GeneralResponse> DeleteUser(int id);
    }
}
