using BaseLibrary.DTOs;
using Microsoft.AspNetCore.Components.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ClientLibrary.Services.Implementations;

namespace ClientLibrary.Helpers
{
    public class CustomAuthenticationStateProvider(LocalStorageService localStorageService, AccessTokenProvider accessTokenProvider) : AuthenticationStateProvider
    {
        private readonly ClaimsPrincipal anoymous = new(new ClaimsIdentity());
        public override async Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            // Read access token from in-memory provider
            var token = await accessTokenProvider.GetTokenAsync();
            if (string.IsNullOrWhiteSpace(token)) return await Task.FromResult(new AuthenticationState(anoymous));

            var getUserClaims = DecryptToken(token);
            if (getUserClaims == null) return await Task.FromResult(new AuthenticationState(anoymous));

            var claimsPrincipal = SetClaimPrincipal(getUserClaims);
            return await Task.FromResult(new AuthenticationState(claimsPrincipal));
        }

        public async Task UpdateAuthenticationState(UserSession userSession)
        {
            var claimsPrincipal = new ClaimsPrincipal();
            if (!string.IsNullOrEmpty(userSession.Token))
            {
                // Store only access token in-memory. Refresh token is stored server-side in HttpOnly cookie.
                await accessTokenProvider.SetTokenAsync(userSession.Token);
                var getUserClaims = DecryptToken(userSession.Token!);
                claimsPrincipal = SetClaimPrincipal(getUserClaims);
            }
            else
            {
                await accessTokenProvider.RemoveTokenAsync();
            }
            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(claimsPrincipal)));
        }

        public static ClaimsPrincipal SetClaimPrincipal(CustomUserClaims claims)
        {
            if (claims.Email is null) return new ClaimsPrincipal();
            return new ClaimsPrincipal(new ClaimsIdentity(
                new List<Claim>
                {
            new(ClaimTypes.NameIdentifier, claims.Id!),
            new(ClaimTypes.Name, claims.Name!),
            new(ClaimTypes.Email, claims.Email!),
            new(ClaimTypes.Role, claims.Role!)
                }, "JwtAuth"));
        }

        private static CustomUserClaims DecryptToken(string jwtToken)
        {
            if (string.IsNullOrEmpty(jwtToken)) return new CustomUserClaims();

            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwtToken);
            var userId = token.Claims.FirstOrDefault(_ => _.Type == ClaimTypes.NameIdentifier);
            var name = token.Claims.FirstOrDefault(_ => _.Type == ClaimTypes.Name);
            var email = token.Claims.FirstOrDefault(_ => _.Type == ClaimTypes.Email);
            var role = token.Claims.FirstOrDefault(_ => _.Type == ClaimTypes.Role);
            return new CustomUserClaims(userId!.Value!, name!.Value!, email!.Value!, role!.Value!);
        }
    }
}
