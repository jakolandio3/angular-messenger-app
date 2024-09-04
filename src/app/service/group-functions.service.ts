import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckAuthService } from './check-auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupFunctionsService {
  BACKENDURL = 'http://localhost:3000';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient, private auth: CheckAuthService) {}
  getGroups(): Observable<any> {
    return this.http.post(
      this.BACKENDURL + '/api/groups/all',
      JSON.stringify({ data: this.auth.getFromSessionStorage('UUID') }),
      this.httpOptions
    );
  }
  getAllGroups(): Observable<any> {
    return this.http.get(this.BACKENDURL + '/api/groups/id');
  }
}
