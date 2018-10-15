import { buildPoller } from './xmlExtract';

buildPoller
  .subscribe(({ builds }) => {
    const hasFailure = builds.filter((build) => build.lastBuildStatus === 'Failure').length
    const hasPending = builds.filter((build) => build.activity === 'Building').length

    let path = "green.png";
    let color = "#00b710";
    let text: string = null;

    if (hasFailure) {
      path = "red.png";
      text = `${hasFailure}`;
      color = '#ff1f1f';
    }

    if (hasPending) {
      path = "yellow.png";
      text = `${hasPending}`;
      color = '#dcab00';
    }

    chrome.browserAction.setBadgeText({ text })
    chrome.browserAction.setBadgeBackgroundColor({ color })
    chrome.browserAction.setIcon({ path });
  })
