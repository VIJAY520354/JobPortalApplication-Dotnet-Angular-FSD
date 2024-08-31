using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JobPortalApplication.Models
{
    public class Job
    {

        [Key]
        public int ID { get; set; }
        public string RRID { get; set; }
        public string JobDescription { get; set; }
        public int NoOfPositions { get; set; } //internal
        public int ExternalPositions { get; set; } //external
        public int SelectedPositions { get; set; } //closed Positions
        public string Status { get; set; }
        
        
        [JsonIgnore]
        public ICollection<Profile>? Profiles { get; set; }
        //foriegn Key
        public int? UserId { get; set; }
        [JsonIgnore]
        public User? User { get; set; }

    }
}
