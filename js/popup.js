
var config = {}

window.onload = function () {
    chrome.storage.sync.get(["isContent", "isFoot", "isAD"], function (data) {
        // alert(JSON.stringify(data));
        config = data;
        document.getElementById('isContent').checked = data.isContent;
        document.getElementById('isFoot').checked = data.isFoot;
        document.getElementById('isAD').checked = data.isAD;
    })

}

document.querySelectorAll('input').forEach((element) => {
    element.onclick = function () {
        config[this.id] = this.checked;
        sendMessageToContentScript(config, (response) => {
            if (response.result == "ok") {
                // alert(JSON.stringify(config));
                chrome.storage.sync.set(config, function (data) { })
            }
        });
    }
});


// document.getElementById('isContent').onclick = function () {
//     config.isContent = this.checked;
//     sendMessageToContentScript(config, (response) => {
//         if (response.result == "ok") {
//             // alert(1);
//         }
//     });
// }

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (callback) {
            // alert(tabs.length, tabs[0].id)
            callback(tabs.length ? tabs[0].id : null);
        }
    });
}

// 这2个获取当前选项卡id的方法大部分时候效果都一致，只有少部分时候会不一样
function getCurrentTabId2() {
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (tabs) {
            if (callback) callback(tabs.length ? tabs[0].id : null);
        });
    });
}


// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code) {
    getCurrentTabId((tabId) => {
        chrome.tabs.executeScript(tabId, { code: code });
    });
}
