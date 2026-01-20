import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'produto-app-root',
  imports: [
    RouterModule
  ],
  template: '<router-outlet></router-outlet>'
})

export class ProdutoAppComponent { }