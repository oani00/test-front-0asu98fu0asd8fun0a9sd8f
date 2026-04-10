import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class InitialPageComponent implements OnInit, OnDestroy {
  topExcursions: Excursion[] = [];
  bottomExcursions: Excursion[] = [];
  duplicatedTopExcursions: Excursion[] = [];
  duplicatedBottomExcursions: Excursion[] = [];
  loading = false;
  apiUrl = environment.apiUrl;

  topTranslate = 0; // percent
  bottomTranslate = 0; // percent

  private topInterval: any;
  private bottomInterval: any;

  constructor(private excursionService: ExcursionService) {}

  ngOnInit(): void {
    this.loadExcursions();
  }

  startCarousels(): void {
    this.stopCarousels();

    // translateX percentages are relative to the element's own width.
    // The track holds 5 copies, so one full original set = 100/5 = 20% of the track.
    const CYCLE = 100 / 5;
    const STEP  = 0.04; // percent per tick (~50px/s at 330px-wide cards)
    const TICK  = 30;   // ms

    if (this.topExcursions.length > 0) {
      this.topInterval = setInterval(() => {
        this.topTranslate -= STEP;
        if (this.topTranslate <= -CYCLE) {
          this.topTranslate += CYCLE;
        }
      }, TICK);
    }

    if (this.bottomExcursions.length > 0) {
      this.bottomInterval = setInterval(() => {
        this.bottomTranslate -= STEP;
        if (this.bottomTranslate <= -CYCLE) {
          this.bottomTranslate += CYCLE;
        }
      }, TICK);
    }
  }

  stopCarousels(): void {
    if (this.topInterval) {
      clearInterval(this.topInterval);
      this.topInterval = null;
    }
    if (this.bottomInterval) {
      clearInterval(this.bottomInterval);
      this.bottomInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.stopCarousels();
  }

  loadExcursions(): void {
    this.loading = true;
    this.excursionService.getExcursions().subscribe({
      next: (excursions) => {
        // Split dynamically at midpoint
        const midpoint = Math.ceil(excursions.length / 2);
        this.topExcursions = excursions.slice(0, midpoint);
        this.bottomExcursions = excursions.slice(midpoint);
        // duplicate for seamless scroll (5 copies)
        this.duplicatedTopExcursions = [...this.topExcursions, ...this.topExcursions, ...this.topExcursions, ...this.topExcursions, ...this.topExcursions];
        this.duplicatedBottomExcursions = [...this.bottomExcursions, ...this.bottomExcursions, ...this.bottomExcursions, ...this.bottomExcursions, ...this.bottomExcursions];
        this.startCarousels();
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
