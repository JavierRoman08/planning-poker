import { ToastService } from '@/services/toast.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit{
  message: string = '';
  isVisible: boolean = false;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toastState.subscribe(toast => {
      this.message = toast.message;
      this.showToast(toast.duration);
    });
  }

  showToast(duration: number) {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, duration);
  }
}
