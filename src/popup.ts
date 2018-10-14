import * as $ from 'jquery';
import { extractProjectData, Build } from './xmlExtract';


$(function () {

  chrome.storage.sync.get({
    builds: [],
  }, ({ builds }) => {
    builds.forEach((build: Build, index) => {

      $.get(build.xmlUrl)
        .then(extractProjectData)
        .then(({ lastBuildStatus, activity }: Build) => {
          $(`#build_${index}`).addClass(lastBuildStatus);
          $(`#build_${index}`).addClass(activity);
        });


      $('#builds')
        .append($('<div>', { id: `build_${index}` })
          .append($('<a>', {
            href: build.webUrl,
            text: build.name,
            target: '_blank',
          }))
        );

    });
  });
});
