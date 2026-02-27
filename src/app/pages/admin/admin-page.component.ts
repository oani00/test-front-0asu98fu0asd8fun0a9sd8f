import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcursionService } from '../../services/excursion.service';
import { AdminService, ChangeUserTypeRequest } from '../../services/admin.service';
import { Excursion } from '../../models/excursion';

// Simple UI state types
interface EditableExcursion extends Excursion { editing?: boolean; }

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  // Excursions
  excursions: EditableExcursion[] = [];
  loadingExcursions = false;
  errorExcursions = '';

  // New excursion form model
  newExcursion: Partial<Excursion> = { type: 'passeio', name: '' };
  creating = false;
  createMsg = '';
  selectedFile: File | null = null;
  editingFiles: Map<string, File | null> = new Map();

  // User promotion/demotion form
  targetUserId = '';
  targetType: 'user' | 'admin' = 'user';
  requestingUserEmail = '';
  requestingUserPassword = '';
  userTypeMsg = '';
  userTypeLoading = false;

  // Filter
  filterType: 'passeio' | 'viagem' | 'all' = 'all';

  // Admin check
  isAdmin = true; // default true until checked
  authMsg = '';

  constructor(
    private excursionService: ExcursionService,
    private adminService: AdminService
  ) {
    console.log('[AdminPageComponent] - constructor: Admin page component initialized');
  }

  ngOnInit(): void {
    console.log('[AdminPageComponent] - ngOnInit: Initializing admin page');
    this.prefillAdminCredentials();
    this.loadExcursions();
  }

  prefillAdminCredentials() {
    console.log('[AdminPageComponent] - prefillAdminCredentials: Loading admin credentials from localStorage');
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[AdminPageComponent] - prefillAdminCredentials: User data parsed:', parsed);
        if (parsed?.email) {
          this.requestingUserEmail = parsed.email;
          console.log('[AdminPageComponent] - prefillAdminCredentials: Email set:', this.requestingUserEmail);
        }
        if (parsed?.type) {
          this.isAdmin = parsed.type === 'admin';
          console.log('[AdminPageComponent] - prefillAdminCredentials: Admin status:', this.isAdmin);
          if (!this.isAdmin) {
            this.authMsg = 'Acesso restrito: somente administradores.';
            console.log('[AdminPageComponent] - prefillAdminCredentials: Non-admin user detected');
          }
        }
      } else {
        this.isAdmin = false;
        this.authMsg = 'Não autenticado.';
        console.log('[AdminPageComponent] - prefillAdminCredentials: No user data in localStorage');
      }
    } catch {
      this.isAdmin = false;
      this.authMsg = 'Erro ao ler usuário armazenado.';
      console.error('[AdminPageComponent] - prefillAdminCredentials: Error parsing user data');
    }
  }

  loadExcursions() {
    console.log('[AdminPageComponent] - loadExcursions: Loading excursions from service');
    this.loadingExcursions = true;
    this.excursionService.getExcursions().subscribe({
      next: (data) => {
        console.log('[AdminPageComponent] - loadExcursions: Received excursions data:', data.length, 'excursions');
        this.excursions = data as EditableExcursion[];
        this.loadingExcursions = false;
        console.log('[AdminPageComponent] - loadExcursions: Excursions loaded successfully');
      },
      error: (err) => {
        console.error('[AdminPageComponent] - loadExcursions: Error loading excursions:', err);
        this.errorExcursions = err?.error?.message || 'Erro ao carregar excursões';
        this.loadingExcursions = false;
      }
    });
  }

  filteredExcursions(): EditableExcursion[] {
    console.log('[AdminPageComponent] - filteredExcursions: Filtering excursions by type:', this.filterType);
    if (this.filterType === 'all') {
      console.log('[AdminPageComponent] - filteredExcursions: Returning all excursions:', this.excursions.length);
      return this.excursions;
    }
    const filtered = this.excursions.filter(e => e.type === this.filterType);
    console.log('[AdminPageComponent] - filteredExcursions: Filtered excursions:', filtered.length, 'for type:', this.filterType);
    return filtered;
  }

  toggleEdit(excursion: EditableExcursion) {
    console.log('[AdminPageComponent] - toggleEdit: Toggling edit mode for excursion:', excursion.name);
    excursion.editing = !excursion.editing;
    console.log('[AdminPageComponent] - toggleEdit: Edit mode set to:', excursion.editing);
    if (excursion.editing) {
      // Reset file selection when entering edit mode
      this.editingFiles.set(excursion._id || '', null);
    }
  }

  onFileSelected(event: Event, excursionId?: string) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      if (excursionId) {
        this.editingFiles.set(excursionId, file);
        console.log('[AdminPageComponent] - onFileSelected: File selected for excursion:', excursionId, file.name);
      } else {
        this.selectedFile = file;
        console.log('[AdminPageComponent] - onFileSelected: File selected for new excursion:', file.name);
      }
    }
  }

  saveExcursion(excursion: EditableExcursion) {
    console.log('[AdminPageComponent] - saveExcursion: Saving excursion:', excursion.name);
    if (!excursion._id) {
      console.error('[AdminPageComponent] - saveExcursion: No excursion ID provided');
      return;
    }
    const excursionId = excursion._id;
    const file = this.editingFiles.get(excursionId) || undefined;
    this.adminService.updateExcursion(excursionId, excursion, file).subscribe({
      next: (res) => {
        console.log('[AdminPageComponent] - saveExcursion: Excursion saved successfully:', res);
        Object.assign(excursion, res, { editing: false });
        this.editingFiles.delete(excursionId);
      },
      error: (err) => {
        console.error('[AdminPageComponent] - saveExcursion: Error saving excursion:', err);
        alert(err?.error?.message || 'Erro ao salvar excursão');
      }
    });
  }

  deleteExcursion(excursion: EditableExcursion) {
    console.log('[AdminPageComponent] - deleteExcursion: Attempting to delete excursion:', excursion.name);
    if (!excursion._id) {
      console.error('[AdminPageComponent] - deleteExcursion: No excursion ID provided');
      return;
    }
    if (!confirm('Confirmar exclusão?')) {
      console.log('[AdminPageComponent] - deleteExcursion: User cancelled deletion');
      return;
    }
    this.adminService.deleteExcursion(excursion._id).subscribe({
      next: () => {
        console.log('[AdminPageComponent] - deleteExcursion: Excursion deleted successfully');
        this.excursions = this.excursions.filter(e => e._id !== excursion._id);
      },
      error: (err) => {
        console.error('[AdminPageComponent] - deleteExcursion: Error deleting excursion:', err);
        alert(err?.error?.message || 'Erro ao deletar')
      }
    });
  }

  createExcursion() {
    console.log('[AdminPageComponent] - createExcursion: Creating new excursion:', this.newExcursion);
    this.createMsg = '';
    if (!this.newExcursion.name) {
      console.log('[AdminPageComponent] - createExcursion: Validation failed - name is required');
      this.createMsg = 'Nome é obrigatório';
      return;
    }
    this.creating = true;
    this.adminService.createExcursion(this.newExcursion, this.selectedFile || undefined).subscribe({
      next: (created) => {
        console.log('[AdminPageComponent] - createExcursion: Excursion created successfully:', created);
        this.excursions.push(created as EditableExcursion);
        this.newExcursion = { type: 'passeio', name: '' };
        this.selectedFile = null;
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.creating = false;
        this.createMsg = 'Criado com sucesso';
      },
      error: (err) => {
        console.error('[AdminPageComponent] - createExcursion: Error creating excursion:', err);
        this.creating = false;
        this.createMsg = err?.error?.message || 'Erro ao criar';
      }
    });
  }

  submitChangeUserType() {
    console.log('[AdminPageComponent] - submitChangeUserType: Changing user type for user ID:', this.targetUserId, 'to:', this.targetType);
    this.userTypeMsg = '';
    if (!this.targetUserId) {
      console.log('[AdminPageComponent] - submitChangeUserType: Validation failed - target user ID required');
      this.userTypeMsg = 'ID do usuário alvo é obrigatório';
      return;
    }
    if (!this.requestingUserEmail || !this.requestingUserPassword) {
      console.log('[AdminPageComponent] - submitChangeUserType: Validation failed - admin credentials required');
      this.userTypeMsg = 'Credenciais de administrador são obrigatórias';
      return;
    }
    const payload: ChangeUserTypeRequest = {
      type: this.targetType,
      requestingUserEmail: this.requestingUserEmail,
      requestingUserPassword: this.requestingUserPassword
    };
    console.log('[AdminPageComponent] - submitChangeUserType: Payload prepared:', payload);
    this.userTypeLoading = true;
    this.adminService.changeUserType(this.targetUserId, payload).subscribe({
      next: (res) => {
        console.log('[AdminPageComponent] - submitChangeUserType: User type changed successfully:', res);
        this.userTypeMsg = res.message;
        this.userTypeLoading = false;
      },
      error: (err) => {
        console.error('[AdminPageComponent] - submitChangeUserType: Error changing user type:', err);
        this.userTypeMsg = err?.error?.message || 'Erro na alteração';
        this.userTypeLoading = false;
      }
    });
  }
}
