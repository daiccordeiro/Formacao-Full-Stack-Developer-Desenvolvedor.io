import { Injectable } from '@angular/core';
import { CanActivate, CanMatch } from '@angular/router';

@Injectable()
export class AuthGuard implements CanMatch, CanActivate {
   

    user = { admin: true, logged: true }

    // CanLoad depreciado no Angular 19, substituido pelo canMatch
    canMatch() : boolean {
        return this.user.admin;
    }

    // CanActivate protege rotas já carregadas
    canActivate() : boolean {
        return this.user.logged;
    }
}