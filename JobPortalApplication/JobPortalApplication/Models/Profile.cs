using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JobPortalApplication.Models
{
    public class Profile
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string FilePath { get; set; }
        public string Skills {  get; set; }
        public string Remarks { get; set; }
        public string JobType { get; set; }
        public int JobId { get; set; }
        
        public Job Job { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }

    }
}
