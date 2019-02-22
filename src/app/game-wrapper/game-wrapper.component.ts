import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GAMES } from '../game-list/game-list';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';


@Component({
  selector: 'app-game-wrapper',
  styleUrls: ['./game-wrapper.component.scss'],
  template: `
    <button (click)="addGame()">Add Test Game</button>
    <div class="game-wrap">
      <div #gameEntry></div>
    </div>
  `
})
export class GameWrapperComponent implements OnInit, AfterContentInit {

  games: AngularFirestoreCollection<{name: string}>;
  private gameDoc: AngularFirestoreDocument<{name: string}>;

  @ViewChild('gameEntry', { read: ViewContainerRef }) gameEntry: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private db: AngularFirestore,
  ) { }

  ngAfterContentInit() {
    this.games = this.db.collection('games');

    this.route.params.subscribe(params => {
      const componentToResolve = GAMES.find(game => game.title === params.game).component;

      const factory = this.resolver.resolveComponentFactory(componentToResolve);
      const gameComponent = this.gameEntry.createComponent(factory);
      // gameComponent.instance.SOME-INPUT = 'something'
    });
  }

  addGame() {
    this.games.add({ name: 'testGame' });
  }

  updateGame() {
    // this.gameDoc = this.db.doc<{ name: string }>('games'/)
  }

  ngOnInit() {

  }
}
