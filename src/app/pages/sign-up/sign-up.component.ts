import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SignUpService } from '../../services/sign-up.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  name = '';
  surname = '';
  phone = '';
  birthDate = '';
  cpf = '';
  password = '';
  message = '';
  error = '';

  constructor(private signUpService: SignUpService, private router: Router) {
    console.log('[SignUpComponent] - constructor: Sign-up component initialized');
  }

  private normalizeDigits(value: string): string {
    return value.replace(/\D/g, '');
  }

  onSubmit() {
    console.log('[SignUpComponent] - onSubmit: Attempting to create user with name:', this.name, 'phone:', this.phone);
    this.message = '';
    this.error = '';

    if (!this.name || !this.surname || !this.phone || !this.birthDate || !this.cpf || !this.password) {
      console.log('[SignUpComponent] - onSubmit: Validation failed - missing required fields');
      this.error = 'Todos os campos são obrigatórios.';
      return;
    }

    const normalizedCpf = this.normalizeDigits(this.cpf);
    const normalizedPhone = this.normalizeDigits(this.phone);

    if (normalizedCpf.length !== 11) {
      this.error = 'CPF deve conter 11 dígitos.';
      return;
    }

    if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
      this.error = 'Telefone deve ter 10 ou 11 dígitos.';
      return;
    }

    const fullName = `${this.name.trim()} ${this.surname.trim()}`;

    this.signUpService.createUser(
      fullName,
      this.password,
      normalizedPhone,
      this.birthDate,
      normalizedCpf
    ).subscribe({
      next: (res) => {
        console.log('[SignUpComponent] - onSubmit: User created successfully:', res);
        this.message = res.message; //Mensagem vem do backend
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.name = '';
          this.surname = '';
          this.phone = '';
          this.birthDate = '';
          this.cpf = '';
          this.password = '';
        }, 2000);
      },
      error: (err) => {
        console.error('[SignUpComponent] - onSubmit: User creation failed:', err);
        this.error = err?.error?.message || 'Erro ao criar usuário.';
      }
    });

  }
}
