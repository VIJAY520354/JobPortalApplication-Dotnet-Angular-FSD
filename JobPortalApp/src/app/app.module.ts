import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { AddprofileComponent } from './addprofile/addprofile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { HomeComponent } from './home/home.component';
import { AddjobComponent } from './addjob/addjob.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './Services/jwt-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    ProfilesComponent,
    AddprofileComponent,
    UpdateProfileComponent,
    HomeComponent,
    AddjobComponent,
    RegistrationComponent,
    LoginComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule, // required for toastr
    ToastrModule.forRoot(),  // ToastrModule added
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['https://localhost:4435'], // Replace with your API domain
        disallowedRoutes: [], // Replace with routes you want to exclude
      },
    })
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function tokenGetter() { 
  return localStorage.getItem("jwt"); 
}
