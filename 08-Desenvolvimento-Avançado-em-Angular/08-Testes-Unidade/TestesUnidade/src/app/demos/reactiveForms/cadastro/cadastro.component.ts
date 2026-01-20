import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControlName, FormsModule } from '@angular/forms';
import { NgxBrazil, NgxBrazilValidators, NgxBrazilMASKS } from 'ngx-brazil';

import { Usuario } from './models/usuario';
import { DisplayMessage, GenericValidator, ValidationMessages } from './generic-form-validation'; 
import { fromEvent, merge, Observable } from 'rxjs';
import { CustomValidators } from './custom-validators'; // Meus validadores customizados

@Component({
    selector: 'app-cadastro',
    imports: [
      CommonModule, 
      ReactiveFormsModule,  
      FormsModule, 
      NgxBrazil       
    ],
    templateUrl: './cadastro.component.html'    
})

export class CadastroComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  cadastroForm: FormGroup;
  usuario: Usuario;
  formResult: string = '';  
  MASKS = NgxBrazilMASKS;
  
  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};
  
  // Usando FormGroup e FormControl
  /*   
   constructor() { } 

   ngOnInit() {
      this.cadastroForm = new FormGroup({
        nome: new FormControl(''),
        cpf: new FormControl(''),
        email: new FormControl(''),
        senha: new FormControl(''),
        senhaConfirmacao: new FormControl(''),
      });

    }
  */

 mudancasNaoSalvas: boolean;

  // Usando FormBuilder
  constructor(private fb: FormBuilder) {
    this.validationMessages = {
      nome: {
        required: 'O Nome é requerido',
        minlength: 'O Nome precisa ter no mínimo 2 caracteres',
        maxlength: 'O Nome precisa ter no máximo 150 caracteres'
      },
      cpf: {
        required: 'Informe o CPF',
        cpf: 'CPF em formato Inválido'
      },
      email: {
        required: 'Informe o e-mail',
        email: 'Email Inválido'
      },
      senha: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      },
      senhaConfirmacao: {
        required: 'Informe a senha novamente',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
        equalTo: 'As senhas não conferem'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }
    
  ngOnInit() { 
    // Definição dos controles do formulário e suas validações
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]], // Validação do campo Nome
      cpf: ['', [Validators.required, NgxBrazilValidators.cpf]], // Validação de campo requerido e CPF válido
      email: ['', [Validators.required, Validators.email]], // Validação de campo requerido e formato de email
      senha: ['', [Validators.required, CustomValidators.rangeLength(6,15)]], 
      senhaConfirmacao: ['', [Validators.required, CustomValidators.rangeLength(6,15), CustomValidators.equalTo('senha')]]
    });
  }
  
  
  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Evento disparado toda vez que 'perco' o foco do controle do formulário  
    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.cadastroForm);
      this.mudancasNaoSalvas =  true;
    });
  }


  adicionarUsuario() {
    // Só processar o formulário se ele foi alterado (dirty) e é válido (valid)
    if (this.cadastroForm.dirty && this.cadastroForm.valid) {
      // Tipando o objeto usuario, com a Model Usuario
      this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);
      this.formResult = JSON.stringify(this.cadastroForm.value);

      this.mudancasNaoSalvas =  false;
    }
    else {
      this.formResult = "Não submeteu!!!"  
    }
  }
}