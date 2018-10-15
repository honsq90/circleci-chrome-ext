export function getStorage(props) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(props, (storage) => {
      resolve(storage);
    })
  })
}
