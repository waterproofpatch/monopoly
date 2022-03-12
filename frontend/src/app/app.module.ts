import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayersComponent } from './players/players.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TransactionsComponent } from './transactions/transactions.component';
import { HttpClientModule } from '@angular/common/http';
import {
  PieceSelectDialog,
  ErrorDialog,
  LogDialog,
  NewGameDialog,
} from './services/dialog-service/dialog.service';
import { AnimatedDigitComponent } from './animated/animated-digit.component';
import { BaseComponent } from './base/base/base.component';
import { TransactionComponent } from './transaction/transaction.component';
@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    GameBoardComponent,
    PieceSelectDialog,
    ErrorDialog,
    LogDialog,
    NewGameDialog,
    AnimatedDigitComponent,
    BaseComponent,
    TransactionsComponent,
    TransactionComponent,
  ],
  imports: [
    HttpClientModule,
    MatMenuModule,
    MatDividerModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [{ provide: MatDialogRef, useValue: {} }],
  bootstrap: [AppComponent],
})
export class AppModule {}
