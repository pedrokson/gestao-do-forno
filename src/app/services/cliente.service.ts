import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://localhost:8000/api/clientes';
  constructor(private http: HttpClient) {}
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  create(cliente: any): Observable<any> {
    return this.http.post(this.apiUrl, cliente);
  }
}