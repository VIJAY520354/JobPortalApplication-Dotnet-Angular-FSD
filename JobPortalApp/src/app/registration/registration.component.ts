import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizeService } from '../Services/authorize.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerFormGroup:FormGroup;
  constructor(private formBuilder: FormBuilder,private authorizeService:AuthorizeService,private toastr: ToastrService,private route:Router) 
  {
    this.registerFormGroup = this.formBuilder.group({
      id: [0, Validators.required],
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]], // only characters and spaces
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,}$')]], // at least 6 characters with 1 lowercase, 1 uppercase, 1 digit, 1 special character
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]] // exactly 10 digits
    })
       
  } 
  ngOnInit(): void {
  }
  onSubmit(){
    this.registerFormGroup.markAllAsTouched();
    if(this.registerFormGroup.valid){
        let payload={
          userId:this.registerFormGroup.get('id')?.value,
          name:this.registerFormGroup.get('name')?.value,
          email:this.registerFormGroup.get('email')?.value,
          password:this.registerFormGroup.get('password')?.value,
          contactNumber:this.registerFormGroup.get('contactNumber')?.value
        }
        this.authorizeService.registerUser(payload).subscribe({
          next: (res)=>{console.log(res.message),
            this.toastr.error(res.message, '', {
              positionClass: 'toast-top-right', // Set toastr position
              timeOut: 2000, // Set toastr duration in milliseconds (2 seconds)
              progressBar: true // Show/hide progress bar
            }),
               this.route.navigate(['/login'])
            ;
          },
          error: (res)=>
          { console.log(res.error.message),
            this.toastr.error(res.error.message, '', {
              positionClass: 'toast-top-right', // Set toastr position
              timeOut: 2000, // Set toastr duration in milliseconds (2 seconds)
              progressBar: true // Show/hide progress bar
            });
            
          }
        })
          
    }
    
  }
  onBack(){
    this.route.navigate(['/login'])
  }
}
