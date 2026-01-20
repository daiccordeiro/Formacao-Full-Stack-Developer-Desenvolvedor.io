import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Produto } from '../produtos/models/produto';
import { ProdutoService } from './produto.service';


@Injectable({
  providedIn: 'root'
})
export class ProdutosResolve implements Resolve<Produto[]> {
    
    constructor(private produtoService: ProdutoService){}

    resolve(route: ActivatedRouteSnapshot): Observable<Produto[]> {
        return this.produtoService.obterTodos(route.params['estado']);
    }
}