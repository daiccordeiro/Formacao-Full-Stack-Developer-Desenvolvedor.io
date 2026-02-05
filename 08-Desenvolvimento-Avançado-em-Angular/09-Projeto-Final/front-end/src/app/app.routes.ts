import { Routes } from '@angular/router';

import { HomeComponent } from './navegacao/home/home.component';
import { NotFoundComponent } from './navegacao/not-found/not-found.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},

    { path: 'home', component: HomeComponent },

    { path: 'conta',
        loadChildren: () =>
          import('./conta/conta.route').then(m => m.CONTA_ROUTES)
    }, //Lazy Loading


    { path: 'nao-encontrado', component: NotFoundComponent },
    { path: '***', component: NotFoundComponent },
];
