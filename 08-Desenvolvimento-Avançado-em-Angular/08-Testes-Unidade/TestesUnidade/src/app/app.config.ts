import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { NgxBrazil } from 'ngx-brazil';

import { routes } from './app.routes';

import { AuthGuard } from './services/app.guard';
import { CadastroGuard } from './services/cadastro.guard';
import { BAR_UNIDADE_CONFIG, BarUnidadeConfig } from './demos/bar-di-zones/bar.config';

registerLocaleData(localePt);

const barUnidadeConfig: BarUnidadeConfig = {
  unidadeId: 1000,
  unidadeToken: 'eca938c99a0e9ff91029dc'
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Infra básica (substitui BrowserModule)
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    
    // Guards globais
    AuthGuard,
    CadastroGuard,

    // Módulos legados / terceiros
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      NgxBrazil,       
    ),
    
    {
      provide: BAR_UNIDADE_CONFIG,
      useValue: barUnidadeConfig
    },
    {
      provide: 'ConfigManualUnidade',
      useValue: barUnidadeConfig
    }  
  ]
};