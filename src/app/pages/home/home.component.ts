import { Component } from '@angular/core';
import { Produto } from '../../services/produto.service';
import { HomeService } from '../../services/home.service';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  totalVendasHoje = 0;
  faturamentoMensal = 0;
  maisVendidos: { nome: string; total: number }[] = [];
  estoqueCritico: Produto[] = [];

  constructor(private dashboardService: HomeService) {}

  ngOnInit(): void {
    this.dashboardService.getTotalVendasDia().subscribe(res => this.totalVendasHoje = res.total);
    this.dashboardService.getFaturamentoMensal().subscribe(res => this.faturamentoMensal = res.total);
    this.dashboardService.getMaisVendidos().subscribe(res => this.maisVendidos = res);
    this.dashboardService.getEstoqueCritico().subscribe(res => this.estoqueCritico = res);
  }
}
