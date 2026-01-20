import { Routes } from '@angular/router';

import { HomeComponent } from './navegacao/home/home.component';
import { SobreComponent } from './institucional/sobre/sobre.component';
import { CadastroComponent } from './demos/reactiveForms/cadastro/cadastro.component';
import { NotFoundComponent } from './navegacao/not-found/not-found.component';

import { AuthGuard } from './services/app.guard';
import { CadastroGuard } from './services/cadastro.guard';

import { FilmesComponent } from './demos/pipes/filmes/filmes.component';
import { BarComponent } from './demos/bar-di-zones/bar.component';
import { TodoComponent } from './demos/todo-list/todo.component';

import { TasksService } from './demos/todo-list/todo.service';
import { Store } from './demos/todo-list/todo.store';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},

    { path: 'home', component: HomeComponent},
    { path: 'sobre', component: SobreComponent },
    { path: 'filmes', component: FilmesComponent},    
    { path: 'bar', component: BarComponent},
    
    { path: 'todo', 
        component: TodoComponent,
        providers: [
            TasksService,
            Store]},
    
    { path: 'cadastro', 
        component: CadastroComponent, 
        canDeactivate: [CadastroGuard]},
    
    { path: 'produtos', 
        loadChildren: () => 
            import('./demos/arquitetura-componentes/produto.route')
            .then(m => m.PRODUTO_ROUTES)},  //Lazy Loading   
    
    { path: 'admin', 
        loadChildren: () => 
            import('./admin/admin.routes')
            .then(m => m.ADMIN_ROUTES),
        canMatch: [AuthGuard], 
        canActivate: [AuthGuard]},  //substituido canLoad - depreciado no Angular 19                   
    
    // Sempre deixar essa configuração por ÚLTIMO
    { path: '**', component: NotFoundComponent}                   
];