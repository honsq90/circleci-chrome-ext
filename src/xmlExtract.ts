export interface Build {
  name: string;
  lastBuildStatus: string;
  webUrl: string;
  activity: string;
  xmlUrl?: string;
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
