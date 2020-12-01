var getSelectedTab = (tab) => {
  var tabId = tab.id;
  var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);


  document.getElementById('rotate').addEventListener('click', () => sendMessage({ action: 'ROTATE' }));
  let s = document.getElementById('fname').value;

  document.getElementById('reset').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("finTest.html") });
    let s = document.getElementById('fname').value;
    return sendMessage({ action: s });
  }
  );

  document.getElementById('a01').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("stock.html") });
  }
  );

}
chrome.tabs.getSelected(null, getSelectedTab);

