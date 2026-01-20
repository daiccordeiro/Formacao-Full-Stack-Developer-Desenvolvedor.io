import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Produto } from '../produtos/models/produto';


@Injectable({
  providedIn: 'root'
})
export class ProdutoService {   
  
  private readonly apiUrl = 'http://localhost:3000/produtos';
    
  constructor(private http: HttpClient) {}

  obterTodos(estado: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl).pipe(
      map(produtos => {   
        if (estado === 'ativos') {
          return produtos.filter(p => p.ativo);
        }
        return produtos;
      })
    );
  }

  obterPorId(id: number): Observable<Produto | undefined> {
    return this.http.get<Produto[]>(this.apiUrl).pipe(
      map(produtos => produtos.find(p => p.id === id))
    );
  }
}