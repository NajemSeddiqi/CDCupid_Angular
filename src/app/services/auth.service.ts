import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';

  constructor(private http: HttpClient) {}

  login(model: any): Observable<void> {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((res: any) => {
        const user = res;
        if (user) localStorage.setItem('token', user.token);
      })
    );
  }

  register(model: any): Observable<object> {
    return this.http.post(this.baseUrl + 'register', model);
  }
}