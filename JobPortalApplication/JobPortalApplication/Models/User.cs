using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JobPortalApplication.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserRole { get; set; }
        public string ContactNumber {  get; set; }
        [JsonIgnore]
        public ICollection<Job>? Jobs { get; set; }
        [JsonIgnore]
        public ICollection<Profile>? Profiles { get; set; }



    }
}
