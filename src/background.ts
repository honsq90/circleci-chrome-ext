
function polling() {
  chrome.storage.sync.get({
    builds: [],
  }, ({ builds }) => {
    console.log('polling', builds);
  });
  setTimeout(polling, 1000 * 30);
}

polling();

