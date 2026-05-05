import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Produto } from '../../produto/models/produto';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'lista-produto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './lista-produtos.component.html'
})
export class ListaProdutosComponent {

  imagens: string = environment.imagensUrl;

  @Input()
  produtos: Produto[] = [];
}
