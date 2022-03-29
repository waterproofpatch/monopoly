import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { GameService } from './services/game.service';
import { AuthenticationService } from './services/authentication.service';
import { DialogService } from './services/dialog/dialog.service';
import { BaseComponent } from './components/base/base.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends BaseComponent {
  title = 'monopoly';

  constructor(
    public gameService: GameService,
    public authenticationService: AuthenticationService,
    private dialogService: DialogService
  ) {
    super();
    this.gameService.getVersion();
  }
  newGame(): void {
    this.dialogService
      .displayNewGameDialog()
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((name) => {
        this.gameService.newGame(name);
      });
  }
  login(): void {
    this.dialogService.displayLoginDialog();
  }

  register(): void {
    this.dialogService.displayRegisterDialog();
  }
}
