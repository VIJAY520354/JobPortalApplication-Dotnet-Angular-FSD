import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../Services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthorizeService } from '../Services/authorize.service';
import { User } from '../Model/User';

@Component({
  selector: 'app-addprofile',
  templateUrl: './addprofile.component.html',
  styleUrls: ['./addprofile.component.css']
})
export class AddprofileComponent implements OnInit {
  profileFormGroup:FormGroup;
  jobId: number = 0; // Correct initialization
  jd: string | null = null; // Route parameter
  rrid: string | null = null; // Query string parameter
  loggedInUser: User | null = null;
  selectedFile: File | null = null;
  

  constructor(private formBuilder: FormBuilder,private router:Router,private profileService:ProfileService,private route:ActivatedRoute,private toastr: ToastrService,private authorizeService:AuthorizeService) { 
    this.profileFormGroup=this.formBuilder.group({
      id:[0,Validators.required],
      name:['',[Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      skills:['',Validators.required],
      jobType:['',Validators.required]
     })
  }
  
  ngOnInit(): void {
    this.loggedInUser = this.authorizeService.getLoggedInUser();
    if(this.loggedInUser==null){
      this.router.navigate(['/login']); // Redirect to login if user ID is not available
    }
    this.route.paramMap.subscribe(params => {
      this.jobId = params.has('id') ? Number(params.get('id')) : 0; //  way to fetch route parameter
      this.jd = params.get('jd');
      this.rrid = this.route.snapshot.queryParamMap.has('rrid') ? this.route.snapshot.queryParamMap.get('rrid') : null; //  way to fetch query parameter
      
    })
    // this.profileFormGroup.patchValue({
    //   name:this.loggedInUser?.name
    // })
  }
  
  onBack(){
    this.router.navigate(['/profiles',this.jobId,this.jd],{ 
      queryParams: { rrid: this.rrid }} );
  }
  //file event handler.
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onSubmit() {
    console.log('in submit')
    this.profileFormGroup.markAllAsTouched();
    if (this.profileFormGroup.valid && this.selectedFile && this.rrid) {
    const fileData = new FormData();
    fileData.append('resume', this.selectedFile); //resume:selectedfile
    this.profileService.uploadFile(fileData,this.rrid,this.loggedInUser?.name).subscribe({
        next: (res) => {
          const filePath = res.message; // Assuming the server response contains the file path
          const payload = {
            id: this.profileFormGroup.get('id')?.value,
            name: this.profileFormGroup.get('name')?.value,
            status: 'In Progress',
            skills:this.profileFormGroup.get('skills')?.value,
            remarks:"",
            jobId: this.jobId,
            userId: this.loggedInUser?.userId,
            resumePath: filePath,
            jobType: this.profileFormGroup.get('jobType')?.value
          };

          this.profileService.addProfile(payload).subscribe({
            next: (res) => {
              console.log(res.message);
              this.router.navigate(['/profiles',this.jobId,this.jd], {
                queryParams: { rrid: this.rrid }
              });
            },
            error: (res) => {
              console.log(res.error.message);
              this.toastr.error(res.error.message, '', {
                positionClass: 'toast-top-right',
                timeOut: 2000,
                progressBar: true
              });
            }
          });
        },
        error: (res) => {
          console.log(res.error.message);
          this.toastr.error(res.error.message, '', {
            positionClass: 'toast-top-right',
            timeOut: 2000,
            progressBar: true
          });
        }
      });
    }
  }
}