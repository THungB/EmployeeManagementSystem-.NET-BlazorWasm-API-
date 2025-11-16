using BaseLibrary.DTOs;
using BaseLibrary.Entities;
using BaseLibrary.Responses;
using ClientLibrary.Helpers;
using ClientLibrary.Services.Contract;
using Microsoft.JSInterop;
using System.Net.Http.Json;
using System.Net.Http.Headers;

namespace ClientLibrary.Services.Implementations
{
    public class UserAccountService : IUserAccountService
    {
        private const string AuthUrl = "api/authentication";
        private readonly GetHttpClient _getHttpClient;
        private readonly IJSRuntime _jsRuntime;
        private const string TokenKey = "authToken";
        private const string RolesKey = "userRoles";

        public UserAccountService(GetHttpClient getHttpClient, IJSRuntime jsRuntime)
        {
            _getHttpClient = getHttpClient;
            _jsRuntime = jsRuntime;
        }

        public async Task<GeneralResponse> CreateAsync(Register user)
        {
            var httpClient = _getHttpClient.GetPublicHttpClient();
            var result = await httpClient.PostAsJsonAsync($"{AuthUrl}/register", user);
            if (!result.IsSuccessStatusCode) 
                return new GeneralResponse(false, "Error occurred during registration");

            return await result.Content.ReadFromJsonAsync<GeneralResponse>() 
                ?? new GeneralResponse(false, "Failed to process registration response");
        }

        public async Task<LoginWithCookieResponse> SignInAsync(Login user)
        {
            var httpClient = _getHttpClient.GetPublicHttpClient();
            var result = await httpClient.PostAsJsonAsync($"{AuthUrl}/login", user);
            
            if (!result.IsSuccessStatusCode)
            {
                return new LoginWithCookieResponse 
                { 
                    Success = false, 
                    Message = result.StatusCode == System.Net.HttpStatusCode.Unauthorized 
                        ? "Invalid username or password" 
                        : "An error occurred during login" 
                };
            }

            var response = await result.Content.ReadFromJsonAsync<LoginWithCookieResponse>();
            if (response == null)
                return new LoginWithCookieResponse { Success = false, Message = "Invalid server response" };

            if (response.Success && !string.IsNullOrEmpty(response.Token))
            {
                // Store the access token in memory
                await _jsRuntime.InvokeVoidAsync("localStorage.setItem", TokenKey, response.Token);
                
                // Store user roles if available
                if (response.Roles != null && response.Roles.Any())
                {
                    await _jsRuntime.InvokeVoidAsync("localStorage.setItem", 
                        RolesKey, 
                        System.Text.Json.JsonSerializer.Serialize(response.Roles));
                }
            }

            return response;
        }

        public async Task<LoginWithCookieResponse> RefreshTokenAsync()
        {
            var httpClient = _getHttpClient.GetPublicHttpClient();
            
            try
            {
                // The refresh token is automatically sent via HTTP-only cookie
                var result = await httpClient.PostAsync($"{AuthUrl}/refresh-token", null);
                
                if (!result.IsSuccessStatusCode)
                {
                    return new LoginWithCookieResponse 
                    { 
                        Success = false, 
                        Message = "Failed to refresh token" 
                    };
                }

                var response = await result.Content.ReadFromJsonAsync<LoginWithCookieResponse>();
                if (response == null)
                    return new LoginWithCookieResponse { Success = false, Message = "Invalid refresh token response" };

                if (response.Success && !string.IsNullOrEmpty(response.Token))
                {
                    // Update the stored access token
                    await _jsRuntime.InvokeVoidAsync("localStorage.setItem", TokenKey, response.Token);
                }

                return response;
            }
            catch (Exception ex)
            {
                return new LoginWithCookieResponse 
                { 
                    Success = false, 
                    Message = $"Token refresh failed: {ex.Message}" 
                };
            }
        }

        public async Task<bool> SignOutAsync()
        {
            try
            {
                // Clear the stored access token and roles
                await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", TokenKey);
                await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", RolesKey);
                
                // The refresh token cookie will be cleared by the server
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<ManageUser>> GetUsers()
        {
            var httpClient = await _getHttpClient.GetPrivateHttpClient();
            var result = await httpClient.GetFromJsonAsync<List<ManageUser>>($"{AuthUrl}/users");
            return result ?? new List<ManageUser>();
        }

        public async Task<GeneralResponse> UpdateUser(ManageUser user)
        {
            var httpClient = await _getHttpClient.GetPrivateHttpClient();
            var result = await httpClient.PutAsJsonAsync($"{AuthUrl}/update-user", user);
            
            if (!result.IsSuccessStatusCode)
            {
                return new GeneralResponse(false, "Error updating user");
            }
            
            return await result.Content.ReadFromJsonAsync<GeneralResponse>() 
                ?? new GeneralResponse(false, "Failed to process update response");
        }

        public async Task<List<SystemRole>> GetRoles()
        {
            var httpClient = await _getHttpClient.GetPrivateHttpClient();
            var result = await httpClient.GetFromJsonAsync<List<SystemRole>>($"{AuthUrl}/roles");
            return result ?? new List<SystemRole>();
        }

        public async Task<GeneralResponse> DeleteUser(int id)
        {
            var httpClient = await _getHttpClient.GetPrivateHttpClient();
            var result = await httpClient.DeleteAsync($"{AuthUrl}/delete-user/{id}");
            
            if (!result.IsSuccessStatusCode)
            {
                return new GeneralResponse(false, "Error deleting user");
            }
            
            return await result.Content.ReadFromJsonAsync<GeneralResponse>() 
                ?? new GeneralResponse(false, "Failed to process delete response");
        }
    }
}
