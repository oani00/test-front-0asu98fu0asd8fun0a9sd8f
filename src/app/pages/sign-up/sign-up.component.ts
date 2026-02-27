import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  email = '';
  password = '';
  message = '';
  error = '';

  constructor(private signUpService: SignUpService) {
    console.log('[SignUpComponent] - constructor: Sign-up component initialized');
  }

  onSubmit() {
    console.log('[SignUpComponent] - onSubmit: Attempting to create user with name:', this.name, 'email:', this.email);
    this.message = '';
    this.error = '';
    if (!this.name || !this.email || !this.password) {
      console.log('[SignUpComponent] - onSubmit: Validation failed - missing required fields');
      this.error = 'Nome, email e senha são obrigatórios.';
      return;
    }
    this.signUpService.createUser(this.name, this.email, this.password).subscribe({
      next: (res) => {
        console.log('[SignUpComponent] - onSubmit: User created successfully:', res);
        this.message = res.message;
        this.name = '';
        this.email = '';
        this.password = '';
      },
      error: (err) => {
        console.error('[SignUpComponent] - onSubmit: User creation failed:', err);
        this.error = err?.error?.message || 'Erro ao criar usuário.';
      }
    });
  }
}
