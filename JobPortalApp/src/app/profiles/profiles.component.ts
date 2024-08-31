import { Component, OnInit } from '@angular/core';
import { Profile } from '../Model/Profile';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../Services/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../Model/User';
import { AuthorizeService } from '../Services/authorize.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  profiles: Profile[] = [];
  jobId: number  = 0; 
  jd: string | null = null; // Route parameter
  rrid: string | null = null; // Query string parameter
  loggedInUser: User | null = null;
  selectedFile: File | null = null;
  filteredProfiles: Profile[] = [];

  profileFormGroup:FormGroup;
  constructor(private router: Router,private profileService:ProfileService,private formBuilder: FormBuilder,private route: ActivatedRoute,private authorizeService:AuthorizeService,private toastr:ToastrService) { 
    this.profileFormGroup=this.formBuilder.group({
      id:[0,Validators.required],
      name:['',Validators.required],
      status:['',Validators.required],
      skills:['',Validators.required],
      remarks:[''],
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
      
    });
    this.getAllProfilesByJobId();
  }
  
  //subscribing to service
  getAllProfilesByJobId()
  {
    this.profileService.getAllProfilesByJobId(this.jobId).subscribe(
      {
        next: (res) => 
          {
          this.profiles=res
          if(this.loggedInUser?.role=='Admin')
          {
          this.filteredProfiles=res
          }
          else{
          this.filteredProfiles= this.profiles.filter(profile=>profile.userId==this.loggedInUser?.userId)
          console.log(this.profiles)
          }},
        error: (error) => console.log("error while fetching profiles",error)
      }
    )
  }
  AddProfile(){
    this.router.navigate(['/addprofiles',this.jobId,this.jd],{ 
      queryParams: { rrid: this.rrid }} );
  }
  onDelete(id:number){
    if (confirm("Are you sure you want to delete this profile?"))
  {
    this.profileService.deleteProfile(id).subscribe({
      next: (res) => {console.log(res.message),
          this.getAllProfilesByJobId();
      },
      error: (error) => console.log("error while deleting profiles",error)
    })
  }
  }
  onUpdate(profile:Profile){
    this.profileFormGroup.setValue({
      id:profile.id,
      name:profile.name,
      status:profile.status,
      skills:profile.skills,
      jobType:profile.jobType,
      remarks:`${this.loggedInUser?.name}: \n${profile.remarks}`
    })
  }
  //file event handler.
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onSubmit(){
    this.profileFormGroup.markAllAsTouched();
    let payload={
      id:this.profileFormGroup.get('id')?.value,
      name:this.profileFormGroup.get('name')?.value,
      status:this.profileFormGroup.get('status')?.value,
      skills:this.profileFormGroup.get('skills')?.value,
      remarks:this.profileFormGroup.get('remarks')?.value,
      jobType: this.profileFormGroup.get('jobType')?.value,
      jobId:this.jobId,
      userId:this.loggedInUser?.userId
    }
    this.profileService.updateProfile(payload).subscribe({
      next: (res)=>  {
        console.log(res.message),
        this.getAllProfilesByJobId()
        
     },
      error:(error) => console.log("error while updating profile",error)
    })

  }
  //Search Funtionality
  onSearch(inputText:string){
   const searchText=inputText.toLowerCase();
   this.filteredProfiles = this.profiles.filter(profile => profile.name.toLowerCase().includes(searchText));
  }
  onBack(){
    this.router.navigate(['/home'])
  }
  onDownload(filePath:string)
  {
     // Show a notification that the download is starting
    this.toastr.info('Downloading file...', '', { timeOut: 2000 });
    // Call the downloadFile method in the FileService, which returns an Observable of Blob
    this.profileService.downloadFile(filePath).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob); // Create a URL for the Blob object
        const a = document.createElement('a'); // Create an anchor element
        a.href = url; // Set the href attribute to the Blob URL
        a.download = this.getFileNameFromPath(filePath); // Set the download attribute to the file name
        document.body.appendChild(a); // Append the anchor element to the document body
        a.click(); // Programmatically click the anchor element to trigger the download
        document.body.removeChild(a);  // Remove the anchor element from the document body
        window.URL.revokeObjectURL(url);  // Revoke the Blob URL to free up memory
        this.toastr.success('File downloaded successfully','', { timeOut: 2000 });
      },
      error: (err) => {
        console.error('Download error:', err);
        this.toastr.error('Failed to download file', 'Error', { timeOut: 2000 });
      }
    });
  }
  //// Helper method to extract the file name from the file path
  private getFileNameFromPath(filePath: string): string {
    return filePath.split('\\').pop() || filePath.split('/').pop() || 'downloadedFile';
  }
  //checking admin role
  checkAdmin():boolean{
    if(this.loggedInUser?.role=="Admin"){
      return true;
    }
    return false;
  }
  //checking profile is selected or not
  isSelected(profile:Profile):boolean{
    if(profile.status=="Selected"){
      return true;
    }
    return false;
   
  }
  
  
}
