import { Endereco } from './endereco';
import { Produto } from '../../produto/models/produto';

export interface Fornecedor {
    id: string;
    nome: string;
    documento: string;
    ativo: boolean;
    tipoFornecedor: number;
    endereco: Endereco;
    produtos: Produto[];
}
