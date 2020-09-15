import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../_models/user';

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

  updateUserById(id: number, user: User): Observable<object> {
    return this.http.put(this.baseUrl + id, user);
  }

  setMainPhoto(userId: number, id: number): Observable<object> {
    return this.http.patch(this.baseUrl + userId + '/photos/' + id, {});
  }

  deletePhoto(userId: number, id: number): Observable<object> {
    return this.http.delete(this.baseUrl + userId + '/photos/' + id);
  }
}
