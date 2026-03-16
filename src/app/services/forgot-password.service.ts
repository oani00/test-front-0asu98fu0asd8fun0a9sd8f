import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private apiUrl = 'http://localhost:3000/SignUp/ResetPassword';

  constructor(private http: HttpClient) {}

  resetPassword(cpf: string, phone: string, birthDate: string, newPassword: string): Observable<any> {
    return this.http.post(this.apiUrl, { cpf, phone, birthDate, newPassword });
  }
}
