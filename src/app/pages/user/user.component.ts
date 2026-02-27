import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ExcursionService } from '../../services/excursion.service';
import { Excursion } from '../../models/excursion';
import { environment } from '../../../environments/environment';
import { AvatarService } from '../../services/avatar.service';

interface User {
  id: string;
  name: string;
  email: string;
  type?: string;
  picture?: string | null;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  currentUser: User | null = null;
  userExcursions: Excursion[] = [];
  loading = false;
  error = '';

  selectedFile: File | null = null;
  uploadMessage = '';
  uploadError = '';

  constructor(
    private excursionService: ExcursionService,
    private http: HttpClient,
    private avatar: AvatarService
  ) {
    console.log('[UserComponent] - constructor: User component initialized');
  }

  ngOnInit(): void {
    console.log('[UserComponent] - ngOnInit: Initializing user component');
    this.loadUserAndExcursions();
  }

  loadUserAndExcursions(): void {
    console.log('[UserComponent] - loadUserAndExcursions: Loading user and excursions data');
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
        console.log('[UserComponent] - loadUserAndExcursions: Current user loaded:', this.currentUser);
        //TODO essa propriedade nao existe. É errado fazer no localstorage? É, mas, como é uma POC, vamos deixar assim.
        if (this.currentUser?.type === 'admin') {
          console.log('[UserComponent] - loadUserAndExcursions: Admin user detected, blocking access');
          this.error = 'Esta página é apenas para usuários não-administradores.';
          return;
        }
        console.log('[UserComponent] - loadUserAndExcursions: User is not admin, loading excursions');
        this.loadUserExcursions();
      } else {
        console.log('[UserComponent] - loadUserAndExcursions: No user data in localStorage');
        this.error = 'Usuário não autenticado.';
      }
    } catch {
      console.error('[UserComponent] - loadUserAndExcursions: Error parsing user data from localStorage');
      this.error = 'Erro ao carregar dados do usuário.';
    }
  }

  loadUserExcursions(): void {
    console.log('[UserComponent] - loadUserExcursions: Loading user excursions');
    if (!this.currentUser) {
      console.error('[UserComponent] - loadUserExcursions: No current user available');
      return;
    }

    console.log('[UserComponent] - loadUserExcursions: Current user:', this.currentUser);
    this.loading = true;
    this.excursionService.getExcursions().subscribe({
      next: (excursions) => {
        console.log('[UserComponent] - loadUserExcursions: All excursions received:', excursions.length, 'excursions');
        console.log('[UserComponent] - loadUserExcursions: All excursions:', excursions);
        this.userExcursions = excursions.filter(excursion => {
          console.log('[UserComponent] - loadUserExcursions: Checking excursion:', excursion.name, 'users:', excursion.users);
          const isUserInExcursion = excursion.users?.some((user: any) => user._id === this.currentUser!.id);
          console.log('[UserComponent] - loadUserExcursions: Is user in excursion?', isUserInExcursion);
          return isUserInExcursion;
        });
        console.log('[UserComponent] - loadUserExcursions: Filtered user excursions:', this.userExcursions.length, 'excursions');
        console.log('[UserComponent] - loadUserExcursions: Filtered user excursions:', this.userExcursions);
        this.loading = false;
      },
      error: (err) => {
        console.error('[UserComponent] - loadUserExcursions: Error loading excursions:', err);
        this.error = err?.error?.message || 'Erro ao carregar excursões';
        this.loading = false;
      }
    });
  }

  unsubscribeFromExcursion(excursionId: string): void {
    console.log('[UserComponent] - unsubscribeFromExcursion: Unsubscribing from excursion:', excursionId);
    if (!this.currentUser?.id) {
      console.error('[UserComponent] - unsubscribeFromExcursion: No current user ID available');
      return;
    }

    const url = `${environment.apiUrl}/users/${this.currentUser.id}/unsubscribe/${excursionId}`;
    console.log('[UserComponent] - unsubscribeFromExcursion: Making request to:', url);
    this.http.post(url, {}).subscribe({
      next: () => {
        console.log('[UserComponent] - unsubscribeFromExcursion: Successfully unsubscribed from excursion');
        // Remove the excursion from the local list
        this.userExcursions = this.userExcursions.filter(e => e._id !== excursionId);
        console.log('[UserComponent] - unsubscribeFromExcursion: Excursion removed from local list');
      },
      error: (err) => {
        console.error('[UserComponent] - unsubscribeFromExcursion: Error unsubscribing:', err);
        alert(err?.error?.message || 'Erro ao sair da excursão');
      }
    });
  }

  onFileSelected(event: Event): void {
    console.log('[UserComponent] - onFileSelected: File selected');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('[UserComponent] - onFileSelected: File name:', this.selectedFile.name, 'size:', this.selectedFile.size);
      this.uploadError = '';
      this.uploadMessage = '';
    }
  }

  uploadPicture(): void {
    console.log('[UserComponent] - uploadPicture: Starting picture upload');
    if (!this.selectedFile) {
      console.warn('[UserComponent] - uploadPicture: No file selected');
      this.uploadError = 'Por favor, selecione uma imagem.';
      return;
    }

    if (!this.currentUser?.id) {
      console.error('[UserComponent] - uploadPicture: No current user ID');
      this.uploadError = 'Usuário não autenticado.';
      return;
    }

    const formData = new FormData();
    formData.append('picture', this.selectedFile);

    const url = `${environment.apiUrl}/users/${this.currentUser.id}/picture`;
    console.log('[UserComponent] - uploadPicture: Uploading to:', url);

    this.uploadError = '';
    this.uploadMessage = 'Enviando foto...';

    this.http.post<{ message: string; pictureId: string }>(url, formData).subscribe({
      next: (res) => {
        console.log('[UserComponent] - uploadPicture: Upload successful, pictureId:', res.pictureId);
        this.uploadMessage = res.message || 'Foto enviada com sucesso!';
        
        // Update local storage with new picture ID
        if (this.currentUser) {
          this.currentUser.picture = res.pictureId;
          localStorage.setItem('user', JSON.stringify(this.currentUser));
          console.log('[UserComponent] - uploadPicture: Updated localStorage with new picture ID');
        }

        // Sync avatar service
        this.avatar.syncWithStoredUser();

        // Clear file input
        this.selectedFile = null;

        // Reload page after a short delay to ensure navbar updates
        setTimeout(() => {
          console.log('[UserComponent] - uploadPicture: Reloading page after upload');
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        console.error('[UserComponent] - uploadPicture: Upload failed:', err);
        this.uploadError = err?.error?.message || 'Erro ao fazer upload da foto.';
        this.uploadMessage = '';
      }
    });
  }
}
