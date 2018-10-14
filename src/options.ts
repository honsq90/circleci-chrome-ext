import * as $ from 'jquery';
import { extractProjectData } from './xmlExtract';

// Saves options to chrome.storage.sync.
async function save_options() {
  const rawValue = $('#circleci_urls').val() as string;

  const urls = rawValue.split("\n")
    .filter((xmlUrl) => xmlUrl.length > 0)
  // TODO: filter non urls
  // .filter((xmlUrl) => new URL(xmlUrl));

  const buildPromises = urls.map((xmlUrl) => {
    return $.get(xmlUrl)
      .then((xmlData) => ({
        ...extractProjectData(xmlData),
        xmlUrl,
      }));
  })

  const builds = await Promise.all(buildPromises)

  console.log(builds)

  chrome.storage.sync.set({
    urls,
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
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    urls: [],
  }, ({ urls }) => {
    $('#circleci_urls').val(urls.join("\n"));
  });
}

$('#save').click(save_options);
$(restore_options); // document.addEventListener('DOMContentLoaded', restore_options);

