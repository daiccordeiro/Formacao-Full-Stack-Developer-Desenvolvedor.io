import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { MenuComponent } from './navegacao/menu/menu.component';
import { FooterComponent } from './navegacao/footer/footer.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,

    MenuComponent,
    FooterComponent,

    NgbModule,  // Bootstrap
  ],
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'front-end';
}
