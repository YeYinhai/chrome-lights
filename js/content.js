(function () {
    // 首次
    var first = true;
    var firstLength = contentLength();

    var config = {
        isContent: false,
        isFoot: true,
        isAD: true
    }

    chrome.storage.sync.get(["isContent", "isFoot", "isAD"], function (data) {
        // alert(JSON.stringify(data));
        config = data;
    })


    chrome.extension.onMessage.addListener(
        // 直接接受popup发来的消息
        function (request, sender, sendResponse) {
            config = request;
            main();
            sendResponse({ result: "ok" })
        }
    );

    setInterval(() => {
        if (first) {
            main();
            first = false;
        } else if (firstLength != contentLength()) {
            main();
            firstLength = contentLength();
        }
    }, 200)

    function main() {
        // 去掉底部公司信息。
        config.isFoot ? $('#foot').hide() : $('#foot').show();

        if (config.isContent) {
            // 去掉普通内容
            $('.c-abstract').hide();
            // 去掉带有图片的内容
            $('.c-span-last > p > p ').hide();
        } else {
            $('.c-abstract').show();
            $('.c-span-last > p > p ').show();
        }

        // 去掉头部广告
        if (config.isAD) {
            $('.m').each((index, element) => {
                if (element.innerText == '广告') {
                    $(element).parent().parent().hide();
                }
            });
        }

        // 设置容器高度
        $('#content_left').css({ "overflow": "auto", "padding-top": "20px", "width": "640px" });
        $('#content_right').css({ "overflow": "auto", "max-height": "850px", "margin-top": "150px" });
        $('#wrapper_wrapper').css({ "padding-bottom": "100px" });
        // 分页悬浮
        $('#page').css({ "position": "fixed", "bottom": "0" });
        $('#page>a').css({ "height": "36px" });
    }

    function contentLength() {
        return $('#content_left')[0].innerText.length;
    }

})();