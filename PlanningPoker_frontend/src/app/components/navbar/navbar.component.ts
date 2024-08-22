import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() gameId: string | undefined;
  @Input() gameName: string | undefined;
  @Input() playerName: string | undefined;
}
