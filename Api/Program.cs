using Api.Data;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<Context>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// injecta JWT services class dentro de los controllers
builder.Services.AddScoped<JWTService>();

//se define el servicios de autenticacion
builder.Services.AddIdentityCore<User>(options =>
{
    // password options
    options.Password.RequiredLength = 6;
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    
    // email options
    options.SignIn.RequireConfirmedEmail = true;
})
    .AddRoles<IdentityRole>() //roles
    .AddRoleManager<RoleManager<IdentityRole>>() // able identity roleManager
    .AddEntityFrameworkStores<Context>() // provide context
    .AddSignInManager<SignInManager<User>>() // make use of signin manager
    .AddUserManager<UserManager<User>>() // make use of user manager to create users
    .AddDefaultTokenProviders(); // token to email confirmation

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            //valida el token basado en los parametros dentro appsettings
            ValidateIssuerSigningKey = true,
            // se usa para encriptar y descencriptar jwt token
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
            // valida el hostname del issuer
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            // validacion issuer es activa?
            ValidateIssuer = true,
            // validacion audience es activa?
            ValidateAudience = false
        };
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//añade la authenticacion en el pipeline de la aplicación y debe ir antes de la autorizacion => autenticacion luego autorizacion
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
