using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class DefaultController : ControllerBase
    {
        [HttpGet("/")]
        public string Index()
        {
            return "Api running...";
        }
    }
}
