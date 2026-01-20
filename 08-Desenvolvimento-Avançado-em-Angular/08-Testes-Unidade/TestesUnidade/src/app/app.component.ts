import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuComponent } from './navegacao/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './navegacao/footer/footer.component';

@Component({
  selector: 'app-root',  
  imports: [
    CommonModule,
    MenuComponent,
    RouterOutlet,
    FooterComponent
  ],
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'MeuProjeto';
}