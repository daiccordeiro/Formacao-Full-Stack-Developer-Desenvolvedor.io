import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren, ElementRef, inject, QueryList, DestroyRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, fromEvent, map, merge, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Fornecedor } from '../models/fornecedor';
import { Endereco } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';

import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { NgxBrazilValidators } from 'ngx-brazil';


@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit, AfterViewInit  {

  private fb = inject(FormBuilder);
  private fornecedorService = inject( FornecedorService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements!: QueryList<ElementRef>;

  fornecedorForm!: FormGroup;
  enderecoForm!: FormGroup;

  fornecedor = {} as Fornecedor;
  endereco = {} as Endereco;

  errors: string[] = [];
  errorsEndereco: string[] = [];

  mudancasNaoSalvas = false;
  displayMessage: DisplayMessage = {};

  validationMessages: ValidationMessages = {
    nome: { required: 'Informe o Nome' },
    documento: { required: 'Informe o Documento' },
    logradouro: { required: 'Informe o Logradouro' },
    numero: { required: 'Informe o Número' },
    bairro: { required: 'Informe o Bairro' },
    cep: { required: 'Informe o CEP' },
    cidade: { required: 'Informe a Cidade' },
    estado: { required: 'Informe o Estado' }
  };

  genericValidator = new GenericValidator(this.validationMessages);
  //textoDocumento: string = '';

  ngOnInit(): void {
    this.criarForms();
    this.carregarFornecedor();
  }

  private criarForms(): void {
    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]]
    });

    this.enderecoForm = this.fb.group({
      id: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required, NgxBrazilValidators.cep]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: ''
    });
  }

  private carregarFornecedor(): void {
    this.route.paramMap
      .pipe(
        map(params => Number(params.get('id'))),
        switchMap(id => this.fornecedorService.obterPorId(id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(fornecedor => {
        this.fornecedor = fornecedor;
        this.fornecedorForm.patchValue(fornecedor);
      });
  }

  //tipoFornecedor!: number;
  //formResult: string = '';

  ngAfterViewInit(): void {
    const controlBlurs = this.formInputElements
      .toArray()
      .map(formControl =>
        fromEvent(formControl.nativeElement, 'blur')
    );

    // Evento disparado toda vez que 'perco' o foco do controle do formulário
    merge(...controlBlurs)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.displayMessage =
          this.genericValidator.processarMensagens(this.fornecedorForm);

        this.mudancasNaoSalvas = true;
      });
  }

  editarFornecedor(): void {
    // Só processar o formulário se ele foi alterado (dirty) e é válido (valid)
    if (!this.fornecedorForm.dirty || !this.fornecedorForm.valid) return;
      // Tipando o objeto usuario, com a Model Usuario
      const fornecedorAtualizado: Fornecedor = {
        ...this.fornecedor,
        ...this.fornecedorForm.value
      };

      this.fornecedorService.novoFornecedor(fornecedorAtualizado)
        .subscribe({
          next: sucesso => {
            this.mudancasNaoSalvas = false;
            this.processarSucesso(sucesso);
          },
        error: falha => this.processarFalha(falha)
      });
  }

  processarSucesso(response: any): void {
    this.fornecedorForm.reset();
    this.errors = [];

    const toast = this.toastr.success(
      'Fornecedor atualizado com sucesso!',
      'Sucesso!',
      { progressBar: true, closeButton: true }
    );

    toast?.onHidden.subscribe(() => {
      this.router.navigate(['/fornecedores/listar-todos']);
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
