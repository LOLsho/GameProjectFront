// import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
// import {environment} from "../../../environments/environment";
// import {range} from "rxjs/internal/observable/range";
// import {filter, map, sampleTime, scan, startWith, timestamp, toArray} from "rxjs/operators";
// import {interval} from "rxjs/internal/observable/interval";
// import {flatMap} from "rxjs/internal/operators";
// import {Observable} from "rxjs/internal/Observable";
// import {fromEvent} from "rxjs/internal/observable/fromEvent";
// import {combineLatest} from "rxjs/internal/observable/combineLatest";
// import {merge} from "rxjs/internal/observable/merge";
//
// @Component({
//   selector: 'app-spaceship',
//   templateUrl: './spaceship.component.html',
//   styleUrls: ['./spaceship.component.scss']
// })
// export class SpaceshipComponent implements OnInit {
//
//   @ViewChild('spaceShipGame') spaceShipGame: ElementRef;
//   headerHeight: number = environment.headerHeight;
//
//   SPEED: number = 40;
//   STAR_NUMBER: number = 250;
//   ENEMY_FREQ: number = 1500;
//   SHOOTING_SPPED: number = 15;
//   HERO_Y: number = window.innerHeight - this.headerHeight - 15;
//
//   canvas: HTMLCanvasElement;
//   ctx;
//
//   starsStream$;
//   spaceShipStream$;
//   enemiesStream$;
//   playerFiringStream$;
//   heroShots$;
//
//
//   constructor(
//     private renderer: Renderer2
//   ) { }
//
//   ngOnInit() {
//     this.setCanvas();
//     this.createStarStream();
//     this.createEnemies();
//     this.createSpaceShipStream();
//     this.createPlayerFiring();
//     this.createHeroShots();
//
//
//     const GAME = combineLatest(this.starsStream$,
//       this.spaceShipStream$,
//       this.enemiesStream$,
//       this.heroShots$,
//       (
//       stars,
//       spaceShip,
//       enemies,
//       heroShots
//     ) => ({
//       stars, spaceShip, enemies, heroShots
//     })).pipe(sampleTime(this.SPEED));
//
//     GAME.subscribe((actors) => this.renderScene(actors));
//   }
//
//   createHeroShots() {
//     this.heroShots$ = combineLatest(this.playerFiringStream$, this.spaceShipStream$, (
//       shotEvent,
//       spaceShip
//     ) => ({
//       x: spaceShip.x
//     })).pipe(
//       scan(
//         (shotArray, shot) => {
//           shotArray.push({
//             x: shot.x,
//             y: this.HERO_Y
//           });
//
//           return shotArray;
//         }, []
//       )
//     );
//   }
//
//   createPlayerFiring() {
//     this.playerFiringStream$ = merge(
//       fromEvent(this.canvas, 'click'),
//       fromEvent(document, 'keydown').pipe(
//         filter((event) => {
//           return event.keyCode === 32;
//         })
//       ).pipe(
//         startWith({})
//       ).pipe(
//         sampleTime(200)
//       ).pipe(
//         timestamp()
//       )
//     );
//   }
//
//   getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }
//
//   paintEnemies(enemies) {
//     enemies.forEach(enemy => {
//       enemy.y += 5;
//       enemy.x += this.getRandomInt(-15, 15);
//
//       this.paintTriangle(enemy.x, enemy.y, 20, '#FEAA01', 'down');
//     });
//   }
//
//   createEnemies() {
//     this.enemiesStream$ = interval(this.ENEMY_FREQ).pipe(
//       scan(enemyArray => {
//         const enemy = {
//           x: parseInt((Math.random() * this.canvas.width).toString(), 10),
//           y: -30
//         };
//
//         enemyArray.push(enemy);
//         return enemyArray;
//       }, [])
//     );
//   }
//
//   createStarStream() {
//     this.starsStream$ = range(1, this.STAR_NUMBER).pipe(
//       map(() => ({
//         x: parseInt((Math.random() * this.canvas.width).toString(), 10),
//         y: parseInt((Math.random() * this.canvas.height).toString(), 10),
//         size: Math.random() * 3 + 1
//       }))).pipe(toArray()).pipe(
//         flatMap(starArray => {
//           return interval(this.SPEED).pipe(map(() => {
//             starArray.forEach((star) => {
//               if (star.y >= this.canvas.height) star.y = 0;
//               star.y += star.size;
//             });
//
//             return starArray;
//           }));
//         }));
//   }
//
//   createSpaceShipStream() {
//     this.spaceShipStream$ = fromEvent(document, 'mousemove').pipe(
//       map((event: MouseEvent) => ({
//         x: event.clientX,
//         y: this.HERO_Y
//       }))
//     ).pipe(startWith({
//       x: this.canvas.width / 2,
//       y: this.HERO_Y
//     }));
//   }
//
//   renderScene(actors) {
//     this.paintStars(actors.stars);
//     this.paintHeroShip(actors.spaceShip);
//     this.paintEnemies(actors.enemies);
//     this.paintHeroShots(actors.heroShots);
//   }
//
//   paintHeroShots(heroShots) {
//     heroShots.forEach(shot => {
//       shot.y -= this.SHOOTING_SPPED;
//       this.paintTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
//     });
//   }
//
//   paintHeroShip(spaceShip) {
//     this.paintTriangle(spaceShip.x, spaceShip.y, 20, '#673ab7', 'up');
//   }
//
//   paintTriangle(x, y, width , color, direction) {
//     this.ctx.fillStyle = color;
//     this.ctx.beginPath();
//     this.ctx.moveTo(x - width, y);
//     this.ctx.lineTo(x, direction === 'up' ? y - width : y + width);
//     this.ctx.lineTo(x + width, y);
//     this.ctx.lineTo(x - width, y);
//     this.ctx.fill();
//   }
//
//   paintStars(stars) {
//     this.ctx.fillStyle = '#000000';
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
//     this.ctx.fillStyle = '#ffffff';
//     stars.forEach(star => {
//       this.ctx.fillRect(star.x, star.y, star.size, star.size);
//     });
//   }
//
//   setCanvas() {
//     this.canvas = document.createElement('canvas');
//     this.ctx = this.canvas.getContext('2d');
//     this.renderer.appendChild(this.spaceShipGame.nativeElement, this.canvas);
//     this.canvas.width = window.innerWidth;
//     this.canvas.height = window.innerHeight - this.headerHeight;
//   }
// }
//
//
//
// // this.startStream$ = range(1, this.STAR_NUMBER)
// //   .pipe(rxMap(() => ({
// //     x: parseInt((Math.random() * this.canvas.width).toString(), 10),
// //     y: parseInt((Math.random() * this.canvas.height).toString(), 10),
// //     size: Math.random() * 3 + 1
// //   })));
// //
// //
// // this.startStream$.subscribe((star) => console.log(star));
