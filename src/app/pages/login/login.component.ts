import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private avatar: AvatarService
  ) {
    console.log('[LoginComponent] - constructor: Login component initialized');
  }

  onSubmit() {
    console.log('[LoginComponent] - onSubmit: Attempting login with email:', this.email);
    this.errorMsg = '';
    this.loginService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('[LoginComponent] - onSubmit: Login successful, user:', res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        // Sync avatar after login
        this.avatar.syncWithStoredUser();
        this.router.navigate(['/menu-general']);
        console.log('[LoginComponent] - onSubmit: Navigation to menu-general initiated');
        // TEMPORARY: Force page reload to update navbar. Replace with shared AuthService for reactive updates.
        setTimeout(() => {
          console.log('[LoginComponent] - onSubmit: Reloading page after login');
          window.location.reload();
        }, 1000); // Wait 1 second before reloading
      },
      error: (err) => {
        console.error('[LoginComponent] - onSubmit: Login failed:', err);
        this.errorMsg = err?.error?.message || 'Erro ao fazer login.';
      }
    });
  }
}
