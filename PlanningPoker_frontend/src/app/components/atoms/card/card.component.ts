import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() value: number = 0;
  @Input() isSelected: boolean = false;
  @Input() playerType: string = '';
  @Output() clickEvent = new EventEmitter<number>();

  onClickFn() {

    if (this.playerType == 'player') {
      this.clickEvent.emit(this.value)
    } else {
      console.log('No tienes permiso para realizar esta accion');
    }
  }
}
