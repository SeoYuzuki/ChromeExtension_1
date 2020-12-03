var getSelectedTab = (tab) => {
  document.getElementById('a01').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("stockCal/stock.html") });
  }
  );

}
chrome.tabs.getSelected(null, getSelectedTab);

