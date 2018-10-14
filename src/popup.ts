import * as $ from 'jquery';
import { extractProjectData, Build } from './xmlExtract';

$(function () {

  chrome.storage.sync.get({
    builds: [],
  }, ({ builds }) => {
    builds.forEach((build: Build, index) => {

      $.get(build.xmlUrl).then(extractProjectData);

      $('#builds').append($('<li>', {
        text: build.name,
        id: `build_${index}`,
      }));

    });
  });
});
