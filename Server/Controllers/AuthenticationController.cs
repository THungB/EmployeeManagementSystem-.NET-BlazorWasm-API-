using BaseLibrary.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServerLibrary.Repositories.Contract;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthenticationController(IUserAccount accountInterface) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register user)
        {
            if (user == null) return BadRequest("User data is null.");
            var result = await accountInterface.CreateAsync(user);
            return Ok(result);
        }
        [HttpPost("login")]
        public async Task<IActionResult> SignInAsync(Login user)
        {
            if (user == null) return BadRequest("User data is null.");
            var result = await accountInterface.SignInAsync(user);
            return Ok(result);
        }
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshTokenAsync(RefreshToken token)
        {
            if (token == null) return BadRequest("Mofel is empty.");
            var result = await accountInterface.RefreshTokenAsync(token);
            return Ok(result);
        }
    }
}
