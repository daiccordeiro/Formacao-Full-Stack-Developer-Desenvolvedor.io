import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { LocalStorageUtils } from '../../utils/localstorage';
import { NovoComponent } from '../novo/novo.component';


export const produtoDeactivateGuard: CanDeactivateFn<NovoComponent> =
  (component) => {

  if (component.mudancasNaoSalvas) {
    return window.confirm(
      'Tem certeza que deseja abandonar o preenchimento do formulario?'
    );
  }
  return true;
};


export const produtoGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const localStorageUtils = new LocalStorageUtils();
  const router = inject(Router);

  if (!localStorageUtils.obterTokenUsuario()) {
    router.navigate(['/conta/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const user = localStorageUtils.obterUsuario();
  const claim = route.data?.['claim'];

  if (claim) {
    if (!user?.claims) {
      navegarAcessoNegado(router);
      return false;
    }

    const possuiClaim = user.claims.some(
      (x: any) => x.type === claim.nome && x.value === claim.valor
    );

    if (!possuiClaim) {
      navegarAcessoNegado(router);
      return false;
    }
  }
  return true;
};

function navegarAcessoNegado(router: Router) {
  router.navigate(['/acesso-negado']);
}
