import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";

import { Usuario } from "../models/usuario";
import { BaseService } from "../../services/base.service";


@Injectable({
  providedIn: 'root'
})
export class ContaService extends BaseService {
  private http = inject(HttpClient);

  cadastrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(
        `${this.UrlServiceV1}nova-conta`,
        usuario,
        this.ObterHeaderJson()
      )
      .pipe(
        map(response => this.extractData<Usuario>(response)),
        catchError(error => this.serviceError(error))
      );
  }

  login(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(
        `${this.UrlServiceV1}entrar`,
        usuario,
        this.ObterHeaderJson()
      )
      .pipe(
        map(response => this.extractData<Usuario>(response)),
        catchError(error => this.serviceError(error))
      );
  }
}
