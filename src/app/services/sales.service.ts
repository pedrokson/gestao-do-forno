import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../shared/interfaces/sales.interface';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = 'http://localhost:3000/vendas';

  constructor(
    private http: HttpClient
  ) { }

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  create(sale: Sale): Observable<any> {
    return this.http.post(this.apiUrl, sale);
  }
}
