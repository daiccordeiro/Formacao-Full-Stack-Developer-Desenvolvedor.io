import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormControlName, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, merge, Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';

import { DisplayMessage, GenericValidator, ValidationMessages } from '../../utils/generic-form-validation';
import { CustomValidators } from '../../utils/custom-validators';

import { Usuario } from '../models/usuario';
import { ContaService } from '../services/conta.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

 @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errors: any[] = [];
  loginForm!: FormGroup;
  usuario!: Usuario;

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
    private router: Router,
    private toastr: ToastrService) {

    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email Inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength(6,15)]]
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] =
      this.formInputElements.map((formControl: ElementRef) =>
        fromEvent(formControl.nativeElement, 'blur'));

    // Evento disparado toda vez que 'perco' o foco do controle do formulário
    merge(...controlBlurs).subscribe(() => {
      this.displayMessage =
        this.genericValidator.processarMensagens(this.loginForm);
    });
  }

  login(): void {
    // Só processar o formulário se ele foi alterado (dirty) e é válido (valid)
    if (this.loginForm.dirty && this.loginForm.valid) {
      // Tipando o objeto usuario, com a Model Usuario
      this.usuario = {
        ...this.usuario,
        ...this.loginForm.value
      };

      this.contaService.login(this.usuario).subscribe({
        next: sucesso => this.processarSucesso(sucesso),
        error: falha => this.processarFalha(falha)
      });
    }
  }

  processarSucesso(response: any): void {
    this.loginForm.reset();
    this.errors = [];

    //this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);
    this.contaService.salvarUsuarioLocal(response);

    const toast = this.toastr.success(
      'Login realizado com Sucesso!',
      'Bem-vindo!',
      {
        progressBar: true,
        closeButton: true
      }
    );

    toast?.onHidden.subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  processarFalha(fail: any): void {
    this.errors = fail.error?.errors ?? [],

     this.toastr.error(
      'Ocorreu um erro ao processar a solicitação.',
      'Erro',
      {
        progressBar: true,
        closeButton: true
      }
    );
  }
}
