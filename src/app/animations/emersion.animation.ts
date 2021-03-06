import { animate, style, transition, trigger } from '@angular/animations';

export const emersionAnimation = [
  trigger('emersionAnimation', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('0.25s', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate('0.25s', style({ opacity: 0 }))
    ]),
  ]),
];
