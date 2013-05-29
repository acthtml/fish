
/** mNotice
 ## 综合需求
 # 在输入域（input 或 textarea）周边显示相关的数据框供用户选择
 # 框的数据需要按特定的格式打印
 # 框显示在输入域的周边时，满足指定的偏移量范围，尽可能的在视口中完整显示
 # 框的数据需要满足用户交互的需要
 # 框的数据可以缓存或不缓存
 
 ## 交互
 # 输入域（input 或 textarea）获得焦点时，用户看到数据框。失去焦点时，数据框隐藏。
   数据框被用户操作（点击）时，如果用户操作无效区域（此区域内没有符合输入框的数据），
   如果该区域在数据框内，数据框保持显示，如果在数据框外，则隐藏数据框。
   反之，当操作在有效区域时，则隐藏。而数据填入输入域
 # 数据框的显示和隐藏需要满足不同的 DOM 节点上的不同的触发事件

 ## change log
 # 不在提供缓存机制，目前缓存机制由代码自行实现，将来会在 ajax 模块内部实现
 # 仅对 request 且 urlInTime 的情况下，使用缓存机制
*/

/**
 * @param {Object} offset 示例{x: 3, y: -3}，默认 {x: 0, y: 0}，弹框相对于输入域的偏移量
 * @param {Object} request 请求数据的 ajax 参数对象，但是不包括回调 fn，fn 内部实现，必传（与 localData 不能同传）
 * @param {Object} localData 本地数据对象，必传（与 request 不能同传）
 * @param {String} template 标签模版字符串，默认 ""
 * @param {String} mode 用于指定内容打印格式，默认普通，如果需要 mTab 组件化格式，传递 "mTab" 字符串即可
 * @param {Function} display 用于打印数据的回调，默认提供两个参数，第一个参数是数据对象，第二个参数是模版字符串（必传）
 * @param {Boolean} isClick 如果数据项需要非链接形式的 click，设置为 true，默认 false
 * @param {Function} clickCallback 如果 isClick 设置为 true，那么就可以指定该回调，它在点击后触发一些用户自定义操作，默认 false
 * @param {Boolean} isHover 如果数据项需要非链接形式的 hover，设置为 true，默认 false
 * @param {String} beside 推荐使用 fish 组件绑定的 this，可以传递选择器字符串，索引结果的第一个作为输入域
 * @param {String} theme 样式主题不指定则使用默认值，如果指定则给弹框最外层添加该主题名到其 className 中
 * @param {String} rejects 是个排除框的选择器字符串，也就是说当 reject 这个东西显示时（判断类名中有没有 none），mNotice 不会显示
 * @param {Function} urlInTime 该函数用于处理 url 中需要变化的查询串。如果需要使用，请符合如下规则：
            # request 已经指定
            # request 的 url 必须是静态的（可以包含不变的查询串）
            # 变化的查询由 urlInTime 内部处理，最后返回完整的 url 来替换 request 中的 url
            # urlInTime 的第一个参数是 request 中的 url（静态无变化的 url），this 是 fish 化的 beside
            PS：如果 request 中的 url 是纯静态的，推荐由组件外部请求到数据后，由参数 localData 传入
 * @return {Object} 提供组件对象的一些方法：
            show() 显示组件
            hide() 隐藏组件
            position(fish 化的弹框元素对象, fish 化的输入域对象, 偏移量同上 offset) 定位需要挨在特定元素周边的元素
            update() 更新组件数据
 * @description 仅对 request 且 urlInTime 的情况下，使用缓存机制
 */

(function (f) {
    function main(param) {
        var noticeId = fish.guid();
        if (!param) {
            throw new Error("传递设置参数！");
        }
        var beside = param.beside,
			dataBoxType = param.dataBoxType,
			isSelect = param.isSelect,
			documentCaptureEvent = param.documentCaptureEvent?param.documentCaptureEvent:"focus",
			inputCaptureEvent = param.inputCaptureEvent?param.inputCaptureEvent:"click",
			
        // 定义接受的输入域类型
            available = {
                "INPUT": "INPUT",
                "TEXTAREA": "TEXTAREA"
            };
		
        // 验证需要弹框的输入域是否是 this 或存在
        if (!this.length) {
            if (
                !beside ||
                (
                    typeof beside !== "string" &&
                    beside.nodeType !== 1 &&
                    !beside.length
                )
              ) {
                throw new Error("指定需要弹框的节点选择器或节点！");
            }
            beside = f.one(beside);
            if (!beside.length) {
                throw new Error("指定需要弹框的节点！");
            }
        } else {
            beside = f.one(this[0]);
        }

        if (!available[beside[0].nodeName]) {
            throw new Error("指定的输入域无效！");
        }

        var offset = {
            x: 0,
            y: 0
        },
        x = param.offset && param.offset.x,
        y = param.offset && param.offset.y,
        request = param.request,
        localData = param.localData,
        template = typeof param.template === "string" ? param.template : undefined,
        mode = param.mode === "mTab" ? "mTab" : "",
        noticeFrame, //iframe元素
        display = param.display,
        isClick = param.isClick === undefined ? false : !!param.isClick,
        isHover = param.isHover === undefined ? false : !!param.isHover,
    // # 参数 warn，暂不放入
    // 如果输入域需要验证函数，
    // 那么 warn 作为验证函数传入，函数的第一个参数即是输入域
    // 默认为不需要验证函数，即 false
    // warn = typeof param.warn === "function" ? param.warn : false,
        clickCallback = typeof param.clickCallback === "function" ? param.clickCallback : false,
        theme = typeof param.theme === "string" ? param.theme : "",
        urlInTime = typeof param.urlInTime === "function" ? param.urlInTime : false,
        rejects = typeof param.rejects === "string" ? param.rejects : false,
    // rejects = rejectSelector && f.all(rejectSelector),
        staticUrl = "",
        wrap,
        isWrapFull,
        positionTimer,
        ie6ResizeBackDropTimer,
        dataCache = {};

        // 验证和处理偏移量
        if (
            param.offset &&
            (
                parseInt(x) ||
                parseInt(y)
            )
          ) {
            x && (offset.x = x);
            y && (offset.y = y);
        }

        // 验证和处理数据格式打印的回调函数
        if (!param.display && typeof param.display !== "function") {
            throw new Error("指定数据渲染函数！");
        }

        // 验证和处理数据源
        // request 和 localData 不能并存
        if (
            (!request && !localData) ||
            (request && localData)
          ) {
            throw new Error("指定唯一数据源！");
        } else {
            if (request && urlInTime) {

                staticUrl = request.url;
                request.url = urlInTime(staticUrl);

                request.fn = function (data) {
                    if (data && (data.length || !isEmpty(data))) {
                        f.ready(
                            function () {
                                dataCache[request.url.substring(request.url.indexOf("?") + 1)] = data;
                                if (!f.all("#mNotice-" + noticeId).length) {
                                    init(data, noticeId);
                                } else {
                                    makeWrapHtml(data);
                                }
                            }
                        );
                    }
                }
                request.onTimeout = function () {
                    requestErrorOccur("服务器端响应超时！");
                }
                request.err = function () {
                    requestErrorOccur("服务器端发生错误！");
                }
                f.ajax(request);

            } else {
                f.ready(
                    function () {
                        if (localData && (localData.length || !isEmpty(localData))) {
                            init(localData, noticeId);
                        }
                    }
                );
            }
        }

        // 重定位弹框容器的 window 事件监听
        f.ready(
            function () {
                f.one(window).on(
                    "resize",
                    rePositionWrap
                );

                f.one(window).on(
                    "scroll",
                    rePositionWrap
                );
            }
        );

        return {
            show: function () {
                setTimeout(function(){
                    (isWrapFull && isRejectsAllHide(rejects)) && (wrap.removeClass("none") && positionWrap());
                },0)

            },
            hide: function () {
                wrap.addClass("none");
            },
            position: positionWrap,
            update: function () {
                var prop;
                request.url = urlInTime(staticUrl);
                prop = request.url.substring(request.url.indexOf("?") + 1);
                if (dataCache[prop]) {
                    makeWrapHtml(dataCache[prop]);
                } else {
                    f.ajax(request);
                }
            }
            /* 不需要这块代码
            isWrapBeing: function () {
                return wrap ? true : false;
            } */
            
        }

        function isRejectsAllHide(rejectsSelector) {
            var isHide = true,
                rejects = f.all(rejectsSelector);
            if (rejects.length) {
                rejects.each(
                    function (item) {
                        if (!(f.one(item).hasClass("none") || item.style.display === "none")) {
                            isHide = false;
                            return false;
                        }
                    }
                );
                return isHide;
            } else {
                // 没有排斥内容
                return 1;
            }
        }

        function makeWrapHtml(data) {
            var tmpTemplate;

            if (!(tmpTemplate = display.apply(beside, [data, template]))) {
                isWrapFull = false;
                return;
            }
            wrap.html("");
            wrap.html(tmpTemplate);
            isWrapFull = true;
        }

        function init(data, noticeId) {
            var closeBtn,
                tmpTemplate;
				
            if (!isSelect){
				select(beside);
			}
            if (!(tmpTemplate = display.apply(beside, [data, template]))) {
                isWrapFull = false;
                return;
            }
            wrap = wrapHtml(tmpTemplate, noticeId);
            isWrapFull = true;

            mode === "mTab" && mTab(mode, beside, noticeId);

            focus(beside, wrap);
            
            isClick && click(wrap, beside);
            if (isHover) {
                mouseover(wrap);
                mouseout(wrap);
            }
            keydown(beside, wrap);
            clickNotOn(wrap, beside);
            closeBtn = f.one(".mNotice-close", wrap);
            if (closeBtn.length) {
                wrap.on(
                    "click",
                    function (e) {
                        var that = f.getTarget(e);
                        if (f.one(that).hasClass("mNotice-close")) {
                            wrap.addClass("none");
                        }
                    }
                );
            }
        }

        //生成或重置iframe
        function wrapIframe(){
            //to void every browser when mNotice is overlay a flash, so we need iframe allways.
            //if (f.browser("ms", 6)) {
            if(!noticeFrame){
                var backdrop = document.createElement("iframe");
                backdrop.id = "mNotice-backdrop";
                fish.one(wrap).html("top", backdrop);
                f.one(backdrop).css("position:absolute;border:none;filter:alpha(opacity=0);opacity:0;z-index:-1");
                noticeFrame = backdrop;
            }
            //get Width height

            var width = fish.one(wrap).width(),
                height = fish.one(wrap).height();

            fish.all(noticeFrame).css("width:" + width + "px;height:" + height + "px");

            //}
        }

        // 包装模板字符串（即参数中的 template）
        // 即给弹框内容的标签结构字符串
        // 包裹一个弹框容器（即一个 div 以 innerHTML 的形式嵌入 template）
        function wrapHtml(template, noticeId) {
            wrap = document.createElement("div");
            var fishifyWrap = f.one(wrap);
			if (dataBoxType){
				fishifyWrap.attr("data-box-type",dataBoxType);
			}
            wrap.id = "mNotice-" + noticeId;
            wrap.className = theme ? "mNotice-wrap none " + theme : "mNotice-wrap none";
            fishifyWrap.css("position: absolute; z-index: 1000000;");
            document.body.insertBefore(wrap, document.body.firstChild);
            wrap.innerHTML = template;


            wrapIframe();

            return fishifyWrap;
        }

        // 弹框中内容的显示格式，如果是显示参数 mode === "mTab"
        // 则为标签卡显示模式，否则为普通显示模式
        function mTab(mode, beside, noticeId ) {
            if (mode === "mTab") {
                f.one('#mNotice-' + noticeId).mTab(
                    {
                        tab_tray: '.mNotice-mTab-tab-tray',
                        append: 'current',
                        content: '.mNotice-mTab-content',
                        fn: function () {
                            rePositionWrap();
                            wrapIframe();
                        }
                    }
                )
            }
        }

        // 弹框中鼠标操作对象的事件
        // 比如 focus，click，hover 等
        function focus(beside, wrap) {
            beside.on(
                documentCaptureEvent,
                function (e) {
                    f.all("body .mNotice-wrap").addClass("none");
                    if (isWrapFull && isRejectsAllHide(rejects)) {
                        wrap.removeClass("none");
                        positionWrap(wrap, beside, offset);
                        wrapIframe();
//                        if (f.browser("ms", 6)) {
//                            resizeIe6BackDrop(wrap);
//                        }
                    }
                }
            );
        }

        function select(beside) {
            beside.on(
                "click",
                function (e) {
                    beside[0].select();
                }
            );
        }

        function click(wrap, beside) {
            wrap.on(
                inputCaptureEvent,
                function (e) {
                    var that = f.getTarget(e),
                        legacytype;
                    if (f.one(that).hasClass("mNotice-normal")) {

                        beside.val(that.innerHTML);
                        beside.attr("cid", that.getAttribute("cid"));

                        // 遗留的酒店名称 type 5，这个 type = 5 还要用吗？
                        // 由具体情况决定
                        /* if(that.getAttribute("legacytype")) {
                        beside.attr("ctype", that.getAttribute("legacytype"));
                        }else {
                        beside.attr("ctype", that.getAttribute("ctype"));
                        } */

                        beside.attr("ctype", that.getAttribute("ctype"));

                        beside.addClass("color-normal");
                        wrap.addClass("none");
						if (dataBoxType){
							setTimeout(function(){f.dom("#"+dataBoxType).blur()},20);
						}
                        clickCallback && clickCallback.apply(f.one(that), [beside]);
                    }
                }
            );
        }

        function mouseover(wrap) {
            wrap.on(
                "mouseover",
                function (e) {
                    var that = f.getTarget(e);
                    if (f.one(that).hasClass("mNotice-normal")) {
                        f.all(".mNotice-normal", wrap).removeClass("mNotice-hover");
                        f.one(that).addClass("mNotice-hover");
                    }
                }
            );
        }

        function mouseout(wrap) {
            wrap.on(
                "mouseout",
                function (e) {
                    f.all(".mNotice-normal", wrap).removeClass("mNotice-hover");
                }
            );
        }
        // ### / ### //

        // 点击发生在弹框容器之外的处理（如果在弹框容器外，隐藏容器）
        function clickNotOn(wrap, beside) {
            f.one(document).on(
                "mousedown",
                function (e) {
                    var that = f.getTarget(e);
                    while (that !== null) {
                        if (
                            that.nodeType === 1 &&
                            (
                                that === beside[0] ||
                                that.className.indexOf("mNotice-wrap") > -1
                            )
                          ) {
							
							if (fish.one(that).attr("data-box-type")){
								setTimeout(function(){fish.dom("#"+fish.one(that).attr("data-box-type")).focus()},0);
							}
                            return;
                        }
						
                        that = that.parentNode;
                    }
                    wrap.addClass("none");
                }
            );
        }

        // 如果在需要弹框的输入域中发生按键操作
        // 如果是 tab 键，则隐藏弹框容器
        function keydown(beside, wrap) {
            beside.on(
                "keydown",
                function (e) {
                    e = f.getEvent(e);
                    key = e.keyCode || e.which;
                    typeof key === "number" && key!==17&& key!==18 && wrap.addClass("none");
                    // alert(key);
                }
            );
        }

        // 弹框容器（是个 div）定位
        function positionWrap(_wrap, _beside, offset) {
            var _offset = offset;
            if (_wrap && _wrap[0].nodeType === 1 && _beside && _beside[0].nodeType === 1) {

                //先偏移，避免一些现实上的小闪动
                _wrap.css("left:-1000px;");

                var viewWidth = f.one(window).width(),
                    viewHeight = f.one(window).height(),
                    besideWidth = _beside.width(),
                    besideHeight = _beside.height(),
                    wrapWidth = _wrap.width(),
                    wrapHeight = _wrap.height(),
                    besideOffset = _beside.offset(),
                    scrollTop = f.one(document).scrollTop(),
                    scrollLeft = f.one(document).scrollLeft(),
                    temp;

                if (_offset && !isEmpty(_offset)) {
                    _offset.x = typeof _offset.x === "number" ? _offset.x : 0;
                    _offset.y = typeof _offset.y === "number" ? _offset.y : 0;
                } else {
                    _offset = {
                        x: 0,
                        y: 0
                    }
                }

                if (
                    (temp = besideOffset.left - scrollLeft) > viewWidth - (besideOffset.left - scrollLeft) &&
                    viewWidth - (besideOffset.left - scrollLeft) < wrapWidth
                  ) {
                    _wrap.css("left:" + (besideOffset.left + besideWidth - wrapWidth - _offset.x) + "px");
                } else {
                    _wrap.css("left:" + (besideOffset.left + _offset.x) + "px");
                }
                
                /*
                if (
                    (temp = besideOffset.top - scrollTop) > viewHeight - (besideOffset.top - scrollTop) &&
                    viewHeight - (besideOffset.top - scrollTop) < wrapHeight
                  ) {
                    _wrap.css("top:" + (besideOffset.top - wrapHeight - offset.y) + "px");
                } else {
                    _wrap.css("top:" + (besideOffset.top + besideHeight + offset.y) + "px");
                }
                */
                _wrap.css("top:" + (besideOffset.top + besideHeight + _offset.y) + "px");
                
            } else {
                positionWrap(wrap, beside, offset);
                //TODO:允许不输入，不输入的时候使用对象的值
                //throw new Error("需要指定输入域和/或及其弹框！");
            }
        }

        // 在页面窗体发生改变时，
        // 重定位容器
        function rePositionWrap() {
            if (!wrap || wrap.hasClass("none")) {
                return;
            }
            positionTimer && clearTimeout(positionTimer);
            positionTimer = setTimeout(
                function () {
                    positionWrap(wrap, beside, offset);
                    wrapIframe();
//                    if (f.browser("ms", 6)) {
//                        resizeIe6BackDrop(wrap);
//                    }
                },
                100
            );
        }

        // ie6 弹框容器中的 iframe 在弹框改变大小时，
        // 相应的也调整大小
        function resizeIe6BackDrop(wrap) {
            var // ieBackDrop = f.one("#mNotice-backdrop"),
                children,
                backdrop,
                content,
                backdrop;

            children = getChildren.apply(this, arguments);
            if (!children.iframe || !children.content) {
                return false;
            }
            backdrop = f.one(children.backdrop);
            content = f.one(children.content);
            backdrop.css("width:" + content.width() + "px;height:" + content.height());

            function getChildren(wrap) {
                var children = wrap[0].childNodes,
                    iframe,
                    content,
                    i = 0,
                    item;
                while (item = children[i++]) {
                    if (item.id === "mNotice-backdrop") {
                        iframe = item;
                    } else if (item.nodeType === 1) {
                        content = item;
                    }
                }
                return {
                    backdrop: iframe,
                    content: content
                };
            }
        }

        // 数据对象是否是空的
        // 通过检查对象有没有属性来判断
        // 有，不是空对象；反之，是空对象
        function isEmpty(o) {
            for (var p in o) {
                return false;
            }
            return true;
        }

        // 对服务器端发生的错误或超时，
        // 记入全局 iError，
        // 静默处理用户响应
        function requestErrorOccur(info) {
            if (!window.iError) {
                window.iError = [];
            }
            window.iError.push(
                {
                    date: new Date().toString(),
                    info: info
                }
            );
        }

    }

    f.extend(
        {
            mNotice: main
        }
    );
})(fish);