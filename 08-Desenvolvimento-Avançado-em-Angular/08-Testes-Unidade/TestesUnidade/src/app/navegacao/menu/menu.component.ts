import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-menu',
    imports: [
      CommonModule,  
      RouterLink,
      RouterLinkActive
  ],
    templateUrl: './menu.component.html',
})

export class MenuComponent {

    nav: Nav[] = [
    {
      link: '/home',
      name: 'Home',
      exact: true,
      admin: false
    },
    {
      link: '/cadastro',
      name: 'Cadastro',
      exact: true,
      admin: false
    },
    {
      link: '/sobre',
      name: 'Sobre',
      exact: true,
      admin: false
    },
    {
      link: '/produtos',
      name: 'Produtos',
      exact: false,
      admin: false
    },
    {
      link: '/filmes',
      name: 'Filmes',
      exact: false,
      admin: false
    },
    {
      link: '/bar',
      name: 'Bar',
      exact: false,
      admin: false
    },
        {
      link: '/todo',
      name: 'To Do',
      exact: false,
      admin: false
    },
    {
      link: '/admin',
      name: 'Admin',
      exact: false,
      admin: false
    }
  ];
}

interface Nav {
  link: string,
  name: string,
  exact: boolean,
  admin: boolean
}
