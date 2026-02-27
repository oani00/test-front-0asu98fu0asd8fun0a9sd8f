import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Excursion } from '../../models/excursion';
import { ExcursionService } from '../../services/excursion.service';

type MenuOption = {
  name: string;
  path?: string;
  type?: 'passeio' | 'viagem';
};

@Component({
  selector: 'app-menu-general',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-general.component.html',
  styleUrl: './menu-general.component.css',
})
export class MenuGeneralComponent implements OnInit {
  menuOptions: MenuOption[] = [];
  locations: Excursion[] = [];
  showExcursions = false;
  selectedCategory: 'passeio' | 'viagem' | null = null;

  constructor(private excursionService: ExcursionService, private router: Router) {
    console.log('[MenuGeneralComponent] - constructor: Menu general component initialized');
  }

  ngOnInit() {
    console.log('[MenuGeneralComponent] - ngOnInit: Initializing menu options');
    this.menuOptions = [
      { name: 'Viagens', type: 'viagem' },
      { name: 'Passeios', type: 'passeio' },
      { name: 'Suporte', path: '/support' },
    ];
    console.log('[MenuGeneralComponent] - ngOnInit: Menu options initialized:', this.menuOptions);
  }

  onMenuOptionClick(option: MenuOption) {
    console.log('[MenuGeneralComponent] - onMenuOptionClick: Menu option clicked:', option);
    if (option.type) {
      console.log('[MenuGeneralComponent] - onMenuOptionClick: Loading excursions for type:', option.type);
      this.excursionService.getExcursions().subscribe((data) => {
        console.log('[MenuGeneralComponent] - onMenuOptionClick: Received excursions data:', data.length, 'excursions');
        this.locations = data.filter((excursion) => excursion.type === option.type);
        this.selectedCategory = option.type ?? null;
        this.showExcursions = true;
        console.log('[MenuGeneralComponent] - onMenuOptionClick: Filtered excursions:', this.locations.length, 'for type:', option.type);
      });
      return;
    }

    if (option.path) {
      console.log('[MenuGeneralComponent] - onMenuOptionClick: Navigating to path:', option.path);
      this.router.navigate([option.path]);
    }
  }

  goBack() {
    console.log('[MenuGeneralComponent] - goBack: Going back to menu');
    this.showExcursions = false;
    this.selectedCategory = null;
  }
}

