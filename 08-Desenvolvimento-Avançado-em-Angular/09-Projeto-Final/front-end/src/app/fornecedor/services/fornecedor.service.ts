import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, delay, map } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";

import { BaseService } from "../../services/base.service";
import { CepConsulta, Endereco } from "../models/endereco";
import { Fornecedor } from '../models/fornecedor';


@Injectable({
  providedIn: 'root'
})
export class FornecedorService extends BaseService {
  private http = inject(HttpClient);

  fornecedor: Fornecedor = {} as Fornecedor;

  obterTodos(): Observable<Fornecedor[]> {
    return this.http
      .get<Fornecedor[]>(
        `${this.UrlServiceV1}fornecedores`)
      .pipe(
        catchError(this.serviceError)
      );
  }

  obterPorId(id: string | number): Observable<Fornecedor> {
    return this.http
      .get<Fornecedor>(
        `${this.UrlServiceV1}fornecedores/${id}`, this.ObterAuthHeaderJson())
      .pipe(
        catchError(this.serviceError)
      );
  }

  novoFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
   return this.http
      .post<Fornecedor>(
        `${this.UrlServiceV1}fornecedores`, fornecedor, this.ObterAuthHeaderJson())
      .pipe(
        catchError(this.serviceError)
      );
  }

  atualizarFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http
      .put<Fornecedor>(
        `${this.UrlServiceV1}fornecedores/${fornecedor.id}`, fornecedor, this.ObterAuthHeaderJson())
      .pipe(
        catchError(this.serviceError)
      );
  }

  excluirFornecedor(id: string | number): Observable<void> {
    return this.http
      .delete<void>(
        `${this.UrlServiceV1}fornecedores/${id}`, this.ObterAuthHeaderJson())
      .pipe(
        catchError(this.serviceError)
      );
   }

  atualizarEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http
      .put<Endereco>(
        `${this.UrlServiceV1}fornecedores/endereco/${endereco.id}`, endereco, this.ObterAuthHeaderJson())
      .pipe(
        catchError(this.serviceError)
      );
  }

  consultarCep(cep:string): Observable<CepConsulta> {
    return this.http
      .get<CepConsulta>(
        `https://viacep.com.br/ws/${cep}/json/`)
      .pipe(
        catchError(this.serviceError)
      );
    }
}
