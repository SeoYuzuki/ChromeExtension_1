// 接收 message，在 chrome extension 或 contentScript 都通用
// runtime.onMessage.addListener(callback<request, sender, sendResponse>)

var element_1='';
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('sender', sender);  // {id: "...", url: "..."}
  console.log(request); 
	
	if(request.action != ''){
		element_1=request.action;
	}
	
	if(request.greeting != ''){
		console.log('2');
		eval(element_1+".innerText='hhhhhh';");
	}
	
  if (request.from === 'popup.js') {
    // 可以在 sendMessage 的 callback 中取得，此 sendResponse 的內容
    // 需要注意若在多個地方呼叫同時呼叫 sendResponse，將只會收到一個
    sendResponse({
      from: 'background.js',
    });
  }
});