import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';

import { LocalStorageUtils } from '../../utils/localstorage';
import { CadastroComponent } from '../cadastro/cadastro.component';


// Impede sair do cadastro com alterações não salvas
export const sairCadastroGuard: CanDeactivateFn<CadastroComponent> =
  (component: CadastroComponent) => {

    if (component.mudancasNaoSalvas) {
      return window.confirm(
        'Tem certeza que deseja abandonar o preenchimento do formulário?'
      );
    }
    return true;
};

// Impede usuário logado de acessar login/cadastro
export const contaGuard: CanActivateFn = () => {
  const localStorageUtils = inject(LocalStorageUtils);
  const router = inject(Router);

  if (localStorageUtils.obterTokenUsuario()) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
