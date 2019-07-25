import { animate, style, transition, trigger } from '@angular/animations';


export const accordionAnimation = [
  trigger('accordionAnimation', [
    transition(':enter', [
      style({ height: '0' }),
      animate('0.25s', style({ height: '*' })),
    ]),
    transition(':leave', [
      style({ height: '*' }),
      animate('0.25s', style({ height: '0' })),
    ]),
  ]),
];
