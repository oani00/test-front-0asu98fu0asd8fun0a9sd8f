import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Excursion } from '../models/excursion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {

  constructor(
    private http: HttpClient
  ) {
    console.log('[ExcursionService] - constructor: Excursion service initialized');
  }

  getExcursions(): Observable<Excursion[]> {
    const url = `${environment.apiUrl}/excursions`;
    console.log('[ExcursionService] - getExcursions: Fetching all excursions from:', url);
    return this.http.get<Excursion[]>(url);
  }

  getExcursionById(id: string): Observable<Excursion> {
    const url = `${environment.apiUrl}/excursions/${id}`;
    console.log('[ExcursionService] - getExcursionById: Fetching excursion by ID:', id, 'from:', url);
    return this.http.get<Excursion>(url);
  }

  subscribeToExcursion(userId: string, excursionId: string): Observable<any> {
    const url = `${environment.apiUrl}/users/${userId}/subscribe/${excursionId}`;
    console.log('[ExcursionService] - subscribeToExcursion: Subscribing user', userId, 'to excursion', excursionId, 'via:', url);
    return this.http.post(url, {});
  }

  unsubscribeFromExcursion(userId: string, excursionId: string): Observable<any> {
    const url = `${environment.apiUrl}/users/${userId}/unsubscribe/${excursionId}`;
    console.log('[ExcursionService] - unsubscribeFromExcursion: Unsubscribing user', userId, 'from excursion', excursionId, 'via:', url);
    return this.http.post(url, {});
  }
}