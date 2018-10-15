import * as $ from 'jquery';
import { forkJoin, interval, of } from 'rxjs';
import { mergeMap, switchMap, tap, map } from 'rxjs/operators';
import { Build, extractProjectData } from './xmlExtract';
import { getStorage } from './chromeStorage';

const convertToPromise = (val: Build, index: number) => {
  return $.get(val.xmlUrl)
    .then(extractProjectData)
    .then((build) => ({ ...build, xmlUrl: val.xmlUrl }));
}

$(function () {

  getStorage({ builds: [], lastUpdated: null })
    .then(({ builds, lastUpdated }) => {

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
          $(`#update_status`).text(`Last updated at ${new Date(lastUpdated).toISOString()}`);
        }
      });
    });

  getStorage({ builds: [] })
    .then(({ builds }) => {
      interval(5000)
        .pipe(
          switchMap(() => of(builds).pipe(
            mergeMap((build) => forkJoin(...build.map(convertToPromise))),
            map((builds) => ({ builds, lastUpdated: Date.now() })),
            tap((syncState) => chrome.storage.sync.set(syncState)),
          )),
        )
        .subscribe(({ builds, lastUpdated }) => {
          builds.forEach((build: Build, index) => {
            $(`#build_${index}`).addClass(build.lastBuildStatus);
            $(`#build_${index}`).addClass(build.activity);
          });
          $(`#update_status`).text(`Last updated at ${new Date(lastUpdated).toISOString()}`);
        });
    })

});
