import { NgModule } from '@angular/core';
import { RouterEffects } from './effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { RouterSerializerProvider } from '../../../assets/configs/store/store.config';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument(),
  ],
  providers: [
    RouterEffects,
    RouterSerializerProvider,
  ],
})
export class RouterStoreModule { }
