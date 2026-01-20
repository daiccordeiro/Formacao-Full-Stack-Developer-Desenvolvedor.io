import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import para usar ngIf, ngSwitch, pipes...
import { RouterModule } from '@angular/router'; // Import para usar o RouterLink no html do produto-card-detalhe

import { Produto } from '../models/produto';

@Component({
    selector: 'produto-card-detalhe',
    imports: [
      CommonModule, 
      RouterModule
    ],  
    templateUrl: './produto-card-detalhe.component.html',
  })
  
  export class ProdutoDetalheComponent { 

    @Input()
    produto: Produto; 

    @Output()
    status = new EventEmitter<Produto>();

    emitirEvento(){ 
      this.status.emit(this.produto);
    }
  }