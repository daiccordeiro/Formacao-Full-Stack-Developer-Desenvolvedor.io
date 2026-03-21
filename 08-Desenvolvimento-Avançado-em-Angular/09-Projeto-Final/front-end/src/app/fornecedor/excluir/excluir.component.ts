import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { NgxBrazil } from 'ngx-brazil';

import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';


@Component({
  selector: 'app-excluir',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgxBrazil
  ],
  templateUrl: './excluir.component.html'
})
export class ExcluirComponent {

  private fornecedorService = inject(FornecedorService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
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

  excluirEvento(Fornecedor: Fornecedor): void {
    this.fornecedorService
      .excluirFornecedor(Fornecedor.id)
      .subscribe({
        next: () => this.sucessoExclusao(),
        error: () => this.falha()
      });
  }

  sucessoExclusao(): void {
    const toast = this.toastr.success(
      'Fornecedor excluido com Sucesso!',
      'Good bye'
    );

    toast?.onHidden.subscribe(() => {
      this.router.navigate(['/fornecedores/listar-todos']);
    });
  }

  falha(): void {
    this.toastr.error(
      'Houve um erro no processamento!',
      'Ops'
    );
  }
}
