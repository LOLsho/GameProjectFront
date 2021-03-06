import { NgModule } from '@angular/core';
import { AuthStoreModule } from '@store/auth-store/auth-store.module';
import { GameInfoStoreModule } from '@store/game-info-store/game-info-store.module';
import { GameListStoreModule } from '@store/game-list-store/game-list-store.module';
import { SessionStoreModule } from '@store/session-store/session-store.module';
import { SessionListStoreModule } from '@store/session-list-store/session-list-store.module';
import { StepsStoreModule } from '@store/steps-store/steps-store.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from '@store/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterSerializerProvider } from '../../assets/configs/store/store.config';
import { RouterEffects } from '@store/router-store/effects';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { PlayersStoreModule } from '@store/players-store/players-store.module';
import { ChatStoreModule } from '@store/chat-store/chat-store.module';
import { UsersStoreModule } from '@store/users-store/users-store.module';


@NgModule({
  imports: [
    AuthStoreModule,
    GameInfoStoreModule,
    GameListStoreModule,
    SessionStoreModule,
    SessionListStoreModule,
    StepsStoreModule,
    PlayersStoreModule,
    ChatStoreModule,
    UsersStoreModule,

    StoreModule.forRoot({
      routerReducer: routerReducer,
    }),
    EffectsModule.forRoot([AppEffects, RouterEffects]),

    StoreRouterConnectingModule.forRoot(),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
  ],
  providers: [
    RouterSerializerProvider,
  ],
})
export class RootStoreModule { }
