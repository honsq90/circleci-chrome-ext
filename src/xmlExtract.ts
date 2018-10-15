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

export function appendXmlUrl(xmlUrl) {
  return (build): Build => ({ ...build, xmlUrl })
}

export function getBuildPromise(xmlUrl: string) {
  return get(xmlUrl)
    .then(extractProjectData)
    .then(appendXmlUrl(xmlUrl));
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

export const buildPoller: Observable<Build[]> =
  interval(5000)
    .pipe(
      startWith(0),
      switchMap(() => from(getStorage({ builds: [] })).pipe(
        map(({ builds }) => builds.map((build) => build.xmlUrl)),
        mergeMap((builds) => forkJoin(...builds.map(getBuildPromise))),
        tap((builds) => chrome.storage.sync.set({ builds })),
      )),
      share(),
    )
