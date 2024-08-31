import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../Services/job.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../Model/User';
import { AuthorizeService } from '../Services/authorize.service';

@Component({
  selector: 'app-addjob',
  templateUrl: './addjob.component.html',
  styleUrls: ['./addjob.component.css']
})
export class AddjobComponent implements OnInit { 
  jobFormGroup:FormGroup;
  loggedInUser: User | null = null;
  constructor(private formBuilder: FormBuilder,private router:Router,private jobService:JobService,private toastr: ToastrService,private route: ActivatedRoute,private authorizeService:AuthorizeService) { 
    this.jobFormGroup=this.formBuilder.group({
      id:[0,Validators.required],
      rrid:['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      jobDescription:['',Validators.required],
      noOfPositions:['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      externalPositions:['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      selectedPositions:['',[Validators.required,Validators.pattern('^[0-9]+$')]],
      status:['',Validators.required],
      })
  }

  ngOnInit(): void {
    this.loggedInUser = this.authorizeService.getLoggedInUser();
    if(this.loggedInUser==null){
      this.router.navigate(['/login']); // Redirect to login if user ID is not available
    }
    }
  onBack(){
    this.router.navigate(["/home"]);
  }
  onSubmit()
  {
    this.jobFormGroup.markAllAsTouched();
      if(this.jobFormGroup.valid)
        {
        let payload={
          id:this.jobFormGroup.get('id')?.value,
          rrid:this.jobFormGroup.get('rrid')?.value,
          jobDescription:this.jobFormGroup.get('jobDescription')?.value,
          noOfPositions:this.jobFormGroup.get('noOfPositions')?.value,
          selectedPositions:this.jobFormGroup.get('selectedPositions')?.value,
          status:this.jobFormGroup.get('status')?.value,
          externalPositions:this.jobFormGroup.get('externalPositions')?.value,
          userId:this.loggedInUser?.userId
        }
        console.log(payload)
        this.jobService.addJob(payload).subscribe({
            next: (res)=>  {console.log(res.message),
            this.router.navigate(['/home']);;
           },
          error:(res) => {console.log(res.error.message),
            this.toastr.error(res.error.message, '', {
              positionClass: 'toast-top-right', // Set toastr position
              timeOut: 2000, // Set toastr duration in milliseconds (2 seconds)
              progressBar: true // Show/hide progress bar
            });
          }
        })
      }
  }
}
