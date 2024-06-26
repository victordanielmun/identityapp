using System.ComponentModel.DataAnnotations;

namespace Api.DTOs.Account
{
    public class RegisterDto
    {
        [Required]
        [StringLength(50, MinimumLength = 3 , ErrorMessage = "First Name must be between {2} and {1} characters")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 3 , ErrorMessage = "Last Name must be between {2} and {1} characters")]
        public string LastName { get; set; }
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 6 , ErrorMessage = "Password must be between {2} and {1} characters")]
        public string Password { get; set; }
    }
}
