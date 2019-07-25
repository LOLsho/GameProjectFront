import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { chatReducer } from '@store/chat-store/reducer';
import { EffectsModule } from '@ngrx/effects';
import { ChatEffects } from '@store/chat-store/effects';


@NgModule({
  imports: [
    StoreModule.forFeature('chat', chatReducer),
    EffectsModule.forFeature([ChatEffects]),
  ],
  providers: [
    ChatEffects,
  ],
})
export class ChatStoreModule {}
