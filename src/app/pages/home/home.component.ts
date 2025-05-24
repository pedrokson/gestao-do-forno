import { Component, OnInit } from '@angular/core';
import { Produto } from '../../services/produto.service';
import { HomeService } from '../../services/home.service';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service'; // ajuste o caminho se necessário

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // If you are using standalone components, uncomment the next line and remove from NgModule declarations
  // imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  clientes: any[] = [];
  totalVendasHoje = 0;
  faturamentoMensal = 0;
  maisVendidos: { nome: string; total: number }[] = [];
  estoqueCritico: Produto[] = [];

  constructor(
    private clienteService: ClienteService,
    private dashboardService: HomeService
  ) {}

  ngOnInit(): void {
    this.clienteService.getAll().subscribe((res: any[]) => (this.clientes = res));

    this.dashboardService
      .getTotalVendasDia()
      .subscribe((res) => (this.totalVendasHoje = res.total));
    this.dashboardService
      .getFaturamentoMensal()
      .subscribe((res) => (this.faturamentoMensal = res.total));
    this.dashboardService
      .getMaisVendidos()
      .subscribe((res) => (this.maisVendidos = res));
    this.dashboardService
      .getEstoqueCritico()
      .subscribe((res) => (this.estoqueCritico = res));
  }
}
