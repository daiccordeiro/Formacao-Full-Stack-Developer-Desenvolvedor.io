import { Routes } from "@angular/router";

import { ProdutoAppComponent } from "./produto.app.component";
import { ProdutoDashboardComponent } from "./produtos/components/produto-dashboard.component";
import { EditarProdutoComponent } from "./produtos/components/editar-produto.component";

import { ProdutosResolve } from "./services/produto.resolve";
import { ProdutoService } from './services/produto.service';

export const PRODUTO_ROUTES: Routes = [
    { path: '', 
        component: ProdutoAppComponent,
        providers: [
            ProdutoService,
            ProdutosResolve
        ],         
        children: [
            { 
                path: '', 
                redirectTo: 'todos', 
                pathMatch: 'full' 
            }, 
            { path: ':estado', 
                component: ProdutoDashboardComponent, 
                resolve: { 
                    produtos: ProdutosResolve 
                }, 
                data: { 
                    teste: 'informação' 
                } 
            },             
            { path: 'editar/:id', 
                component: EditarProdutoComponent 
            }
        ] 
    },    
];