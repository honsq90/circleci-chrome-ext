import { appendXmlUrl, Build } from './xmlExtract';

describe('xmlExtract', () => {
  it('should append xmlUrl', () => {

    const build: Build = {
      activity: 'Sleeping',
      lastBuildStatus: 'Success',
      name: 'test',
      webUrl: 'https://example.com',
    }
    const xmlUrl = 'https://example.com/index.xml'

    expect(appendXmlUrl(xmlUrl)(build)).toEqual({
      ...build,
      xmlUrl,
    })
  })
})
