import { initialPlayersState, playersAdapter, PlayersState } from '@store/players-store/state';
import { PlayersAction, PlayersActionType } from '@store/players-store/actions';


export const playersReducer = function (
  state: PlayersState = initialPlayersState,
  action: PlayersAction
): PlayersState {

  switch (action.type) {
    case PlayersActionType.SubscribeToPlayers:
    case PlayersActionType.UnsubscribeFromPlayers:
    case PlayersActionType.PlayersError:
      return state;

    case PlayersActionType.AddPlayer:
      return playersAdapter.addOne(action.payload, { ...state, loaded: true });

    case PlayersActionType.UpdatePlayer:
      return playersAdapter.upsertOne(action.payload, { ...state, loaded: true });

    case PlayersActionType.RemovePlayer:
      return playersAdapter.removeOne(action.payload.uid, { ...state, loaded: true });

    case PlayersActionType.ClearPlayersState:
      return playersAdapter.removeAll({ ...state, loaded: false });

  }

  return state;
};
