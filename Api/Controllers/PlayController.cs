using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlayController : ControllerBase
    {
        [HttpGet("get-players")]
        public IActionResult GetPlayers()
        {
            return Ok(new JsonResult(new { title = "Only authorized user", message = "only autorized users can Get Players" }));
        }
    }
}
