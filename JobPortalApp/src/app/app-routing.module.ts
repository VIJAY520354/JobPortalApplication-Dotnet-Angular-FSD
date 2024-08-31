import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilesComponent } from './profiles/profiles.component';
import { AddprofileComponent } from './addprofile/addprofile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { HomeComponent } from './home/home.component';
import { AddjobComponent } from './addjob/addjob.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:"home",component:HomeComponent},
  {path:"addjob",component:AddjobComponent},
  {path:"profiles/:id/:jd",component: ProfilesComponent},
  {path:"addprofiles/:id/:jd", component:AddprofileComponent},
  {path:"updateprofiles", component:UpdateProfileComponent},
  {path:"register",component:RegistrationComponent},
  {path:"login",component:LoginComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

 }
