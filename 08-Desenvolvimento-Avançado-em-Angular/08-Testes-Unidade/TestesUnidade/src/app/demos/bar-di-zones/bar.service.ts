import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BAR_UNIDADE_CONFIG, BarUnidadeConfig } from './bar.config';

export function BarFactory(http: HttpClient, injector: Injector){
  return new BarServices(http, injector.get(BAR_UNIDADE_CONFIG));
}

@Injectable()

export class BarServices {
  constructor(
    private http: HttpClient,
    @Inject(BAR_UNIDADE_CONFIG) private config: BarUnidadeConfig) {}

  obterUnidade(): string {   
    return `Unidade ID: ${this.config.unidadeId} | Token: ${this.config.unidadeToken}`;
  }

  obterBebidas(): string { 
    return 'Bebidas'; 
  }

  obterPorcoes(): string { 
    return 'Porções'; 
  }

  obterRefeicoes(): string { 
    return 'Refeições'; 
  }
}


// Mock para testes
export class BarServicesMock {
  obterBebidas(): string { 
    return 'Mock'; 
  }

  obterPorcoes(): string { 
    return 'Mock'; 
  }

  obterRefeicoes(): string { 
    return 'Mock'; 
  }
}


// Abstração, representando o método [obterBebidas]
export abstract class BebidaService {
  abstract obterBebidas(): string;
}