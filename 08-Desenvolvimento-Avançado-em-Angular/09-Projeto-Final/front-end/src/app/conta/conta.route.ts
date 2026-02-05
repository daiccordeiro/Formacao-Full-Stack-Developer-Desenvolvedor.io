import { Routes } from '@angular/router';

import { ContaAppComponent } from './conta.app.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';


export const CONTA_ROUTES: Routes = [
  {
    path: '',
    component: ContaAppComponent,
    children: [
      {
        path: 'cadastro',
        component: CadastroComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      }
    ]
  }
];
