import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";

import { BaseService } from "../../services/base.service";
import { Produto, Fornecedor } from '../models/produto';


@Injectable({
  providedIn: 'root'
})
export class ProdutoService extends BaseService {
   private http = inject(HttpClient);



  obterTodos(): Observable<Produto[]> {
    return this.http
      .get<Produto[]>(
        `${this.UrlServiceV1}produtos`)
      .pipe(
        catchError(this.serviceError)
      );
  }

  obterPorId(id: string): Observable<Produto> {
    return this.http
      .get<Produto>(
        `${this.UrlServiceV1}produtos/${id}`, this.ObterAuthHeaderJson())
      .pipe(
        catchError(this.serviceError)
      );
  }

  novoProduto(produto: Produto): Observable<Produto> {
    return this.http
      .post<Produto>(
        `${this.UrlServiceV1}produtos`, produto, this.ObterAuthHeaderJson())
      .pipe(
        catchError(this.serviceError)
      );
  }

  atualizarProduto(produto: Produto): Observable<Produto> {
    return this.http
      .put<Produto>(
        `${this.UrlServiceV1}produtos/${produto.id}`, produto, this.ObterAuthHeaderJson())
      .pipe(
        catchError(this.serviceError)
      );
  }

  excluirProduto(id: string): Observable<void> {
    return this.http
      .delete<void>(
        `${this.UrlServiceV1}produtos/${id}`, this.ObterAuthHeaderJson())
      .pipe(
        catchError(this.serviceError)
      );
  }

  obterFornecedores(): Observable<Fornecedor[]> {
    return this.http
      .get<Fornecedor[]>(
        `${this.UrlServiceV1}fornecedores`)
      .pipe(
        catchError(this.serviceError)
    );
  }
}
