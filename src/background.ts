
function polling() {
  chrome.storage.sync.get({
    urls: [],
  }, ({ urls }) => {
    console.log('polling', urls)
  });
  setTimeout(polling, 1000 * 30);
}

polling();

