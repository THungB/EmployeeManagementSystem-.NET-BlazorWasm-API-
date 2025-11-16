using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ServerLibrary.Repositories.Contract;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication by default
    public class GenericController<T>(IGenericRepositoryInterface<T> genericRepositoryInterface) : ControllerBase where T : class
    {
        [HttpGet("all")]
        [AllowAnonymous] // allow public reads
        public async Task<IActionResult> GetAll() => Ok(await genericRepositoryInterface.GetAll());

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")] // restrict deletes to Admins
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0) return BadRequest("Invalid request sent");
            return Ok(await genericRepositoryInterface.DeleteById(id));
        }

        [HttpGet("single/{id}")]
        [AllowAnonymous] // allow public reads
        public async Task<IActionResult> GetById(int id)
        {
            if (id <= 0) return BadRequest("Invalid request sent");
            return Ok(await genericRepositoryInterface.GetById(id));
        }

        [HttpPost("add")]
        [Authorize(Roles = "Admin")] // restrict create to Admins
        public async Task<IActionResult> Add(T model)
        {
            if (model is null) return BadRequest("Invalid data sent");
            return Ok(await genericRepositoryInterface.Insert(model));
        }

        [HttpPut("update")]
        [Authorize(Roles = "Admin")] // restrict updates to Admins
        public async Task<IActionResult> Update(T model)
        {
            if (model is null) return BadRequest("Invalid data sent");
            return Ok(await genericRepositoryInterface.Update(model));
        }
    }
}
