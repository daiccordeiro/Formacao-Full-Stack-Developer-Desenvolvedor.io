import { Routes } from '@angular/router';

import { FornecedorAppComponent } from './fornecedor.app.component';

import { NovoComponent } from './novo/novo.component';
import { ListaComponent } from './lista/lista.component';
import { EditarComponent } from './editar/editar.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ExcluirComponent } from './excluir/excluir.component';


export const FORNECEDOR_ROUTES: Routes = [
    {
        path: '', component: FornecedorAppComponent,
        children: [
          { path: 'listar-todos', component: ListaComponent },
          { path: 'adicionar-novo', component: NovoComponent },
          { path: 'editar/:id', component: EditarComponent },
          { path: 'detalhes/:id', component: DetalhesComponent },
          { path: 'excluir/:id', component: ExcluirComponent }
        ]
    }
];
