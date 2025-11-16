using BaseLibrary.DTOs;
using BaseLibrary.Entities;
using BaseLibrary.Responses;

namespace ClientLibrary.Services.Contract
{
    public interface IUserAccountService
    {
        Task<GeneralResponse> CreateAsync(Register user);
        Task<LoginWithCookieResponse> SignInAsync(Login user);
        Task<LoginWithCookieResponse> RefreshTokenAsync();
        Task<bool> SignOutAsync();
        Task<List<ManageUser>> GetUsers();
        Task<GeneralResponse> UpdateUser(ManageUser user);
        Task<GeneralResponse> DeleteUser(int id);
        Task<List<SystemRole>> GetRoles();
    }
}
