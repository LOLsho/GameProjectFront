import { NgModule } from '@angular/core';
import { RouterStoreModule } from '@store/router-store/router-store.module';
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


@NgModule({
  imports: [
    // RouterStoreModule,
    AuthStoreModule,
    GameInfoStoreModule,
    GameListStoreModule,
    SessionStoreModule,
    SessionListStoreModule,
    StepsStoreModule,

    StoreModule.forRoot({
      router: routerReducer
    }),
    EffectsModule.forRoot([AppEffects, RouterEffects]),

    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument(),
  ],
  providers: [
    RouterSerializerProvider,
  ],
})
export class RootStoreModule { }
