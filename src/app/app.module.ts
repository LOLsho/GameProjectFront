import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { l10nConfig, L10nProvider } from '../assets/configs/l10n/l10n.config';
import { HeaderComponent } from './core/header/header.component';
import { GreetingComponent } from './greeting/greeting.component';
import { GameListComponent } from './game-list/game-list.component';
import { TicTacToeComponent } from './games/tic-tac-toe/tic-tac-toe.component';
import { SapperComponent } from './games/sapper/sapper.component';
import { RadioComponent } from './elements/radio/radio.component';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { ROUTES } from './app-routing.module';
import { SharedModule } from './modules/shared.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { firebaseConfig } from '../assets/configs/firebase/firebase.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationModule } from 'angular-l10n';


@NgModule({
  declarations: [
    HeaderComponent,
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
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }),
    TranslationModule.forRoot(l10nConfig),
    SharedModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [
    L10nProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
