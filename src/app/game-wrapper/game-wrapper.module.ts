import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameWrapperComponent } from './game-wrapper.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../modules/shared.module';
import { CustomFieldComponent } from '../games/sapper/custom-field/custom-field.component';
import { TicTacToeComponent } from '../games/tic-tac-toe/tic-tac-toe.component';
import { SapperComponent } from '../games/sapper/sapper.component';
import { MenuComponent } from '../elements/menu/menu.component';
import { StartGameMenuComponent } from './start-game-menu/start-game-menu.component';
import { EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './store/effects/session.effects';
import { StepsEffects } from './store/effects/steps.effects';
import { SapperStartMenuComponent } from '../games/sapper/sapper-start-menu/sapper-start-menu.component';
import { GameInfoEffects } from './store/effects/game-info.effects';
import { SessionListComponent } from '../elements/session-list/session-list.component';
import { SessionListEffects } from './store/effects/session-list.effects';
import { SessionItemComponent } from '../elements/session-item/session-item.component';
import { EnterIdComponent } from './start-game-menu/enter-id/enter-id.component';
import { CreateNewMultiGameComponent } from './start-game-menu/create-new-multi-game/create-new-multi-game.component';
import { BoxComponent } from '../elements/box/box.component';
import { ChessComponent } from '../games/chess/chess.component';
import { CanvasService } from '../services/canvas.service';
import { ChessPieceComponent } from '../games/chess/chess-piece/chess-piece.component';
import { ChoosePieceComponent } from '../games/chess/choose-piece/choose-piece.component';


const ROUTES: Routes = [
  {
    path: '',
    component: GameWrapperComponent,
  },
  {
    path: ':game',
    component: GameWrapperComponent,
  },
];


const gamesComponents = [
  CustomFieldComponent,
  TicTacToeComponent,
  SapperComponent,
  ChessComponent,
  SapperStartMenuComponent,
  SessionListComponent,
  CreateNewMultiGameComponent,
  EnterIdComponent,
  ChessPieceComponent,
  ChoosePieceComponent,
];


@NgModule({
  declarations: [
    SessionItemComponent,
    GameWrapperComponent,
    MenuComponent,
    StartGameMenuComponent,
    BoxComponent,
    ...gamesComponents,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTES),
    // StoreModule.forFeature('appState', []),
    EffectsModule.forFeature([SessionEffects, SessionListEffects, StepsEffects, GameInfoEffects]),
  ],
  entryComponents: [
    ...gamesComponents,
  ],
  providers: [
    CanvasService,
  ],
})
export class GameWrapperModule { }
