import { Component, OnInit } from '@angular/core';
import { JobService } from '../Services/job.service';
import { Job } from '../Model/Job';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { AuthorizeService } from '../Services/authorize.service';
import { User } from '../Model/User';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfileService } from '../Services/profile.service';
import { Profile } from '../Model/Profile';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  jobs: Job[]=[];
  jobEditFormGroup:FormGroup;
  loggedInUser: User | null = null;
  userName:string='';
  filteredJobs: Job[] = [];
  profiles:Profile[]=[];
  flag:number=0;
  constructor(private jobService: JobService,private router:Router,private formBuilder:FormBuilder,private toastr:ToastrService,private route: ActivatedRoute,private authorizeService:AuthorizeService,private profileService:ProfileService) {
    this.jobEditFormGroup=this.formBuilder.group({
      id:[0,Validators.required],//formcontroll
      rrid:['',Validators.required],
      jobDescription:['',Validators.required],
      noOfPositions:['',Validators.required],
      selectedPositions:['',Validators.required],
      status:['',Validators.required],
      externalPositions:['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      })
   }
  ngOnInit(): void {
    
    this.loggedInUser = this.authorizeService.getLoggedInUser();
    if(this.loggedInUser==null){
      this.router.navigate(['/login']); // Redirect to login if user ID is not available
    }
    this.getAllJobsAndProfiles() //fetching all jobs and profiles
   
  }
   
  getAppliedStatusByJobId(jobId:number):number{ 
      this.flag=0;
      this.profiles.forEach((profile)=>{
        console.log('profileuserid: '+profile.userId)
        console.log('loginuserid: '+this.loggedInUser?.userId)
        if(profile.jobId==jobId && profile.userId==this.loggedInUser?.userId){
                this.flag=1;
        } 
      }
      )
      return this.flag;
  }
  
    getAllJobsAndProfiles() {
      if (this.loggedInUser) {
        this.userName = this.loggedInUser.name;
    
        if (this.loggedInUser.role === 'Admin') {
          // If user is an Admin, fetch jobs created by the user
          this.jobService.getAllJobsByUserId(this.loggedInUser.userId).subscribe({
            next: (res) => {
              this.jobs = res;
              this.filteredJobs = res;
            },
            error: (error) => console.log(error),
          });
        } else if (this.loggedInUser.role === 'User') {
          // If user is a regular User, fetch all profiles and jobs
          Promise.all([
            lastValueFrom(this.profileService.getAllProfiles()), // Convert observable to promise
            lastValueFrom(this.jobService.getAllJobs()), // Convert observable to promise
            ])
            .then(([profiles, jobs]) => {
              this.profiles = profiles; // Assign profiles response to profiles array
              this.jobs = jobs; // Assign jobs response to jobs array
              this.filteredJobs = jobs; // Assign jobs response to filteredJobs array
              
              // Set applied status for each job
              this.filteredJobs.forEach((job) => {
                if (this.getAppliedStatusByJobId(job.id) == 1) {
                  job.appliedStatus = 'Applied'; // Mark job as applied if conditions are met
                }
                else
                  job.appliedStatus="Not Applied"
              });
              console.log(this.filteredJobs);
            })
            .catch((error) => console.log(error)); // Handle errors
        }
      }
    }
    
    onAddJob(){
    this.router.navigate(["/addjob"]);
  }
  AddProfile(jobId:number,jobRRID:string){
    this.router.navigate(['/addprofiles',jobId,this.loggedInUser?.userId],{ 
      queryParams: { rrid: jobRRID }} ); 
  }
  onUpdate(job: Job)
  {
    this.jobEditFormGroup.setValue({
         id:job.id,
         rrid:job.rrid,
         jobDescription:job.jobDescription,
         noOfPositions:job.noOfPositions,
         selectedPositions:job.selectedPositions,
         status:job.status,
         externalPositions:job.externalPositions
        })
  }
 onSubmit()
  {
    this.jobEditFormGroup.markAllAsTouched();
      if(this.jobEditFormGroup.valid)
      {
        let payload={
          id:this.jobEditFormGroup.get('id')?.value,
          rrid:this.jobEditFormGroup.get('rrid')?.value,
          jobDescription:this.jobEditFormGroup.get('jobDescription')?.value,
          noOfPositions:this.jobEditFormGroup.get('noOfPositions')?.value,
          selectedPositions:this.jobEditFormGroup.get('selectedPositions')?.value,
          externalPositions:this.jobEditFormGroup.get('externalPositions')?.value,
          status:this.jobEditFormGroup.get('status')?.value,
          userId:this.loggedInUser?.userId
        }
        this.jobService.updateJob(payload).subscribe(
          {
            next: (res)=>{
              console.log(res.message);
              this.getAllJobsAndProfiles()
           },
            error:(res) => console.log(res.error.message)
           
          })
        
      }
  }
  onDelete(id:number)
  {
    if (confirm("Are you sure you want to delete this job?"))
    {
    this.jobService.deleteJob(id).subscribe({
      next:(res)=>{console.log(res.message);
        this.getAllJobsAndProfiles()
      },
      error:(res)=>console.log(res.error.message)
    })
   }
  }
  onSearch(inputText:string){
    const searchText=inputText.toLowerCase();
    this.filteredJobs = this.jobs.filter(job => job.jobDescription.toLowerCase().includes(searchText));
   }
  onLogOut(){
    localStorage.removeItem('jwt');
    this.router.navigate(["/login"]);
  }
  checkAdmin():boolean{
    if(this.loggedInUser?.role=="Admin"){
      return true;
    }
    return false;
  }
}
