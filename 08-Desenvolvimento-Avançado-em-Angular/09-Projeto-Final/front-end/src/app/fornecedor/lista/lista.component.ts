import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RouterLink } from '@angular/router';

import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';


@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './lista.component.html'
})
export class ListaComponent {

  private fornecedorService = inject(FornecedorService);
  fornecedores$: Observable<Fornecedor[]> =
    this.fornecedorService.obterTodos();
}
