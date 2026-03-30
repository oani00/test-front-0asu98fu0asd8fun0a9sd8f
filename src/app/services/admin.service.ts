import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Excursion } from '../models/excursion';
import { environment } from '../../environments/environment';

/** Body for PATCH /users/:id when updating role (maps to `type` on the server). */
export interface PatchUserRoleBody {
  role: 'user' | 'admin';
}

export interface PatchUserResponse {
  message: string;
  user: { id: string; name: string; phone?: string; type: string };
}

/** GET /SignUp/GetUserByPhone — no password in response */
export interface UserLookupByPhoneResponse {
  id: string;
  name: string;
  phone: string;
  type: string;
  picture?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('[AdminService] - constructor: Admin service initialized with base URL:', this.base);
  }

  // Excursion CRUD
  createExcursion(data: Partial<Excursion>, file?: File): Observable<Excursion> {
    console.log('[AdminService] - createExcursion: Creating excursion with data:', data, 'file:', file?.name);
    const url = `${this.base}/excursions`;
    console.log('[AdminService] - createExcursion: Making POST request to:', url);
    
    if (file) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name || '');
      if (data.description) formData.append('description', data.description);
      if (data.date) formData.append('date', data.date instanceof Date ? data.date.toISOString() : data.date);
      if (data.location) formData.append('location', data.location);
      if (data.price !== undefined) formData.append('price', data.price.toString());
      formData.append('type', data.type || 'passeio');
      formData.append('file', file);
      return this.http.post<Excursion>(url, formData);
    } else {
      // Use JSON for regular data
      return this.http.post<Excursion>(url, data);
    }
  }

  updateExcursion(id: string, data: Partial<Excursion>, file?: File): Observable<Excursion> {
    console.log('[AdminService] - updateExcursion: Updating excursion ID:', id, 'with data:', data, 'file:', file?.name);
    const url = `${this.base}/excursions/${id}`;
    console.log('[AdminService] - updateExcursion: Making PUT request to:', url);
    
    if (file) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name || '');
      if (data.description) formData.append('description', data.description);
      if (data.date) formData.append('date', data.date instanceof Date ? data.date.toISOString() : data.date);
      if (data.location) formData.append('location', data.location);
      if (data.price !== undefined) formData.append('price', data.price.toString());
      if (data.type) formData.append('type', data.type);
      formData.append('file', file);
      return this.http.put<Excursion>(url, formData);
    } else {
      // Use JSON for regular data
      return this.http.put<Excursion>(url, data);
    }
  }

  deleteExcursion(id: string): Observable<{ message: string }> {
    console.log('[AdminService] - deleteExcursion: Deleting excursion ID:', id);
    const url = `${this.base}/excursions/${id}`;
    console.log('[AdminService] - deleteExcursion: Making DELETE request to:', url);
    return this.http.delete<{ message: string }>(url);
  }

  lookupUserByPhone(phone: string): Observable<UserLookupByPhoneResponse> {
    const params = new HttpParams().set('phone', phone);
    return this.http.get<UserLookupByPhoneResponse>(`${this.base}/SignUp/GetUserByPhone`, {
      params
    });
  }

  patchUserRole(userId: string, body: PatchUserRoleBody): Observable<PatchUserResponse> {
    const url = `${this.base}/users/${userId}`;
    return this.http.patch<PatchUserResponse>(url, body);
  }
}
