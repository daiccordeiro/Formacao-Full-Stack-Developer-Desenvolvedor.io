import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LocalStorageUtils } from '../utils/localstorage';


export function validarAcessoUsuario(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  router: Router
): boolean {

   const localStorageUtils = new LocalStorageUtils();

  // Token
  if (!localStorageUtils.obterTokenUsuario()) {
    router.navigate(['/conta/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const user = localStorageUtils.obterUsuario();
  const claim = route.data?.['claim'];

  // Claims
  if (claim) {
    if (!user?.claims) {
      return navegarAcessoNegado(router);
    }

    const possuiClaim = user.claims.some(
      (x: any) =>
        x.type === claim.nome &&
        x.value.includes(claim.valor)
    );

    if (!possuiClaim) {
      return navegarAcessoNegado(router);
    }
  }
  return true;
};

function navegarAcessoNegado(router: Router): boolean {
  router.navigate(['/acesso-negado']);
  return false;
}
