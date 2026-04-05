import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ExcursionService } from '../../services/excursion.service';
import { AdminService } from '../../services/admin.service';
import { Excursion, ExcursionUserRef } from '../../models/excursion';

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

  // User promotion/demotion: phone → GET GetUserByPhone → PATCH /users/:id
  targetPhone = '';
  targetRole: 'user' | 'admin' = 'user';
  userTypeMsg = '';
  userTypeLoading = false;

  // Filter
  filterType: 'passeio' | 'viagem' | 'all' = 'all';

  // Admin check
  isAdmin = true; // default true until checked
  authMsg = '';

  /** Keys `excursionId:userId` while disenroll/paid request in flight */
  private enrolleeBusy = new Set<string>();

  constructor(
    private excursionService: ExcursionService,
    private adminService: AdminService
  ) {
    console.log('[AdminPageComponent] - constructor: Admin page component initialized');
  }

  ngOnInit(): void {
    console.log('[AdminPageComponent] - ngOnInit: Initializing admin page');
    this.loadAdminAccessFromStorage();
    this.loadExcursions();
  }

  loadAdminAccessFromStorage() {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) {
        this.isAdmin = false;
        this.authMsg = 'Não autenticado.';
        return;
      }
      const parsed = JSON.parse(stored);
      this.isAdmin = parsed?.type === 'admin';
      this.authMsg = this.isAdmin ? '' : 'Acesso restrito: somente administradores.';
    } catch {
      this.isAdmin = false;
      this.authMsg = 'Erro ao ler usuário armazenado.';
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

  //TODO rever codigo comentado
  filteredExcursions(): EditableExcursion[] {
    // console.log('[AdminPageComponent] - filteredExcursions: Filtering excursions by type:', this.filterType);
    if (this.filterType === 'all') {
      // console.log('[AdminPageComponent] - filteredExcursions: Returning all excursions:', this.excursions.length);
      return this.excursions;
    }
    const filtered = this.excursions.filter(e => e.type === this.filterType);
    // console.log('[AdminPageComponent] - filteredExcursions: Filtered excursions:', filtered.length, 'for type:', this.filterType);
    return filtered;
  }

  private toDateInputValue(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().substring(0, 10);
  }

  toggleEdit(excursion: EditableExcursion) {
    console.log('[AdminPageComponent] - toggleEdit: Toggling edit mode for excursion:', excursion.name);
    excursion.editing = !excursion.editing;
    console.log('[AdminPageComponent] - toggleEdit: Edit mode set to:', excursion.editing);
    if (excursion.editing) {
      // Reset file selection when entering edit mode
      this.editingFiles.set(excursion._id || '', null);
      // Normalize dates to YYYY-MM-DD for <input type="date">
      (excursion as any).date = this.toDateInputValue(excursion.date);
      (excursion as any).returnDate = this.toDateInputValue(excursion.returnDate);
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

  enrolledUsers(ex: EditableExcursion): (string | ExcursionUserRef)[] {
    return ex.users || [];
  }

  userId(u: string | ExcursionUserRef): string {
    return typeof u === 'string' ? u : u._id;
  }

  userLabel(u: string | ExcursionUserRef): string {
    if (typeof u === 'string') return u;
    const name = u.name?.trim() || '—';
    const phone = u.phone?.trim();
    return phone ? `${name} (${phone})` : name;
  }

  isUserPaid(ex: EditableExcursion, u: string | ExcursionUserRef): boolean {
    const id = this.userId(u);
    return (ex.paidUsers || []).some((p) => String(p) === id);
  }

  isEnrolleeBusy(ex: EditableExcursion, u: string | ExcursionUserRef): boolean {
    if (!ex._id) return false;
    return this.enrolleeBusy.has(`${ex._id}:${this.userId(u)}`);
  }

  disenrollUser(ex: EditableExcursion, u: string | ExcursionUserRef) {
    if (!ex._id) return;
    const uid = this.userId(u);
    const key = `${ex._id}:${uid}`;
    if (this.enrolleeBusy.has(key)) return;
    if (!confirm('Desinscrever este usuário desta excursão?')) return;
    this.enrolleeBusy.add(key);
    this.adminService.disenrollUserFromExcursion(ex._id, uid).subscribe({
      next: () => {
        ex.users = (ex.users || []).filter((x) => this.userId(x) !== uid);
        ex.paidUsers = (ex.paidUsers || []).filter((p) => String(p) !== uid);
        this.enrolleeBusy.delete(key);
      },
      error: (err) => {
        alert(err?.error?.error || err?.error?.message || 'Erro ao desinscrever');
        this.enrolleeBusy.delete(key);
      }
    });
  }

  onPaidCheckboxChange(ex: EditableExcursion, u: string | ExcursionUserRef, ev: Event) {
    const paid = (ev.target as HTMLInputElement).checked;
    this.onPaidToggle(ex, u, paid);
  }

  /** Optimistic paidUsers update; reverts on API error so checkbox stays consistent */
  onPaidToggle(ex: EditableExcursion, u: string | ExcursionUserRef, paid: boolean) {
    if (!ex._id) return;
    const uid = this.userId(u);
    const key = `${ex._id}:${uid}`;
    if (this.enrolleeBusy.has(key)) return;

    const prevPaid = [...(ex.paidUsers || []).map(String)];
    const nextPaid = paid
      ? prevPaid.includes(uid) ? prevPaid : [...prevPaid, uid]
      : prevPaid.filter((p) => p !== uid);
    ex.paidUsers = nextPaid;

    this.enrolleeBusy.add(key);
    this.adminService.setExcursionUserPaid(ex._id, uid, paid).subscribe({
      next: () => {
        this.enrolleeBusy.delete(key);
      },
      error: (err) => {
        ex.paidUsers = prevPaid;
        alert(err?.error?.error || err?.error?.message || 'Erro ao atualizar pagamento');
        this.enrolleeBusy.delete(key);
      }
    });
  }

  submitChangeUserType() {
    this.userTypeMsg = '';
    const phone = this.targetPhone.trim();
    if (!phone) {
      this.userTypeMsg = 'Telefone do usuário alvo é obrigatório';
      return;
    }
    this.userTypeLoading = true;
    this.adminService
      .lookupUserByPhone(phone)
      .pipe(switchMap((u) => this.adminService.patchUserRole(String(u.id), { role: this.targetRole })))
      .subscribe({
        next: (res) => {
          this.userTypeMsg = res.message;
          this.userTypeLoading = false;
        },
        error: (err) => {
          this.userTypeMsg = err?.error?.message || 'Erro na alteração';
          this.userTypeLoading = false;
        }
      });
  }
}
