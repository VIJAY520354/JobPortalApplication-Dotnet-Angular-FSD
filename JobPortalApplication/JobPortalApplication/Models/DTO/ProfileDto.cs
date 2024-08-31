using System.ComponentModel.DataAnnotations;

namespace JobPortalApplication.Models.DTO
{
    public class ProfileDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Status { get; set; }
        
        public string? ResumePath { get;set; }
        public string Remarks { get; set; }
        public string Skills {  get; set; }
        public string JobType { get; set; }
        [Required]
        public int JobId { get; set; }
        [Required]
        public int UserId { get;set; }
    }
}
