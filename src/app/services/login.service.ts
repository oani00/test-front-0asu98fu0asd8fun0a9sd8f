import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(name: string, password: string) {
    const url = `${environment.apiUrl}/login`; 
    const body = { name, password };
    return this.httpClient.post<LoginResponse>(url, body)
    .pipe(
      tap((value) =>{
        sessionStorage.setItem('auth-token', value.token);
      })
    );

    

  }
}
