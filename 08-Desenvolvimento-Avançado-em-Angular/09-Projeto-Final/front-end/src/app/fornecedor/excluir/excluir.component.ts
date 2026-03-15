import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';


@Component({
  selector: 'app-excluir',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './excluir.component.html'
})
export class ExcluirComponent implements OnInit {
  fornecedor!: Fornecedor;

  private fornecedorService = inject(FornecedorService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    //const id = this.route.snapshot.paramMap.get('id');
    this.fornecedor = this.route.snapshot.data['fornecedor'];

    if (!this.fornecedor) {
      this.router.navigate(['/fornecedores/listar-todos']);
    }
  }

  excluirEvento(): void {
    this.fornecedorService
      .excluirFornecedor(this.fornecedor.id)
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
