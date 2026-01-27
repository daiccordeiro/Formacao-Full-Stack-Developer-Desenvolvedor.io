import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { Produto } from '../produtos/models/produto';
import { ProdutoService } from './produto.service';


describe('ProdutoService', () => {

    let service: ProdutoService;
    let httpMock: HttpTestingController;

    const produtosFake: Produto[] = [
        { id: 1, nome: 'Galaxy S10+', ativo: true, valor: 100, imagem: 'celular.jpg' },
        { id: 2, nome: 'Go Pro 8', ativo: true, valor: 200, imagem: 'gopro.jpg' },
        { id: 3, nome: 'Laptop Asus', ativo: false, valor: 300, imagem: 'laptop.jpg' }
    ];


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProdutoService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(ProdutoService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('Deve retornar apenas produtos ativos', () => {
        service.obterTodos('ativos')
            .subscribe(produtos => {
                expect(produtos.length).toBe(2);
                expect(produtos.every(p => p.ativo)).toBeTrue();
        });

        const req = httpMock.expectOne('http://localhost:3000/produtos');
        expect(req.request.method).toBe('GET');

        req.flush(produtosFake);
    });

    it('Deve retornar um produto por id', () => {
        service.obterPorId(2)
            .subscribe(produto => {
                expect(produto).toBeTruthy();
                expect(produto?.id).toBe(2);
                expect(produto?.nome).toBe('Go Pro 8');
        });

        const req = httpMock.expectOne('http://localhost:3000/produtos');
        expect(req.request.method).toBe('GET');

        req.flush(produtosFake);
    });

});