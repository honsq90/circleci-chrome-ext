import { get } from 'jquery';
import { forkJoin, interval, of, from, Observable } from 'rxjs';
import { mergeMap, switchMap, tap, map, share, startWith } from 'rxjs/operators';
import { getStorage } from './chromeStorage';

export interface Build {
  name: string;
  lastBuildStatus: string;
  webUrl: string;
  activity: string;
  xmlUrl?: string;
}

export interface SyncState {
  builds: Build[];
  lastUpdated: number;
}

export function getBuildPromise(xmlUrl: string) {
  return get(xmlUrl)
    .then(extractProjectData)
    .then((build) => ({ ...build, xmlUrl: xmlUrl }));
}

export function extractProjectData(xmlData: XMLDocument): Build {
  const projectXmlData = xmlData.getElementsByTagName("Project");
  if (projectXmlData.length) {
    const project = projectXmlData[0];
    const name = project.getAttribute('name');
    const lastBuildStatus = project.getAttribute('lastBuildStatus');
    const webUrl = project.getAttribute('webUrl');
    const activity = project.getAttribute('activity');
    return { name, lastBuildStatus, webUrl, activity };
  }
}

export const buildPoller: Observable<SyncState> =
  from(getStorage({ builds: [] }))
    .pipe(
      switchMap(({ builds }) => {
        return interval(5000)
          .pipe(
            startWith(0),
            switchMap(() => of(builds).pipe(
              map((builds: Build[]) => builds.map((build) => build.xmlUrl)),
              mergeMap((builds) => forkJoin(...builds.map(getBuildPromise))),
              map((builds) => ({ builds, lastUpdated: Date.now() })),
              tap((syncState) => chrome.storage.sync.set(syncState)),
            )),
          )
      }),
      share(),
    )
