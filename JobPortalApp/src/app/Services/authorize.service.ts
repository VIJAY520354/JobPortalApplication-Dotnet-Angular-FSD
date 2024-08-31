import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../Model/User';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  private baseUrl = environment.apiUrl+"/User";
  constructor(private http:HttpClient,private jwtHelper: JwtHelperService) { }
  loginUser(payload:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/LoginUser`,payload)
  }
  registerUser(payload:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/RegisterUser`,payload)
  }
  setAccessToken(token: any){
    localStorage.setItem('jwt', token); 
  }
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
  getLoggedInUser(): User | null{
    const token = this.getToken();
    if(token && !this.isTokenExpired(token)){
      let decodedToken = this.jwtHelper.decodeToken(token);
        let loggedInUser: User = 
        {
        userId: parseInt(decodedToken.nameid),
        name: decodedToken.unique_name,
        email: decodedToken.email,
        contactNumber: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
        role: decodedToken.role,
      }
      return loggedInUser;
    }
    return null;
  }
 
}
