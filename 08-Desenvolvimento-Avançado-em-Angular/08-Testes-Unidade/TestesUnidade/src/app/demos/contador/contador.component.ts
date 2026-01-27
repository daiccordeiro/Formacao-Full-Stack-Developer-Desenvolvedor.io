import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-contador',  
  imports: [
    CommonModule
  ],
  templateUrl: './contador.component.html',
  styleUrls: ['./contador.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ContadorComponent {
  
  @Input() passo = 1;
  @Input() min = 0;
  @Input() max = 100;

  @Output() readonly alterado = new EventEmitter<number>();

  @ViewChild('contadorFocus') contadorFocus!: ElementRef<HTMLElement>;

  valor = 0;
  foco = false;


  ngAfterViewInit(): void {
    this.contadorFocus.nativeElement.focus();
  }

  incrementar() {
    if (this.valor < this.max) {
      this.valor += this.passo;
      this.alterado.emit(this.valor);
      this.manterFoco();
    }
  }

  decrementar() {
    if (this.valor > this.min) {
      this.valor -= this.passo;
      this.alterado.emit(this.valor);
      this.manterFoco();
    }
  }

  private manterFoco() {
    queueMicrotask(() => {
      this.contadorFocus?.nativeElement.focus();
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.incrementar();
      event.preventDefault();
    }

    if (event.key === 'ArrowDown') {
      this.decrementar();
      event.preventDefault();
    }
  }

  onFocus() {
    this.foco = true;
  }

  onBlur() {
    this.foco = false;
  }
}