import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";

import { UsuarioResponse } from '../../utils/localstorage';
import { BaseService } from "../../services/base.service";

import { Usuario } from "../models/usuario";


@Injectable({
  providedIn: 'root'
})
export class ContaService extends BaseService {
  private http = inject(HttpClient);

  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<any>(
        `${this.UrlServiceV1}nova-conta`,
        usuario,
        this.ObterHeaderJson()
      )
      /*.pipe(
        map(response => this.extractData<Usuario>(response)),
        catchError(error => this.serviceError(error))
      );*/
      .pipe(
        map(this.extractData<Usuario>),
        catchError(this.serviceError)
      );
  }

  login(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<any>(
        `${this.UrlServiceV1}entrar`,
        usuario,
        this.ObterHeaderJson()
      )
      /*.pipe(
        map(response => this.extractData<Usuario>(response)),
        catchError(error => this.serviceError(error))
      );*/
      .pipe(
        map(this.extractData<Usuario>),
        catchError(this.serviceError)
      );
  }

  salvarUsuarioLocal(response: UsuarioResponse): void {
    this.LocalStorage.salvarDadosLocaisUsuario(response);
  }
}
