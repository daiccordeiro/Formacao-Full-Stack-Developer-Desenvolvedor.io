import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { Router } from '@angular/router';

import { LocalStorageUtils } from '../utils/localstorage';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private readonly localStorageUtil =  new LocalStorageUtils();

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.tratarErroHttp(error);

        return throwError(() => error);
      })
    );
  }

  private tratarErroHttp(error: HttpErrorResponse): void {
    switch (error.status) {
      case 401:
        this.localStorageUtil.limparDadosLocaisUsuario();
        this.router.navigate(['/conta/login'], {
          queryParams: { returnUrl: this.router.url }
        });
        break;

      case 403:
        this.router.navigate(['/acesso-negado']);
        break;
    }
  }
}
