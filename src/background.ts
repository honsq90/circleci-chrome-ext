import { buildPoller } from './xmlExtract';

buildPoller
  .subscribe(({ builds }) => {
    const hasFailure = builds.some((build) => build.lastBuildStatus === 'Failure')
    const hasPending = builds.some((build) => build.activity === 'Building')

    let path = "green.png"
    if (hasFailure) {
      path = "red.png"
    } else if (hasPending) {
      path = "yellow.png"
    }

    chrome.browserAction.setIcon({ path });
  })
