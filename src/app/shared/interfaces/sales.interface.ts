export interface Sale {
  id?: number;
  produtoId: number;
  quantidade: number;
  valorTotal: number;
  dataVenda: string;
  clienteId: number;
}
