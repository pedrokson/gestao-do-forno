import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private API_URL = 'http://localhost:3000/relatorios'; 
  private API_URL_VENDAS = 'http://localhost:3000/vendas';

  constructor(private http: HttpClient) {}

  getVendas(dataInicio: string, dataFim: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/vendas?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  getFiado(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/fiado`);
  }

  pagarVenda(id: number): Observable<any> {
    return this.http.put<any>(`${this.API_URL_VENDAS}/${id}/pagar`, {});
  }
}
