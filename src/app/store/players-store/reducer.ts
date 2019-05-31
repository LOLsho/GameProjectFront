import { initialPlayersState, playersAdapter, PlayersState } from '@store/players-store/state';
import { PlayersAction, PlayersActionType } from '@store/players-store/actions';


export function playersReducer (
  state: PlayersState = initialPlayersState,
  action: PlayersAction
): PlayersState {

  switch (action.type) {
    case PlayersActionType.SubscribeToPlayers:
    case PlayersActionType.UnsubscribeFromPlayers:
    case PlayersActionType.PlayersError:
      return state;

    case PlayersActionType.PlayersLoaded:
      return { ...state, loaded: true };

    case PlayersActionType.AddPlayer:
      return playersAdapter.upsertOne(action.payload, state);

    case PlayersActionType.UpdatePlayer:
      return playersAdapter.upsertOne(action.payload, state);

    case PlayersActionType.RemovePlayer:
      return playersAdapter.removeOne(action.payload.uid, state);

    case PlayersActionType.ClearPlayersState:
      return playersAdapter.removeAll({ ...state, loaded: false });

    case PlayersActionType.KickOutPlayer:
      return playersAdapter.removeOne(action.payload.uid, state);
  }

  return state;
}
