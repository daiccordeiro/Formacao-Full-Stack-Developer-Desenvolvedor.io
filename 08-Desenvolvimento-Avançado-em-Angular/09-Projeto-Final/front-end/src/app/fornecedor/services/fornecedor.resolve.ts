import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from './fornecedor.service';


@Injectable()
export class FornecedorResolve implements Resolve<Fornecedor> {

  constructor(private fornecedorService: FornecedorService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Fornecedor> {
    const id = route.paramMap.get('id');

    return this.fornecedorService.obterPorId(id!);
  }
}
