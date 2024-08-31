import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private baseUrl = environment.apiUrl+"/Job";
  constructor(private http:HttpClient) { }

  getAllJobs():Observable<any>{
    return this.http.get(`${this.baseUrl}/GetAllJobs`)
  }
  getAllJobsByUserId(userId:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/GetAllJobsByUserId/${userId}`)
  }
  addJob(payload:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/AddJobs`,payload)
  }
  updateJob(payload:any):Observable<any>{
    return this.http.put(`${this.baseUrl}/UpdateJobs`,payload)
  }
  deleteJob(id: number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/DeleteJobs/${id}`)
  }
}
