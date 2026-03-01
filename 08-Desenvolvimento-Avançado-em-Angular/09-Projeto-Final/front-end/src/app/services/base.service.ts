import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalStorageUtils } from '../utils/localstorage';


export abstract class BaseService {
  public LocalStorage = new LocalStorageUtils();
  protected UrlServiceV1: string = environment.apiUrlv1

  protected ObterHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  protected ObterAuthHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.LocalStorage.obterTokenUsuario()}`
      })
    };
  }

  protected extractData<T>(response: any): T {
    return response?.data as T;
  }

  protected serviceError(response: HttpErrorResponse) {
    let customError: string[] = [];
    let customResponse = { error: { errors: [] as string[] } };

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
