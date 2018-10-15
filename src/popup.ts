import * as $ from 'jquery';
import { Build, buildPoller } from './xmlExtract';
import { getStorage } from './chromeStorage';

getStorage({ builds: [] })
  .then(({ builds }) => {
    builds.forEach((build: Build, index) => {
      const buildDivAttributes = {
        id: `build_${index}`,
        class: build.lastBuildStatus,
        href: build.webUrl,
        text: build.name,
        target: '_blank',
      };
      $('#builds').append($('<a>', buildDivAttributes));
    });
  });

buildPoller.subscribe((builds) => {
  builds.forEach((build: Build, index) => {
    $(`#build_${index}`).addClass(build.lastBuildStatus);
    $(`#build_${index}`).addClass(build.activity);
  });
});
