using System.Text.Json.Serialization;

namespace BaseLibrary.DTOs
{
    public class LoginWithCookieResponse
    {
        [JsonIgnore] // Don't include this in the JSON response
        public string? RefreshToken { get; set; }
        
        public string Token { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool Success { get; set; }
        // Backwards-compatibility: older client code expects a 'Flag' property
        // Map it to the same value as Success so both names work.
        public bool Flag { get => Success; set => Success = value; }
        public string[]? Roles { get; set; }
    }
}
