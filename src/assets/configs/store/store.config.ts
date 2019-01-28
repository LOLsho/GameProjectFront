import { MetaReducer } from '@ngrx/store';
import { isDevMode } from '@angular/core';
import { storeFreeze } from 'ngrx-store-freeze';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer } from '@ngrx/router-store';
import { CustomSerializer } from '../../../app/store/router.serializer';


export const storeMetaReducers: MetaReducer<any>[] = isDevMode() ? [storeFreeze] : [];
export const storeDevtoolsModule = isDevMode() ? StoreDevtoolsModule.instrument() : [];

export const RouterSerializerProvider = {
  provide: RouterStateSerializer,
  useClass: CustomSerializer,
};
