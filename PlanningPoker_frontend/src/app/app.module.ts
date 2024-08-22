import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TableComponent } from './components/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from './components/atoms/label/label.component';
import { InputComponent } from './components/atoms/input/input.component';
import { RadioComponent } from './components/atoms/radio/radio.component';
import { FieldComponent } from './components/molecules/field/field.component';
import { PlayerFormComponent } from './components/organisms/player-form/player-form.component';
import { GameFormComponent } from './components/organisms/game-form/game-form.component';
import { ButtonComponent } from './components/atoms/button/button.component';
import { ErrorComponent } from './components/atoms/error/error.component';
import { CardComponent } from './components/atoms/card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ButtonComponent,
    TableComponent,
    LabelComponent,
    InputComponent,
    RadioComponent,
    FieldComponent,
    PlayerFormComponent,
    GameFormComponent,
    ErrorComponent,
    CardComponent
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
