import { InitialPageComponent } from './pages/initial-page/initial-page.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuGeneralComponent } from './pages/menu-general/menu-general.component';
import { Routes } from '@angular/router';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SupportComponent } from './pages/support/support.component';
import { ViagemDetailComponent } from './pages/excursion-detail/excursion-detail.component';
import { AdminPageComponent } from './pages/admin/admin-page.component';
import { UserComponent } from './pages/user/user.component';

export const routes: Routes = [
  { path: 'excursion-detail/:id', component: ViagemDetailComponent },
  { path: '', redirectTo: '/initial', pathMatch: 'full' },
  { path: 'initial', component: InitialPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu-general', component: MenuGeneralComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'support', component: SupportComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'user', component: UserComponent }
];
