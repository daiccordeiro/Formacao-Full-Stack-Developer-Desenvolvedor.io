import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';

import { NovoComponent } from '../novo/novo.component';
import { validarAcessoUsuario } from '../../services/base.guard';

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
export const fornecedorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return validarAcessoUsuario(route, state, router);
};
