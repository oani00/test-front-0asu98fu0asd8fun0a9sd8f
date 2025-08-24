import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Excursion } from '../../models/excursion';
import { ExcursionService } from '../../services/excursion.service';

@Component({
  selector: 'app-menu-viagens',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-viagens.component.html',
  styleUrl: './menu-viagens.component.css'
})
export class MenuViagensComponent implements OnInit {

  locations: Excursion[] = [];

  constructor(
    private excursionService: ExcursionService,  
    private router: Router) {}

  ngOnInit() {
    this.excursionService.getExcursions().subscribe(data => {
    //TODO: Update to fetch excursions and filter by type if needed
      this.locations = data;
    }); 
  }

}
