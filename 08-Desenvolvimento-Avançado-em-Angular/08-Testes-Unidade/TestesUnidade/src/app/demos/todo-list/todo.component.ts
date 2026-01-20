import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Imports para usar ngIf, ngSwitch, pipes...
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksComponent } from './components/tasks/tasks.component';
import { TasksIniciadasComponent } from './components/tasks-iniciadas/tasks-iniciadas.component';
import { TasksFinalizadasComponent } from './components/tasks-finalizadas/tasks-finalizadas.component';
import { ITask } from './task';
import { TasksService } from './todo.service';

@Component({  
  selector: 'app-todo-list',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TasksComponent,
    TasksIniciadasComponent, 
    TasksFinalizadasComponent
  ],  
  templateUrl: './todo.component.html',
})

export class TodoComponent implements OnInit {
  
  tarefaForm: FormGroup;
  tarefa: ITask;

  constructor(private fb: FormBuilder, private tasksService: TasksService) {}

  adicionarTarefa() {
    if (this.tarefaForm.dirty && this.tarefaForm.valid) {
      this.tarefa = Object.assign({}, this.tarefa, this.tarefaForm.value);
      
      this.tasksService.adicionar(this.tarefa);
      this.tarefaForm.reset();
    }
  }
  
  ngOnInit() {
    this.tarefaForm = this.fb.group({
      nome: [''],      
    });
  }
}