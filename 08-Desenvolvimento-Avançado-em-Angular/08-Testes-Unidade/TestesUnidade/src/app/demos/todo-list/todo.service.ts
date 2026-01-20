import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from "rxjs/operators";

import { ITask } from './task';
import { Store } from './todo.store';

import { environment } from 'src/environments/environment';

@Injectable()
export class TasksService {  

  constructor(
    private http: HttpClient, 
    private store: Store
  ){ }
  
  // Adicionei o $ para ficar igual da aula [getTodoList$:]  
  getTodoList$(): Observable<ITask[]>{
    return this.http            
      .get<ITask[]>(`${environment.apiUrl}/todolist`)
      .pipe(
        tap(next => this.store.set('todolist', next))
      );
  }  

  toggle(event:any){
    this.http
      .put(`${environment.apiUrl}/todolist/${event.task.id}`, event.task)
      .subscribe(() => {        
        const value = this.store.value.todolist;
        
        const todolist = value.map((task: ITask) => {
          if (event.task.id === task.id){
            return { ...task, ...event.task};
          } else {
            return task;
          }  
        });

        this.store.set('todolist', todolist);
      })
  }

// Desafio Final do Módulo: Adicionar uma Caixa com botão Adicionar e Remover
  adicionar(task: ITask) {
    const novaTask: Omit<ITask, 'id'> = {
      ...task,
      finalizado: false,
      iniciado: false
    };

    this.http
      .post<ITask>(`${environment.apiUrl}/todolist`, novaTask)
      .subscribe((taskCriada) => {

        const value = this.store.value.todolist;        
        this.store.set('todolist', [...value, taskCriada]);
      });
  }

  remover(id: number) {
    this.http
    .delete(`${environment.apiUrl}/todolist/${id}`)
    .subscribe(() => {

        const value = this.store.value.todolist.filter(item => item.id !== id);

        this.store.set('todolist', value);
      });
  }
}