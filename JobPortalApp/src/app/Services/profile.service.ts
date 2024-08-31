import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = environment.apiUrl+"/Profile";
  constructor(private http:HttpClient) { }
  getAllProfiles():Observable<any>{
      return this.http.get(`${this.baseUrl}/GetAllProfiles`);
  }
  addProfile(payload:any):Observable<any>{
      return this.http.post(`${this.baseUrl}/AddProfiles`,payload)
  }
  updateProfile(payload:any):Observable<any>{
      return this.http.put(`${this.baseUrl}/UpdateProfiles`,payload)
  }
  deleteProfile(id: number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/DeleteProfiles/${id}`)
  }
  getAllProfilesByJobId(id:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/GetAllProfilesByJobId/${id}`)
  }
  uploadFile(payload: any,rrid:string,name:string| undefined): Observable<any> {
    return this.http.post(`${this.baseUrl}/UploadFile/${rrid}/${name}`, payload);
  }
  downloadFile(filePath: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'blob' as 'json'  // Ensure responseType is correctly set to 'blob'
    };

    // Encode the file path properly for URL
    const encodedFilePath = encodeURIComponent(filePath);

    return this.http.post(`${this.baseUrl}/DownloadFile`, `"${encodedFilePath}"`, options);
  }
    
}
