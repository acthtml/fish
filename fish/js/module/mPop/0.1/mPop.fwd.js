
//<<-------------pop组件---------------
(function () {

    var recordParent, //记录文档的节点位置
    recordPoint,
    cover = "#poperCover",
    cenLayout = "#poperContent",
    content = "#poperContent div.cenholder",
    __cover,
    __cenLayout,
    __content,
    __window,
    __document,
    param = {
        html: "",
        top: "auto"
    };

    function insertback() {
        if (recordParent) {
            fish.all(content + " > *").each(function () {
                recordParent.insertBefore(this, recordPoint);
            })
            recordParent = null;
        }
        else {
            __content.html("");
        }
    }

    //弹出层
    var main = function (p) {
        if (!p) { return; }
        var def = {
            html: "",
            top: "auto"
        }
        //创建内容
        if (!fish.all(cover)[0]) {
            fish.all("body").html("bottom", "<div id='poperCover' class='poplayout' style='display:none'></div><div id='poperContent' class='cenlayout'  style='display:none'><div class='cenholder'></div></div>");
            __cover = fish.all(cover);
            __cenLayout = fish.all(cenLayout);
            __content = fish.all(content);
            __window = fish.all(window);
            __document = fish.all(document);
            //点击空白处消失
            __cover.on("click", main.close);
            __window.on("resize", main.setPos);
        }
        //先将原先节点insert回原位置
        insertback();
        var html = p.content;
        //同步私有参数
        fish.lang.extend(def, p);

        //保存节点位置等
        if (typeof html === "string") {
            def.html = html;
        }
        else if (html.nodeType === 1) {
            recordParent = html.parentNode;
            //TODO:测试下ie的节点还原有没有问题
            recordPoint = html.nextSibling;
            def.html = html;
        }
        else if (html[0] && html[0].nodeType === 1) {
            recordParent = html[html.length - 1].parentNode;
            recordPoint = html[html.length - 1].nextSibling;
            def.html = html;
        }
        //保存公共参数
        fish.lang.extend(param, def);
        //插入
        __content.html("bottom", param.html);
        //延时一会让ie6正常显示
        setTimeout(function(){
            main.setPos();
        }, 0);
        //main.show();
        //显示
        __cenLayout.css("display:block");
        __cover.css("display:block");
        var allSelect = fish.all("select");
        allSelect.clear(fish.all("select", __cenLayout));
        allSelect.css("visibility:hidden");
    }
    //设置位置
    main.setPos = function () {
        var top, left, toggle, contentWidth = __content.width();

        if (param.top === "auto") {
            top = __window.scrollTop() + __window.height() / 2 - __content.height() / 2;
        }
        else {
            top = parseInt(param.top, 10) + __window.scrollTop();
        }
        left = __window.scrollLeft() + __window.width() / 2 - contentWidth / 2;
        __cenLayout.css("top:" + top + "px; left:" + left + "px; width:" + contentWidth + "px");

        if(fish.browser("ms", 6)){
            __cover.css("position:absolute; width:" + __document.width() + "px; height:" + Math.max(__document.height(), __window.height()) + "px");
        }
    }
    //隐藏
    main.close = function () {
        __cenLayout.css("display:none");
        __cover.css("display:none");
        var allSelect = fish.all("select");
        allSelect.clear(fish.all("select", __cenLayout));
        allSelect.css("visibility:visible");
        //先将原先节点insert回原位置
        insertback();
    }
    //扩展到fish
    fish.extend({
        mPop: main
    })
})();
//-------------pop组件--------------->>

