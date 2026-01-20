import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';  // Imports para usar ngIf, ngSwitch, pipes...
import { map } from 'rxjs/operators';

import { ToDoListComponent } from "../todo-list/todo-list.component";
import { Observable, Subscription } from 'rxjs';
import { TasksService } from '../../todo.service';
import { Store } from '../../todo.store';

@Component({
  selector: 'tasks',
  imports: [
    CommonModule, 
    ToDoListComponent
  ],
  templateUrl: './tasks.component.html'
})

export class TasksComponent implements OnInit, OnDestroy {

  todolist$: Observable<any[]>;
  subscription: Subscription;

  constructor(private taskService: TasksService, private store: Store) {}

  ngOnInit() { 
    //this.todolist$ =  this.taskService.getToDoList();
    this.todolist$ =  this.store.getTodoList()
      .pipe(
        map(todolist => todolist.filter(task => !task.iniciado && !task.finalizado))
      );

      this.subscription = this.taskService.getTodoList$().subscribe();
  }  

  onToggle(event){
    this.taskService.toggle(event);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}