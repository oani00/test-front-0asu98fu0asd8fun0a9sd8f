import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Excursion, PictureRef } from '../../models/excursion';
import { CommonModule } from '@angular/common';
import { ExcursionService } from '../../services/excursion.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-excursion-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excursion-detail.component.html',
  styleUrl: './excursion-detail.component.css'
})
export class ViagemDetailComponent implements OnInit {
  viagem: Excursion | undefined;
  currentYear: number = new Date().getFullYear();
  currentUser: any = null;
  isSubscribed: boolean = false;
  apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private excursionService: ExcursionService,
    private router: Router
  ) {
    console.log('[ExcursionDetailComponent] - constructor: Excursion detail component initialized');
  }

  ngOnInit() {
    console.log('[ExcursionDetailComponent] - ngOnInit: Initializing excursion detail component');
    const id = this.route.snapshot.paramMap.get('id');
    console.log('[ExcursionDetailComponent] - ngOnInit: Route parameter id:', id);
    if (id) {
      console.log('[ExcursionDetailComponent] - ngOnInit: Loading excursion data for id:', id);
      this.excursionService.getExcursionById(id).subscribe(data => {
        console.log('[ExcursionDetailComponent] - ngOnInit: Excursion data received:', data);
        this.viagem = data;
        this.checkSubscriptionStatus();
      });
    }

    // Load current user
    console.log('[ExcursionDetailComponent] - ngOnInit: Loading current user from localStorage');
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        console.log('[ExcursionDetailComponent] - ngOnInit: Current user loaded:', this.currentUser);
      } catch (error) {
        console.error('[ExcursionDetailComponent] - ngOnInit: Error parsing user data:', error);
      }
    } else {
      console.log('[ExcursionDetailComponent] - ngOnInit: No user data found in localStorage');
    }
  }

  checkSubscriptionStatus() {
    console.log('[ExcursionDetailComponent] - checkSubscriptionStatus: Checking subscription status');
    if (this.viagem && this.currentUser && this.viagem.users) {
      this.isSubscribed = this.viagem.users.includes(this.currentUser.id);
      console.log('[ExcursionDetailComponent] - checkSubscriptionStatus: User subscription status:', this.isSubscribed);
    } else {
      this.isSubscribed = false;
      console.log('[ExcursionDetailComponent] - checkSubscriptionStatus: Cannot check subscription - missing data');
    }
  }

  toggleSubscription() {
    console.log('[ExcursionDetailComponent] - toggleSubscription: Toggling subscription, current status:', this.isSubscribed);
    if (!this.currentUser) {
      console.log('[ExcursionDetailComponent] - toggleSubscription: No current user, redirecting to login');
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }

    if (!this.viagem || !this.viagem._id) {
      console.error('[ExcursionDetailComponent] - toggleSubscription: Missing excursion data');
      return;
    }

    const userId = this.currentUser.id;
    const excursionId = this.viagem._id;
    console.log('[ExcursionDetailComponent] - toggleSubscription: User ID:', userId, 'Excursion ID:', excursionId);

    if (this.isSubscribed) {
      console.log('[ExcursionDetailComponent] - toggleSubscription: Unsubscribing from excursion');
      // Unsubscribe
      this.excursionService.unsubscribeFromExcursion(userId, excursionId).subscribe({
        next: (response) => {
          console.log('[ExcursionDetailComponent] - toggleSubscription: Unsubscribed successfully:', response);
          this.isSubscribed = false;
          // Update local excursion data
          if (this.viagem && this.viagem.users) {
            this.viagem.users = this.viagem.users.filter(id => id !== userId);
            console.log('[ExcursionDetailComponent] - toggleSubscription: Local excursion users updated');
          }
        },
        error: (error) => {
          console.error('[ExcursionDetailComponent] - toggleSubscription: Error unsubscribing:', error);
          alert('Erro ao cancelar inscrição. Tente novamente.');
        }
      });
    } else {
      console.log('[ExcursionDetailComponent] - toggleSubscription: Subscribing to excursion');
      // Subscribe
      this.excursionService.subscribeToExcursion(userId, excursionId).subscribe({
        next: (response) => {
          console.log('[ExcursionDetailComponent] - toggleSubscription: Subscribed successfully:', response);
          this.isSubscribed = true;
          // Update local excursion data
          if (this.viagem) {
            this.viagem.users = this.viagem.users || [];
            this.viagem.users.push(userId);
            console.log('[ExcursionDetailComponent] - toggleSubscription: Local excursion users updated');
          }
        },
        error: (error) => {
          console.error('[ExcursionDetailComponent] - toggleSubscription: Error subscribing:', error);
          alert('Erro ao se inscrever. Tente novamente.');
        }
      });
    }
  }

  getPictureUrl(): string {
    if (this.viagem?.pictures && this.viagem.pictures.length > 0) {
      // Handle both populated objects and string IDs
      const pictureId = typeof this.viagem.pictures[0] === 'string' 
        ? this.viagem.pictures[0] 
        : (this.viagem.pictures[0] as PictureRef)._id;
      return `${this.apiUrl}/pictures/${pictureId}`;
    }
    return 'assets/placeholder-excursion.svg'; // Fallback image
  }
}
