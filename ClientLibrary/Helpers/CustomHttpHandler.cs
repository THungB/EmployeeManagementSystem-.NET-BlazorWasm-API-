using BaseLibrary.DTOs;
using ClientLibrary.Services.Contract;
using System.Net;

namespace ClientLibrary.Helpers
{
    public class CustomHttpHandler(GetHttpClient getHttpClient, LocalStorageService localStorageService, IUserAccountService accountService, ClientLibrary.Services.Implementations.AccessTokenProvider accessTokenProvider) : DelegatingHandler
    {
        protected async override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            bool loginUrl = request.RequestUri!.AbsoluteUri.Contains("login");
            bool registerUrl = request.RequestUri!.AbsoluteUri.Contains("register");
            bool refreshTokenUrl = request.RequestUri!.AbsoluteUri.Contains("refresh-token");

            if (loginUrl || registerUrl || refreshTokenUrl) return await base.SendAsync(request, cancellationToken);

            var result = await base.SendAsync(request, cancellationToken);

            if (result.StatusCode == HttpStatusCode.Unauthorized)
            {
                // Get token from in-memory provider
                var currentToken = await accessTokenProvider.GetTokenAsync();
                // If request has no Authorization header, and we have a token, attach it
                if (!request.Headers.Contains("Authorization") && !string.IsNullOrEmpty(currentToken))
                {
                    request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", currentToken);
                    return await base.SendAsync(request, cancellationToken);
                }

                // Attempt refresh using cookie-based refresh endpoint
                var newJwtToken = await GetReshToken();
                if (string.IsNullOrEmpty(newJwtToken)) return result;

                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", newJwtToken);
                return await base.SendAsync(request, cancellationToken);
            }
            return result;
        }

        private async Task<string> GetReshToken()
        {
            // Server expects refresh token in HttpOnly cookie; call refresh endpoint without body
            var result = await accountService.RefreshTokenAsync();
            if (result == null || !result.Success) return string.Empty;
            // store new access token in-memory
            await accessTokenProvider.SetTokenAsync(result.Token);
            return result.Token;
        }
    }
}
