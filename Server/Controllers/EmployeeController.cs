using BaseLibrary.Entities;
using Microsoft.AspNetCore.Mvc;
using ServerLibrary.Repositories.Contract;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController(IGenericRepositoryInterface<Employee> genericRepositoryInterface) : GenericController<Employee>(genericRepositoryInterface)
    {
    }
}
