import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) {
    console.log('[LoginService] - constructor: Login service initialized');
  }

  login(email: string, password: string) {
    const url = `${environment.apiUrl}/SignUp/login/0`;
    const body = { email, password };
    console.log('[LoginService] - login: Attempting login for email:', email, 'at URL:', url);
    return this.httpClient.post<LoginResponse>(url, body);
  }
}
