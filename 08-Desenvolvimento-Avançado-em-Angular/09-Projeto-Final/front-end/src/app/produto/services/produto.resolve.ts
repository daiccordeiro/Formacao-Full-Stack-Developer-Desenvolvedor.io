import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Produto } from '../models/produto';
import { ProdutoService } from './produto.service';


@Injectable({
  providedIn: 'root'
})
export class ProdutoResolve implements Resolve<Produto> {

  constructor(private produtoService: ProdutoService) { }

   resolve(route: ActivatedRouteSnapshot): Observable<Produto> {
    const id = route.paramMap.get('id');

    return this.produtoService.obterPorId(id!);
  }
}
