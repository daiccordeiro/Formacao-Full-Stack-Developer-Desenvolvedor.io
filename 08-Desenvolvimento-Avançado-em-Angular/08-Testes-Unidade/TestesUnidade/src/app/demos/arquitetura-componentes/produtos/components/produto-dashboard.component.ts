import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { CommonModule } from '@angular/common';  // Imports para usar ngIf, ngSwitch, pipes...

import { ActivatedRoute } from '@angular/router';

import { Produto } from '../models/produto';
import { ProdutoDetalheComponent } from './produto-card-detalhe.component';
import { ProdutoCountComponent } from './produto-count.component';

@Component({
  selector: 'app-produto-dashboard',  
  imports: [
    CommonModule, 
    ProdutoDetalheComponent, 
    ProdutoCountComponent
  ],  
  templateUrl: './produto-dashboard.component.html',
})

export class ProdutoDashboardComponent implements OnInit, AfterViewInit {
  
  produtos!: Produto[]

  @ViewChild(ProdutoCountComponent, { static: false })
   contador!: ProdutoCountComponent;

  @ViewChild('teste', { static: false })
   mensagemTela!: ElementRef<HTMLElement>; 
  
  @ViewChildren(ProdutoDetalheComponent)
   botoes!: QueryList<ProdutoDetalheComponent>;


  constructor(private route: ActivatedRoute) {} 

  ngOnInit() {
    this.produtos = this.route.snapshot.data['produtos']; // Trazendo os dados direto da rota, com o ActivatedRoute
    console.log(this.route.snapshot.data['teste']);
  }
  
   ngAfterViewInit(): void {
    console.log('Objeto do Contador: ', this.contador.produtos);

    const clickTexto$: Observable<Event> = 
    fromEvent(this.mensagemTela.nativeElement,'click');

    clickTexto$.subscribe(() => {
      alert('clicou no texto!');
      return;
    });

    //console.log(this.botoes);
    this.botoes.forEach(botao => {
      console.log(botao.produto);
    });
  }

  mudarStatus(produto: Produto) {
    produto.ativo = !produto.ativo;
  }
}