import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Produto } from '../../models/produto.model';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-products',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  produtos: Produto[] = [];

  nome = '';
  preco = 0;
  estoque = 0;

  addProduto() {
    const novoProduto: Produto = {
      id: Date.now(), 
      nome: this.nome,
      preco: this.preco,
      estoque: this.estoque
    };

    this.produtos.push(novoProduto);

    // Limpa os campos após adicionar o produto
    this.nome = '';
    this.preco = 0;
    this.estoque = 0; 
  }
}
