import { ToastService } from '@/services/toast.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit{
  url: string = "";
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }

  constructor(private toastService: ToastService){}

  ngOnInit(): void {
    this.url = window.location.href;
  }

  shareLink(){
    navigator.clipboard.writeText(this.url).then(() => {
      this.toastService.showToast('Enlace copiado con exito', 3000)
    }).catch(err => {
      this.toastService.showToast('Ha ocurrido un error al copiar el enlace', 3000)
    });
  }

}
