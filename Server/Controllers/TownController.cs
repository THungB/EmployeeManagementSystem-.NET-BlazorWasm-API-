using BaseLibrary.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServerLibrary.Repositories.Contract;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TownController(IGenericRepositoryInterface<Town> genericRepositoryInterface) : GenericController<Town>(genericRepositoryInterface)
    {
    }
}
