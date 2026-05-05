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
import { CurrencyUtils } from '../../utils/currency-utils';

import { Produto, Fornecedor } from '../models/produto';
import { ProdutoService } from '../services/produto.service';

import { ImageCropperComponent, ImageCroppedEvent, ImageTransform, Dimensions } from 'ngx-image-cropper';


@Component({
  selector: 'app-novo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgxBrazil,
    ImageCropperComponent
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

  // Propriedades da imagem
  imageChangedEvent: any = '';
  croppedImage: string = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  //showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imageURL!: string;
  imagemNome!: string;
  //

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
      //imagem: ['', [Validators.required]],
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

  adicionarProduto(): void {
    if (!this.produtoForm.dirty) return;

    // Valida imagem primeiro
    if (!this.croppedImage) {
      this.toastr.error('Selecione e recorte uma imagem antes de salvar');
      return;
    }

    if (this.produtoForm.invalid) return;

    const produtoNovo: Produto = {
      ...this.produtoForm.value
    };

    // Adiciona imagem recortada
    produtoNovo.imagemUpload = this.croppedImage.split(',')[1];
    produtoNovo.imagem = this.imagemNome;

    produtoNovo.valor = CurrencyUtils.stringParaDecimal(produtoNovo.valor);

    this.produtoService.novoProduto(produtoNovo)
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

  //Métodos para subir e editar as imagens
  fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    this.imagemNome = file.name;
    this.croppedImage = '';
    this.imageChangedEvent = file;

    // permite re-selecionar o mesmo arquivo
    input.value = '';
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.base64) {
      this.croppedImage = event.base64;
      this.produtoForm.get('imagem')?.setValue('ok');
    }
  }

  imageLoaded() {
  }

  cropperReady(sourceImageDimensions: Dimensions) {
  }

  loadImageFailed() {
    this.errors.push('O formato do arquivo ' + this.imagemNome + ' não é aceito.');
  }
}
