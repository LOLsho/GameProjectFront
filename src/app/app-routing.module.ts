import { Routes } from '@angular/router';
import { GreetingComponent } from './greeting/greeting.component';
import { AuthGuard } from './auth/auth.guard';

export const ROUTES: Routes = [
  { path: '', component: GreetingComponent },
  { path: 'authentication', loadChildren: './auth/auth.module#AuthModule', canActivate: [AuthGuard]  },
  { path: 'games', loadChildren: './game-list/game-list.module#GameListModule', canActivate: [AuthGuard] },
  { path: 'game', loadChildren: './game-wrapper/game-wrapper.module#GameWrapperModule', canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];
