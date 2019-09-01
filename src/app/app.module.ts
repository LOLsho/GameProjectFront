import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { l10nConfig, L10nProvider } from '../assets/configs/l10n/l10n.config';
import { HeaderComponent } from './features/header/header.component';
import { GreetingComponent } from './features/greeting/greeting.component';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { ROUTES } from './app-routing.module';
import { SharedModule } from './modules/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationModule } from 'angular-l10n';
import { NotifierModule } from 'angular-notifier';
import { notifierConfig } from '../assets/configs/notifier/notifier.config';
import { RootStoreModule } from '@store/root-store.module';
import { FirebaseModule } from './modules/firebase.module';
import { ModalInfoComponent } from './elements/modal-info/modal-info.component';
import { ChatComponent } from './features/chat/chat.component';
import { MessageListComponent } from './features/chat/message-list/message-list.component';
import { MessageComponent } from './features/chat/message/message.component';
import { InputAreaComponent } from './features/chat/input-area/input-area.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';


@NgModule({
  declarations: [
    HeaderComponent,
    GreetingComponent,
    AppComponent,
    ModalInfoComponent,
    ChatComponent,
    MessageListComponent,
    MessageComponent,
    InputAreaComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }),

    // ----- Shared -----
    SharedModule,

    // ----- Firebase -----
    FirebaseModule,

    // ----- NgRx Store -----
    RootStoreModule,

    // ----- Third-party -----
    TranslationModule.forRoot(l10nConfig),
    NotifierModule.withConfig(notifierConfig),
  ],
  entryComponents: [
    ModalInfoComponent,
    UserProfileComponent,
  ],
  providers: [
    L10nProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
