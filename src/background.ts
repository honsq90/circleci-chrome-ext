import { getStorage } from './chromeStorage';

function polling() {
  getStorage({ builds: [] })
    .then(({ builds }) => {
      console.log('polling', builds);
      setTimeout(polling, 5000);
    });
}

polling();

