import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GreetingComponent } from './greeting/greeting.component';
import { RouterModule } from '@angular/router';
import { GameListComponent } from './game-list/game-list.component';
import { TicTacToeComponent } from './games/tic-tac-toe/tic-tac-toe.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { HeaderComponent } from './core/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthGuard } from "./auth/auth.guard";
import {TokenInterceptorService} from "./auth/token-interceptor.service";
import { SpaceshipComponent } from './games/spaceship/spaceship.component';
import {SapperComponent} from './games/sapper/sapper.component';
import { RadioComponent } from './elements/radio/radio.component';
import {TranslationModule, L10nLoader} from 'angular-l10n';
import {l10nConfig} from '../configs/l10n/l10n.config'



@NgModule({
  declarations: [
    AppComponent,
    GreetingComponent,
    GameListComponent,
    TicTacToeComponent,
    HeaderComponent,
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    SpaceshipComponent,
    SapperComponent,
    RadioComponent,
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    TranslationModule.forRoot(l10nConfig),
    RouterModule.forRoot([
      {
        path: '',
        component: GreetingComponent
      },
      {
        path: 'authentication',
        component: AuthComponent,
        children: [
          {
            path: 'sign-in',
            component: SignInComponent
          },
          {
            path: 'sign-up',
            component: SignUpComponent
          }
        ]
      },
      { path: 'games', component: GameListComponent, canActivate: [AuthGuard] },
      { path: 'tic-tac-toe', component: TicTacToeComponent },
      { path: 'spaceship', component: SpaceshipComponent },
      { path: 'sapper', component: SapperComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private l10nLoader: L10nLoader) {
    this.l10nLoader.load();
  }
}
