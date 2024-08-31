import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizeService } from '../Services/authorize.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../Model/User';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup:FormGroup;
  loggedInUser: User | null =null;
  
  constructor(private formBuilder: FormBuilder,private authorizeService:AuthorizeService,private toastr: ToastrService,private router:Router) {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
   }

  ngOnInit(): void {
  }
  onSubmit()
  {
    this.loginFormGroup.markAllAsTouched();
    if(this.loginFormGroup.valid){
        let payload={
          email:this.loginFormGroup.get('email')?.value,
          password:this.loginFormGroup.get('password')?.value,
          }
        this.authorizeService.loginUser(payload).subscribe({
          next: (res)=>{console.log(res),
            this.authorizeService.setAccessToken(res.token),//setting token in local storage
            this.loggedInUser=this.authorizeService.getLoggedInUser(); //fetching loggedin user details
            if(this.loggedInUser && this.loggedInUser?.role=="Admin" || this.loggedInUser?.role=="User")
            {
            this.router.navigate(['home']); //if login successfull
            }
            else
             this.router.navigate(["/login"]) //if login unsuccessfull
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
  onRegister(){
    this.router.navigate(['/register'])
  }
}
