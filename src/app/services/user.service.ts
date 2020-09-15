import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../_models/user';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  updateUserById(id: number, user: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + id, user);
  }

  setMainPhoto(userId: number, id: number): Observable<Photo> {
    return this.http.patch<Photo>(this.baseUrl + userId + '/photos/' + id, {});
  }

  deletePhoto(userId: number, id: number): Observable<Photo> {
    return this.http.delete<Photo>(this.baseUrl + userId + '/photos/' + id);
  }
}
