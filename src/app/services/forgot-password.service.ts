import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private apiUrl = `${environment.apiUrl}/SignUp/ResetPassword`;

  constructor(private http: HttpClient) {}

  resetPassword(cpf: string, phone: string, birthDate: string, newPassword: string): Observable<any> {
    return this.http.post(this.apiUrl, { cpf, phone, birthDate, newPassword });
  }
}
