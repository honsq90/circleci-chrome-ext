import * as $ from 'jquery';

let count = 0;

$(function () {
  chrome.browserAction.setBadgeText({ text: count.toString() });
  $('#countUp').click(() => {
    chrome.browserAction.setBadgeText({ text: (++count).toString() });
  });

});
