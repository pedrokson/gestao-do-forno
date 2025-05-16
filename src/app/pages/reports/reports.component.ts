import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CurrencyPipe],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  dataInicial: string = '';
  dataFinal: string = '';

  relatoriosOriginais: any[] = []; // Dados originais, sem filtro
  relatorios: any[] = []; // Dados filtrados para mostrar na tabela

  constructor() {}

  ngOnInit(): void {
    // Inicializa com um período padrão, para já mostrar algo
    this.dataInicial = '2025-05-01';
    this.dataFinal = '2025-05-31';

    this.carregarRelatorios();
    this.filtrarRelatorios();
  }

  carregarRelatorios(): void {
    // Exemplo com dados fictícios
    this.relatoriosOriginais = [
      {
        data: '2025-05-01',
        produto: 'Produto A',
        categoria: 'Categoria 1',
        quantidade: 10,
        total: 500,
      },
      {
        data: '2025-05-02',
        produto: 'Produto B',
        categoria: 'Categoria 2',
        quantidade: 5,
        total: 250,
      },
      {
        data: '2025-05-15',
        produto: 'Produto C',
        categoria: 'Categoria 1',
        quantidade: 7,
        total: 350,
      },
      {
        data: '2025-05-20',
        produto: 'Produto A',
        categoria: 'Categoria 1',
        quantidade: 3,
        total: 150,
      },
    ];
  }

  filtrarRelatorios(): void {
    if (!this.dataInicial || !this.dataFinal) {
      this.relatorios = [];
      return;
    }

    const inicio = new Date(this.dataInicial);
    const fim = new Date(this.dataFinal);

    this.relatorios = this.relatoriosOriginais.filter((r) => {
      const data = new Date(r.data);
      return data >= inicio && data <= fim;
    });

    setTimeout(() => {
      this.gerarGraficos();
    }, 100);
  }

  gerarGraficos(): void {
    // Destrói gráficos antigos para evitar sobreposição
    const ctx1 = (document.getElementById('grafico1') as HTMLCanvasElement).getContext('2d');
    const ctx2 = (document.getElementById('grafico2') as HTMLCanvasElement).getContext('2d');

    // Dados para gráfico de pizza (total por categoria)
    const categoriasMap = new Map<string, number>();
    this.relatorios.forEach((r) => {
      categoriasMap.set(r.categoria, (categoriasMap.get(r.categoria) || 0) + r.total);
    });

    const categorias = Array.from(categoriasMap.keys());
    const totalPorCategoria = Array.from(categoriasMap.values());
    (window as any).grafico1 = new Chart(ctx1!, {
      type: 'pie',
      data: {
        labels: categorias,
        datasets: [
          {
            label: 'Total por Categoria',
            data: totalPorCategoria,
            backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Distribuição de Vendas (R$)' },
        },
      },
    });

    // Dados para gráfico de barras (quantidade por produto)
    const produtosMap = new Map<string, number>();
    this.relatorios.forEach((r) => {
      produtosMap.set(r.produto, (produtosMap.get(r.produto) || 0) + r.quantidade);
    });

    const produtos = Array.from(produtosMap.keys());
    const quantidadePorProduto = Array.from(produtosMap.values());

    (window as any).grafico2 = new Chart(ctx2!, {
      type: 'bar',
      data: {
        labels: produtos,
        datasets: [
          {
            label: 'Quantidade Vendida',
            data: quantidadePorProduto,
            backgroundColor: '#007bff',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Quantidade por Produto' },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  exportarCSV(): void {
    if (this.relatorios.length === 0) {
      alert('Nenhum dado para exportar');
      return;
    }

    const csvHeaders = ['Data', 'Produto', 'Categoria', 'Quantidade', 'Total'];
    const csvRows = this.relatorios.map((r) =>
      [r.data, r.produto, r.categoria, r.quantidade, r.total].join(',')
    );

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  imprimir(): void {
    window.print();
  }
}
