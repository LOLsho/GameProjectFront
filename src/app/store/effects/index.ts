import { RouterEffects } from './router.effects';
import { AuthEffects } from './auth.effects';
import { GamesListEffects } from './games-list.effects';


export const appEffects = [RouterEffects, AuthEffects, GamesListEffects];
