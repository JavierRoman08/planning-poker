import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() text: string = 'Button';
  @Input() onClickFn?: () => void = () => {};

  handleClick() {
    if (this.onClickFn) {
      this.onClickFn();
    }
  }
}
