import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { ProdutoService, Produto } from '../../services/produto.service';
import { Sale } from '../../shared/interfaces/sales.interface';
import { User } from '../../shared/interfaces/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  produtos: Produto[] = [];
  vendas: Sale[] = [];
  usuarios: User[] = []; // Adicionei esta linha para armazenar os usuários, se necessário

  produto_id: number | null = null;
  vendedor_id: number | null = null; // Adicionei esta linha para armazenar o vendedor_id, se necessário
  quantidade: number = 1;
  data: string = new Date().toISOString().slice(0, 10); // formato yyyy-MM-dd

  mensagem = '';

  constructor(
    private salesService: SalesService,
    private produtoService: ProdutoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((res) => (this.usuarios = res)); // Adicionei esta linha para carregar os usuários, se necessário
    this.carregarProdutos();
    this.carregarVendas();
  }

  carregarProdutos() {
    this.produtoService.getAll().subscribe((res) => (this.produtos = res));
  }

  carregarVendas() {
    this.salesService.getAll().subscribe((res: any[]) => {
      this.vendas = res.map(v => ({
        ...v,
        produtoId: v.produto_id,
        dataVenda: v.data_venda,
        valorTotal: v.valor_total,
        clienteId: v.cliente_id
      }));
    });
  }
  registrarVenda() {
    this.mensagem = '';
  
    // Validação dos campos obrigatórios
    if (!this.produto_id || this.quantidade <= 0 || !this.data || !this.vendedor_id) {
      this.mensagem = 'Preencha todos os campos corretamente.';
      return;
    }
  
    const produtoSelecionado = this.produtos.find(p => p.id === Number(this.produto_id));
  
    if (!produtoSelecionado) {
      this.mensagem = 'Produto não encontrado.';
      return;
    }
  
    const valorTotal = this.quantidade * produtoSelecionado.preco;
  
    const sale: Sale = {
      produtoId: this.produto_id,
      quantidade: this.quantidade,
      dataVenda: this.data,
      valorTotal: valorTotal,
      clienteId: this.vendedor_id
    };
  
    this.salesService.create(sale).subscribe({
      next: () => {
        this.mensagem = '✅ Venda registrada com sucesso!';
        this.quantidade = 1;
        this.data = new Date().toISOString().slice(0, 10);
        this.carregarVendas();
      },
      error: (err) => {
        if (err.status === 400 && err.error?.erro) {
          this.mensagem = `⚠️ ${err.error.erro};`
        } else {
          this.mensagem = 'Erro ao registrar a venda. Tente novamente.';
        }
      }
    });
  }

  getNomeProduto(produtoId: number): string {
    debugger
    const produto = this.produtos.find((p) => p.id == produtoId);
    return produto ? produto.nome : 'Produto não encontrado';
  }
  
  getPrecoProduto(produtoId: number): number {
    const produto = this.produtos.find((p) => p.id == produtoId);
    return produto ? produto.preco : 0;
  }
  
}
