import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RouterLink } from '@angular/router';

import { NgxBrazil } from 'ngx-brazil';

import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto';


@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgxBrazil
  ],
  templateUrl: './lista.component.html'
})
export class ListaComponent {

private produtoService = inject(ProdutoService);
  produto$: Observable<Produto[]> =
    this.produtoService.obterTodos();
}
