import { buildPoller } from './xmlExtract';

buildPoller
  .subscribe(() => {
    console.log('build polled!')
  })
