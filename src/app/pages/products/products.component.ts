import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Produto, ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  produtos: Produto[] = [];

  nome = '';
  preco = 0;
  estoque = 0;

  edit = false;
  produtoEdit: number | null = null;

  constructor(
    private produtoService: ProdutoService // Injetando o serviço de produtos
  ) {}

  ngOnInit() {
    this.loadProdutos();
  }

  loadProdutos() {
    debugger
    this.produtoService.getAll().subscribe((res) => {
      this.produtos = res;
    });
  }

  addProduto() {
    const produto: Produto = {
      nome: this.nome,
      preco: this.preco,
      estoque: this.estoque,
    };
    if (this.edit && this.produtoEdit !== null) {
      this.produtoService.update(this.produtoEdit, produto).subscribe((res) => {
        this.loadProdutos();
        this.resetForm();
      });
    } else {
      this.produtoService.create(produto).subscribe((res) => {
        this.loadProdutos();
        this.resetForm();
      });
    }
  }

  editProduto(produto: Produto) {
    this.nome = produto.nome;
    this.preco = produto.preco;
    this.estoque = produto.estoque;
    this.edit = true;
    this.produtoEdit = produto.id!;
  }

  deleteProduto(produto: Produto) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      if (produto.id != null) { // cobre null e undefined
        this.produtoService.delete(produto.id).subscribe(() => {
          this.loadProdutos();
          if (this.produtoEdit === produto.id) {
            this.resetForm();
          }
        });
      }
    }
  }

  resetForm() {
    this.nome = '';
    this.preco = 0;
    this.estoque = 0;
    this.edit = false;
    this.produtoEdit = null;
  }
}
