import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InitialPageComponent } from './pages/initial-page/initial-page.component';
import { MenuGeneralComponent } from './pages/menu-general/menu-general.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    InitialPageComponent,
    LoginComponent,
    SignUpComponent,
    MenuGeneralComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'projectangular';

  constructor() {
    console.log('[AppComponent] - constructor: App component initialized with title:', this.title);
  }
}
