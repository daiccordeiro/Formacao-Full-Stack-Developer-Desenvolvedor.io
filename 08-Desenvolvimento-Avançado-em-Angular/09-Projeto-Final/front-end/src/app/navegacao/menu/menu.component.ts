import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
//import { RouterLink } from "@angular/router";
import { MenuLoginComponent } from "../menu-login/menu-login.component";


@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
    CommonModule,
    NgbCollapseModule,
    //RouterLink,
    MenuLoginComponent
],
    templateUrl: './menu.component.html',
})

export class MenuComponent {
  isCollapsed = true;
}
