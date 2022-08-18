import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const peerVoiceIndicator = trigger('peerIndicator', [
  state(
    '0',
    style({
      'box-shadow': '0 0 0 0 #4A576B, 0 0 0 0 #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '1',
    style({
      'box-shadow': '0 0 0 5px #4A576B, 0 0 0 0 #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '2',
    style({
      'box-shadow': '0 0 0 0 #4A576B, 0 0 0 10px #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '3',
    style({
      'box-shadow': '0 0 0 15px #4A576B, 0 0 0 0 #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '4',
    style({
      'box-shadow': '0 0 0 0 #4A576B, 0 0 0 18px #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '5',
    style({
      'box-shadow': '0 0 0 25px #4A576B, 0 0 0 0 #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '6',
    style({
      'box-shadow': '0 0 0 0 #4A576B, 0 0 0 30px #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '7',
    style({
      'box-shadow': '0 0 0 36px #4A576B, 0 0 0 0 #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '8',
    style({
      'box-shadow': '0 0 0 36px #4A576B, 0 0 0 36px #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '9',
    style({
      'box-shadow': '0 0 0 36px #4A576B, 0 0 0 36px #4A576B',
      transition: '0.4s'
    })
  ),
  state(
    '10',
    style({
      'box-shadow': '0 0 0 36px #4A576B, 0 0 0 36px #4A576B',
      transition: '0.4s'
    })
  ),

  transition('0=>10', animate('400ms ease-in-out')),
  transition('10=>0', animate('400ms ease-in-out'))
]);
