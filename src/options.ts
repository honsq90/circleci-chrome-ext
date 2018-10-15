import * as $ from 'jquery';
import { getBuildPromise } from './xmlExtract';
import { getStorage } from './chromeStorage';

async function saveOptions() {
  const rawValue = $('#circleci_urls').val() as string;

  const urls = rawValue.split("\n")
    .filter((xmlUrl) => xmlUrl.length > 0)

  const builds = await Promise.all(urls.map(getBuildPromise))

  chrome.storage.sync.set({
    builds,
  }, () => {
    // Update status to let user know options were saved.
    const status = $('#status');
    status.text('URLs saved.');
    setTimeout(function () {
      status.text('');
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  getStorage({ builds: [] })
    .then(({ builds }) => {
      const urls = builds.map((build) => build.xmlUrl).join("\n")
      $('#circleci_urls').val(urls);
    })
}

$('#save').click(saveOptions);
$(restoreOptions);
