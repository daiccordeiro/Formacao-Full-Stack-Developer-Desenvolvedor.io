import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormControlName, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, merge, Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { CustomValidators } from '../../utils/custom-validators';

import { Usuario } from '../models/usuario';
import { ContaService } from '../services/conta.service';


@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule
  ],
  templateUrl: './cadastro.component.html'
})

export class CadastroComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errors: any[] = [];
  cadastroForm!: FormGroup;
  usuario!: Usuario;

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};


  mudancasNaoSalvas!: boolean;


  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
    private router: Router,
    private snackBar: MatSnackBar) {

    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email Inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      },
      confirmPassword: {
        required: 'Informe a senha novamente',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
        equalTo: 'As senhas não conferem'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength(6,15)]],
      confirmPassword: ['', [Validators.required, CustomValidators.rangeLength(6,15), CustomValidators.equalTo('password')]]
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] =
      this.formInputElements.map((formControl: ElementRef) =>
        fromEvent(formControl.nativeElement, 'blur'));

    // Evento disparado toda vez que 'perco' o foco do controle do formulário
    merge(...controlBlurs).subscribe(() => {
      this.displayMessage =
        this.genericValidator.processarMensagens(this.cadastroForm);

        this.mudancasNaoSalvas = true;
    });
  }

  adicionarConta(): void {
    // Só processar o formulário se ele foi alterado (dirty) e é válido (valid)
    if (this.cadastroForm.dirty && this.cadastroForm.valid) {
      // Tipando o objeto usuario, com a Model Usuario
      this.usuario = {
        ...this.usuario,
        ...this.cadastroForm.value
      };

      this.contaService.cadastrarUsuario(this.usuario).subscribe({
        next: sucesso => this.processarSucesso(sucesso),
        error: falha => this.processarFalha(falha)
      });

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any): void {
    this.cadastroForm.reset();
    this.errors = [];

    this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);

    this.snackBar.open(
      'Registro realizado com Sucesso! Bem-vindo!',
      'Fechar',
      { duration: 3000 }
    ).afterDismissed().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  processarFalha(fail: any): void {
    this.errors = fail.error?.errors ?? [],

    this.snackBar.open(
      'Ocorreu um erro!',
      'Fechar',
      { duration: 4000 }
    );
  }
}
