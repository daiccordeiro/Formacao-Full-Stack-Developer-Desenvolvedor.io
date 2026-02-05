import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from "@angular/router";


@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
    CommonModule,
    NgbCollapseModule,
    RouterLink
],
    templateUrl: './menu.component.html',
})

export class MenuComponent {
  isCollapsed = true;
}
