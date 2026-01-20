import { Component, Inject, Injector, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BarFactory, BarServices, BarServicesMock, BebidaService } from './bar.service';

import { BAR_UNIDADE_CONFIG, BarUnidadeConfig } from './bar.config';


@Component({  
  selector: 'app-bar',
  imports: [
    CommonModule
  ],
  providers:[   
    //{ provide: BarServices, useClass: BarServicesMock }, // para testar
    //{ provide: BarServices, useClass: BarServices },
    { 
      provide: BarServices, useFactory: BarFactory, 
      deps: [
        HttpClient, Injector
      ]
    }, 
    { provide: BebidaService, useExisting: BarServices }
  ],   
  templateUrl: './bar.component.html',
})

export class BarComponent {   
  
  ConfigManual: BarUnidadeConfig;
  Config: BarUnidadeConfig;
  
  barBebida1!: string;
  dadosUnidade!: string;
  barBebida2!: string;

  
  constructor (
    private barServices: BarServices,
    @Inject('ConfigManualUnidade') private ApiConfigManual: BarUnidadeConfig,
    @Inject(BAR_UNIDADE_CONFIG) private ApiConfig: BarUnidadeConfig,
    private bebidaService : BebidaService,
    private ngZone: NgZone
    ) {}


  ngOnInit(): void {
    this.barBebida1 = this.barServices.obterBebidas();
    this.ConfigManual = this.ApiConfigManual;
    this.Config = this.ApiConfig;
    this.dadosUnidade = this.barServices.obterUnidade();

    this.barBebida2 = this.bebidaService.obterBebidas();
  }    


  //ngZone
  public progress: number = 0;
  public label!: string;

  processWithinAngularZone() {
    this.label = 'dentro';
    this.progress = 0;
    this._increaseProgress(() => console.log('Finalizado por DENTRO do Angular!')); //Callback
  }

  processOutsideOfAngularZone() {
    this.label = 'fora';
    this.progress = 0;
    this.ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
        this.ngZone.run(() => { console.log('Finalizado por FORA do Angular!'); }); //Callback
      });
    });
  }

  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Progresso atual: ${this.progress}%`);

    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 10);
    } else {
      doneCallback();
    }
  }
}