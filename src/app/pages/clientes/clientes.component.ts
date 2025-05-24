import { Component, OnInit } from '@angular/core';
import { Cliente, ClienteService } from '../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-clientes',
  imports : [CommonModule, FormsModule],
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  cliente: Cliente = { nome: '', email: '', telefone: '' };
  clientes: Cliente[] = [];
  mensagem = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (dados) => this.clientes = dados,
      error: () => this.mensagem = 'Erro ao carregar clientes.'
    });
  }

  cadastrarCliente(): void {
    if (!this.cliente.nome || !this.cliente.email || !this.cliente.telefone) {
      this.mensagem = 'Todos os campos são obrigatórios.';
      return;
    }

    this.clienteService.criar(this.cliente).subscribe({
      next: () => {
        this.mensagem = 'Cliente cadastrado com sucesso!';
        this.cliente = { nome: '', email: '', telefone: '' };
        this.carregarClientes();
      },
      error: (err) => {
        this.mensagem = 'Erro ao cadastrar: ' + err.error?.erro || err.message;
      }
    });
  }

  excluirCliente(id?: number): void {
    if (!id) return;

    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.remover(id).subscribe({
        next: () => this.carregarClientes(),
        error: () => this.mensagem = 'Erro ao excluir cliente.'
      });
    }
  }
}