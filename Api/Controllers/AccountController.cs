using Api.DTOs.Account;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jwtService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountController(JWTService jwtService, 
            SignInManager<User> signInManager, 
            UserManager<User> userManager)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            
            return createApplicationUserDto(user);
        }


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            //email no encontrado
            if(user == null) return Unauthorized("Invalid user o password");
            //usuario no confirma email
            if(user.EmailConfirmed == false) return Unauthorized("Email not confirmed");
            // result es el resultado de la autenticacion envia usuario encontrado y password
            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            //valida si el password es correcto
            if(!result.Succeeded) return Unauthorized("Invalid user o password");

            return createApplicationUserDto(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto model)
        {
            if (await CheckEmailExistsAsync(model.Email))
            {
                return BadRequest($"Email {model.Email} already exists, try with another one");
            }

            var userToAdd = new User
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                UserName = model.Email.ToLower(),
                Email = model.Email.ToLower(),
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new JsonResult(new {title = "Registration Successful", message = "Your account has been created successfully" }));
        }

        #region Private Helper Methods
        private UserDto createApplicationUserDto(User user)
        {
            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                JWT = _jwtService.CreateJWT(user)
            };
        }

        private async Task<bool> CheckEmailExistsAsync(string email)
        {
           return await _userManager.Users.AnyAsync(u => u.Email == email.ToLower());
        }
        

        #endregion

    }
}
