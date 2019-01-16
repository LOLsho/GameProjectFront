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

@Component({
  selector: 'app-game-wrapper',
  styleUrls: ['./game-wrapper.component.scss'],
  template: `
    <div class="game-wrap">
      <div #gameEntry></div>
    </div>
  `
})
export class GameWrapperComponent implements OnInit, AfterContentInit {

  @ViewChild('gameEntry', { read: ViewContainerRef }) gameEntry: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
  ) { }

  ngAfterContentInit() {
    this.route.params.subscribe(params => {
      const componentToResolve = GAMES.find(game => game.title === params.game).component;

      const factory = this.resolver.resolveComponentFactory(componentToResolve);
      const gameComponent = this.gameEntry.createComponent(factory);
      // gameComponent.instance.SOME-INPUT = 'something'
    });
  }

  ngOnInit() {

  }
}
