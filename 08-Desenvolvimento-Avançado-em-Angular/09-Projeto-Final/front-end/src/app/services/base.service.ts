import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageUtils } from '../utils/localstorage';


export abstract class BaseService {
  protected LocalStorage = inject(LocalStorageUtils);
  protected UrlServiceV1: string = environment.apiUrlv1

  protected ObterHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  protected ObterAuthHeaderJson() {
    const token = this.LocalStorage.obterTokenUsuario();

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      })
    };
  }

  protected extractData<T>(response: any): T {
    return response?.data as T;
  }

  protected serviceError(response: HttpErrorResponse) {
    const customError: string[] = [];
    const customResponse = { error: { errors: [] as string[] } };

    if (response.status === 0) {
      customError.push('Erro de conexão com o servidor.');
    }

    if (response.status === 500) {
      customError.push(
        'Ocorreu um erro no processamento, tente novamente mais tarde ou contate o suporte.'
      );

      // Erros do tipo 500 não possuem uma lista de erros
      // A lista de erros do HttpErrorResponse é readonly
      customResponse.error.errors = customError;
      return throwError(() => customResponse);
    }

    if (response.error?.errors) {
      return throwError(() => response);
    }

    customError.push('Ocorreu um erro inesperado.');
    customResponse.error.errors = customError;

    console.error(response);
    return throwError(() => customResponse);
  }
}
