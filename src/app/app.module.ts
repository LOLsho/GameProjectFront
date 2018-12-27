import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {GreetingComponent} from './greeting/greeting.component';
import {RouterModule} from '@angular/router';
import {GameListComponent} from './game-list/game-list.component';
import {TicTacToeComponent} from './games/tic-tac-toe/tic-tac-toe.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material';
import {HeaderComponent} from './core/header/header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthComponent} from './auth/auth.component';
import {SignInComponent} from './auth/sign-in/sign-in.component';
import {SignUpComponent} from './auth/sign-up/sign-up.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './auth/auth.guard';
import {TokenInterceptorService} from './auth/token-interceptor.service';
// import { SpaceshipComponent } from './games/spaceship/spaceship.component';
import {SapperComponent} from './games/sapper/sapper.component';
import {RadioComponent} from './elements/radio/radio.component';
import {TranslationModule, L10nLoader} from 'angular-l10n';
import {initL10n, l10nConfig} from '../assets/configs/l10n/l10n.config';
import {ROUTES} from './app-routing.module';


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
    // SpaceshipComponent,
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
    RouterModule.forRoot(ROUTES),
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }, // TODO Separation to modules, lazy loading, and e.c.
    {
      provide: APP_INITIALIZER,
      useFactory: initL10n,
      deps: [L10nLoader],
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
