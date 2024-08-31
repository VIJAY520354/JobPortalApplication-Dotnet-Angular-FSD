using JobPortalApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace JobPortalApplication.Controllers
{
  
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly JobDbContext _jobDbContext;
        public JobController(JobDbContext jobDbContext)
        {
            this._jobDbContext = jobDbContext;
        }
        [HttpGet]
        [Route("GetAllJobs")]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _jobDbContext.Jobs.ToListAsync();
            return Ok(jobs);
        }
        [HttpGet]
        [Route("GetAllJobsByUserId/{Id}")]
        public async Task<IActionResult> GetAllJobsByUserId([FromRoute] int Id)
        {
            var Jobs= await _jobDbContext.Jobs.Where(j => j.UserId == Id).ToListAsync();
            return Ok(Jobs);
            
        }
        [HttpPost]
        [Route("AddJobs")]
        public async Task<IActionResult> AddJobs([FromBody] Job job)
        {
            if (job == null)
            {
                return BadRequest(new { message = "Invalid Job Data" });
            }
            // Check if rrid is unique
            var existingJob = await _jobDbContext.Jobs.FirstOrDefaultAsync(j => j.RRID == job.RRID);
            if (existingJob != null)
            {
                return BadRequest(new { message = "RRID must be unique" });
            }
            await _jobDbContext.Jobs.AddAsync(job);
            await _jobDbContext.SaveChangesAsync();
            return Ok(new { message = "Job Added successfully" });
        }
        [HttpPut]
        [Authorize(Roles = "Admin")]
        [Route("UpdateJobs")]
        public async Task<IActionResult> UpdateJobs([FromBody] Job job)
        {
            var ExistingJob = await _jobDbContext.Jobs.FirstOrDefaultAsync(x => x.ID == job.ID);
            if (ExistingJob == null)
            {
                return NotFound(new { message = "Job Not Found" });
            }
            
            ExistingJob.Profiles = job.Profiles;
            ExistingJob.NoOfPositions = job.NoOfPositions;
            ExistingJob.Status = job.Status;
            ExistingJob.JobDescription = job.JobDescription;
            ExistingJob.SelectedPositions = job.SelectedPositions;
            ExistingJob.ExternalPositions = job.ExternalPositions;
            await _jobDbContext.SaveChangesAsync();
            return Ok(new { message = "Job Updated successfully" });
        }
        [HttpDelete]
        [Authorize(Roles = "Admin")]
        [Route("DeleteJobs/{Id}")]
        public async Task<IActionResult> DelteJobs([FromRoute] int Id)
        {
            var ExistingJob = await _jobDbContext.Jobs.FindAsync(Id);
            if (ExistingJob != null)
            {
                _jobDbContext.Jobs.Remove(ExistingJob);
                await _jobDbContext.SaveChangesAsync();
                return Ok(new { message = "Job Deleted successfully" });
            }
            return NotFound(new { message = "Job Not Found" });

        }
    }


}
