import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
export interface userCheck {
  email: string;
  pwd: string;
}

type role = 'SUPERADMIN' | 'GROUPADMIN' | 'USER';

export interface group {
  groupID: Number;
  isAdmin: boolean;
}
export interface userObj {
  username?: string;
  email?: string;
  valid?: boolean;
  UUID: number;
  password?: string;
  roles?: role[];
  groups?: group[];
}

@Injectable({
  providedIn: 'root',
})
export class CheckAuthService {
  BACKENDURL = 'http://localhost:3000';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  valid: any;
  getValid: any;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.valid = new BehaviorSubject(sessionStorage.getItem('valid'));
    this.getValid = this.valid.asObservable();
  }
  CreateUser(data: userCheck): Observable<userObj> {
    console.log('checking', data);
    return this.httpClient.post<userObj>(
      this.BACKENDURL + '/api/auth/register',
      data,
      this.httpOptions
    );
  }
  login(data: userCheck): Observable<userObj> {
    console.log('checking', data);
    return this.httpClient.post<userObj>(
      this.BACKENDURL + '/api/auth/login',
      data,
      this.httpOptions
    );
  }
  logout(): any {
    this.httpClient
      .post(
        this.BACKENDURL + '/api/auth/logout',
        JSON.stringify({ data: sessionStorage.getItem('UUID') }),
        this.httpOptions
      )
      .subscribe((res) => console.log(res));
    this.router.navigate(['/login']);
    this.clearSessionStorage();
    this.checkIsValid();
  }
  removeAccount(): any {
    this.httpClient
      .post(
        this.BACKENDURL + '/api/auth/delete',
        JSON.stringify({ data: sessionStorage.getItem('UUID') }),
        this.httpOptions
      )
      .subscribe((res) => console.log(res));
    this.router.navigate(['/login']);
    this.clearSessionStorage();
    this.checkIsValid();
  }

  updateUser(data: userObj): Observable<userObj> {
    console.log('updating');
    return this.httpClient.post<userObj>(
      this.BACKENDURL + '/api/auth/update',
      data,
      this.httpOptions
    );
  }
  checkIsValid() {
    this.valid.next(sessionStorage.getItem('valid'));
    if (this.valid && this.valid === 'true') {
      return true;
    } else return false;
  }
  saveToSessionStorage(key: string, value: userObj[keyof userObj]) {
    if (value) {
      sessionStorage.setItem(key, value.toString());
    } else {
      console.log('error on value');
    }
  }
  clearSessionStorage() {
    sessionStorage.clear();
    console.log('storage cleared');
  }
  getFromSessionStorage(key: keyof userObj) {
    return sessionStorage.getItem(key);
  }
}