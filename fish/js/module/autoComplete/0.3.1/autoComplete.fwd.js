 //autoComplete 末日重构版本
(function(){

    /*
     * ready时初始化，搜索框
     * 按不同的搜索类型提供预置的标签结构（城市或酒店名称商圈等）
     * 绑定事件 focus blur keyup hover click resize scroll
     * 根据不同的事件操作执行不同的操作 ajax ui改变 定位 传值
     *
     * @param {Object}
     * beside 相对元素
     * template 初始化标签
     * class 主题样式限定名（样式类名）
     * placeholder input 默认输入
     * offset {Object}偏移量
     * request {Object}
     * print 打印函数
     * itemValueFn 取得当前所选项的值
     * submit 提交函数
     * title 头部提示
     * itemClass 每项的类名
     * highlightClass hover 或上下箭头所到项的高亮的类名
     * emptyClass placeholder 时的样式类名
     *
     */

    function main(param) {
        var beside, //表单内元素,后面被格式化为fish对象
            id = fish.guid(), //唯一id
            template = '<div id="autoComplete-' + id + '" class="autofill_wrap"><table class="autofill_tray" cellpadding="0" cellspacing="0"><tr class="autofill_title"><th class="autofill_hd"><span class="autofill_hd_inner"></span></th></tr></table><span class="autofill_close"></span></div>',
            wrap,   //最父级节点
            titleWrap, //title节点
            localData = [], //本地数据
            printData = {}, //打印出来的数据集
            offset = {x:0, y:0},  //偏移
            title = "输入中文/拼音/↑↓键选择",  //默认title文字
            output = {},   //输出对象
            preSortFn = null, //排序前的数据处理函数
            sortFn = null, //排序函数
            width, //宽度，不指定时为自适应
            highlight = true, //是否高亮关键字
            max = 10,//最高显示条目数
            originIndex = 0, //默认高亮的行号
            keepListOnNoResult = false, //是否保持无结果前有结果的列表 -_-
            url = "", //异步地址,可以使用function, 来接受不同的参数
            type = "get", //异步类型
            ignore = true,            //是否忽略大小写
            processPrintDataFn, //打印前的整理函数
            processAjaxDataFn = function(){}, //需要返回标准数组
            urlInTime = function(){}, //及时解析的url函数
            itemPrintFn = function(){}, //每行的打印函数,返回innerHTML
            itemValueFn = function(){}, //获取每行的提交值的函数
            itemEnableFn = function(){return true}, //判定每汗是否有效的函数，无效的行不会加上 hover的类名。也就不会响应 mouseover和click等
            ajaxFn = function (){},  //异步回调函数
            itemHighlightFn = function(){return true}, //是否高亮关键字
            elemTouch = false, //保存是否被点击点中
            theme = "", //主题,是个类名
            tableWrapElem, //table节点
            autocompleteFrame, //iframe的节点
            itemClass = "autofill_item", //每行的类名
            enableClass = "enableListRow", //每行的类名
            hoverClass = "autofill_hover",  //光标滑过的类名
            highlightClass = "autofill_hili", //高亮关键字的类名
            emptyClass = "autofill_empty"; //表单为空值时的类名

        beside = this;
        if(!beside[0]){
            throw new Error("autoComplete init faild, fish obj was null when exec fish.all('...').autoComplete()");
        }


        fish.one("body").html("top", template);
        wrap = fish.one("#autoComplete-" + id);
        titleWrap = fish.one(".autofill_hd_inner", wrap[0]);
        tableWrapElem = fish.dom(".autofill_tray", wrap[0]);



//
//        if(typeof param.placeholder === "string") {
//            beside.val(param.placeholder);
//        }

        offset.x = param.offsetX !== undefined ? param.offsetX : 0;
        offset.y = param.offsetY !== undefined ? param.offsetY : 0;

        if(typeof param.processAjaxDataFn === "function"){
            processAjaxDataFn = param.processAjaxDataFn;
        }

        if(typeof param.itemPrintFn === "function"){
            itemPrintFn = param.itemPrintFn;
        }

        if(typeof param.template === "string" && fish.trim(param.template).length) {
            template = param.template;
        }

        if(typeof param.title === "string" && fish.trim(param.title).length) {
            title = param.title;
            titleWrap.html(param.title);
        }

        if(typeof param.theme === "string" && fish.trim(param.theme).length) {
            theme = param.theme;
            wrap.addClass(param.theme);
        }

        if(typeof param.itemClass === "string" && fish.trim(param.itemClass).length) {
            itemClass = param.itemClass;
        }

        if(typeof param.highlightClass === "string" && fish.trim(param.highlightClass).length) {
            highlightClass = param.highlightClass;
        }

        if(typeof param.emptyClass === "string" && fish.trim(param.emptyClass).length) {
            emptyClass = param.emptyClass;
        }

        if(typeof param.ajaxFn === "function"){
            ajaxFn = param.ajaxFn;
        }

        width = param.width ? param.width : width;
        processPrintDataFn = param.processPrintDataFn ? param.processPrintDataFn : processPrintDataFn;
        preSortFn = param.preSortFn ? param.preSortFn : preSortFn;
        max = param.max ? param.max : max;
        sortFn = param.sortFn ? param.sortFn : sortFn;
        keepListOnNoResult = param.keepListOnNoResult ? param.keepListOnNoResult : keepListOnNoResult;
        url = param.requestUrl ? param.requestUrl : url;
        type = param.requestType ? param.requestType : type;
        itemPrintFn = param.itemPrintFn ? param.itemPrintFn : itemPrintFn;
        itemEnableFn = param.itemEnableFn ? param.itemEnableFn : itemEnableFn;
        itemValueFn = param.itemValueFn ? param.itemValueFn : itemValueFn;
        localData = param.localData ? param.localData : localData;
        itemHighlightFn = param.itemHighlightFn ? param.itemHighlightFn : itemHighlightFn;


        width && fish.all(tableWrapElem).css("width:" + width + "px");

        positionWrap(wrap, beside, offset);

        wrap.css("display:none");
        wrap.effect({
            elem:beside,
            interShow:false
        })



        //生成或重置iframe
        function wrapIframe(){
            //to void every browser when mNotice is overlay a flash, so we need iframe allways.
            //if (f.browser("ms", 6)) {
            if(!autocompleteFrame){
                var backdrop = document.createElement("iframe");
                backdrop.id = "mNotice-backdrop";
                fish.one(wrap).html("top", backdrop);
                fish.one(backdrop).css("position:absolute;border:none;filter:alpha(opacity=0);opacity:0;z-index:-1");
                autocompleteFrame = backdrop;
            }
            //get Width height

            var width = fish.one(wrap).width(),
                height = fish.one(wrap).height();

            fish.all(autocompleteFrame).css("width:" + width + "px;height:" + height + "px");

            //}
        }

        var ajaxTimer;
        function ajaxToGetData(handledUrl){
            if(ajaxTimer){
                clearTimeout(ajaxTimer);
            }
            ajaxTimer = setTimeout(function(){
                if(beside.ajaxObj){
                    try{
                        beside.ajaxObj.abort();
                    }
                    catch(e){}
                }
                beside.ajaxObj = fish.ajax({
                    url: handledUrl,
                    type: type,
                    fn: function(data) {
                        ajaxFn(data);
                        var fData = processAjaxDataFn(data);
                        beside.origin = output.val();
                        if(fData && fData.length){
                            bulidTitleTips(title);
                            bulidTableList(fData);
                        }
                        else{
                            if(keepListOnNoResult){
                                bulidTableList();
                            }
                            bulidTitleTips("对不起，找不到：" + processHighlight(output.val()))
                        }
                        wrapIframe();

                    }
                });
                ajaxTimer = null;
            }, 200);
        }

        function bulidTableList(fData, highLightKey){
            if(fData && processPrintDataFn){
                processPrintDataFn.call(output, fData);
            }
            printData = fData;
            _bulidTableList(fData, highLightKey);
        }

        function _bulidTableList(fData, highLightKey){
            var htmlTemp, enableTemp, hlTemp;
            cleanList(tableWrapElem);



            if(fData && fData.length){
                for(n=0; n<fData.length; n++){
                   row = tableWrapElem.insertRow(-1);
                   cell = row.insertCell(-1);
                    enableTemp = itemEnableFn.call(row, fData[n], n);
                    row.className = itemClass;
                    if(enableTemp){
                        row.className += (" " + enableClass);
                    }
                   htmlTemp = itemPrintFn.call(row, fData[n], n);
                   if(htmlTemp === false){
                       tableWrapElem.deleteRow(-1);
                   }
                   else{
                       if(hlTemp = itemHighlightFn.call(row, fData[n], n)){
                           cell.innerHTML = processHighlight(htmlTemp, highLightKey);
                       }
                       else{
                           cell.innerHTML = htmlTemp;
                       }
                   }
                }
                //设置第一个可用的index
                if(tableWrapElem.index !== -1){
                    var list = fish.all("." + itemClass, tableWrapElem);
                    while(list[tableWrapElem.index] && !fish.one(list[tableWrapElem.index]).hasClass(enableClass)){
                        tableWrapElem.index++;
                    };
                    if(list[tableWrapElem.index]){
                        fish.one(list[tableWrapElem.index]).addClass(hoverClass);
                    }
                    else{
                        tableWrapElem.index = -1;
                    }
                }
            }
        }

        function bulidTitleTips(html){
            output.setTitle(html);
        }



        function sub_matchData(key){
            var fData = [],
               tempCity, tempMatch, tempKey, tempMatchIndex, tempTempMatchIndex,
               tempMatchKey, matchKeyPri,
               i, iLength, j, jLength, k, kLength;
            //城市
            iLength = localData.length;
            for(var i=0; i<iLength; i++){
               tempCity = localData[i];
               tempMatch = tempCity.match;
               jLength = tempMatch.length;
               tempMatchIndex = -1;
               //关键字
               for(var j=0; j<jLength; j++){
                   tempKey = tempMatch[j];
                   //忽略大小写
                   if(ignore){
                       tempKey = tempKey.toLowerCase();
                   }
                   //找到最靠前的匹配
                   if( (tempTempMatchIndex = tempKey.indexOf(key)) > -1  && ((tempMatchIndex === -1) || (tempTempMatchIndex < tempMatchIndex)) ){
                       tempMatchIndex = tempTempMatchIndex;
                       tempMatchKey = tempKey;
                   }
               }
               if(tempMatchIndex > -1){
                   if(preSortFn){
                       preSortFn(tempCity, tempMatchKey, tempMatchIndex);
                   }
                   fData[fData.length] = tempCity;
               }
            }

            if(!fData.length){
                key = key.substr(0, key.length - 1);
                if(key !== ""){
                    fData = sub_matchData(key);
                }
                fData.matchFalid = true;
            }
            else{
                fData.matchLength = key.length;
            }

            return fData;
        }


        function matchData(key){

            var fData;
            //TODO:支持大小写
            if(ignore){
                key = key.toLowerCase();
            }
            //最小匹配
            fData = sub_matchData(key);

            beside.origin = key;
            if(fData.length){
                //排序
                if(sortFn){
                    fData.sort(sortFn);
                }
                //剔除多余的数
                if(max){
                    fData.splice(max, fData.length);
                }
                if(fData.matchFalid){
                    bulidTitleTips("对不起，找不到：" + processHighlight(key));
                }
                else{
                    bulidTitleTips(title);
                }
                bulidTableList(fData, key.substr(0, fData.matchLength));
            }
            else{
                bulidTitleTips("对不起，找不到：" + processHighlight(key));
                cleanList(tableWrapElem);
            }
            wrapIframe();


        }




        //处理高亮关键字
        function processHighlight(html, highLightKey){
            if(highlight){
                var hightlightWords = highLightKey ? highLightKey : output.val(),
                    hightlightReg = new RegExp(hightlightWords, "g" + (ignore ? "i" : ""));
                return  html.replace(
                            /(>|^)([^>^<]+)(<|$)/g,
                            function($reg){
                                return $reg.replace(hightlightReg, function($mac){
                                    return '<span class="' + highlightClass + '">' + $mac + '</span>';
                                } )
                            });
            }
            else{
                return html;
            }

        }

        // down 40
        // up 38

        beside.on(
            "keyup",
            function(e) {
                var that = fish.getTarget(e),
                    key = getKey(e),
                    tray = tableWrapElem,
                    theValue,
                    handledUrl;
                theValue = output.val();
                if(theValue === "" || theValue === param.placeholder) {
                    output.hide();
                    //空白或这等于holder时，不显示
                    return;
                }
                else{
                    output.show();
                }

                if(key === 13) {
                    var list = fish.all("." + itemClass, tray);
                    param.submit && param.submit(output);
                    if(printData[tray.index]){
                        beside.val(itemValueFn.call(list[tray.index], printData[tray.index], tray.index));
                    }
                    output.hide();
                }else if(key === 40 || key === 38) {
                    highlightClassItem(key, tray, beside);
                }else {
                    handledUrl = url && url.call(output, theValue);
                    if(handledUrl){
                        //异步调取数据
                        ajaxToGetData(handledUrl);
                    }
                    else{
                        //模糊匹配查询
                        matchData(theValue);
                    }
                }

            }
        );




        wrap.on(
            "mouseover",
            function(e) {
                var that = fish.getTarget(e),
                    row,
                    list,
                    tray = tableWrapElem;
                    list = fish.all("." + itemClass, tray);
                while(that !== null) {
                    row = fish.one(that);
                    if(row.hasClass(itemClass)) {
                        list.removeClass(hoverClass);
                        list.each(
                            function(ele, index) {
                                if(ele === that && fish.one(that).hasClass(enableClass)) {
                                    row.addClass(hoverClass);
                                    tray.index = index;
                                    beside.val(itemValueFn.call(list[tray.index], printData[tray.index], tray.index));
                                    return false;
                                }
                            }
                        );
                        break;
                    }
                    that = that.parentNode;
                }

            }
        );

        wrap.on(
            "click",
            function(e) {
                var that = fish.getTarget(e),
                    row,
                    list,
                    tray = tableWrapElem;
                    list = fish.all("." + itemClass, tray);
                while(that !== null) {
                    row = fish.one(that);
                    if(row.hasClass(itemClass)) {
                        list.each(
                            function(ele, index) {
                                if(ele === that && fish.one(that).hasClass(enableClass)) {
                                    row.addClass(hoverClass);
                                    tray.index = index;
                                    beside.val(itemValueFn.call(list[tray.index], printData[tray.index], tray.index));
                                    return false;
                                }
                            }
                        );
                        output.hide();
                        break;
                    }
                    that = that.parentNode;
                }

            }
        );

        fish.one(".autofill_close", wrap).on("click", function(){
            output.hide();
        })

        beside.on("mousedown", function(){
            elemTouch = true;
        });
        beside.on("mouseup", function(){
            elemTouch = false;
        });

        wrap.on("mousedown", function(){
            elemTouch = true;
        });
        wrap.on("mouseup", function(){
            elemTouch = false;
        });

        beside.on(
            "focus",
            function(e) {
                var that = fish.getTarget(e);
                if(fish.trim(that.value) === param.placeholder) {
                    that.value = "";
                    fish.one(that).removeClass(emptyClass);
                }
            }
        );

        beside.on(
            "blur",
            function(e) {
                var that = fish.getTarget(e);
                if(!fish.trim(that.value) || fish.trim(that.value) === param.placeholder) {
                    that.value = param.placeholder;
                    fish.one(that).addClass(emptyClass);
                }
                setTimeout(function(){
                    if(!elemTouch){
                        output.hide();
                        elemTouch = false;
                    }
                }, 0);
            }
        );

        fish.one(window).on(
            "resize",
            function() {
                output.resetPosition();
            }
        );



        // 静态定位函数
        function positionWrap(wrap, beside, offset) {
            if (wrap && wrap[0].nodeType === 1 && beside && beside[0].nodeType === 1) {

                var viewWidth = fish.one(window).width(),
                    viewHeight = fish.one(window).height(),
                    besideWidth = beside.width(),
                    besideHeight = beside.height(),
                    wrapWidth = wrap.width(),
                    wrapHeight = wrap.height(),
                    besideOffset = beside.offset(),
                    scrollTop = fish.one(document).scrollTop(),
                    scrollLeft = fish.one(document).scrollLeft(),
                    temp;

                if (offset && !isemptyClass(offset)) {
                    offset.x = typeof offset.x === "number" ? offset.x : 0;
                    offset.y = typeof offset.y === "number" ? offset.y : 0;
                } else {
                    var offset = {
                        x: 0,
                        y: 0
                    }
                }

                if (
                    (temp = besideOffset.left - scrollLeft) > viewWidth - (besideOffset.left - scrollLeft) &&
                    viewWidth - (besideOffset.left - scrollLeft) < wrapWidth
                  ) {
                    wrap.css("left:" + (besideOffset.left + besideWidth - wrapWidth - offset.x) + "px");
                } else {
                    wrap.css("left:" + (besideOffset.left + offset.x) + "px");
                }

                wrap.css("top:" + (besideOffset.top + besideHeight + offset.y) + "px");

            } else {
                throw new Error("需要指定输入域和/或及其弹框！");
            }
        }

        // 实时定位函数
        function rePositionWrap(wrap, beside, offset) {
            if (    (!wrap || wrap.hasClass("none")) &&
                    beside &&
                    beside[0].nodeType === 1 ) {
                return;
            }

            if (offset && !isemptyClass(offset)) {
                offset.x = typeof offset.x === "number" ? offset.x : 0;
                offset.y = typeof offset.y === "number" ? offset.y : 0;
            } else {
                var offset = {
                    x: 0,
                    y: 0
                }
            }

            beside[0].positionTimer && clearTimeout(beside[0].positionTimer);
            beside[0].positionTimer = setTimeout(function () {
                    positionWrap(wrap, beside, offset);
                },
                100
            );
        }



        function highlightClassItem(key, tray, beside) {
            var list = fish.all("." + itemClass, tray),
                last = list.length - 1;

            if(!list.length) {
                // 无列表
                return;
            }

            list.removeClass(hoverClass);

            switch(key) {
                case 40:
                    do{
                        tray.index++;
                    }
                    while(list[tray.index] && !fish.one(list[tray.index]).hasClass(enableClass));

                    if(tray.index > last){
                        tray.index = -1;
                        beside.val(beside.origin);
                    }
                    else{
                        fish.one(list[tray.index]).addClass(hoverClass);
                        beside.val(itemValueFn.call(list[tray.index], printData[tray.index], tray.index));
                    }

                break;
                case 38:
                    do{
                        tray.index--;
                    }
                    while(list[tray.index] && !fish.one(list[tray.index]).hasClass(enableClass));


                    if(tray.index === -1) {
                        beside.val(beside.origin);
                    }else if(tray.index < -1){
                        tray.index = last;
                        fish.one(list[tray.index]).addClass(hoverClass);
                        beside.val(itemValueFn.call(list[tray.index], printData[tray.index], tray.index));
                    }
                    else{
                        fish.one(list[tray.index]).addClass(hoverClass);
                        beside.val(itemValueFn.call(list[tray.index], printData[tray.index], tray.index));
                    }

                break;
            }


        }

        function cleanList(tray) {
            tray.index = originIndex;
            var list = fish.all("." + itemClass, tray),
                l = list.length;
            while(l-- > 0) {
                tray.deleteRow(-1);
            }
        }
        output.macth = function(){
            matchData(output.val());
        }
        output.hide = function(){
            wrap.css("display:none");
        }
        output.show = function(){
            if(wrap.getCss("display") === "none"){

                wrap.css("display:block");
                output.resetPosition();
                wrapIframe();
            }
        }
        output.setTitle = function(title){
            titleWrap.html(title);
        }
        output.val = function(value){
            if(value !== undefined){
                beside.val(value);
            }
            else{
                return fish.trim( beside.val(value) );
            }
            
        }
        output.resetPosition = function(){
            positionWrap(wrap, beside, offset);
        }
        output.requestUrl = function(urlFn){
            if(typeof urlFn === "function"){
                url = urlFn;
            }
        }
        output.localData = localData;


        return output;
    }


    // 是否空对象（非内置对象）
    function isemptyClass(o) {
        for (var p in o) {
            return false;
        }
        return true;
    }

    // 获得键值
    function getKey(e) {
        e = fish.getEvent(e);
        if(e.which) {
            return e.which;
        }else {
            return e.keyCode;
        }
    }


    fish.extend({autoComplete:main});
}())