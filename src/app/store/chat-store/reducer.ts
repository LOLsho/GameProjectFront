import { ChatState, generalMessagesAdapter, initialChatState } from '@store/chat-store/state';
import { ChatActions, ChatActionTypes } from '@store/chat-store/actions';


export function chatReducer(state: ChatState = initialChatState, action: ChatActions): ChatState {
  switch (action.type) {
    case ChatActionTypes.LoadGeneralMessages:
    case ChatActionTypes.SubscribeToGeneralMessages:
    case ChatActionTypes.ChatError:
    case ChatActionTypes.SendGeneralMessage:
      return state;

    case ChatActionTypes.GeneralMessagesLoaded:
      // return stepsAdapter.addAll(action.payload, { ...state, loaded: true });
      return updateChatState(state, action.payload, 'general', 'addAll');
      // return { ...state, general: { ...state.general, loaded: true } };

    case ChatActionTypes.AddGeneralMessage:
      return updateChatState(state, action.payload, 'general', 'addOne');

    case ChatActionTypes.UpdateGeneralMessage:
      return updateChatState(state, action.payload, 'general', 'upsertOne');

    case ChatActionTypes.RemoveGeneralMessage:
      return updateChatState(state, action.payload.id, 'general', 'removeOne');
  }

  return state;
}


function updateChatState(state: ChatState, payload: any, property: string, adapterAction, loaded = true): ChatState {
  return {
    ...state,
    [property]: generalMessagesAdapter[adapterAction](payload, { ...state[property], loaded: loaded }),
  };
}
