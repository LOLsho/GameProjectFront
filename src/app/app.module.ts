import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { l10nConfig, L10nProvider } from '../assets/configs/l10n/l10n.config';
import { HeaderComponent } from './elements/header/header.component';
import { GreetingComponent } from './greeting/greeting.component';
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
import { StoreModule } from '@ngrx/store';
import { RouterSerializerProvider } from '../assets/configs/store/store.config';
import { appReducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { appEffects } from './store/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { NotifierModule } from 'angular-notifier';
import { notifierConfig } from '../assets/configs/notifier/notifier.config';
import { EnterNicknameComponent } from './elements/enter-nickname/enter-nickname.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';



@NgModule({
  declarations: [
    HeaderComponent,
    GreetingComponent,
    AppComponent,
    EnterNicknameComponent,
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
    EffectsModule.forRoot(appEffects),
    StoreRouterConnectingModule,
    NotifierModule.withConfig(notifierConfig),

    StoreModule.forRoot(appReducers,
      // { metaReducers: [storeFreeze] }
    ),
    StoreDevtoolsModule.instrument(),
  ],
  entryComponents: [
    EnterNicknameComponent,
  ],
  providers: [
    L10nProvider,
    RouterSerializerProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
