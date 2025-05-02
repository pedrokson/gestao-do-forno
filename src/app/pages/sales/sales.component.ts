import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { ProdutoService, Produto } from '../../services/produto.service';
import { Sale } from '../../shared/interfaces/sales.interface';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  produtos: Produto[] = [];
  vendas: Sale[] = [];

  produto_id: number | null = null;
  quantidade: number = 1;
  data: string = new Date().toISOString().slice(0, 10); // formato yyyy-MM-dd

  mensagem = '';

  constructor(
    private salesService: SalesService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarVendas();
  }

  carregarProdutos() {
    this.produtoService.getAll().subscribe(res => this.produtos = res);
  }

  carregarVendas() {
    this.salesService.getAll().subscribe(res => this.vendas = res);
  }

  registrarVenda() {
    if (!this.produto_id || this.quantidade <= 0 || !this.data) {
      this.mensagem = 'Preencha todos os campos corretamente.';
      return;
    }

    const sales: Sale = {
      produtoId: this.produto_id,
      quantidade: this.quantidade,
      dataVenda: this.data,
      valorTotal: 0,
      clienteId: 0
    };

    this.salesService.create(sales).subscribe(() => {
      this.mensagem = 'Venda registrada com sucesso!';
      this.quantidade = 1;
      this.data = new Date().toISOString().slice(0, 10);
      this.carregarVendas();
    });
  }
}