import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private API_URL = 'http://localhost:8000/api/vendas'; // Substitua pela sua URL real

  constructor(private http: HttpClient) {}

  getRelatorios(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }
}
