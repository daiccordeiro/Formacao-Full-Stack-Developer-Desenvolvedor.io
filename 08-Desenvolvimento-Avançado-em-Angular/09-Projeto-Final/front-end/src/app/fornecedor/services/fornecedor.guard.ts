import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { LocalStorageUtils } from '../../utils/localstorage';
import { NovoComponent } from '../novo/novo.component';


// CanDeactivate (formulário sujo)
export const fornecedorDeactivateGuard: CanDeactivateFn<NovoComponent> =
  (component) => {

  if (component.mudancasNaoSalvas) {
    return window.confirm(
      'Tem certeza que deseja abandonar o preenchimento do formulario?'
    );
  }
  return true;
};

// CanActivate (autorização)
export const fornecedorGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const localStorageUtils = new LocalStorageUtils();
  const router = inject(Router);

  if (!localStorageUtils.obterTokenUsuario()) {
    router.navigate(['/conta/login']);
    return false;
  }

  const user = localStorageUtils.obterUsuario();
  const claim = route.data?.['claim'];

  if (claim) {
    if (!user?.claims) {
      navegarAcessoNegado(router);
      return false;
    }

    const userClaim = user.claims.find((x: any) => x.type === claim.nome);

    if (!userClaim) {
      navegarAcessoNegado(router);
      return false;
    }

    const valoresClaim = userClaim.value as string;

    if (!valoresClaim.includes(claim.valor)) {
      navegarAcessoNegado(router);
      return false;
    }
  }
  return true;
};

function navegarAcessoNegado(router: Router) {
  router.navigate(['/acesso-negado']);
}
