import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface SignUpResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  constructor(private http: HttpClient) {
    console.log('[SignUpService] - constructor: Sign-up service initialized');
  }

  createUser(name: string, email: string, password: string): Observable<SignUpResponse> {
    const url = `${environment.apiUrl}/SignUp/CreateUser`;
    const body = { name, email, password };
    console.log('[SignUpService] - createUser: Creating user:', name, 'with email:', email, 'at URL:', url);
    return this.http.post<SignUpResponse>(url, body);
  }
}
