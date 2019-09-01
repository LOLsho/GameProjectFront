import { ChatState, generalMessagesAdapter, GeneralMessagesState } from '@store/chat-store/state';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Message } from '../../features/chat/message/message.models';


export const getGeneralMessagesState = (state: ChatState): GeneralMessagesState => state.general;
export const getGeneralMessagesLoaded = (state: GeneralMessagesState): boolean => state.loaded;


export const selectChatState: MemoizedSelector<object, ChatState>
  = createFeatureSelector<ChatState>('chat');

export const selectGeneralMessagesState: MemoizedSelector<object, GeneralMessagesState>
  = createSelector(selectChatState, getGeneralMessagesState);

export const selectGeneralMessagesIds = generalMessagesAdapter.getSelectors(selectGeneralMessagesState).selectIds;
export const selectGeneralMessagesEntities = generalMessagesAdapter.getSelectors(selectGeneralMessagesState).selectEntities;
export const selectAllGeneralMessages = generalMessagesAdapter.getSelectors(selectGeneralMessagesState).selectAll;
export const selectGeneralMessagesLength = generalMessagesAdapter.getSelectors(selectGeneralMessagesState).selectTotal;

export const selectGeneralMessagesLoaded: MemoizedSelector<object, boolean>
  = createSelector(selectGeneralMessagesState, getGeneralMessagesLoaded);

export const selectLastGeneralMessage: MemoizedSelector<object, Message>
  = createSelector(selectAllGeneralMessages, (messages: Message[]): Message => messages[messages.length - 1]);
