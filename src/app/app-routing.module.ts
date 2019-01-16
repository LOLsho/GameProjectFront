import { Routes } from '@angular/router';
import { GreetingComponent } from './greeting/greeting.component';
import { GameListComponent } from './game-list/game-list.component';
import { AuthGuard } from './auth/auth.guard';
import { TicTacToeComponent } from './games/tic-tac-toe/tic-tac-toe.component';
import { SapperComponent } from './games/sapper/sapper.component';

export const ROUTES: Routes = [
  { path: '', component: GreetingComponent },
  { path: 'authentication', loadChildren: './auth/auth.module#AuthModule',  },
  { path: 'games', component: GameListComponent, canActivate: [AuthGuard] },
  { path: 'tic-tac-toe', component: TicTacToeComponent },
  // { path: 'spaceship', component: SpaceshipComponent },
  { path: 'sapper', component: SapperComponent },
  { path: '**', redirectTo: '' },
];
