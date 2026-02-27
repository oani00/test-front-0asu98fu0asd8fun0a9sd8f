import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AvatarService } from '../../services/avatar.service';
import { ExcursionService } from '../../services/excursion.service';
import { Excursion } from '../../models/excursion';

type MenuOption = {
  name: string;
  type?: 'passeio' | 'viagem';
  path?: string;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  userName: string | null = null;
  readonly menuOptions: MenuOption[] = [
    { name: 'Viagens', type: 'viagem' },
    { name: 'Passeios', type: 'passeio' },
    { name: 'Suporte', path: '/support' }
  ];

  drawerOpen = false;
  showExcursions = false;
  selectedCategory: 'passeio' | 'viagem' | null = null;
  locations: Excursion[] = [];
  isLoadingExcursions = false;
  drawerError: string | null = null;

  constructor(
    public avatar: AvatarService,
    private excursionService: ExcursionService,
    private router: Router
  ) {
    console.log('[NavbarComponent] - constructor: Navbar component initialized');
  }

  ngOnInit(): void {
    console.log('[NavbarComponent] - ngOnInit: Initializing navbar component');
    const user = localStorage.getItem('user');
    if (user) {
      try {
        this.userName = JSON.parse(user).name;
        console.log('[NavbarComponent] - ngOnInit: User loaded from localStorage:', this.userName);
        // Sync avatar with stored user data
        this.avatar.syncWithStoredUser();
      } catch {
        this.userName = null;
        console.log('[NavbarComponent] - ngOnInit: Error parsing user data from localStorage');
      }
    } else {
      console.log('[NavbarComponent] - ngOnInit: No user found in localStorage');
      // Reset avatar when no user
      this.avatar.avatarUrl$.next(undefined);
      this.avatar.emoji$.next('👤');
    }
  }

  logout(): void {
    console.log('[NavbarComponent] - logout: Logging out user');
    localStorage.removeItem('user');
    this.userName = null;
    // Reset avatar on logout
    this.avatar.avatarUrl$.next(undefined);
    this.avatar.emoji$.next('👤');
    console.log('[NavbarComponent] - logout: User logged out successfully');
    // Optionally, redirect to login or initial page
    // window.location.href = '/login';
  }

  toggleDrawer(forceState?: boolean): void {
    this.drawerOpen = forceState ?? !this.drawerOpen;
    if (!this.drawerOpen) {
      this.resetDrawerState();
    }
  }

  onMenuOptionClick(option: MenuOption): void {
    this.drawerError = null;
    if (option.type) {
      this.loadExcursionsByType(option.type);
      return;
    }

    if (option.path) {
      this.router.navigate([option.path]);
      this.toggleDrawer(false);
    }
  }

  goBackToMenu(): void {
    this.showExcursions = false;
    this.selectedCategory = null;
    this.locations = [];
    this.drawerError = null;
  }

  navigateToExcursion(excursion: Excursion): void {
    if (!excursion._id) {
      return;
    }
    this.router.navigate(['/excursion-detail', excursion._id]);
    this.toggleDrawer(false);
  }

  trackByLocation = (_: number, excursion: Excursion): string =>
    excursion._id ?? excursion.name;

  getMenuOptionDescription(option: MenuOption): string {
    if (option.type === 'viagem') {
      return 'Roteiros completos e experiências imersivas';
    }
    if (option.type === 'passeio') {
      return 'Passeios rápidos para o dia-a-dia';
    }
    return 'Suporte e acompanhamento da nossa equipe';
  }

  private loadExcursionsByType(type: 'passeio' | 'viagem'): void {
    this.isLoadingExcursions = true;
    this.showExcursions = true;
    this.selectedCategory = type;
    this.locations = [];
    this.excursionService.getExcursions().subscribe({
      next: (excursions) => {
        this.locations = excursions.filter((excursion) => excursion.type === type);
        this.isLoadingExcursions = false;
      },
      error: (err) => {
        console.error('[NavbarComponent] - loadExcursionsByType: Error loading excursions:', err);
        this.drawerError = 'Não foi possível carregar as excursões agora. Tente novamente em instantes.';
        this.isLoadingExcursions = false;
      }
    });
  }

  private resetDrawerState(): void {
    this.showExcursions = false;
    this.selectedCategory = null;
    this.locations = [];
    this.drawerError = null;
    this.isLoadingExcursions = false;
  }
}
