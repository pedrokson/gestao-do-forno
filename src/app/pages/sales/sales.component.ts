import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { ProdutoService, Produto } from '../../services/produto.service';
import { Sale } from '../../shared/interfaces/sales.interface';
import { User } from '../../shared/interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  clientes: any[] = [];
  clienteId: number | null = null;
  fiado: boolean = false;
  produtos: Produto[] = [];
  vendas: Sale[] = [];
  usuarios: User[] = [];


  produto_id: number | null = null;
  vendedor_id: number | null = null;
  quantidade: number = 1;
  data: string = new Date().toISOString().slice(0, 10);
  formaPagamento: string = '';

  mensagem = '';

  constructor(
    private salesService: SalesService,
    private produtoService: ProdutoService,
    private userService: UserService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((res) => (this.usuarios = res));
    this.carregarProdutos();
    this.carregarVendas();
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.listar().subscribe((res: any[]) => (this.clientes = res));
  }

  carregarProdutos() {
    this.produtoService.getAll().subscribe((res) => (this.produtos = res));
  }

  carregarVendas() {
    this.salesService.getAll().subscribe((res: any[]) => {
      this.vendas = res.map((v) => ({
        ...v,
        produtoId: v.produto_id,
        dataVenda: v.data_venda,
        valorTotal: v.valor_total,
        clienteId: v.cliente_id,
        formaPagamento: v.forma_pagamento,
        fiado: v.fiado // Certifique-se que o backend retorna esse campo
      }));
    });
  }

  registrarVenda() {
    this.mensagem = '';

    if (
      !this.produto_id ||
      this.quantidade <= 0 ||
      !this.data ||
      !this.vendedor_id ||
      !this.formaPagamento ||
      !this.clienteId
    ) {
      this.mensagem = 'Preencha todos os campos corretamente.';
      return;
    }

    const produtoSelecionado = this.produtos.find(
      (p) => p.id === Number(this.produto_id)
    );
    if (!produtoSelecionado) {
      this.mensagem = 'Produto não encontrado.';
      return;
    }

    const valorTotal = this.quantidade * produtoSelecionado.preco;

    const sale: any = {
      produtoId: this.produto_id,
      quantidade: this.quantidade,
      valorTotal: valorTotal,
      dataVenda: this.data,
      clienteId: this.clienteId,
      vendedorId: this.vendedor_id,
      forma_pagamento: this.formaPagamento,
      fiado: this.fiado ? 1 : 0
    };

    this.salesService.create(sale).subscribe({
      next: () => {
        this.mensagem = '✅ Venda registrada com sucesso!';
        this.quantidade = 1;
        this.data = new Date().toISOString().slice(0, 10);
        this.formaPagamento = '';
        this.fiado = false;
        this.clienteId = null;
        this.produto_id = null;
        this.vendedor_id = null;
        this.carregarVendas();
      },
      error: (err) => {
        if (err.status === 400 && err.error?.erro) {
          this.mensagem = `⚠️ ${err.error.erro}`;
        } else {
          this.mensagem = 'Erro ao registrar a venda. Tente novamente.';
        }
      },
    });
  }

  getNomeProduto(produtoId: number): string {
    const produto = this.produtos.find((p) => p.id == produtoId);
    return produto ? produto.nome : 'Produto não encontrado';
  }

  getPrecoProduto(produtoId: number): number {
    const produto = this.produtos.find((p) => p.id == produtoId);
    return produto ? produto.preco : 0;
  }
  
  getNomeCliente(clienteId: number): string {
    const cliente = this.clientes.find((c) => c.id == clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  }
}