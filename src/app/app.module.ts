import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TokenInterceptorProvider } from './services/token-interceptor.service';
import { TranslationModule } from 'angular-l10n';
import { l10nConfig, L10nProvider } from '../assets/configs/l10n/l10n.config';
import { HeaderComponent } from './core/header/header.component';
import { AuthComponent } from './auth/auth.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { GreetingComponent } from './greeting/greeting.component';
import { GameListComponent } from './game-list/game-list.component';
import { TicTacToeComponent } from './games/tic-tac-toe/tic-tac-toe.component';
import { SapperComponent } from './games/sapper/sapper.component';
import { RadioComponent } from './elements/radio/radio.component';
import { MaterialModule } from './modules/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app-routing.module';
import { SharedModule } from './modules/shared.module';


@NgModule({
  declarations: [
    HeaderComponent,
    AuthComponent,
    SignUpComponent,
    SignInComponent,
    GreetingComponent,
    GameListComponent,
    TicTacToeComponent,
    SapperComponent,
    RadioComponent,
    AppComponent,
    // SpaceshipComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(ROUTES),
    TranslationModule.forRoot(l10nConfig),
    SharedModule,
  ],
  providers: [
    TokenInterceptorProvider,
    L10nProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
