import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';


@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './detalhes.component.html'
})
export class DetalhesComponent {

  private route = inject(ActivatedRoute);
  private fornecedorService = inject(FornecedorService);

  readonly fornecedor$: Observable<Fornecedor> =
  this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => this.fornecedorService.obterPorId(Number(id)))
  );
}
