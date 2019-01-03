import { Routes } from '@angular/router';
import { GreetingComponent } from './greeting/greeting.component';
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { GameListComponent } from './game-list/game-list.component';
import { AuthGuard } from './auth/auth.guard';
import { TicTacToeComponent } from './games/tic-tac-toe/tic-tac-toe.component';
import { SapperComponent } from './games/sapper/sapper.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: GreetingComponent,
  },
  {
    path: 'authentication',
    component: AuthComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
    ],
  },
  { path: 'games', component: GameListComponent, canActivate: [AuthGuard] },
  { path: 'tic-tac-toe', component: TicTacToeComponent },
  // { path: 'spaceship', component: SpaceshipComponent },
  { path: 'sapper', component: SapperComponent },
  { path: '**', redirectTo: '' },
];
