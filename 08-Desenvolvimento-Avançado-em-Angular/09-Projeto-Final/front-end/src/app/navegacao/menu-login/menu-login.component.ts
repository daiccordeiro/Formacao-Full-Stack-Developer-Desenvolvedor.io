import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageUtils } from '../../utils/localstorage';


@Component({
    selector: 'app-menu-login',
    standalone: true,
    imports: [
    CommonModule,
    RouterLink
],
    templateUrl: './menu-login.component.html'
})

export class MenuLoginComponent {
  private router = inject(Router);
  private localStorageUtils = inject(LocalStorageUtils);

  get usuarioLogado(): boolean {
    return !!this.localStorageUtils.obterTokenUsuario();
  }

  get email(): string | undefined {
    return this.localStorageUtils.obterUsuario()?.email;
  }

  logout(): void {
    this.localStorageUtils.limparDadosLocaisUsuario();
    this.router.navigate(['/home']);
  }
}
