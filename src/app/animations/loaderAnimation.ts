import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const loaderAnimation = trigger('loaderAnimation', [
  state(
    'default',
    style({
      animation: 'spin 0.8s linear infinite'
    })
  ),
  transition('* => *', animate('800ms ease-in'))
]);
