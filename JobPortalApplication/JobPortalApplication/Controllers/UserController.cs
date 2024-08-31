
using JobPortalApplication.Models;
using JobPortalApplication.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JobPortalApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly JobDbContext _jobDbContext;
        private string securityKey;
        public UserController(JobDbContext jobDbContext)
        {
            this._jobDbContext = jobDbContext;
            this.securityKey = "this is My Web application Secuirty Key";
        }
        [HttpPost]
        [Route("LoginUser")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            var user= await _jobDbContext.Users.FirstOrDefaultAsync(u=> u.Email==loginDto.Email &&
            u.Password == loginDto.Password );
            if (user == null) 
            {
                return BadRequest(new { message = "Invalid Email or Password" });
            }
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            //createsymetirc security key
            var key = Encoding.ASCII.GetBytes(securityKey);
            //create claims object
            var identity = new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, Convert.ToString(user.UserId)),
                    new Claim(ClaimTypes.Name,user.Name),
                    new Claim(ClaimTypes.MobilePhone,user.ContactNumber),
                    new Claim(ClaimTypes.Email,user.Email),
                    new Claim(ClaimTypes.Role,user.UserRole)
            }); ;
            //create signingcredentials object with security key and algo
            //passing security key to generate secret-code using algo & security key
            var credential = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            //create tokendiscriptor object with claims,expiration,signingcreditials
            var tokenDiscriptor = new SecurityTokenDescriptor
            {
                Issuer= "https://localhost:44357",
                Audience= "http://localhost:4200",
                Subject = identity,//claims
                Expires = DateTime.Now.AddMinutes(30),//expiration time
                SigningCredentials = credential,//secret code

            };
            var token = jwtTokenHandler.CreateToken(tokenDiscriptor);
            LoginResponseDto response = new LoginResponseDto()
            {
                Token = jwtTokenHandler.WriteToken(token),
                User = user
            };
            return Ok(response);

        }
        [HttpPost]
        [Route("RegisterUser")]
        public async Task<IActionResult> SignUp([FromBody] RegisterDto RegisterUser)
        {
            var ExistingUser= _jobDbContext.Users.FirstOrDefault(u=>u.Email==RegisterUser.Email);
            if (ExistingUser == null)
            {
                User user= new User()
                {
                    UserId = RegisterUser.UserId,
                    Name = RegisterUser.Name,
                    Email = RegisterUser.Email,
                    Password=RegisterUser.Password,
                    ContactNumber = RegisterUser.ContactNumber,
                    UserRole="User"
                };
               await  _jobDbContext.Users.AddAsync(user);
               await _jobDbContext.SaveChangesAsync();
               return Ok(new { message = "User Registerd Successfully" });
            }
            return BadRequest(new { message = "User Alredy Exists" });
        }
        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users=await _jobDbContext.Users.ToListAsync();
            return Ok(users);
        }
        
        
    }
}
