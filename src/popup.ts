import * as $ from 'jquery';

import { Build, buildPoller } from './xmlExtract';
import { getStorage } from './chromeStorage';

getStorage({ builds: [], lastUpdated: null })
  .then(({ builds, lastUpdated }) => {
    builds.forEach((build: Build, index) => {
      const buildDivAttributes = {
        id: `build_${index}`,
        class: build.lastBuildStatus,
        href: build.webUrl,
        text: build.name,
        target: '_blank',
      };
      $('#builds').append($('<a>', buildDivAttributes));
      if (lastUpdated) {
        $('#update_status').text(`Last updated at ${new Date(lastUpdated).toISOString()}`);
      }
    });
  });

buildPoller.subscribe(({ builds, lastUpdated }) => {
  builds.forEach((build: Build, index) => {
    $(`#build_${index}`).addClass(build.lastBuildStatus);
    $(`#build_${index}`).addClass(build.activity);
  });
  $(`#update_status`).text(`Last updated at ${new Date(lastUpdated).toISOString()}`);
});

