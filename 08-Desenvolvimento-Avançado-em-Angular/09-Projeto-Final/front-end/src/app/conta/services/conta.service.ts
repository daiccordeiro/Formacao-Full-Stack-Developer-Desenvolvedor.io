import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

import { environment } from "../../../environments/environment";

import { HttpClient } from "@angular/common/http";
import { Usuario } from "../models/usuario";


@Injectable()
export class ContaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  cadastrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/conta`, usuario);
  }

  login(usuario: Usuario): Observable<any> {
     return this.http.post(`${this.apiUrl}/conta/login`, usuario);
  }
}
