import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren, ElementRef, inject, QueryList, DestroyRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, fromEvent, map, merge, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

import { Fornecedor } from '../models/fornecedor';
import { CepConsulta, Endereco } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';

import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { NgxBrazil, NgxBrazilMASKS, NgxBrazilValidators } from 'ngx-brazil';
import { StringUtils } from '../../utils/string-utils';

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

  private fb = inject(FormBuilder);
  private fornecedorService = inject( FornecedorService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private modalService = inject(NgbModal);
  private spinner = inject(NgxSpinnerService);

  @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements!: QueryList<ElementRef>;

  fornecedorForm!: FormGroup;
  enderecoForm!: FormGroup;

  fornecedor = {} as Fornecedor;
  endereco = {} as Endereco;

  errors: any[] = [];
  errorsEndereco: any[] = [];

  mudancasNaoSalvas = false;
  displayMessage: DisplayMessage = {};

  MASKS = NgxBrazilMASKS;
  textoDocumento: string = '';
  tipoFornecedor!: number;


  validationMessages: ValidationMessages = {
    nome: { required: 'Informe o Nome' },
    documento: {
      required: 'Informe o Documento',
      cpf: 'CPF em formato Inválido',
      cnpj: 'CNPJ em formato Inválido'},
    logradouro: { required: 'Informe o Logradouro' },
    numero: { required: 'Informe o Número' },
    bairro: { required: 'Informe o Bairro' },
    cep: { required: 'Informe o CEP' },
    cidade: { required: 'Informe a Cidade' },
    estado: { required: 'Informe o Estado' }
  };
  genericValidator = new GenericValidator(this.validationMessages);


  ngOnInit(): void {
    this.criarForm();

    const fornecedor = this.route.snapshot.data['fornecedor'];
    if (fornecedor){
      this.fornecedor = fornecedor;
      this.tipoFornecedor = this.fornecedor.tipoFornecedor;

      this.fornecedorForm.patchValue(this.fornecedor);

      if (fornecedor.endereco){
        this.enderecoForm.patchValue(fornecedor.endereco);
      }
      this.preencherForm();
    }
  }

  private criarForm(): void {
    this.spinner.show();

    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
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
    setTimeout(() => {this.spinner.hide();}, 1000);
  }

  private preencherForm(): void {
    this.fornecedorForm.setValue({
      id: this.fornecedor.id,
      nome: this.fornecedor.nome,
      ativo: this.fornecedor.ativo,
      tipoFornecedor: this.fornecedor.tipoFornecedor.toString(),
      documento: this.fornecedor.documento
    });

    if (this.tipoFornecedorForm.value === 1) {
      this.documento.setValidators([Validators.required, NgxBrazilValidators.cpf]);
    }
    else {
      this.documento.setValidators([Validators.required, NgxBrazilValidators.cnpj]);
    }

    this.enderecoForm.setValue({
      id: this.fornecedor.endereco.id,
      logradouro: this.fornecedor.endereco.logradouro,
      numero: this.fornecedor.endereco.numero,
      complemento: this.fornecedor.endereco.complemento,
      bairro: this.fornecedor.endereco.bairro,
      cep: this.fornecedor.endereco.cep,
      cidade: this.fornecedor.endereco.cidade,
      estado: this.fornecedor.endereco.estado
    });
  }

  ngAfterViewInit(): void {
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
    this.enderecoForm.patchValue({
      logradouro: cepConsulta.logradouro,
      bairro: cepConsulta.bairro,
      cep: cepConsulta.cep,
      cidade: cepConsulta.localidade,
      estado: cepConsulta.uf
    });
  }


  editarFornecedor(): void {
    // Só processar o formulário se ele foi alterado (dirty) e é válido (valid)
    if (!this.fornecedorForm.dirty || !this.fornecedorForm.valid) return;
      const fornecedorAtualizado: Fornecedor = this.fornecedorForm.value;

      fornecedorAtualizado.endereco.cep = StringUtils.somenteNumeros(fornecedorAtualizado.endereco.cep);
      fornecedorAtualizado.documento = StringUtils.somenteNumeros(fornecedorAtualizado.documento);

      this.fornecedorService.atualizarFornecedor(fornecedorAtualizado)
        .pipe(takeUntilDestroyed(this.destroyRef))
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

  editarEndereco(): void {
    // Só processar o formulário se ele foi alterado (dirty) e é válido (valid)
    if (!this.enderecoForm.dirty || !this.enderecoForm.valid) return;
      const enderecoNovo: Endereco = this.enderecoForm.value;

      enderecoNovo.cep = StringUtils.somenteNumeros(enderecoNovo.cep);
      enderecoNovo.fornecedorId = this.fornecedor.id;

      this.fornecedorService.atualizarEndereco(enderecoNovo)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: sucesso => {
            this.mudancasNaoSalvas = false;
            this.processarSucessoEndereco(sucesso);
          },
          error: falha => this.processarFalhaEndereco(falha)
        });
  }

  processarSucessoEndereco(endereco: Endereco): void {
    this.enderecoForm.reset();
    this.errors = [];

    const toast = this.toastr.success(
      'Endereço atualizado com sucesso!',
      'Sucesso!',
      { progressBar: true, closeButton: true }
    );

    this.fornecedor.endereco = endereco
    this.modalService.dismissAll();
  }

  processarFalhaEndereco(fail: any): void {
    this.errorsEndereco = fail.error?.errors ?? [];

    this.toastr.error(
      'Ocorreu um erro ao processar a solicitação.',
      'Erro',
      { progressBar: true, closeButton: true }
    );
  }

  abrirModal(content: any){
    this.modalService.open(content);
  }
}
