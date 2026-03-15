import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { NgxBrazil } from 'ngx-brazil';

import { Fornecedor } from '../models/fornecedor';


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

  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  readonly fornecedor$: Observable<Fornecedor> =
    this.route.data.pipe(
      map(data => data['fornecedor'])
  );

  readonly enderecoMap$: Observable<SafeResourceUrl> =
    this.fornecedor$.pipe(
      map(f => {
        const enderecoCompleto = `${f.endereco.logradouro}, ${f.endereco.numero} - ${f.endereco.bairro}, ${f.endereco.cidade} - ${f.endereco.estado}`;

        const url = `https://www.google.com/maps/embed/v1/place?q=${enderecoCompleto}&key=AIzaSyAP0WKpL7uTRHGKWyakgQXbW6FUhrrA5pE`;

        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
  );
}
