import { Action } from '@ngrx/store';
import { Message } from '../../chat/message/message.models';


export enum ChatActionTypes {
  LoadGeneralMessages = '[CHAT COMPONENT] Load General Messages',
  SubscribeToGeneralMessages = '[CHAT COMPONENT] Subscribe To General Messages',
  UnsubscribeFromGeneralMessages = '[LOG OUT] Unsubscribe From General Messages',

  GeneralMessagesLoaded = '[FIREBASE API] General Messages Loaded',

  AddGeneralMessage = '[FIREBASE API] Add General Message',
  UpdateGeneralMessage = '[FIREBASE API] Update General Message',
  RemoveGeneralMessage = '[FIREBASE API] Remove General Message',

  SendGeneralMessage = '[CHAT COMPONENT] Send General Message',

  ClearGeneralMessagesState = '[LOG OUT] Clear General Messages State',
  ChatError = '[FIREBASE API] Chat Error',
}


export class LoadGeneralMessages implements Action {
  readonly type = ChatActionTypes.LoadGeneralMessages;
}

export class SubscribeToGeneralMessages implements Action {
  readonly type = ChatActionTypes.SubscribeToGeneralMessages;
}

export class UnsubscribeFromGeneralMessages implements Action {
  readonly type = ChatActionTypes.UnsubscribeFromGeneralMessages;
}

export class GeneralMessagesLoaded implements Action {
  readonly type = ChatActionTypes.GeneralMessagesLoaded;
  constructor(public payload: Message[]) {}
}

export class AddGeneralMessage implements Action {
  readonly type = ChatActionTypes.AddGeneralMessage;
  constructor(public payload: Message) {}
}

export class UpdateGeneralMessage implements Action {
  readonly type = ChatActionTypes.UpdateGeneralMessage;
  constructor(public payload: Message) {}
}

export class RemoveGeneralMessage implements Action {
  readonly type = ChatActionTypes.RemoveGeneralMessage;
  constructor(public payload: Message) {}
}

export class SendGeneralMessage implements Action {
  readonly type = ChatActionTypes.SendGeneralMessage;
  constructor(public payload: Message) {}
}

export class ClearGeneralMessagesState implements Action {
  readonly type = ChatActionTypes.ClearGeneralMessagesState;
}

export class ChatError implements Action {
  readonly type = ChatActionTypes.ChatError;
  constructor(public payload: any) {}
}



export type ChatActions =
  | LoadGeneralMessages
  | SubscribeToGeneralMessages
  | GeneralMessagesLoaded
  | AddGeneralMessage
  | UpdateGeneralMessage
  | RemoveGeneralMessage
  | ChatError
  | SendGeneralMessage
  | UnsubscribeFromGeneralMessages
  | ClearGeneralMessagesState;
