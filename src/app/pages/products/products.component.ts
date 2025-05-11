import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../shared/interfaces/produto.inteface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  produtos: Produto[] = [];

  nome = '';
  preco = 0;
  estoque = 0;
  custoAtual = 0;
  precoSugerido = 0;
  custoMedio = 0;
  margem = 0; // Margem de lucro em porcentagem
  precoVenda = 0;
  lucroEstimado = 0; // Adicione essa variável na sua classe


  edit = false;
  produtoEdit: number | null = null;

  constructor(
    private produtoService: ProdutoService // Injetando o serviço de produtos
  ) {
    console.log('Constructor chamado');
  }

  ngOnInit() {
    debugger;
    console.log('ngOnInit chamado');
    this.loadProdutos();
  }

  loadProdutos() {
    debugger;
    this.produtoService.getAll().subscribe((res) => {
      console.log('Recebido da API:', res); // 👈 veja no console
      this.produtos = res;
    });
    console.log(this.produtos);
  }

  addProduto() {
    if (!this.nome.trim()) {
      alert('Nome do produto é obrigatório!');
      return;
    }

    if (this.precoVenda <= 0) {
      alert('Preço do produto deve ser maior que zero!');
      return;
    }

    if (this.estoque < 0) {
      alert('Estoque do produto não pode ser negativo!');
      return;
    }
    const produto: Produto = {
      nome: this.nome,
      preco: this.precoVenda,
      estoque: this.estoque,
      custoAtual: this.custoAtual,
      precoSugerido: this.precoSugerido,
      custoMedio: this.custoMedio,
      margem: this.margem,
      precoVenda: this.precoVenda,
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
    // Preenche os campos do formulário com os dados do produto selecionado
    this.nome = produto.nome;
    this.estoque = produto.estoque;
    this.custoAtual = produto.custoAtual ?? 0;
    this.custoMedio = produto.custoMedio ?? 0;
    this.margem = produto.margem ?? 0;
    this.precoVenda = produto.precoVenda ?? 0;
    this.precoSugerido = produto.precoSugerido ?? 0;
  
    // Define o modo de edição
    this.edit = true;
    this.produtoEdit = produto.id ?? null; // Armazena o ID do produto sendo editado
  }
  deleteProduto(produto: Produto) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      if (produto.id != null) {
        // cobre null e undefined
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
    this.custoAtual = 0;
    this.precoSugerido = 0;
    this.custoMedio = 0;
    this.margem = 0;
    this.precoVenda = 0;
  }

  calcularValores() {
    const custo = Number(this.custoAtual);
    const margem = Number(this.margem);
    const precoVenda = Number(this.precoVenda);
  
    // 🚨 Validação básica
    if (custo <= 0) {
      this.precoSugerido = 0;
      this.lucroEstimado = 0;
      this.margem = 0;
      return;
    }
  
    // ✅ Calcular preço sugerido com base na margem sobre o custo (markup)
    this.precoSugerido = +(custo * (1 + margem / 100)).toFixed(2);
  
    // ✅ Se houver preço de venda informado, recalcular margem real e lucro estimado
    if (precoVenda > 0) {
      const margemCalculada = ((precoVenda - custo) / custo) * 100;
  
      // Permitir margens negativas
      this.margem = +margemCalculada.toFixed(2);
      this.lucroEstimado = +(precoVenda - custo).toFixed(2);
    } else if (precoVenda === 0) {
      // Caso o preço de venda seja zero
      this.margem = -100; // Margem negativa total
      this.lucroEstimado = -custo; // Prejuízo total igual ao custo
    } else {
      this.lucroEstimado = +(this.precoSugerido - custo).toFixed(2);
    }
  }
}