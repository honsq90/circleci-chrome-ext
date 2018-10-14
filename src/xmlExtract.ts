export interface Build {
  name: string;
  lastBuildStatus: string;
  webUrl: string;
  xmlUrl?: string;
}

export function extractProjectData(xmlData: XMLDocument) {
  const projectXmlData = xmlData.getElementsByTagName("Project");
  if (projectXmlData.length) {
    const project = projectXmlData[0];
    const name = project.getAttribute('name');
    const lastBuildStatus = project.getAttribute('lastBuildStatus');
    const webUrl = project.getAttribute('webUrl');
    return { name, lastBuildStatus, webUrl };
  }
}
