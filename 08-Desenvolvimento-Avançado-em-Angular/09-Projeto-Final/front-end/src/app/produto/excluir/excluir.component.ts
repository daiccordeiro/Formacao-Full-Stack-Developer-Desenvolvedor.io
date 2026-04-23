import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { NgxBrazil } from 'ngx-brazil';

import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto';
import { environment } from '../../../environments/environment';


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
  imagens: string = environment.imagensUrl;

  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);

  readonly produto$: Observable<Produto> =
    this.route.data.pipe(
      map(data => data['produto'])
  );
  produto: any;


  excluirProduto(Produto: Produto): void {
    this.produtoService
      .excluirProduto(Produto.id)
      .subscribe({
        next: () => this.sucessoExclusao(),
        error: () => this.falha()
      });
  }

  sucessoExclusao(): void {
    const toast = this.toastr.success(
      'Produto excluido com Sucesso!',
      'Good bye'
    );

    toast?.onHidden.subscribe(() => {
      this.router.navigate(['/produtos/listar-todos']);
      });
  }

  falha(): void {
    this.toastr.error(
      'Houve um erro no processamento!',
      'Ops'
    );
  }
}
