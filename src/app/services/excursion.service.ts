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
  ) { }

  getExcursions(): Observable<Excursion[]> {
    return this.http.get<Excursion[]>(`${environment.apiUrl}/excursions`);
  }

  getExcursionById(id: string): Observable<Excursion> {
    return this.http.get<Excursion>(`${environment.apiUrl}/excursions/${id}`);
  }
}