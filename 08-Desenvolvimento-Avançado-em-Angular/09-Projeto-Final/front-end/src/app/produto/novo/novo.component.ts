import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ToastrService } from 'ngx-toastr';

import { Router, RouterLink } from '@angular/router';
import { NgxBrazil, NgxBrazilValidators, NgxBrazilMASKS } from 'ngx-brazil';

import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { CustomValidators } from '../../utils/custom-validators';

import { Produto, Fornecedor } from '../models/produto';
import { ProdutoService } from '../services/produto.service';


@Component({
  selector: 'app-novo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgxBrazil
  ],
  templateUrl: './novo.component.html'
})
export class NovoComponent implements OnInit, AfterViewInit  {

  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private destroyRef = inject(DestroyRef);

  @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements!: QueryList<ElementRef>;


  produtoForm!: FormGroup;
  produto = {} as Produto;

  fornecedores: Fornecedor[] = [];

  errors: any[] = [];
  mudancasNaoSalvas = false;
  displayMessage: DisplayMessage = {};

  MASKS = NgxBrazilMASKS;


  validationMessages: ValidationMessages = {
    fornecedorId: { required: 'Escolha um fornecedor' },
    nome: {
      required: 'Informe o Nome',
      minlength: 'Mínimo de 2 caracteres',
      maxlength: 'Máximo de 200 caracteres'
    },
    descricao: {
      required: 'Informe a Descrição',
      minlength: 'Mínimo de 2 caracteres',
      maxlength: 'Máximo de 1000 caracteres'
    },
    imagem: { required: 'Informe a Imagem' },
    valor: { required: 'Informe o Valor' }
  };
  genericValidator = new GenericValidator(this.validationMessages);


  ngOnInit(): void {
    this.criarForms();
  }

  private criarForms(): void {
    this.produtoService.obterFornecedores()
      .subscribe(
        fornecedores => this.fornecedores = fornecedores);

    this.produtoForm = this.fb.group({
      fornecedorId: ['', [Validators.required]],
      nome: ['', [Validators.required, CustomValidators.rangeLength(2,200)]],
      descricao: ['', [Validators.required, CustomValidators.rangeLength(2,1000)]],
      imagem: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      ativo: [true]
    });
  }

  ngAfterViewInit(): void {
    this.produtoForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.validarFormulario();
      });

    const controlBlurs = this.formInputElements
      .toArray()
      .map((formControl: ElementRef) =>
        fromEvent(formControl.nativeElement, 'blur')
      );

    merge(...controlBlurs)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
      this.validarFormulario();
    });
  }

  validarFormulario(): void {
    this.displayMessage = this.genericValidator.processarMensagens(this.produtoForm);
    this.mudancasNaoSalvas = true;
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    // Atualiza o formControl com o arquivo selecionado
    this.produtoForm.patchValue({ imagem: file });
    // Força validação
    this.produtoForm.get('imagem')?.updateValueAndValidity();
  }

  adicionarProduto(): void {
    if (!this.produtoForm.dirty || this.produtoForm.invalid) return;

    const produtoNovo: Produto = this.produtoForm.value;

    this.produtoService.novoProduto(produtoNovo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: sucesso => {
          this.mudancasNaoSalvas = false;
          this.processarSucesso(sucesso);
        },
        error: falha => this.processarFalha(falha)
      })
  }

  processarSucesso(response: any): void {
    this.produtoForm.reset();
    this.errors = [];

    const toast = this.toastr.success(
      'Produto cadastrado com sucesso!',
      'Sucesso!',
      { progressBar: true, closeButton: true }
    );

    toast?.onHidden.subscribe(() => {
      this.router.navigate(['/produtos/listar-todos']);
    });
  }

  processarFalha(fail: any): void {
    this.errors = fail.error?.errors ?? [];

     this.toastr.error(
      'Ocorreu um erro ao processar a solicitação.',
      'Erro',
      { progressBar: true, closeButton: true }
    );
  }
}
