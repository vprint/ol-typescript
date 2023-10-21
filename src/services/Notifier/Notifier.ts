import Notify from 'simple-notify';
import 'simple-notify/dist/simple-notify.min.css';
import { notifyStatus } from 'simple-notify/dist/types';

function createNotify(mode: notifyStatus, text: string, title: string, timout: number): void {
  new Notify({
    status: mode,
    title: title,
    text: text,
    effect: 'fade',
    speed: 300,
    customClass: '',
    customIcon: '',
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: timout,
    gap: 20,
    distance: 20,
    type: 1,
    position: 'right top',
  });
}
function push({ mode, title, text }: { mode: notifyStatus, title: string, text: string }): void {
  switch (mode) {
    case 'success':
      createNotify(mode, text, title, 3000);
      break;
    case 'warning':
      createNotify(mode, text, title, 3000);
      break;
    case 'error':
      createNotify(mode, text, title, 10000);
      break;
  }
}

const Notifier = {
  push
};

export default Notifier;
