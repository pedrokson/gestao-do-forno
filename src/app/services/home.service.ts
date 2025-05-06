import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produto } from './produto.service';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private api = 'http://localhost:3000/home';

  constructor(private http: HttpClient) {}

  getTotalVendasDia() {
    return this.http.get<{ total: number }>(`${this.api}/vendas-dia`);
  }

  getFaturamentoMensal() {
    return this.http.get<{ total: number }>(`${this.api}/faturamento-mensal`);
  }

  getMaisVendidos() {
    return this.http.get<{ nome: string, total: number }[]>(`${this.api}/mais-vendidos`);
  }

  getEstoqueCritico() {
    return this.http.get<Produto[]>(`${this.api}/estoque-critico`);
  }
}
