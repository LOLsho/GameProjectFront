import { Action } from '@ngrx/store';
import { Message } from '../../chat/message/message.models';


export enum ChatActionTypes {
  LoadGeneralMessages = '[CHAT COMPONENT] Load General Messages',
  SubscribeToGeneralMessages = '[CHAT COMPONENT] Subscribe To General Messages',

  GeneralMessagesLoaded = '[FIREBASE API] General Messages Loaded',

  AddGeneralMessage = '[FIREBASE API] Add General Message',
  UpdateGeneralMessage = '[FIREBASE API] Update General Message',
  RemoveGeneralMessage = '[FIREBASE API] Remove General Message',

  SendGeneralMessage = '[CHAT COMPONENT] Send General Message',

  ChatError = '[FIREBASE API] Chat Error',
}


export class LoadGeneralMessages implements Action {
  readonly type = ChatActionTypes.LoadGeneralMessages;
}

export class SubscribeToGeneralMessages implements Action {
  readonly type = ChatActionTypes.SubscribeToGeneralMessages;
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
  | SendGeneralMessage;
