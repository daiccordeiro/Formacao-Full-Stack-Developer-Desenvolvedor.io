import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Imports para usar ngIf, ngSwitch, pipes...
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ToDoListComponent } from "../todo-list/todo-list.component";
import { TasksService } from '../../todo.service';
import { Store } from '../../todo.store';

@Component({
  selector: 'tasks-iniciadas',
  imports: [
    CommonModule, 
    ToDoListComponent
  ],
  templateUrl: './tasks-iniciadas.component.html'
})

export class TasksIniciadasComponent implements OnInit {
  
  iniciados$: Observable<any[]>;

  constructor(private taskService: TasksService, private store: Store) {}

  ngOnInit() { 
    //this.iniciados$ =  this.taskService.getToDoList();
    this.iniciados$ =  this.store.getTodoList()
      .pipe(
        map(todolist => todolist.filter(task => task.iniciado && !task.finalizado))
    );
  }

   onToggle(event){
    this.taskService.toggle(event);
  }
}