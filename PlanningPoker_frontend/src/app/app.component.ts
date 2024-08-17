import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PlanningPoker';
  gameName: string = '';

  constructor (private sockeService: SocketService){}

  ngOnInit(): void {
    console.log('El nombre de la sala es: ', this.gameName)
  }

  startConnection() {
    this.sockeService.startConnection();
  }

  createRoom(form?: NgForm){
    this.startConnection()
    this.sockeService.createRoom(form?.value)
    console.log('Room Created')
    
  }
}
