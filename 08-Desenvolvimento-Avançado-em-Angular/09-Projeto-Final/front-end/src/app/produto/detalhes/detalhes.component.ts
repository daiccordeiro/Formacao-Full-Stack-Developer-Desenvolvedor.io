import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { NgxBrazil } from 'ngx-brazil';

import { Produto } from '../models/produto';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgxBrazil
  ],
  templateUrl: './detalhes.component.html'
})
export class DetalhesComponent {

  imagens: string = environment.imagensUrl;

  private route = inject(ActivatedRoute);

  readonly produto$: Observable<Produto> =
    this.route.data.pipe(
      map(data => data['fornecedor'])
  );

}
