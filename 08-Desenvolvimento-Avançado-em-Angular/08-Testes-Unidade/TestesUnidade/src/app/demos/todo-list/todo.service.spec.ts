import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

import { TasksService } from './todo.service';
import { Store } from './todo.store';
import { ITask } from './task';


describe('TasksService', () => {

    let service: TasksService;
    let httpMock: HttpTestingController;
    let store: Store;

    const todolistMock: ITask[] = [
        { id: 1, nome: 'Responder e-mails', finalizado: true, iniciado: false }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TasksService,
                Store,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(TasksService);
        httpMock = TestBed.inject(HttpTestingController);
        store = TestBed.inject(Store);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('Deve buscar a lista de tarefas e atualizar o store', () => {
        service.getTodoList$()
            .subscribe(result => {
                expect(result.length).toBe(1);
                expect(result).toEqual(todolistMock);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/todolist`);
        expect(req.request.method).toBe('GET');

        req.flush(todolistMock);

        // valida efeito colateral
        expect(store.value.todolist).toEqual(todolistMock);
    });

});