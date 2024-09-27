import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

 
  private apiUrl = 'https://ordercontrol.firstbackoffice.com:3002/api/secret';

  constructor(private http: HttpClient) {}

  getSecret(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  
}
