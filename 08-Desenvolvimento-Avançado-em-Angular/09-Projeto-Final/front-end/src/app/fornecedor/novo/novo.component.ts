import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { fromEvent, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ToastrService } from 'ngx-toastr';

import { Router, RouterLink } from '@angular/router';
import { NgxBrazil, NgxBrazilValidators, NgxBrazilMASKS } from 'ngx-brazil';

import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { StringUtils } from '../../utils/string-utils';

import { CepConsulta } from '../models/endereco';
import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';


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
  private fornecedorService = inject(FornecedorService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private destroyRef = inject(DestroyRef);

  @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements!: QueryList<ElementRef>;

  fornecedorForm!: FormGroup;
  fornecedor = {} as Fornecedor;

  errors: any[] = [];
  mudancasNaoSalvas = false;
  displayMessage: DisplayMessage = {};

  MASKS = NgxBrazilMASKS;
  textoDocumento: string = 'CPF (requerido)';


  validationMessages: ValidationMessages = {
    nome: { required: 'Informe o Nome' },
    documento: {
      required: 'Informe o Documento',
      cpf: 'CPF em formato inválido',
      cnpj: 'CNPJ em formato inválido'},
    logradouro: { required: 'Informe o Logradouro' },
    numero: { required: 'Informe o Número' },
    bairro: { required: 'Informe o Bairro' },
    cep: { required: 'Informe o CEP' },
    cidade: { required: 'Informe a Cidade' },
    estado: { required: 'Informe o Estado' }
  };
  genericValidator = new GenericValidator(this.validationMessages);

  formResult: any;

  ngOnInit(): void {
    this.criarForms();
  }

  private criarForms(): void {
    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required, NgxBrazilValidators.cpf]],
      ativo: [true],
      tipoFornecedor: ['', [Validators.required]],

      endereco: this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required, NgxBrazilValidators.cep]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]]
      })
    });

    this.fornecedorForm.patchValue({ tipoFornecedor: 1, ativo: true });

    this.fornecedorForm.valueChanges.subscribe(() => {
      this.formResult = JSON.stringify(this.fornecedorForm.value);
    });
  }

  ngAfterViewInit(): void {
   // this.trocarValidacaoDocumento();

    this.tipoFornecedorForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.trocarValidacaoDocumento();
        this.validarFormulario();
      });
    this.configurarElementosValidacao();
  }

  // Para validar o campo [Documento] dinamicamente
  configurarElementosValidacao() {
    const controlBlurs = this.formInputElements
    .toArray()
    .map((formControl: ElementRef) =>
      merge(
        fromEvent(formControl.nativeElement, 'blur'),
        fromEvent(formControl.nativeElement, 'change')
      ));

    // Evento disparado toda vez que 'perco' o foco do controle do formulário
    merge(...controlBlurs)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
      this.validarFormulario();
    });
  }

  validarFormulario(): void {
    this.displayMessage = {
      ...this.genericValidator.processarMensagens(this.fornecedorForm),
      ...this.genericValidator.processarMensagens(this.fornecedorForm.get('endereco') as FormGroup)
    };
    this.mudancasNaoSalvas = true;
  }

  trocarValidacaoDocumento() {
    if (this.tipoFornecedorForm.value === 1) {

      this.documento.clearValidators();
      this.documento.setValidators([
        Validators.required,
        NgxBrazilValidators.cpf
      ]);

      this.textoDocumento = "CPF (requerido)";

    } else {

      this.documento.clearValidators();
      this.documento.setValidators([
        Validators.required,
        NgxBrazilValidators.cnpj
      ]);

      this.textoDocumento = "CNPJ (requerido)";
    }
    this.documento.updateValueAndValidity();
  }

  get tipoFornecedorForm(): AbstractControl {
    return this.fornecedorForm.get('tipoFornecedor')!;
  }

  get documento(): AbstractControl {
    return this.fornecedorForm.get('documento')!;
  }

  //Buscando CEP via API: viacep
  buscarCep(cep: string): void {
    cep = StringUtils.somenteNumeros(cep);

    if (cep.length !== 8) {
      this.errors.push('CEP Inválido');
      return;
    }

    this.fornecedorService.consultarCep(cep)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cepRetorno) => this.preencherEnderecoConsulta(cepRetorno),
        error: (erro) => this.errors.push(erro)
      });
  }

  preencherEnderecoConsulta(cepConsulta: CepConsulta): void {
    this.fornecedorForm.patchValue({
      endereco: {
        logradouro: cepConsulta.logradouro,
        bairro: cepConsulta.bairro,
        cep: cepConsulta.cep,
        cidade: cepConsulta.localidade,
        estado: cepConsulta.uf
      }
    });
  }


  adicionarFornecedor(): void {
    // Só processar o formulário se ele foi alterado (dirty) e é válido (valid)
    if (!this.fornecedorForm.dirty || !this.fornecedorForm.valid) return;
      const fornecedorNovo: Fornecedor = this.fornecedorForm.value;

      fornecedorNovo.endereco.cep = StringUtils.somenteNumeros(fornecedorNovo.endereco.cep);
      fornecedorNovo.documento = StringUtils.somenteNumeros(fornecedorNovo.documento);

      this.fornecedorService.novoFornecedor(fornecedorNovo)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: sucesso => {
            //this.mudancasNaoSalvas = false;
            this.processarSucesso(sucesso);
          },
          error: falha => this.processarFalha(falha)
        });
  }

  processarSucesso(response: any): void {
    this.fornecedorForm.reset();
    this.errors = [];

    this.mudancasNaoSalvas = false;
    
    const toast = this.toastr.success(
      'Fornecedor cadastrado com sucesso!',
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
