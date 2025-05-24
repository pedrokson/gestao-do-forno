import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ReportService } from '../../services/report.service';
import { get } from 'http';

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
  fiados: any[] = []; // Dados fiados, se necessário

  mostrarFiados: boolean = false; // Flag para mostrar fiados
  totalFiadoPorCliente: { cliente: string; total: number }[] = []; // Flag para agrupar fiados por cliente

  constructor(
    private currencyPipe: CurrencyPipe,
    private reportService: ReportService // Descomente se você tiver um serviço de relatório // private clienteService: ClienteService, // Descomente se você tiver um serviço de cliente
  ) // private produtoService: ProdutoService, // Descomente se você tiver um serviço de produto
  // private salesService: SalesService, // Descomente se você tiver um serviço de vendas
  // private userService: UserService, // Descomente se você tiver um serviço de usuário
  {}

  ngOnInit(): void {
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);

    this.dataInicial = seteDiasAtras.toISOString().slice(0, 10);
    this.dataFinal = hoje.toISOString().slice(0, 10);

    this.carregarRelatorios();
    this.filtrarRelatorios();
    this.carregarFiados();
  }

  carregarRelatorios(): void {
    if (!this.dataInicial || !this.dataFinal) {
      this.relatoriosOriginais = [];
      this.relatorios = [];
      return;
    }

    this.reportService.getVendas(this.dataInicial, this.dataFinal).subscribe({
      next: (dados) => {
        // Ajusta os dados para compatibilizar com o restante do código
        this.relatoriosOriginais = dados.map((item) => ({
          data: item.data,
          produto: item.produto,
          categoria: item.categoria || 'Sem Categoria',
          quantidade: item.quantidade,
          total: item.valor_total,
          fiado: item.fiado === 1, // ✅ campo de fiado como booleano
        }));

        this.filtrarRelatorios();
      },
      error: (err) => {
        console.error('Erro ao carregar relatórios:', err);
        this.relatoriosOriginais = [];
        this.relatorios = [];
      },
    });
  }

  filtrarRelatorios(): void {
    if (!this.dataInicial || !this.dataFinal) {
      this.relatorios = [];
      return;
    }

    this.reportService.getVendas(this.dataInicial, this.dataFinal).subscribe({
      next: (dados) => {
        this.relatoriosOriginais = dados.map((item) => ({
          data: item.data,
          produto: item.produto,
          quantidade: item.quantidade,
          total: item.valor_total,
          fiado: item.fiado === 1, // ✅ campo de fiado como booleano
        }));

        this.relatorios = [...this.relatoriosOriginais];

        setTimeout(() => {
          this.gerarGraficos();
        }, 100);
      },
      error: (err) => {
        console.error('Erro ao carregar relatórios:', err);
        this.relatorios = [];
      },
    });
  }
  gerarGraficos(): void {
    const ctx1 = (
      document.getElementById('grafico1') as HTMLCanvasElement
    ).getContext('2d');
    const ctx2 = (
      document.getElementById('grafico2') as HTMLCanvasElement
    ).getContext('2d');

    // Destruir gráficos anteriores para evitar sobreposição
    if ((window as any).grafico1 instanceof Chart) {
      (window as any).grafico1.destroy();
    }
    if ((window as any).grafico2 instanceof Chart) {
      (window as any).grafico2.destroy();
    }

    // === Gráfico 1: Distribuição Fiado x À Vista ===
    const fiadoCount = this.relatorios
      .filter((r) => r.fiado)
      .reduce((acc, r) => acc + r.quantidade, 0);
    const aVistaCount = this.relatorios
      .filter((r) => !r.fiado)
      .reduce((acc, r) => acc + r.quantidade, 0);

    (window as any).grafico1 = new Chart(ctx1!, {
      type: 'pie',
      data: {
        labels: ['Fiado', 'À Vista'],
        datasets: [
          {
            data: [fiadoCount, aVistaCount],
            backgroundColor: ['#ffc107', '#28a745'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Distribuição de Vendas (Qtd. de Produtos)',
          },
        },
      },
    });

    // === Gráfico 2: Quantidade por Produto ===
    const produtosMap = new Map<string, number>();
    this.relatorios.forEach((r) => {
      produtosMap.set(
        r.produto,
        (produtosMap.get(r.produto) || 0) + r.quantidade
      );
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
  carregarFiados(): void {
    this.reportService.getFiado().subscribe({
      next: (res) => {
        this.fiados = res;
        this.mostrarFiados = true;
        this.agruparFiadoPorCliente();
      },
      error: () => {
        this.fiados = [];
        this.mostrarFiados = false;
      },
    });
   
  }

  agruparFiadoPorCliente(): void {
    const map = new Map<string, number>();

    this.fiados.forEach((f) => {
      const valorAtual = map.get(f.cliente) || 0;
      map.set(f.cliente, valorAtual + f.valor_total);
    });

    this.totalFiadoPorCliente = Array.from(map, ([cliente, total]) => ({
      cliente,
      total,
    }));
  }

  exportarFiadosCSV(): void {
    if (this.fiados.length === 0) {
      alert('Nenhum fiado para exportar');
      return;
    }

    const headers = [
      'Cliente',
      'Produto',
      'Quantidade',
      'Valor Total',
      'Data Venda',
    ];
    const rows = this.fiados.map((f) =>
      [f.cliente, f.produto, f.quantidade, f.valor_total, f.data_venda].join(
        ','
      )
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'relatorio_fiado.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  marcarComoPago(item: any): void {
    console.log('Marcar como pago:', item);
    this.reportService.pagarVenda(item.id).subscribe({
      next: () => {
        this.fiados = this.fiados.filter((f) => f.id !== item.id);
        this.agruparFiadoPorCliente();
        alert('Venda marcada como paga com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao marcar como pago:', err);
        alert('Erro ao marcar como pago. Tente novamente.');
      },
    });
  }

  imprimir(): void {
    window.print();
  }
}
