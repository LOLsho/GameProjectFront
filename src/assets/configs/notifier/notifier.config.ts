import { NotifierOptions } from 'angular-notifier';


export const notifierConfig: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right'
    },
    vertical: {
      position: 'top',
      distance: 71
    }
  },
  behaviour: {
    onMouseover: 'resetAutoHide',
    stacking: 5
  }
};
