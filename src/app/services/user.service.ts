import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../_models/user';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { UserParams } from './../_models/userParams';
import { Pagination } from './../_models/pagination';
import { Message } from './../_models/message';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) { }

  getUsers(page?: number, itemsPerPage?: number, userParams?: UserParams, likesParam?: any): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    const params = this.getHttpParams(page, itemsPerPage, userParams, likesParam);

    return this.http
      .get<User[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null)
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));

          return paginatedResult;
        })
      );
  }


  getHttpParams(page?: number, itemsPerPage?: number, userParams?: UserParams, likesParam?: any): HttpParams {
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge.toString());
      params = params.append('maxAge', userParams.maxAge.toString());
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers')
      params = params.append('likers', 'true');

    if (likesParam === 'Likees')
      params = params.append('likees', 'true');

    return params;
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

  sendLike(id: number, recipientId: number): Observable<object> {
    return this.http.post(this.baseUrl + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, page?: number, itemsPerPage?: number, messageContainer?: any): Observable<PaginatedResult<Message[]>> {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let params = new HttpParams();
    params = params.append('messageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    return this.http
      .get<Message[]>(this.baseUrl + id + '/messages', { observe: 'response', params })
      .pipe(
        map((res) => {
          paginatedResult.result = res.body;
          if (res.headers.get('Pagination') !== null)
            paginatedResult.pagination = JSON.parse(res.headers.get('Pagination'));

          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      this.baseUrl + id + '/messages/thread/' + recipientId
    );
  }

  sendMessage(id: number, message: Message): Observable<Message> {
    return this.http.post<Message>(this.baseUrl + id + '/messages', message);
  }

  deleteMessage(id: number, userId: number): Observable<object> {
    return this.http.post(this.baseUrl + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, id: number): void {
    this.http.post(this.baseUrl + userId + '/messages/' + id + '/read', {}).subscribe();
  }
}
