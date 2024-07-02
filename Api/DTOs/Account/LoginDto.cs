using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Account
{
    public class LoginDto
    {
        [Required(ErrorMessage = "User email is required")]
        public string  UserName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
