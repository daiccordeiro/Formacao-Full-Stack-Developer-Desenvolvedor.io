import { Routes } from '@angular/router';

import { ProdutoAppComponent } from './produto.app.component';

import { NovoComponent } from './novo/novo.component';
import { ListaComponent } from './lista/lista.component';
import { EditarComponent } from './editar/editar.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { ProdutoResolve } from './services/produto.resolve';

import { produtoDeactivateGuard, produtoGuard } from './services/produto.guard';


export const PRODUTO_ROUTES: Routes = [
  {
      path: '', component: ProdutoAppComponent,
      children: [
        { path: 'listar-todos', component: ListaComponent },

        { path: 'adicionar-novo', component: NovoComponent,
          canActivate: [produtoGuard],
          canDeactivate: [produtoDeactivateGuard],
          data: {
            claim: { nome: 'Produto', valor: 'Adicionar' }
          },
        },

        { path: 'editar/:id', component: EditarComponent,
          canActivate: [produtoGuard],
          data: {
            claim: { nome: 'Produto', valor: 'Atualizar' }
          },
          resolve: { produto: ProdutoResolve }
        },

        { path: 'detalhes/:id', component: DetalhesComponent,
          resolve: { produto: ProdutoResolve }
        },

        { path: 'excluir/:id', component: ExcluirComponent,
          canActivate: [produtoGuard],
          data: {
            claim: { nome: 'Produto', valor: 'Excluir' }
          },
          resolve: { produto: ProdutoResolve }
        },
      ]
  }
];
