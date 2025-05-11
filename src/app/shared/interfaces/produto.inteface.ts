export interface Produto {
  id?: number; // ID do produto (opcional, pois pode ser gerado pelo servidor)
    nome: string; // Nome do produto
    preco: number; // Preço do produto
    estoque: number; // Quantidade em estoque
    custoAtual?: number; // Custo atual do produto (opcional)
    precoSugerido?: number; // Preço sugerido (opcional)
    custoMedio?: number; // Custo médio (opcional)
    margem?: number; // Margem de lucro em porcentagem (opcional)
    precoVenda?: number; // Preço de venda atual (opcional)
}