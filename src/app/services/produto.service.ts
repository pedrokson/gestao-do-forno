import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
  estoque: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  create(produto: Produto): Observable<any> {
    return this.http.post(this.apiUrl, produto);
  }

  update(id: number, produto: Produto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, produto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}