import * as $ from 'jquery';
import { forkJoin, interval, of } from 'rxjs';
import { mergeMap, switchMap, tap, map } from 'rxjs/operators';
import { Build, extractProjectData } from './xmlExtract';

const convertToPromise = (val: Build, index: number) => {
  return $.get(val.xmlUrl)
    .then(extractProjectData)
    .then((build) => ({ ...build, xmlUrl: val.xmlUrl }));
}

$(function () {

  chrome.storage.sync.get({
    builds: [],
    lastUpdated: null,
  }, ({ builds, lastUpdated }) => {
    interval(5000)
      .pipe(
        switchMap(() => of(builds).pipe(
          mergeMap((build) => forkJoin(...build.map(convertToPromise))),
          map((builds) => ({ builds, lastUpdated: new Date() })),
          tap((syncState) => chrome.storage.sync.set(syncState)),
        )),
      )
      .subscribe(({ builds, lastUpdated }) => {
        builds.forEach((build: Build, index) => {
          $(`#build_${index}`).addClass(build.lastBuildStatus);
          $(`#build_${index}`).addClass(build.activity);
        });
        $(`#update_status`).text(`Last updated at ${lastUpdated.toISOString()}`);
      });

    builds.forEach((build: Build, index) => {
      const buildDivAttributes = {
        id: `build_${index}`,
        class: build.lastBuildStatus,
      };

      $('#builds')
        .append($('<div>', buildDivAttributes)
          .append($('<a>', {
            href: build.webUrl,
            text: build.name,
            target: '_blank',
          }))
        );

      if (lastUpdated) {
        $(`#update_status`).text(`Last updated at ${lastUpdated.toISOString()}`);
      }

    });
  });
});
