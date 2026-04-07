import { Routes } from '@angular/router';

import { HomeComponent } from './navegacao/home/home.component';
import { NotFoundComponent } from './navegacao/not-found/not-found.component';
import { AcessoNegadoComponent } from './navegacao/acesso-negado/acesso-negado.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},

    { path: 'home', component: HomeComponent },

    { path: 'conta',
        loadChildren: () =>
          import('./conta/conta.route').then(m => m.CONTA_ROUTES)
    }, //Lazy Loading

    { path: 'fornecedores',
        loadChildren: () =>
          import('./fornecedor/fornecedor.route').then(m => m.FORNECEDOR_ROUTES)
    }, //Lazy Loading

    { path: 'produtos',
        loadChildren: () =>
          import('./produto/produto.route').then(m => m.PRODUTO_ROUTES)
    }, //Lazy Loading

    { path: 'acesso-negado', component: AcessoNegadoComponent },
    { path: 'nao-encontrado', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent },
];
