import { ToastService } from '@/services/toast.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() value: number | undefined;
  @Input() isSelected: boolean = false;
  @Input() playerType: string = '';
  @Output() clickEvent = new EventEmitter<number>();

  constructor(private toastService: ToastService){}

  onClickFn() {
    if (this.playerType == 'player') {
      this.clickEvent.emit(this.value)
    } else {
      this.toastService.showToast('No tienes permiso para realizar esta accion', 3000)
    }
  }
}
