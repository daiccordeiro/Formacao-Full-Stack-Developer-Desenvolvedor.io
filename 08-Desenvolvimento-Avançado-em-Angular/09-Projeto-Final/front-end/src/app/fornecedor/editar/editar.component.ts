import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChildren, ElementRef, inject, QueryList, DestroyRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

import { NgxBrazil, NgxBrazilMASKS, NgxBrazilValidators } from 'ngx-brazil';

import { StringUtils } from '../../utils/string-utils';
import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';

import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { ListaProdutosComponent } from "../produtos/lista-produtos.component";
import { CepConsulta, Endereco } from '../models/endereco';


@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgxBrazil,
    NgxSpinnerModule,
    ListaProdutosComponent
],
  templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit, AfterViewInit  {

  private fb = inject(FormBuilder);
  private fornecedorService = inject( FornecedorService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private spinner = inject(NgxSpinnerService);
  private destroyRef = inject(DestroyRef);

  @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements!: QueryList<ElementRef>;

  fornecedorForm!: FormGroup;
  enderecoForm!: FormGroup;

  fornecedor = {} as Fornecedor;
  //endereco = {} as Endereco;

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
    this.spinner.show();

    this.criarForm();

    const fornecedor = this.route.snapshot.data['fornecedor'];

    if (fornecedor) {
      this.fornecedor = fornecedor;

      this.fornecedor.endereco = this.fornecedor.endereco ?? {} as Endereco;
      this.preencherForm();

      // Sincroniza mudanças do form de endereço com o objeto
      this.enderecoForm.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(value => {
          Object.assign(this.fornecedor.endereco, value);
        });
    }

    this.spinner.hide();
  }

  private criarForm(): void {
    this.fornecedorForm = this.fb.group({
      id: [''],
      nome: ['', [Validators.required]],
      documento: [''],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
    });

    this.enderecoForm = this.fb.group({
        id: [''],
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required, NgxBrazilValidators.cep]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]],
        fornecedorId: ['']
    });
  }

  private preencherForm(): void {
    const fornecedor = this.fornecedor;
    if (!fornecedor) return;

    this.fornecedorForm.patchValue({
      ...fornecedor
    });

    this.trocarValidacaoDocumento(fornecedor.tipoFornecedor);

    if (fornecedor.endereco){
      this.enderecoForm.patchValue({
        ...fornecedor.endereco,
        fornecedorId: fornecedor.id
      });
    }
  }

  ngAfterViewInit(): void {
    this.tipoFornecedorForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(tipo => {
        this.trocarValidacaoDocumento(tipo);
        this.validarFormulario();
      });
    this.configurarElementosValidacao();
  }

  // Para validar o campo [Documento] dinamicamente
  configurarElementosValidacao() {
    const controlBlurs = this.formInputElements
    .toArray()
    .map((formControl: ElementRef) =>
      fromEvent(formControl.nativeElement, 'blur')
      );

    // Evento disparado toda vez que 'perco' o foco do controle do formulário
    merge(...controlBlurs)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
      this.validarFormulario();
    });
  }

  validarFormulario(): void {
    const fornecedorMsg = this.genericValidator.processarMensagens(this.fornecedorForm);
    const enderecoMsg = this.genericValidator.processarMensagens(this.enderecoForm);

    this.displayMessage = {
      ...fornecedorMsg,
      ...enderecoMsg
    };
    this.mudancasNaoSalvas = this.fornecedorForm.dirty || this.enderecoForm.dirty;
  }

  trocarValidacaoDocumento(tipo: number | string): void {
    const tipoNumero = Number(tipo);
    const control = this.documento;

    control.clearValidators();

    control.setValidators([
      Validators.required,
      tipoNumero === 1
        ? NgxBrazilValidators.cpf
        : NgxBrazilValidators.cnpj
    ]);

    control.updateValueAndValidity();

    this.textoDocumento = tipoNumero === 1
      ? 'CPF (requerido)'
      : 'CNPJ (requerido)';
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
      this.errors = ['CEP Inválido'];
      return;
    }

    this.errors = [];

    this.spinner.show();

    this.fornecedorService.consultarCep(cep)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cepRetorno) => {
          this.spinner.hide();
          this.preencherEnderecoConsulta(cepRetorno);
        },
        error: (erro) => {
          this.spinner.hide();
          this.errors = erro?.error?.errors ?? [erro];
        }
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


  //Fornecedor
  editarFornecedor(): void {
    if (!this.fornecedorForm.dirty || this.fornecedorForm.invalid) return;

    this.spinner.show();

    Object.assign(this.fornecedor, this.fornecedorForm.getRawValue());
    this.fornecedor.documento = StringUtils.somenteNumeros(this.fornecedor.documento);

    Object.assign(this.fornecedor.endereco, this.enderecoForm.getRawValue());
    this.fornecedor.endereco.cep = StringUtils.somenteNumeros(this.fornecedor.endereco.cep);
    this.fornecedor.endereco.fornecedorId = this.fornecedor.id;

    this.fornecedorService.atualizarFornecedor(this.fornecedor)
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


  //Endereço
  editarEndereco(): void {
    if (!this.enderecoForm.dirty || this.enderecoForm.invalid) return;

    this.spinner.show();

    Object.assign(this.fornecedor.endereco, this.enderecoForm.getRawValue());

    this.fornecedor.endereco.cep = StringUtils.somenteNumeros(this.fornecedor.endereco.cep);
    this.fornecedor.endereco.fornecedorId = this.fornecedor.id;

    this.fornecedorService.atualizarEndereco(this.fornecedor.endereco)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: sucesso => {
          this.spinner.hide();
          this.mudancasNaoSalvas = false;

          this.processarSucessoEndereco(sucesso);
        },
        error: falha => {
          this.spinner.hide();
          this.processarFalhaEndereco(falha);
        }
      });
  }

  processarSucessoEndereco(endereco: Endereco): void {
    this.errors = [];

    const toast = this.toastr.success(
      'Endereço atualizado com sucesso!',
      'Sucesso!',
      { progressBar: true, closeButton: true }
    );

    this.enderecoForm.patchValue(this.fornecedor.endereco);
    this.enderecoForm.markAsPristine();

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

  //Modal
  abrirModal(content: any, event?: Event){
    (event?.target as HTMLElement)?.blur();

    this.fornecedor.endereco = this.fornecedor.endereco ?? {} as Endereco;

    this.enderecoForm.reset(this.fornecedor.endereco);
    this.enderecoForm.markAsPristine();
    this.enderecoForm.markAsUntouched();

    this.modalService.open(content);
  }
}
