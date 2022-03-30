import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { GameService } from '../../services/game.service';
import { AuthenticationService } from '../../services/authentication.service';
import { DialogService } from '../../services/dialog.service';
import { BaseComponent } from '../../components/base/base.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent extends BaseComponent implements OnInit {
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
      .subscribe((name: string) => {
        this.gameService.newGame(name);
      });
  }
  login(): void {
    this.dialogService.displayLoginDialog();
  }

  register(): void {
    this.dialogService.displayRegisterDialog();
  }

  ngOnInit() {}
}
