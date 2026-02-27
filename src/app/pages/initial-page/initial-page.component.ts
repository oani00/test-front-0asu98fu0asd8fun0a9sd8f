import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExcursionService } from '../../services/excursion.service';
import { Excursion, PictureRef } from '../../models/excursion';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.css'
})
export class InitialPageComponent implements OnInit {
  topExcursions: Excursion[] = [];
  bottomExcursions: Excursion[] = [];
  loading = false;
  apiUrl = environment.apiUrl;

  constructor(private excursionService: ExcursionService) {}

  ngOnInit(): void {
    this.loadExcursions();
  }

  loadExcursions(): void {
    this.loading = true;
    this.excursionService.getExcursions().subscribe({
      next: (excursions) => {
        // Split into top 3 and next 3
        this.topExcursions = excursions.slice(0, 3);
        this.bottomExcursions = excursions.slice(3, 6);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading excursions:', err);
        this.loading = false;
      }
    });
  }

  getPictureUrl(excursion: Excursion): string {
    if (excursion.pictures && excursion.pictures.length > 0) {
      // Handle both populated objects and string IDs
      const pictureId = typeof excursion.pictures[0] === 'string' 
        ? excursion.pictures[0] 
        : (excursion.pictures[0] as PictureRef)._id;
      return `${this.apiUrl}/pictures/${pictureId}`;
    }
    return 'assets/placeholder-excursion.svg'; // Fallback image
  }
}
