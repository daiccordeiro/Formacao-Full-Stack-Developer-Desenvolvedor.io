import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import para usar ngIf, ngSwitch, pipes...
import { ActivatedRoute, Router } from '@angular/router';

import { Produto } from '../models/produto';
import { ProdutoService } from '../../services/produto.service';


@Component({
  selector: 'app-editar-produto', 
  imports: [
    CommonModule
  ],
  templateUrl: './editar-produto.component.html', 
})

export class EditarProdutoComponent implements OnInit {

  produto!: Produto;
  
  constructor(
    private route: ActivatedRoute,            // Pega dados da rota ATIVA
    private produtoService: ProdutoService,
    private router: Router){}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);

      this.produtoService.obterPorId(id)
        .subscribe(produto => {
          if (!produto) {
            this.router.navigate(['/produtos']);
            return;
          }
          this.produto = produto;
        });
      });    
  }
  
  salvar(): void {
    //Comunicação com backend
    this.router.navigate(['/produtos']); // navegação imperativa
  }
}