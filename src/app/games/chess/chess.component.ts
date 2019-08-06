import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ChessConfig,
  ChessFraction,
  ChessPieceData, ChessPieceName, ChessStep, getChessConfig, getInitialBlackPieces, getInitialWhitePieces,
} from './chess.config';
import { createEmptyField } from '../../../assets/functions/game-functions';
import { emersionAnimation } from '../../animations/emersion.animation';
import { UtilService } from '../../services/util.service';
import { NotifierService } from 'angular-notifier';
import { Language, TranslationService } from 'angular-l10n';
import { MatDialog } from '@angular/material';
import { ChoosePieceComponent } from './choose-piece/choose-piece.component';
import { take } from 'rxjs/operators';
import { User } from '../../auth/auth.interface';
import { Step } from '../../game-wrapper/game.interfaces';


@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss'],
  animations: [emersionAnimation],
})
export class ChessComponent implements OnInit, AfterViewInit {

  @Language() lang: string;
  @ViewChild('gameContainer') gameContainer: ElementRef;

  gameOver: boolean;

  testMode: boolean;
  whoseTurn: ChessFraction;
  activeCellId: number = null;
  availableMoves: number[] = [];

  whitePieces: ChessPieceData[];
  blackPieces: ChessPieceData[];

  eatenWhitePieces: ChessPieceData[] = [];
  eatenBlackPieces: ChessPieceData[] = [];

  testWhitePieces: ChessPieceData[] = [];
  testBlackPieces: ChessPieceData[] = [];

  cellIdsUnderWhiteAttack: number[] = [];
  cellIdsUnderBlackAttack: number[] = [];

  field: [][];

  lastStep: Step<ChessStep>;
  testLastStep: Step<ChessStep>;

  upsideDown = false;

  @Input() session;
  @Input() userData: User;
  @Input() steps: Step<ChessStep>[] = [];
  @Output() sessionFinished = new EventEmitter();
  @Input() generateStepData: Function;

  @Input()
  set step(value: Step<ChessStep>) {
    this.updateStep(value);
    this.steps.push(value);
  }

  @Output() sessionUpdated = new EventEmitter();
  @Output() stepMade = new EventEmitter();

  private readonly _config: ChessConfig = getChessConfig();

  constructor(
    private util: UtilService,
    private notifier: NotifierService,
    private translation: TranslationService,
    private modal: MatDialog,
    private crd: ChangeDetectorRef,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.setInitialConfig();
    this.initNewGame();

    if (this.steps.length) {
      this.updateGameUpToLastStep();
    }
    this.crd.detectChanges();
  }

  setInitialConfig() {
    const container = this.gameContainer.nativeElement;
    let diameter = (container.clientHeight - 40) / 8;

    if (diameter > 87) diameter = 87;

    this.config.cellHeight = diameter;
    this.config.cellWidth = diameter;
  }

  updateGameUpToLastStep() {
    this.steps.forEach(((step) => {
      this.updateStep(step);
    }));
  }

  updateStep(step) {
    this.activeCellId = step.data.from;

    if (step.data.transformation) {
      const piece = this.getPieceByCellId(this.activeCellId, this.whoseTurn);
      piece.name = step.data.transformation;
    }

    this.makeMove(step.data.to, true, null, step);
  }

  initNewGame() {
    this.createField();

    this.whoseTurn = 'white';

    this.whitePieces = getInitialWhitePieces();
    this.blackPieces = getInitialBlackPieces();

    this.updateCellsUnderAttack();
  }

  cellClicked(clickedCellId: number, piece?: ChessPieceData) {
    if (this.gameOver) return;

    if (this.lastStep) {
      if (this.lastStep.userId === this.userData.uid) return;
    } else {
      if (this.userData.uid !== this.session.creator.uid) return;
    }

    if (this.activeCellId !== null) {
      if (this.availableMoves.includes(clickedCellId)) {

        this.makeMove(clickedCellId);

      } else {

        this.removeActiveCell();

      }
    } else {
      if (piece && piece.fraction === this.whoseTurn) {

        this.activeCellId = clickedCellId;
        this.availableMoves = this.determineAvailableMoves(piece);

      }
    }
  }

  completeGame(reason: 'checkmate' | 'stalemate') {
    this.gameOver = true;
    let message;

    if (reason === 'checkmate') {
      message = this.whoseTurn === 'white' ? 'CHESS_BLACK-WON' : 'CHESS_WHITE-WON';
    } else {
      message = this.whoseTurn === 'white' ? 'CHESS_STALEMATE-TO-WHITE' : 'CHESS_STALEMATE-TO-BLACK';
    }

    this.notifier.notify('success', this.translation.translate(message));
    this.sessionFinished.emit({});
  }

  get checkmate() {
    const isCheck = this.isCheck();
    const noOneCanChangeCheck = !this.canSomePieceMakeMove();
    return isCheck && noOneCanChangeCheck;
  }

  get stalemate() {
    return !this.canSomePieceMakeMove();
  }

  canSomePieceMakeMove() {
    const myPieces = this.whoseTurn === 'white' ? this.whitePieces : this.blackPieces;
    return myPieces.some((piece: ChessPieceData) => {
      const moves = this.determineAvailableMoves(piece);
      return moves.length > 0;
    });
  }

  rightClick(event) {
    event.preventDefault();
    this.removeActiveCell();
  }

  makeMove(cellId: number, rewind = false, transformedTo?: ChessPieceName, step?: Step<ChessStep>) {
    this.checkIfMoveTakeOnAisle(cellId, this.activePiece);
    this.checkIfMoveCastling(cellId);

    if (!rewind) {
      const reached = this.checkIfPawnReachedEnd(cellId);
      if (reached) return;
    }

    if (!rewind) {
      this.writeDownStep(cellId, transformedTo);
    } else {
      this.lastStep = step;
    }

    if (this.checkCellHasEnemy(cellId, this.activePiece.fraction)) {
      this.removePiece(cellId, this.oppositeFraction(this.activePiece.fraction));
    }

    this.activePiece.hasEverMoved = true;
    this.activePiece.cellId = cellId;

    this.removeActiveCell();
    this.changeTern();
    this.updateCellsUnderAttack();

    if (this.checkmate) {
      this.completeGame('checkmate');
    } else if (this.stalemate) {
      this.completeGame('stalemate');
    }
  }

  checkIfPawnReachedEnd(cellId: number): boolean {
    if (this.activePiece.name !== 'pawn') return;
    const lastRowIndex = this.activePiece.fraction === 'white' ? 0 : 7;

    const [rowIndex, colIndex] = this.getIndexesFromId(cellId);

    if (rowIndex === lastRowIndex) {
      const dialogRef = this.modal.open(ChoosePieceComponent, {
        disableClose: true,
        data: { config: this.config, fraction: this.activePiece.fraction }
      });

      dialogRef.afterClosed()
        .pipe(take(1))
        .subscribe((name: ChessPieceName) => {
          this.activePiece.name = name;
          this.makeMove(cellId, false, name);
        });

      return true;
    }
  }

  removeActiveCell() {
    this.activeCellId = null;
    this.availableMoves = [];
  }

  checkIfMoveTakeOnAisle(moveToId: number, piece: ChessPieceData) {
    const isPawn = piece.name === 'pawn';
    if (!isPawn) return;

    const rowForward = piece.fraction === 'white' ? -1 : 1;

    const leftAttackCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: rowForward, col: -1 });
    const rightAttackCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: rowForward, col: 1 });

    if (moveToId === leftAttackCellId || moveToId === rightAttackCellId) {
      const cellHasEnemy = this.checkCellHasEnemy(moveToId, piece.fraction);
      if (!cellHasEnemy) {
        this.removePiece(this.lastStep.data.to, this.oppositeFraction(piece.fraction));
      }
    }
  }

  checkIfMoveCastling(cellId: number) {
    if (this.activePiece.name !== 'king') return;

    const [moveRowIndex, moveColIndex] = this.getIndexesFromId(cellId);
    const [kingRowIndex, kingColIndex] = this.getIndexesFromId(this.activePiece.cellId);

    const colDifference = kingColIndex - moveColIndex;
    if (Math.abs(colDifference) === 2) {
      const side = colDifference > 0 ? 'left' : 'right';
      const rookRowIndex = this.activePiece.fraction === 'white' ? 7 : 0;
      const rookColIndex = side === 'right' ? 7 : 0;
      const rookCellId = this.getIdFromIndexes(rookRowIndex, rookColIndex);
      const rook = this.getPieceByCellId(rookCellId, this.activePiece.fraction);

      rook.cellId = this.getCellIdRelativeToAnother(rookCellId, { row: 0, col: side === 'right' ? -2 : 3 });
    }
  }

  writeDownStep(cellId: number, transformedTo?: ChessPieceName) {
    this.lastStep = this.generateStepData({
      from: this.activePiece.cellId,
      to: cellId
    });

    if (this.checkCellHasEnemy(cellId, this.activePiece.fraction)) {
      this.lastStep.data.wasEaten = this.getPieceByCellId(cellId, this.oppositeFraction(this.whoseTurn));
    }
    if (transformedTo) {
      this.lastStep.data.transformation = transformedTo;
    }

    this.steps.push(this.lastStep);
    this.stepMade.emit(this.lastStep);
  }

  removePiece(cellId: number, fraction: ChessFraction) {
    let removeFrom: ChessPieceData[];
    let addToEatenArr = true;

    if (this.testMode) {
      removeFrom = fraction === 'white' ? this.testWhitePieces : this.testBlackPieces;
      addToEatenArr = false;
    } else {
      removeFrom = fraction === 'white' ? this.whitePieces : this.blackPieces;
    }

    const index = removeFrom.findIndex((piece: ChessPieceData) => piece.cellId === cellId);
    const removed = removeFrom.splice(index, 1);

    if (addToEatenArr) {
      if (fraction === 'white') {
        this.eatenWhitePieces = [...this.eatenWhitePieces, ...removed];
      } else {
        this.eatenBlackPieces = [...this.eatenBlackPieces, ...removed];
      }
    }
  }

  determineAvailableMoves(piece: ChessPieceData) {
    let availableMoves: number[];
    let moves: number[];

    switch (piece.name) {
      case 'queen':
        availableMoves = this.getAvailableQueenMoves(piece); break;
      case 'rook':
        availableMoves = this.getAvailableRookMoves(piece); break;
      case 'bishop':
        availableMoves = this.getAvailableBishopMoves(piece); break;
      case 'king':
        const castlingMoves = this.getCastlingMoves(piece);
        availableMoves = [...this.getAvailableKingMoves(piece), ...castlingMoves];
        break;
      case 'knight':
        availableMoves = this.getAvailableKnightMoves(piece); break;
      case 'pawn':
        availableMoves = this.getAvailablePawnMoves(piece); break;
    }

    moves = this.testMoves(availableMoves, piece);
    return moves;
  }

  getAvailablePawnMoves(piece: ChessPieceData): number[] {
    const moves = [];

    const oneForwardRow = piece.fraction === 'white' ? -1 : 1;
    const twoForwardRow = piece.fraction === 'white' ? -2 : 2;

    const oneForwardCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: oneForwardRow, col: 0 });
    const twoForwardRowCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: twoForwardRow, col: 0 });
    const attackLeftCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: oneForwardRow, col: -1 });
    const attackRightCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: oneForwardRow, col: 1 });

    if (oneForwardCellId !== null && !this.checkCellHasPiece(oneForwardCellId)) {
      moves.push(oneForwardCellId);

      if (!piece.hasEverMoved && twoForwardRowCellId !== null && !this.checkCellHasPiece(twoForwardRowCellId)) {
        moves.push(twoForwardRowCellId);
      }
    }
    if (
      attackLeftCellId !== null &&
      (this.checkCellHasEnemy(attackLeftCellId, piece.fraction) || this.checkCanTakeOnAisle(piece, attackLeftCellId))
    ) {
      moves.push(attackLeftCellId);
    }
    if (
      attackRightCellId !== null &&
      this.checkCellHasEnemy(attackRightCellId, piece.fraction) || this.checkCanTakeOnAisle(piece, attackRightCellId)
    ) {
      moves.push(attackRightCellId);
    }

    return moves;
  }

  checkCanTakeOnAisle(piece: ChessPieceData, inspectingCellId: number): boolean {
    if (!this.lastStep) return false;

    const lastSteppingPiece = this.getPieceByCellId(this.lastStep.data.to, this.oppositeFraction(piece.fraction));
    if (lastSteppingPiece.name !== 'pawn') return false;

    const rowIndexToStandToTake = piece.fraction === 'white' ? 3 : 4;
    const rowIndexToGoFromToTake = piece.fraction === 'white' ? 1 : 6;

    const [curRowIndex, curColIndex] = this.getIndexesFromId(piece.cellId);

    if (curRowIndex === rowIndexToStandToTake) {
      const [lastFromRowIndex, lastFromColIndex] = this.getIndexesFromId(this.lastStep.data.from);
      const [lastToRowIndex, lastToColIndex] = this.getIndexesFromId(this.lastStep.data.to);

      const [inspectingRowIndex, inspectingColIndex] = this.getIndexesFromId(inspectingCellId);

      const differenceInRowsOfLastStep = Math.abs(lastFromRowIndex - lastToRowIndex);

      return lastFromRowIndex === rowIndexToGoFromToTake &&
             differenceInRowsOfLastStep === 2 &&
             lastFromColIndex === lastToColIndex &&
             inspectingColIndex === lastToColIndex;
    } else {
      return false;
    }
  }

  getCellsUnderPawnsAttack(piece: ChessPieceData, yourFraction: ChessFraction): number[] {
    let attackLeftCellId;
    let attackRightCellId;
    const moves = [];

    attackLeftCellId = this.getCellIdRelativeToAnother(
      piece.cellId, yourFraction === 'white' ? { row: -1, col: -1 } : { row: 1, col: -1 },
    );
    attackRightCellId = this.getCellIdRelativeToAnother(
      piece.cellId, yourFraction === 'white' ? { row: -1, col: 1 } : { row: 1, col: 1 },
    );

    if (attackLeftCellId !== null) {
      moves.push(attackLeftCellId);
    }
    if (attackRightCellId !== null) {
      moves.push(attackRightCellId);
    }

    return moves;
  }

  getAvailableQueenMoves(piece: ChessPieceData, yourFraction: ChessFraction = this.whoseTurn, countYours = false) {
    return [
      ...this.getAvailableBishopMoves(piece, yourFraction, countYours),
      ...this.getAvailableRookMoves(piece, yourFraction, countYours),
    ];
  }

  getAvailableRookMoves(piece: ChessPieceData, yourFraction: ChessFraction = this.whoseTurn, countYours = false) {
    const upCellIds = this.getAvailableCellsByTrend(piece.cellId, yourFraction, { row: 1, col: 0 }, countYours);
    const downCellIds = this.getAvailableCellsByTrend(piece.cellId, yourFraction, { row: -1, col: 0 }, countYours);
    const leftCellIds = this.getAvailableCellsByTrend(piece.cellId, yourFraction, { row: 0, col: -1 }, countYours);
    const rightCellIds = this.getAvailableCellsByTrend(piece.cellId, yourFraction, { row: 0, col: 1 }, countYours);

    return [...upCellIds, ...downCellIds, ...leftCellIds, ...rightCellIds];
  }

  getAvailableBishopMoves(piece: ChessPieceData, yourFraction: ChessFraction = this.whoseTurn, countYours = false) {
    const upLeftCellIds = this.getAvailableCellsByTrend(piece.cellId, yourFraction, { row: -1, col: -1 }, countYours);
    const upRightIds = this.getAvailableCellsByTrend(piece.cellId, yourFraction, { row: -1, col: 1 }, countYours);
    const downLeftCellIds = this.getAvailableCellsByTrend(piece.cellId, yourFraction, { row: 1, col: -1 }, countYours);
    const downRightCellIds = this.getAvailableCellsByTrend(piece.cellId, yourFraction, { row: 1, col: 1 }, countYours);

    return [...upLeftCellIds, ...upRightIds, ...downLeftCellIds, ...downRightCellIds];
  }

  getAvailableCellsByTrend(
    startId: number,
    yourFraction: ChessFraction,
    trend: { row: number; col: number },
    countYours: boolean,
    accArr?: number[]
  ) {
    accArr = accArr || [];

    const inspectedCellId = this.getCellIdRelativeToAnother(startId, trend);

    if (inspectedCellId !== null) {
      if (this.checkCellHasYourOwnPiece(inspectedCellId, yourFraction)) {
        if (countYours) accArr.push(inspectedCellId);
      } else if (this.checkCellHasEnemy(inspectedCellId, yourFraction, 'king')) {
        accArr.push(inspectedCellId);
      } else {
        accArr.push(inspectedCellId);
        this.getAvailableCellsByTrend(inspectedCellId, yourFraction, trend, countYours, accArr);
      }
    }

    return accArr;
  }

  getCastlingMoves(piece: ChessPieceData): number[] {
    const moves = [];

    if (!piece.hasEverMoved && !this.isCheck()) {
      const leftPiece = this.getPieceByCellId(piece.fraction === 'white' ? 56 : 0, piece.fraction);
      const rightPiece = this.getPieceByCellId(piece.fraction === 'white' ? 63 : 7, piece.fraction);

      const oneLeftCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: 0, col: - 1 });
      const twoLeftCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: 0, col: - 2 });

      const oneRightCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: 0, col: 1 });
      const twoRightCellId = this.getCellIdRelativeToAnother(piece.cellId, { row: 0, col: 2 });

      const cellsUnderAttack = piece.fraction === 'white' ? this.cellIdsUnderBlackAttack : this.cellIdsUnderWhiteAttack;

      if (leftPiece && leftPiece.name === 'rook' && !leftPiece.hasEverMoved) {
        const rookAvailableMoves = this.getAvailableRookMoves(leftPiece, leftPiece.fraction, true);
        if (rookAvailableMoves.includes(piece.cellId)) {
          if (!cellsUnderAttack.includes(oneLeftCellId) && !cellsUnderAttack.includes(twoLeftCellId)) {
            moves.push(twoLeftCellId);
          }
        }
      }
      if (rightPiece && rightPiece.name === 'rook' && !rightPiece.hasEverMoved) {
        const rookAvailableMoves = this.getAvailableRookMoves(rightPiece, rightPiece.fraction, true);
        if (rookAvailableMoves.includes(piece.cellId)) {
          if (!cellsUnderAttack.includes(oneRightCellId) && !cellsUnderAttack.includes(twoRightCellId)) {
            moves.push(twoRightCellId);
          }
        }
      }
    }

    return moves;
  }

  getAvailableKingMoves(piece: ChessPieceData, yourFraction: ChessFraction = this.whoseTurn, countYours = false): number[] {
    const cellsCoordinatesToSearch = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    const cellsUnderEnemyAttack = yourFraction === 'white' ? this.cellIdsUnderBlackAttack : this.cellIdsUnderWhiteAttack;

    return cellsCoordinatesToSearch
      .map(([row, col]) => this.getCellIdRelativeToAnother(piece.cellId, { row, col }))
      .filter((moveId: number | null) => {
        if (moveId !== null) {
          if (countYours) {
            return true;
          } else {
            return !this.checkCellHasYourOwnPiece(moveId, yourFraction) && !cellsUnderEnemyAttack.includes(moveId);
          }
        }
      });
  }

  getAvailableKnightMoves(piece: ChessPieceData, countYours = false) {
    const cellsCoordinatesToSearch = [[-2, -1], [-2, 1], [-1, -2], [1, -2], [-1, 2], [1, 2], [2, -1], [2, 1]];

    return cellsCoordinatesToSearch
      .map(([row, col]) => this.getCellIdRelativeToAnother(piece.cellId, { row, col }))
      .filter((moveId: number | null) => {
        if (moveId !== null) {
          if (countYours) {
            return true;
          } else {
            return !this.checkCellHasYourOwnPiece(moveId, piece.fraction);
          }
        }
      });
  }

  getCellIdRelativeToAnother(relativeCellId: number, where: { row: number, col: number }) {
    const [curRowIndex, curColIndex] = this.getIndexesFromId(relativeCellId);

    const searchedRowIndex = curRowIndex + where.row;
    const searchedColIndex = curColIndex + where.col;

    if (searchedRowIndex < 0 || searchedRowIndex > this.config.rows - 1) {
      return null;
    }
    if (searchedColIndex < 0 || searchedColIndex > this.config.columns - 1) {
      return null;
    }

    return this.getIdFromIndexes(searchedRowIndex, searchedColIndex);
  }

  updateCellsUnderAttack() {
    this.cellIdsUnderWhiteAttack = [];
    this.cellIdsUnderBlackAttack = [];

    this.fillUnderAttack('white');
    this.fillUnderAttack('black');
  }

  fillUnderAttack(fraction: ChessFraction, piecesArr?: ChessPieceData[], collectingArray?: number[]) {
    let moves: number[] = [];

    if (!piecesArr) {
      piecesArr = fraction === 'white' ? this.whitePieces : this.blackPieces;
    }

    if (!collectingArray) {
      collectingArray = fraction === 'white' ? this.cellIdsUnderWhiteAttack : this.cellIdsUnderBlackAttack;
    }

    piecesArr.forEach((piece) => {
      switch (piece.name) {
        case 'pawn':
          moves = this.getCellsUnderPawnsAttack(piece, fraction); break;
        case 'knight':
          moves = this.getAvailableKnightMoves(piece, true); break;
        case 'king':
          moves = this.getAvailableKingMoves(piece, fraction, true); break;
        case 'bishop':
          moves = this.getAvailableBishopMoves(piece, fraction, true); break;
        case 'rook':
          moves = this.getAvailableRookMoves(piece, fraction, true); break;
        case 'queen':
          moves = this.getAvailableQueenMoves(piece, fraction, true); break;
      }

      this.addUniquesElemsToArr(collectingArray, moves);
    });
  }

  testMoves(moves: number[], piece: ChessPieceData): number[] {
    this.testMode = true;

    // variables for testing
    let activePieceTest: ChessPieceData;
    let cellsUnderAttack: number[];
    let king: ChessPieceData;
    let kingUnderAttack: boolean;
    const myFraction = this.whoseTurn;
    const enemyFraction = this.oppositeFraction(myFraction);

    // pieces for testing
    this.testWhitePieces = this.util.cloneObj(this.whitePieces);
    this.testBlackPieces = this.util.cloneObj(this.blackPieces);
    const myPieces = myFraction === 'white' ? this.testWhitePieces : this.testBlackPieces;
    const enemyPieces = enemyFraction === 'white' ? this.testWhitePieces : this.testBlackPieces;

    // filter moves relying on test
    const testedMoves = moves.filter((moveId: number) => {
      activePieceTest = myPieces.find((p: ChessPieceData) => {
        return p.cellId === piece.cellId;
      });

      this.checkIfMoveTakeOnAisle(moveId, piece);

      this.testLastStep = this.generateStepData({ from: activePieceTest.cellId, to: moveId });
      if (this.checkCellHasEnemy(moveId, myFraction)) {
        this.testLastStep.data.wasEaten = this.getPieceByCellId(moveId, enemyFraction);
        this.removePiece(moveId, enemyFraction);
      }

      activePieceTest.cellId = moveId;

      cellsUnderAttack = [];
      this.fillUnderAttack(enemyFraction, enemyPieces, cellsUnderAttack);

      king = this.getKing(myPieces);

      kingUnderAttack = cellsUnderAttack.includes(king.cellId);

      // test for this move is done, return pieces to previous positions
      this.cancelLastMove(activePieceTest);

      return !kingUnderAttack;
    });

    this.testMode = false;
    this.testWhitePieces = [];
    this.testBlackPieces = [];

    return testedMoves;
  }

  cancelLastMove(activePiece: ChessPieceData) {
    if (this.testMode) {
      if (this.testLastStep.data.wasEaten) {
        const enemyFraction = this.oppositeFraction(this.whoseTurn);
        const enemyPieces = enemyFraction === 'white' ? this.testWhitePieces : this.testBlackPieces;
        enemyPieces.push(this.testLastStep.data.wasEaten);
      }

      activePiece.cellId = this.testLastStep.data.from;
    }
  }

  addUniquesElemsToArr(arr: any[], elemsToAdd: any[]) {
    elemsToAdd.forEach((elem: number) => {
      if (!arr.includes(elem)) arr.push(elem);
    });
  }

  createField() {
    this.field = createEmptyField(this.config.rows, this.config.columns);
  }

  checkCellHasEnemy(cellId: number, yourFraction: ChessFraction, exception?: ChessPieceName): boolean {
    let enemyArr;
    if (this.testMode) {
      enemyArr = yourFraction === 'white' ? this.testBlackPieces : this.testWhitePieces;
    } else {
      enemyArr = yourFraction === 'white' ? this.blackPieces : this.whitePieces;
    }
    return enemyArr.some((piece: ChessPieceData) => piece.name !== exception && piece.cellId === cellId);
  }

  checkCellHasPiece(cellId: number): boolean {
    return [...this.whitePieces, ...this.blackPieces]
    .some((piece: ChessPieceData) => piece.cellId === cellId);
  }

  checkCellHasYourOwnPiece(cellId: number, yourFraction: ChessFraction): boolean {
    let searchArr;
    if (this.testMode) {
      searchArr = yourFraction === 'white' ? this.testWhitePieces : this.testBlackPieces;
    } else {
      searchArr = yourFraction === 'white' ? this.whitePieces : this.blackPieces;
    }
    return searchArr.some((piece: ChessPieceData) => piece.cellId === cellId);
  }

  getCellBackground(rowIndex: number, colIndex: number): string {
    const cellId = this.getIdFromIndexes(rowIndex, colIndex);

    const sellIsActive = this.isCellActive(rowIndex, colIndex);
    const cellOfLastStep = this.lastStep && (this.lastStep.data.from === cellId || this.lastStep.data.to === cellId);

    if (sellIsActive || cellOfLastStep) {
      return (rowIndex + colIndex) % 2 === 0 ? this.config.evenActiveColor : this.config.oddActiveColor;
    } else {
      return (rowIndex + colIndex) % 2 === 0 ? this.config.evenColor : this.config.oddColor;
    }
  }

  getIndexesFromId(id: number) {
    const rowIndex = Math.floor(id / this.config.columns);
    const columnIndex = id - (rowIndex * this.config.columns);
    return [rowIndex, columnIndex];
  }

  getIdFromIndexes(rowIndex, columnIndex): number {
    return rowIndex * this.config.columns + columnIndex;
  }

  getPieceByCellId(cellId: number, fraction: ChessFraction): ChessPieceData {
    const piecesArr = fraction === 'white' ? this.whitePieces : this.blackPieces;
    return piecesArr.find((piece: ChessPieceData) => piece.cellId === cellId);
  }

  isCellActive(rowIndex: number, colIndex: number): boolean {
    if (this.activeCellId === null) return false;

    const [activeRowIndex, activeColIndex] = this.getIndexesFromId(this.activeCellId);

    return rowIndex === activeRowIndex && colIndex === activeColIndex;
  }

  changeTern() {
    this.whoseTurn = this.whoseTurn === 'white' ? 'black' : 'white';
  }

  isCheck(): boolean {
    const underAttack = this.whoseTurn === 'white' ? this.cellIdsUnderBlackAttack : this.cellIdsUnderWhiteAttack;
    const myPieces = this.whoseTurn === 'white' ? this.whitePieces : this.blackPieces;
    const king = this.getKing(myPieces);
    return underAttack.includes(king.cellId);
  }

  oppositeFraction(fraction: ChessFraction): ChessFraction {
    return fraction === 'white' ? 'black' : 'white';
  }

  getKing(searchInArr: ChessPieceData[]): ChessPieceData {
    return searchInArr.find((piece: ChessPieceData) => piece.name === 'king');
  }

  flipOverField() {
    this.upsideDown = !this.upsideDown;
  }

  get activePiece(): ChessPieceData {
    const searchInArr = this.whoseTurn === 'white' ? this.whitePieces : this.blackPieces;
    return searchInArr.find((piece: ChessPieceData) => piece.cellId === this.activeCellId);
  }

  get config(): ChessConfig {
    return this._config;
  }
}
