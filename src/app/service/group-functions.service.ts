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
  getGroupByID(groupID: string): Observable<any> {
    return this.http.post(
      this.BACKENDURL + '/api/groups/getbyid',
      JSON.stringify({ data: groupID }),
      this.httpOptions
    );
  }
  getAllGroups(): Observable<any> {
    return this.http.get(this.BACKENDURL + '/api/groups/id');
  }
  getUserByID(userID: string): Observable<any> {
    return this.http.post(
      this.BACKENDURL + '/api/users/id',
      JSON.stringify({ data: userID }),
      this.httpOptions
    );
  }
  assignToGroup(userID: string, groupID: string): Observable<any> {
    // const thisUserID = this.auth.getFromSessionStorage('UUID');
    const thisUserID = this.auth.getFromSessionStorage('UUID');
    const body = {
      adminID: thisUserID,
      userID,
      groupID,
    };
    return this.http.post(
      `${this.BACKENDURL}/api/groups/assign`,
      body,
      this.httpOptions
    );
  }
  updateUserGroupPermissions(
    userID: string,
    groupID: string,
    action: string
  ): Observable<any> {
    // const thisUserID = this.auth.getFromSessionStorage('UUID');
    const thisUserID = this.auth.getFromSessionStorage('UUID');
    const body = {
      adminID: thisUserID,
      userID,
      groupID,
      action,
    };
    return this.http.post(
      `${this.BACKENDURL}/api/groups/update/userUUID`,
      body,
      this.httpOptions
    );
  }
  createNewGroup(name: string) {
    const thisUserID = this.auth.getFromSessionStorage('UUID');
    const body = {
      userID: thisUserID,
      name,
    };

    return this.http.post(
      `${this.BACKENDURL}/api/groups/create`,
      body,
      this.httpOptions
    );
  }

  deleteGroup(groupUUID: string) {
    const thisUserID = this.auth.getFromSessionStorage('UUID');
    const body = {
      userID: thisUserID,
      groupUUID: groupUUID,
    };
    return this.http.post(
      `${this.BACKENDURL}/api/groups/delete`,
      body,
      this.httpOptions
    );
  }

  createNewChannel(name: string, groupUUID: string) {
    const thisUserID = this.auth.getFromSessionStorage('UUID');
    const body = {
      userID: thisUserID,
      name,
      group: groupUUID,
    };

    return this.http.post(
      `${this.BACKENDURL}/api/groups/create/channel`,
      body,
      this.httpOptions
    );
  }
  getChannelNames(groupUUID: string, channelUUID: string): Observable<any> {
    const thisUserID = this.auth.getFromSessionStorage('UUID');
    const body = {
      userID: thisUserID,
      groupUUID: groupUUID,
      channelUUID: channelUUID,
    };
    return this.http.post(
      this.BACKENDURL + '/api/groups/details/channel',
      body,
      this.httpOptions
    );
  }
}
