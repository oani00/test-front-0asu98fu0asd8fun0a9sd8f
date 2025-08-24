import { Routes } from '@angular/router';
import { InitialPageComponent } from './pages/initial-page/initial-page.component';
import { MenuMainComponent } from './pages/menu-main/menu-main.component';
import { SupportComponent } from './pages/support/support.component';
import { MenuViagensComponent } from './pages/menu-viagens/menu-viagens.component';
import { ViagemDetailComponent } from './pages/viagem-detail/viagem-detail.component';

export const routes: Routes = [
  { path: 'initial', component: InitialPageComponent },
  { path: '', redirectTo: '/initial', pathMatch: 'full' },
  { path: 'menu-main', component: MenuMainComponent },
  { path: 'support', component: SupportComponent },
  { path: 'viagens', component: MenuViagensComponent },
  { path: 'viagem-detail/:id', component: ViagemDetailComponent }
];
