import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-menu',
    imports: [
      CommonModule,
      NgbCollapseModule,
  ],
    templateUrl: './menu.component.html',
})

export class MenuComponent {
  isCollapsed = true;
}
