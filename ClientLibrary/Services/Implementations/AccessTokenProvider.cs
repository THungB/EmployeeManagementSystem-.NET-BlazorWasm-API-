using System.Threading.Tasks;

namespace ClientLibrary.Services.Implementations
{
    // Simple in-memory access token holder (scoped)
    public class AccessTokenProvider
    {
        private string? _token;

        public Task SetTokenAsync(string? token)
        {
            _token = token;
            return Task.CompletedTask;
        }

        public Task<string?> GetTokenAsync()
        {
            return Task.FromResult(_token);
        }

        public Task RemoveTokenAsync()
        {
            _token = null;
            return Task.CompletedTask;
        }
    }
}
