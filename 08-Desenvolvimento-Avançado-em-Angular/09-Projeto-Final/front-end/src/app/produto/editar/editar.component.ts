import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxBrazil, NgxBrazilValidators, NgxBrazilMASKS } from 'ngx-brazil';

import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { CustomValidators } from '../../utils/custom-validators';

import { Produto, Fornecedor } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgxBrazil,
    NgxSpinnerModule
  ],
  templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit, AfterViewInit  {

  imagens: string = environment.imagensUrl;

  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private spinner = inject(NgxSpinnerService);

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

    const produto = this.route.snapshot.data['produto'];
    if (produto) {
        this.produto = produto;
        this.preencherForm();
      }
    }

  private criarForms(): void {
    this.spinner.show();

    this.produtoService.obterFornecedores()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: fornecedores => {
          this.fornecedores = fornecedores;
          this.spinner.hide();
        },
        error: () => this.spinner.hide()
      });

    this.produtoForm = this.fb.group({
      fornecedorId: ['', [Validators.required]],
      nome: ['', [Validators.required, CustomValidators.rangeLength(2,200)]],
      descricao: ['', [Validators.required, CustomValidators.rangeLength(2,1000)]],
      imagem: [''],
      valor: ['', [Validators.required]],
      ativo: [0]
    });
  }

  private preencherForm(): void {
    const produto = this.produto;
    if (!produto) return;

    this.produtoForm.patchValue({
      ...produto
    });
  }

  ngAfterViewInit(): void {
    this.configurarElementosValidacao();

    this.produtoForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.validarFormulario();
      });
  }

  configurarElementosValidacao() {
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
    this.mudancasNaoSalvas = this.produtoForm.dirty;
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

  editarProduto(): void {
    if (!this.produtoForm.dirty || this.produtoForm.invalid) return;

    this.spinner.show();

    Object.assign(this.produto, this.produtoForm.getRawValue());

    this.produtoService.atualizarProduto(this.produto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: sucesso => {
          this.spinner.hide();
          this.mudancasNaoSalvas = false;
          this.processarSucesso(sucesso);
      },
      error: falha => {
        this.spinner.hide();
        this.processarFalha(falha);
      }
    });
  }

  processarSucesso(response: any): void {
    this.produtoForm.reset();
    this.errors = [];

    const toast = this.toastr.success(
      'Produto editado com sucesso!',
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
