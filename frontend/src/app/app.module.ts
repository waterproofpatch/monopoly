import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayersComponent } from './components/players/players.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  PieceSelectDialog,
  ErrorDialog,
  LogDialog,
  NewGameDialog,
  LoginDialog,
} from './services/dialog/dialog.service';
import { LoginService } from './services/login.service';
import { AnimatedDigitComponent } from './components/animated/animated-digit.component';
import { BaseComponent } from './components/base/base.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    GameBoardComponent,
    PieceSelectDialog,
    ErrorDialog,
    LogDialog,
    NewGameDialog,
    LoginDialog,
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
  providers: [
    LoginService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
