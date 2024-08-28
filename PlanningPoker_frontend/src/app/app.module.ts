import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TableComponent } from './components/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './components/atoms/input/input.component';
import { GameFormComponent } from './components/organisms/game-form/game-form.component';
import { ButtonComponent } from './components/atoms/button/button.component';
import { ErrorComponent } from './components/atoms/error/error.component';
import { CardComponent } from './components/atoms/card/card.component';
import { AvatarComponent } from './components/atoms/avatar/avatar.component';
import { GameComponent } from './components/pages/game/game.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LabelComponent } from './components/atoms/label/label.component';
import { PlayerCardComponent } from './components/molecules/player-card/player-card.component';
import { ToastComponent } from './components/atoms/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    TableComponent,
    LabelComponent,
    InputComponent,
    GameFormComponent,
    ErrorComponent,
    CardComponent,
    AvatarComponent,
    NavbarComponent,
    GameComponent,
    HomeComponent,
    PlayerCardComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
