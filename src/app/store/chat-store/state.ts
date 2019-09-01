import { Message } from '../../features/chat/message/message.models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';


export interface GeneralMessagesState extends EntityState<Message> {
  loaded: boolean;
}

export function sortByDate(a: Message, b: Message): number {
  return a.timestamp - b.timestamp;
}

export const generalMessagesAdapter: EntityAdapter<Message> = createEntityAdapter<Message>({
  sortComparer: sortByDate,
});

export const initialGeneralMessagesState: GeneralMessagesState = generalMessagesAdapter.getInitialState({
  loaded: false,
});


export interface ChatState {
  general: GeneralMessagesState;
}

export const initialChatState: ChatState = {
  general: initialGeneralMessagesState,
};
