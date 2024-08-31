using JobPortalApplication.Models;
using JobPortalApplication.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace JobPortalApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly JobDbContext _jobDbContext;
        private readonly string? _uploadPath;

        public ProfileController(JobDbContext jobDbContext, IConfiguration configuration)
        {
            this._jobDbContext = jobDbContext;
            _uploadPath = configuration.GetSection("UploadSettings:UploadPath").Value;

        }
        [HttpGet]
        [Route("GetAllProfiles")]
        public IActionResult GetAllProfiles()
        {
            var profiles =  _jobDbContext.Profiles.ToList();
            return Ok(profiles);
        }
        [HttpGet]
        [Route("GetAllProfilesByUserId/{Id}")]
        public async Task<IActionResult> GetAllProfilesByUserId([FromRoute] int Id)
        {
            var profiles = await _jobDbContext.Profiles.Where(p => p.UserId == Id).ToListAsync();
            return Ok(profiles);
        }
        [HttpGet]
        [Route("GetAllProfilesByJobId/{JobId}")]
        public async Task<IActionResult> GetAllProfilesById([FromRoute]int JobId)
        {
            var profiles = await _jobDbContext.Profiles.Where(j => j.JobId == JobId).ToListAsync();

            if (profiles == null || profiles.Count == 0)
            {
                return Ok(profiles);
            }

            return Ok(profiles);
        }
        [HttpPost]
        [Route("AddProfiles")]
        public async Task<IActionResult> AddProfiles([FromBody] ProfileDto profileDto)
        {
            if (profileDto==null)
            {
                return BadRequest(new { message = "Invalid Profile Data" });
            }
            else
            {
                Job? job = await _jobDbContext.Jobs.FirstOrDefaultAsync(j => j.ID == profileDto.JobId);
                if ((profileDto.Status == "Selected" && (job.NoOfPositions > 0 || job.ExternalPositions>0)) || (profileDto.Status == "NotSelected" && (job.NoOfPositions > 0 || job.ExternalPositions > 0)) || (profileDto.Status == "In Progress" && (job.NoOfPositions > 0 || job.ExternalPositions > 0 && job.ExternalPositions!=0 )))
                {
                    if ((job.NoOfPositions > 0 && profileDto.JobType == "Internal") || (job.ExternalPositions > 0 && profileDto.JobType == "External"))
                    {
                        var profile = new Profile
                        {
                            Id = profileDto.Id,
                            Name = profileDto.Name,
                            Status = profileDto.Status,
                            JobId = profileDto.JobId,
                            FilePath = profileDto.ResumePath,
                            Skills = profileDto.Skills,
                            UserId = profileDto.UserId,
                            Remarks = profileDto.Remarks,
                            JobType = profileDto.JobType
                        };

                        await _jobDbContext.Profiles.AddAsync(profile);
                        await _jobDbContext.SaveChangesAsync();
                        return Ok(new { message = "Profile Added successfully" });
                    }
                }
                return BadRequest(new { message = "Invalid Profile Data or No.of Open postions are zero" });
            }
        }
        [HttpPut]
        [Route("UpdateProfiles")]
        public async Task<IActionResult> UpdateProfiles([FromBody] ProfileDto profileDto)
        {
            var existingProfile = await _jobDbContext.Profiles.FirstOrDefaultAsync(x => x.Id == profileDto.Id);
            if (existingProfile == null)
            {
                return BadRequest(new { message = "Invalid Profile Data" });
            }
            else
            {
                Job? job = await _jobDbContext.Jobs.FirstOrDefaultAsync(j => j.ID == profileDto.JobId);
                if ((profileDto.Status == "Selected"  ) || (profileDto.Status == "NotSelected") || (profileDto.Status == "In Progress" ))
                {
                    if (profileDto.Status == "Selected")
                    {
                        if (profileDto.JobType == "Internal" && job.NoOfPositions > 0) { //profile selected and internal
                            job.SelectedPositions += 1; 
                            job.NoOfPositions -= 1;
                        }
                        else if(job.ExternalPositions > 0) //external and selected
                        {
                            job.SelectedPositions += 1;
                            job.ExternalPositions -= 1;
                            
                        }
                    }
                    else if (profileDto.Status == "NotSelected" && job.SelectedPositions>0 && existingProfile.Status=="Selected"  )
                    {
                        if (profileDto.JobType == "Internal" && job.NoOfPositions >= 0) //internal not selected && internal
                        {
                            job.SelectedPositions -= 1; //closed-1
                            job.NoOfPositions += 1; //internal +1
                        }
                        else if(job.ExternalPositions >= 0) //external not selected
                        {
                            job.SelectedPositions -= 1; //close-1
                            job.ExternalPositions += 1; //external+1
                            
                        }
                    }
                    existingProfile.Name = profileDto.Name;
                    existingProfile.Status = profileDto.Status;
                    existingProfile.Remarks = profileDto.Remarks;
                    await _jobDbContext.SaveChangesAsync();
                    return Ok(new { message = "Profile Updated successfully" });
                }
                return BadRequest(new { message = "Invalid Profile Data or No of postions zero" });
            }
        }
        [HttpDelete]
        [Route("DeleteProfiles/{Id}")]
        public async Task<IActionResult> DeleteProfiles([FromRoute] int Id)
        {
            Profile? existingProfile = await _jobDbContext.Profiles.FindAsync(Id);
            if (existingProfile != null)
            {
                Job? job = await _jobDbContext.Jobs.FirstOrDefaultAsync(j => j.ID == existingProfile.JobId);
                if (existingProfile.Status == "Selected" && job.SelectedPositions>0 && existingProfile.JobType=="Internal")
                {
                    job.NoOfPositions += 1;
                    job.SelectedPositions -= 1;
                }
                else if (existingProfile.Status == "Selected" && job.SelectedPositions > 0 && existingProfile.JobType == "External")
                {
                    job.ExternalPositions += 1;
                    job.SelectedPositions -= 1;
                }
                // Delete associated file if it exists
                string FilePath = existingProfile.FilePath; //Fetching File Path
                if (!string.IsNullOrEmpty(existingProfile.FilePath))
                {
                    if (System.IO.File.Exists(FilePath)) // Check if the file exists at the specified path
                    {
                        System.IO.File.Delete(FilePath);  // Delete the file from the server
                    }
                }
                _jobDbContext.Profiles.Remove(existingProfile);
                await _jobDbContext.SaveChangesAsync();
                return Ok(new { message = "Profile Deleted successfully" });
                
            }
            return NotFound(new { message = "Profile Not Found" });
        }
        [HttpPost]
        [Route("UploadFile/{rrid}/{name}")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile resume, [FromRoute] string rrid, [FromRoute] string Name)
        {
            if (resume == null || resume.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded" });
            }

            // Ensure the main uploads folder exists
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }

            // Create the directory for the rrid if it doesn't exist
            var rridFolder = Path.Combine(_uploadPath, rrid);
            if (!Directory.Exists(rridFolder))
            {
                Directory.CreateDirectory(rridFolder);
            }
            // Extract the file extension from the uploaded file
            var FileExtension = Path.GetExtension(resume.FileName);

            // Create the new filename with the username and the original file extension
            var FileName = Name+FileExtension;

            // Combine the directory path with the new file name to get the full file path
            var filePath = Path.Combine(rridFolder, FileName);

            // Save the file to the specified path
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await resume.CopyToAsync(stream);
            }

            return Ok(new { message=filePath });
        }
        [HttpPost("DownloadFile")]
        public IActionResult DownloadFile([FromBody] string DownloadFilePath)
        {
            if (string.IsNullOrEmpty(DownloadFilePath))
            {
                return BadRequest(new { message = "File path is required" });
            }

            // Decode the received file path (if needed)
            var decodedFilePath = WebUtility.UrlDecode(DownloadFilePath);

            // Check if the file exists
            if (!System.IO.File.Exists(decodedFilePath))
            {
                return NotFound(new { message = "File not found" });
            }

            // Read the file bytes
            var fileBytes = System.IO.File.ReadAllBytes(decodedFilePath);
            var fileName = Path.GetFileName(decodedFilePath);

            // Return the file as a FileResult
            return File(fileBytes, "application/octet-stream", fileName);
        }

    }
}
