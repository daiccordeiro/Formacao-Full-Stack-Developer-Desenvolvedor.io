import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 

import { Produto } from '../models/produto';

@Component({
    selector: 'app-produto-count',
    imports: [
        CommonModule
    ],
    template: `       
        <div>
            <h3>Produtos</h3>
            <div>
                Produtos Ativos: {{ contadorAtivos() }} 
                no total de {{ produtos.length }} produtos 
                <br /><br />
            </div>
        </div>
    `
})

export class ProdutoCountComponent {

    @Input({ required: true })
    produtos!: Produto[];

    contadorAtivos(): number {   
        return this.produtos.filter(produto => produto.ativo).length;
    }
}