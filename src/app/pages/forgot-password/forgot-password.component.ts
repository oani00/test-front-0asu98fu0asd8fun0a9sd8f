import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  phone = '';
  cpf = '';
  birthDate = '';
  newPassword = '';
  confirmPassword = '';
  errorMsg = '';
  successMsg = '';

  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.phone || !this.cpf || !this.birthDate || !this.newPassword || !this.confirmPassword) {
      this.errorMsg = 'Todos os campos são obrigatórios.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'As senhas não coincidem.';
      return;
    }

    this.forgotPasswordService.resetPassword(this.cpf, this.phone, this.birthDate, this.newPassword).subscribe({
      next: (res) => {
        this.successMsg = res.message;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Erro ao recuperar senha.';
      }
    });
  }
}
