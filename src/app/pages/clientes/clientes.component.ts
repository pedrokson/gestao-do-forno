import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  nome: string = '';
  telefone: string = '';
  mensagem: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.getAll().subscribe((res: any[]) => this.clientes = res);
  }

  cadastrarCliente() {
    if (!this.nome) {
      this.mensagem = 'Preencha o nome!';
      return;
    }
    this.clienteService.create({ nome: this.nome, telefone: this.telefone }).subscribe({
      next: () => {
        this.mensagem = 'Cliente cadastrado!';
        this.nome = '';
        this.telefone = '';
        this.carregarClientes();
      },
      error: () => this.mensagem = 'Erro ao cadastrar cliente.'
    });
  }
}