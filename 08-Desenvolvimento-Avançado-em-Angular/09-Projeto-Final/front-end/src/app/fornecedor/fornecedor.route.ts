import { Routes } from '@angular/router';

import { FornecedorAppComponent } from './fornecedor.app.component';

import { NovoComponent } from './novo/novo.component';
import { ListaComponent } from './lista/lista.component';
import { EditarComponent } from './editar/editar.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { FornecedorResolve } from './services/fornecedor.resolve';
import { fornecedorDeactivateGuard, fornecedorGuard } from './services/fornecedor.guard';


export const FORNECEDOR_ROUTES: Routes = [
    {
        path: '', component: FornecedorAppComponent,
        children: [
          { path: 'listar-todos', component: ListaComponent },

          { path: 'adicionar-novo', component: NovoComponent,
            canActivate: [fornecedorGuard],
            canDeactivate: [fornecedorDeactivateGuard],
            data: {
              claim: { nome: 'Fornecedor', valor: 'Adicionar'}
            }
           },

          { path: 'editar/:id', component: EditarComponent,
            canActivate: [fornecedorGuard],
            data: {
              claim: { nome: 'Fornecedor', valor: 'Atualizar' }
            },
            resolve: { fornecedor: FornecedorResolve }
          },

          { path: 'detalhes/:id', component: DetalhesComponent,
            resolve: { fornecedor: FornecedorResolve }
          },

          { path: 'excluir/:id', component: ExcluirComponent,
            canActivate: [fornecedorGuard],
            data: {
              claim: { nome: 'Fornecedor', valor: 'Excluir' }
            },
            resolve: { fornecedor: FornecedorResolve }
          }
        ]
    }
];
