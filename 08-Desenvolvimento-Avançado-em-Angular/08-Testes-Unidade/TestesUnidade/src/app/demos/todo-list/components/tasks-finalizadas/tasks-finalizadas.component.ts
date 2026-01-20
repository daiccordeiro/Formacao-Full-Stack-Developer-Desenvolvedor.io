import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Imports para usar ngIf, ngSwitch, pipes...
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ToDoListComponent } from "../todo-list/todo-list.component";
import { TasksService } from '../../todo.service';
import { Store } from '../../todo.store';

@Component({
  selector: 'tasks-finalizadas',
  imports: [
    CommonModule, 
    ToDoListComponent
  ],
  templateUrl: './tasks-finalizadas.component.html'
})

export class TasksFinalizadasComponent implements OnInit {

  finalizados$: Observable<any[]>;

  constructor(private taskService: TasksService, private store: Store) {}

  ngOnInit() { 
    //this.finalizados$ =  this.taskService.getToDoList();
   this.finalizados$ =  this.store.getTodoList()
      .pipe(
         map(todolist => todolist.filter(task => task.finalizado))
    );
  }

   onToggle(event){
    this.taskService.toggle(event);
  }
}