/**
 * 日历组件，代码就重构版本
 * @creata 2012-11-28
 */
;(function () {


    var
    specialDate = {
        //2013
        "2013-01-01":{name: "元旦"},
        "2013-02-09":{name: "除夕"},
        "2013-02-10":{name: "春节"},
        "2013-02-24":{name: "元宵"},
        "2013-04-04":{name: "清明"},
        "2013-05-01":{name: "5.1"},
        "2013-06-01":{name: "6.1"},
        "2013-06-12":{name: "端午"},
        "2013-08-13":{name: "七夕"},
        "2013-09-19":{name: "中秋"},
        "2013-10-01":{name: "国庆"},
        "2013-12-25":{name: "圣诞"},
        //2014
        "2014-01-01":{name: "元旦"},
        //2012
        "2012-04-04":{name: "清明"},
        "2012-05-01":{name: "5.1"},
        "2012-06-01":{name: "6.1"},
        "2012-06-23":{name: "端午"},
        "2012-08-23":{name: "七夕"},
        "2012-09-30":{name: "中秋"},
        "2012-10-01":{name: "国庆"},
        "2012-12-25":{name: "圣诞"}
    },
    cache = {}, //缓存日历对象
    gIsIe6 = fish.browser("ms",6),
    gIsIe7 = fish.browser("ms",7),
    dayString = "日一二三四五六";

    //当窗口缩放时，日历的位置进行相应的变化
    fish.one(window).on("resize",function(){
        //return;
        for(var key in cache){
            if(cache.hasOwnProperty(key)){
                var each = cache[key],
                    eachCal,
                    isShow;
                if(each.__calElem){
                    eachCal = fish.one(each.__calElem);
                    if(gIsIe6 || gIsIe7){//在ie6,7下，第一次选日期。会触发resize事件。导致日历关闭不了
                        setTimeout(function(){
                            isShow = eachCal.getCss("display") == "none"? false :true;
                            if(isShow){
                                //重新定位
                                each.show(false,true);
                            }
                        },0);
                    }else{
                        isShow = eachCal.getCss("display") == "none"? false :true;
                        if(isShow){
                            //重新定位
                            each.show(false,true);
                        }
                    }

                }

            }
        }

    });



    /**
    * 控制文本使用权限
    * @param {Object} e 控制对象
    */
    function preventInput(query) {
        fish.all(query ? query : this).each(function (e) {
            if (!e.getAttribute("_preventInput_")) {
                e.style.imeMode = "disabled";
                e.onkeydown = function (e) {
                    fish.preventDefault(e);
                }
                e.oncontextmenu = function () { return false; }
                e.onselectstart = function () { return false; }
                e.setAttribute("_preventInput_", "true");
            }
        })
    }
    function recoverInput(query) {
        fish.all(query ? query : this).each(function (e) {
            if (e.getAttribute("_preventInput_")) {
                e.style.imeMode = "";
                e.onkeydown =
                e.oncontextmenu =
                e.onselectstart = null;
                e.setAttribute("_preventInput_", "");
            }
        })
    }

    //exct fish.html
    function fish_create(str){
        var elem = document.createElement("div"), childs = [];
        fish.all(elem).html(str);
        for(var i=0;i<elem.childNodes.length; i++){
            if(elem.childNodes[i].nodeType === 1){
                childs.push(elem.childNodes[i]);
            }
        }
        elem = null;
        return fish.all(childs);
    }

    //计数器
    var calCount = 0;

    //日历主入口函数
    function main(param){
        var param = param || {},
            nfn = function(){};
        //默认参数
        var defParam = {
            css: "",
            width:0,
            height:0,
            open: false,
            startTime: fish.parseTime(new Date()),
            endTime: "2099-01-01",
            inputElem: fish.dom(this),
            formatInputElemAtStart : false, //是否一开始标准化input中的值
            showPast: false,
            showDay : false,
            now: fish.parseTime(new Date()),
            focus:fish.parseTime(new Date()),  //当前日历的起一个月份
            eachHeight: 28, //单元格的高度包括边框
            eachWidth: 28, //单元格的宽度包括边框
            monthNum: 2, //显示几个月份
            ajaxUrl: "",
            bodyTemp:'<iframe class="if" src="http://img1.40017.cn/cn/new_ui/public/images/png_cover.png"></iframe><div class="date"><div class="top clearfix"></div><div class="calCanvas"></div></div>',
            titleTemp:'<div class="floatL monthTitle"><h4 class="lastText  mCalTitleFir" ><span class="date_title">...</span></h4></div>',
            prevBtnTemp:'<span class="lastMonthBg date_lastSpan"><span class="lastMonth"></span></span>',
            nextBtnTemp:'<span class="nextMonthBg date_nextSpan"><span class="nextMonth"></span></span>',
            cache:{},//缓存数据
            __ajaxObjs:{},//存放正在发异步的列表
            fn: nfn,
            ajaxFn: nfn,
            monthChangeStyle:"",
            _monthTimes : 1, //生成的月份的数量
            mouseover : nfn,
            mouseout : nfn,
            beforeOpen : nfn,
            afterClose : nfn,
            beforePrevFn : nfn, //切换到上个月前的回调
            afterPrevFn : nfn,//切换到上个月后的回调
            beforeNextFn: nfn,//切换到下个月前的回调
            afterNextFn : nfn,//切换到上个月后的回调
            processDataFn : nfn,
            dateTempleteFn : nfn,
            dateClickAbleFn:nfn,//某个日期是否能点
            fillBlank:false,//是否将月的前后前后用上个，下个月的内容,若preLoadingUserData：true则会填充用户数据内容，false则只输出日期
            preLoadingUserData:false,//是否预加载前后两个月的数据
            calTitleFn:false//自定义日历头部字符串

        };

        //创建
        var newCal = fish.lang.proto(mCalFn);
        //扩展默认参数
        fish.lang.extend(defParam, param);
        //扩展参数到新日历对象
        fish.lang.extend(newCal, defParam);
        return newCal.init(param);

    }

    // 获取一个月有几天
    function getMonthDays(time){
        var testDate = fish.parseDate(time, {months:1});
        testDate.setDate(0);
        return testDate.getDate();
    }

    //判断当月的第一天是星期几,
    function getFirstDay(time,returnType){
        var testDate = fish.parseDate(time);
        testDate.setDate(1);
        returnType = returnType||"chinese";
        if(returnType == "chinese"){
            return dayString.charAt(testDate.getDay());
        }else if(returnType == "number"){
            return testDate.getDay()
        }

    }

    //检测是否是特殊日期
    function getSpecDate(time){
        return specialDate[fish.parseTime(time)];
    }



    //获取有效日期
    function getValidDateInMonth(time, startTime, endTime){
        var upDate = fish.parseDate(time),
            downDate = fish.parseDate(time),
            startDate = fish.parseDate(startTime),
            endDate = fish.parseDate(endTime);

        //设置为第一天
        upDate.setDate(1);
        upDate.setHours(0);
        upDate.setMinutes(0);
        //设置为这个月最后一天
        downDate.setDate(getMonthDays(time));
        downDate.setHours(23);
        downDate.setMinutes(59);
        var upNum = upDate.getTime(),
            downNum = downDate.getTime(),
            startNum = startDate.getTime(),
            endNum = endDate.getTime(),
            numArray = [upNum, downNum, startNum, endNum].sort(function(a,b){return a-b});
        //截取区间
        if(numArray[1] === endNum || numArray[1] === downNum){
            //全部无效的日期
            return {start:0, end:0};
        }
        else{


            return {start:new Date(numArray[1]).getDate(), end:new Date(numArray[2]).getDate()};
        }
    }

    //日历对象的方法
    mCalFn = {
        //初始化
        init : function(param){
            var that = this;
            //检查已经绑定的日历
            if (this.inputElem && (this.id = fish.all(this.inputElem).attr("data-mcalid")) && cache[this.id] ) {
                cache[this.id].set(param);
                if(this.open){
                    cache[this.id].show();
                }
                return cache[this.id];
            }
            else{
                var browser = fish.browser(), changeStyle;
                if(browser.name === "ms" && browser.version < 9){
                    changeStyle = "static";
                }
                else{
                    changeStyle = "scroll";
                }

               //console.log("#242 the style is " + this.monthChangeStyle)
                this.monthChangeStyle = this.monthChangeStyle ? this.monthChangeStyle : changeStyle;

                //创建的月份倍数
                this._monthTimes = (this.monthChangeStyle === "scroll"? 3 : 1);

                this.id = ++calCount;
                this.__inputElem = fish.all(this.inputElem);
                this.__inputElem.attr("data-mcalid", this.id);
                //日历大节点

                this.__calElem = fish_create("<div id='mCalendar" + this.id + "' class='mCalendar' style='position:absolute;display:block;top:0px;left:-1000px'></div>");

                //添加到父节点
                fish.one("body").html("top", this.__calElem);


                this.__calElem.html("top", this.bodyTemp);
                //日历头部节点
                this.__topElem = fish.all(".top", this.__calElem);
                //左右月份按钮
                this.__topElem.html("top", this.prevBtnTemp);
                this.__topElem.html("top", this.nextBtnTemp);

                this.__canvasElem = fish.one(".calCanvas", this.__calElem);

                //月份对象的数组
                this.month = [];
                this.__monthHolderElem = fish.one(".date", this.__calElem);
                //日历头部  年月  的节点
                for(var i=0; i<this.monthNum; i++){
                    this.__topElem.html("top", this.titleTemp);
                }



                this.__monthTitleElem = fish.all(".monthTitle", this.__topElem);

                this._setNowAndFoucs();

                var monthWidth, monthHeight,
                    cMonthNum = this.monthNum * (this.monthChangeStyle === "static" ? 1 : 3),
                    subMonthNum = (this.monthChangeStyle === "static" ? 0 : this.monthNum);


                for(var i=0; i<cMonthNum; i++){
                    (function(index){
                        that.month[i] = new mMonth({//缓存了几个月的面板
                            width: monthWidth ? monthWidth : 0,
                            height : monthHeight ? monthHeight : 0,
                            cal : that,//日历对象
                            now : that.now,
                            today:fish.parseTime(),
                            month: fish.parseTime(that.focus, {months:i-subMonthNum}),
                            eachHeight:that.eachHeight,
                            eachWidth:that.eachWidth,
                            startTime : that.startTime,
                            endTime:that.endTime,
                            processDataFn : that.processDataFn,
                            dateTempleteFn : that.dateTempleteFn,
                            dateClickAbleFn:that.dateClickAbleFn,
                            showPast : that.showPast,
                            dataUrl : that.ajaxUrl,
                            fn:function(time){
                                that._setFn(time,index);
                            }, //日期点击的回调
                            mouseover:that.mouseover,
                            mouseout:that.mouseout,
                            fillBlank:that.fillBlank,
                            preLoadingUserData:that.preLoadingUserData,
                            __ajaxObjs:that.__ajaxObjs
                        });
                        that.month[i].insertTo(that.__canvasElem);
                        monthWidth = that.month[i].width;
                        monthHeight = that.month[i].height;
                    })(i);

                }

                this.monthGroup = {
                    a : [],
                    b : [],
                    c : [],
                    //设置中心聚焦月份的第一个月份对象，刚好等于要展示的月份数
                    prev:"a",
                    focus:"b",
                    next : "c"
                };
                //封装一下
                if(this.monthChangeStyle === "static"){
                    //不做切换效果了，直接设置，当然也不好做预加载了
                    for(var i=0; i<this.month.length; i++){
                        this.monthGroup.b.push(this.month[i]);
                    }
                }
                else if(this.monthChangeStyle === "scroll"){
                     //<<-----设置月份切换组，可以做各种切换效果
                    for(var i=0; i<this.month.length; i++){
                        if(i<this.monthNum){
                            this.monthGroup.a.push(this.month[i]);
                        }
                        else if(i<this.monthNum*2){
                            this.monthGroup.b.push(this.month[i]);
                        }
                        else{
                            this.monthGroup.c.push(this.month[i]);
                        }
                    }
                    //设置月份切换组，可以做各种切换效果----->>
                }



                this.set({}, true);

                //因为宽度需要月份初始化才能得到
                this.__monthTitleElem.css("width:" + this.month[0].width + "px");


                this.__prevBtn = fish.one(".lastMonthBg", this.__calElem).on("click", function(){
                    this.beforePrevFn && this.beforePrevFn.call(that);
                    that.goPrev();
                });
                this.__nextBtn = fish.one(".nextMonthBg", this.__calElem).on("click", function(){
                    this.beforeNextFn && this.beforeNextFn.call(that);
                    that.goNext();
                });
                //关联元素的点击
                fish.all(this.elem).on("click",function(){
                    that.show();
                });
                this.__inputElem.on("focus", function(){
                   that.show();
                });
                this.__inputElem.on("mousedown", function(){
                    that._calElemTouch = true;
                });
                this.__inputElem.on("mouseup", function(){
                    that._calElemTouch = false;
                });
                this.__inputElem.on("blur", function(){

                    setTimeout(function(){
                        if(!that._calElemTouch){
                            that.hide();
                            this._calElemTouch = false;
                        }
                    }, 0);
                });

                var all = fish.all([fish.dom(this.__calElem), fish.dom(this.__inputElem)]);
                //如果有相关联的元素
                if (this.elem) {
                    all[all.length] = fish.dom(this.elem);
                    all.length++;
                }

                function interFn(){
                    //that.show();
                    fish.dom(that.__inputElem).blur();
                }
                //没有点击到日历相关的元素就 隐藏 日历
                switch (this.showType){
                    case "pop":
                        break;
                    case "static":
                        break;
                    default:
                        this.__calElem.effect({type:"click", elem:all, interShow: false, interFn:interFn});
                }


                this.__calElem.on("mousedown", function(){
                    that._calElemTouch = true;
                });
                this.__calElem.on("mouseup", function(){
                    that._calElemTouch = false;
                });
                //设置宽高
                that.setWH();
                if(that.open){
                    that.show(false,true);
                }
                else{
                    that.hide();
                }
                //缓存
                return cache[this.id] = this;

            }
        },
        setWH:function(){
            //获取本身的框高
            var newW = this.month[0].width * this.monthNum,
                that = this;
            this.__canvasElem.css("width:" + newW + "px;height:" + this.month[0].height + "px");

            this.show(true);

//            this.height = this.__topElem.height() + this.__canvasElem.height();//有时会算的不准
            this.height =this.__topElem.height() + 25 + 6*(this.eachHeight+2 +1);
//            console.log(this.height);
            this.__monthHolderElem.css("width:" + newW + "px;height:" + this.height + "px");


            this.width = newW + 4;
            this.height = this.height + 4;
            fish.one("iframe", this.__calElem).css("width:" + this.width + "px;height:" + this.height + "px");
            this.__calElem.css("width:" + this.width + "px;height:" + this.height + "px");

            this.hide();
        },
        _setNowAndFoucs:function(){
            var focusDate;
            this.now = fish.parseTime(fish.one(this.inputElem).val());
            if(this.formatInputElemAtStart){
                fish.one(this.inputElem).val( this.now );
            }
            focusDate = fish.parseDate(this.now);
            focusDate.setDate(1);
            //设置成第一天
            this.focus = fish.parseTime(focusDate);
        },
        set:function(param, disableSetMonth){
            var subMonthNum = (this.monthChangeStyle === "static" ? 0 : this.monthNum);
            //扩展一下
            var param = param || {}, that = this;
            fish.lang.extend(this, param);
            this._setNowAndFoucs();

            this.setMonthTitle();


            if(!disableSetMonth){


                for(var i=0; i<this.month.length; i++){
                    (function(index){
                        that.month[i].setDate({
                            now : that.now,
                            today:fish.parseTime(),
                            month: fish.parseTime(that.focus, {months:i-subMonthNum}),
                            startTime : that.startTime,
                            endTime:that.endTime,
                            showPast : that.showPast,
                            processDataFn : that.processDataFn,
                            dateTempleteFn : that.dateTempleteFn,
                            dateClickAbleFn:that.dateClickAbleFn,
                            dataUrl : that.ajaxUrl,
                            fn:function(time){
                                that._setFn(time,index);
                            }, //日期点击的回调
                            mouseover:that.mouseover,
                            mouseout:that.mouseout
                        })
                    })(i);
                }


            }

            if(this.monthChangeStyle === "static"){
                //不做切换效果了，直接设置，当然也不好做预加载了
                this._setStatic();
            }
            else if(this.monthChangeStyle === "scroll"){
                this._setScroll();
            }

            this.monthGroup[this.monthGroup.focus].forEach(function(monthObj, ii){
                monthObj.setUserDate();
            });

        },
        _setFn:function(time,monthIndx){
            var that = this,
                dItemElem;//选中的那天的dom元素
            this.month.forEach(function(month){
                //清除被选择的日期
                month.setNow(time);

            });
            dItemElem =  this.month[monthIndx].getItemElem(fish.parseDate(time).getDate(),fish.parseDate(time).getMonth()+1);
            this.setValue(time);
            setTimeout(function(){
                that.hide();
            }, 0);
            this.fn && this.fn.call(this, time,dItemElem);
        },
        //设置当前日期值
        setValue:function(value){
            this.now = fish.parseTime(value);
            this.__inputElem.val(this.now);
        },
        //设置月份
        setMonth:function(group, month, loadUserDate){
            this.monthGroup[this.monthGroup[group]].forEach(function(monthObj, ii){
                monthObj.setDate({ month : fish.parseTime(month, {months:ii}) });
            });
        },
        //设置月份的自定义数据
        setMonthUserDate:function(group, month){
            this.monthGroup[this.monthGroup[group]].forEach(function(monthObj, ii){
                monthObj.setUserDate();
            });
        },
        //显示
        show:function(outsideofwindow, notUpdate){
            var top = 0,
                left = 0,
                that = this;
            if(outsideofwindow){
                //计算宽度时
                this.__calElem.css("position:absolute;display:block;top:0px;left:-1000px");
            }
            else{
                var coord = fish.one(this.inputElem).offset(),
                    txtH = fish.one(this.inputElem).height(),
                    viewWidth = fish.one(window).width(),
                    calWidth = this.width,
                    leftDistance;
                switch (that.showType){
                    case "pop":
                        fish.all(that.__calElem).css("position:static;");
                        fish.require("mPop", function () {
                            if (fish.all(that.__calElem).getCss("display") !== "block") {
                                fish.all(that.__calElem).css("display:block;");
                            }
                            fish.mPop({
                                content: that.__calElem,
                                afterClose: function () {
                                    fish.all(that.__calElem).css("display:none;");
                                }
                            })

                        });
                        break;
                    case "static":
                        fish.all(that.__calElem).css("position:relative;display:block;left:0;");
                        fish.one(that.inputElem).css("display:block").html("top", that.__calElem);
                        break;
                    default:
                        if (viewWidth - coord.left >= calWidth + 20) {
                            leftDistance = coord.left
                        } else {
                            leftDistance = coord.left - 20 - (calWidth - (viewWidth - coord.left));
                        }
                        top = coord.top + txtH;
                        left = leftDistance;
                    break;
                }
                
                if(!notUpdate){
                    this.set();
                }
                setTimeout(function(){
                    that.__calElem.css("display:block;top:" + top + "px;left:" + left  + "px");
                }, 0)

            }

        },
        //隐藏
        hide:function(){
            //console.trace();
            switch (this.showType){
                case "pop":
                    fish.require("mPop", function () {
                        fish.mPop.close();

                    });
                    break;
                case "static":
                        break;
                default :
                    this.__calElem.css("display:none");
                    break;
            }

            if(this.afterClose && typeof(this.afterClose) === "function"){
                this.afterClose.call(this);
            }

        },
        //切换到上个月
        goPrev:function(){

            this.focus = fish.parseTime(this.focus, {months:-this.monthNum});

            if(this.monthChangeStyle === "static"){
                this.setMonth("focus", this.focus);
                this.setMonthUserDate("focus", this.focus);
            }
            else if(this.monthChangeStyle === "scroll"){

                var newMonthTime =  fish.parseTime(this.focus, {months:-this.monthNum});
                this._scrollPrev();
                this.setMonth("prev", newMonthTime);
                this.setMonthUserDate("focus", newMonthTime);
            }

            this.setMonthTitle();
            this.afterPrevFn && this.afterPrevFn.call(this);
        },
        //切换到下个月
        goNext:function(){

            this.focus = fish.parseTime(this.focus, {months:this.monthNum});

            if(this.monthChangeStyle === "static"){
                this.setMonth("focus", this.focus);
                this.setMonthUserDate("focus", this.focus);
            }
             else if(this.monthChangeStyle === "scroll"){
                var newMonthTime =  fish.parseTime(this.focus, {months:this.monthNum});
                this._scrollNext();
                this.setMonth("next", newMonthTime);
                this.setMonthUserDate("focus", newMonthTime);
            }

            this.setMonthTitle();
            this.afterNextFn && this.afterNextFn.call(this);
        },
        //用于滚动的样式
        _monthStyle:(function(){
            var browser = fish.browser();
            if(browser.name === "ms" && browser.version < 9){
                return function(value){
                    return "left:" + value + "px";
                }
            }
            else{
                return function(value){
                    return  "-webkit-transform:translateX(" + value + "px);" +
                            "-ms-transform:translateX(" + value + "px);" +
                            "-moz-transform:translateX(" + value + "px);" +
                            "-o-transform:translateX(" + value + "px);";
                }
            }
        })(),
        _scrollTo:function(group, position){
            var px = 0, z = 0, that = this, lastGroup = this.monthGroup[group];
            switch(position){
                case "prev":
                    px = -this.monthNum;
                    //为了要被前面的月份挡住，需要调低z
                    group === "next" ?  (z = 0) : (z = 1);
                    break;
                case "next":
                    px = this.monthNum;
                    //为了要被前面的月份挡住，需要调低z
                    group === "prev" ?  (z = 0) : (z = 1);
                    break;
                case "focus":
                    z = 2;
                    break;
            }
            this.monthGroup[lastGroup].forEach(function(monthObj, ii){
                monthObj.css(that._monthStyle((ii + px) * monthObj.width));
                monthObj.z(z);
            });
        },
        //设置滚动
        _setScroll:function(){
            this.monthGroup.prev = "a";
            this.monthGroup.focus = "b";
            this.monthGroup.next = "c";
            //当前显示的月份
            this._scrollTo("focus", "focus");
            this._scrollTo("next", "next");
            this._scrollTo("prev", "prev");
        },
        //左右切换的代码
        _scrollPrev:function(){
            var cFocus = this.monthGroup.focus,
                cPrev = this.monthGroup.prev,
                cNext = this.monthGroup.next;
            this._scrollTo("focus", "next");
            this._scrollTo("next", "prev");
            this._scrollTo("prev", "focus");
            this.monthGroup.focus = cPrev;
            this.monthGroup.prev = cNext;
            this.monthGroup.next = cFocus;

        },
        //左右切换的代码
        _scrollNext:function(){
            var cFocus = this.monthGroup.focus,
                cPrev = this.monthGroup.prev,
                cNext = this.monthGroup.next;
            this._scrollTo("focus", "prev");
            this._scrollTo("next", "focus");
            this._scrollTo("prev", "next");
            this.monthGroup.focus = cNext;
            this.monthGroup.prev = cFocus;
            this.monthGroup.next = cPrev;
        },
        //静态的切换
        _setStatic:function(){
            var that= this;
            this.monthGroup.focus = this.monthGroup.prev = this.monthGroup.next =  "b";

            this.monthGroup.b.forEach(function(monthObj, ii){
                monthObj.css(that._monthStyle(ii * monthObj.width));
            });
        },
        setMonthTitle : function(){
            var that = this;
            this.__monthTitleElem.each(function(elem, ii){
                var date = fish.parseDate(that.focus, {months:ii}),
                    titleStr,
                    year = date.getFullYear(),
                    month = date.getMonth() + 1;
                //自定义日历头部字符串
                if(that.calTitleFn && typeof(that.calTitleFn) === "function"){
                    titleStr = that.calTitleFn.call(that,year,month);
                }else{
                    titleStr = year + "年" + month + "月";
                }
                fish.one(".date_title", elem).html(titleStr);
            })
        },
        setAjaxUrl:function(url){
            this.ajaxUrl = url;

        }
    }


    //每个月份的对象
    function mMonth(param){
        var param = param || {},
               nfn = function(){};
           //默认参数
            var defParam = {
                width:0, //日历对象的宽度
                cal:"",//相对应的日历对象
                now:"", //当前选中的日期
                today:"",
                tomorrow:"",
                month:fish.parseTime(new Date()), //当前月份
                eachHeight: 28, //单元格的高度包括边框
                eachWidth: 28, //单元格的宽度包括边框
                __elem:null,
                dataUrl : "",
                fn:nfn, //日期点击的回调
                ajaxFn : nfn, //异步回调
                showPast : false, //是否显示全部日期
                mouseover:nfn,
                mouseout:nfn,
                //月份节点的模板
                calTemp:(function(){
                    var temp = [], calday;
                    temp.push('<div class="contentTime clearfix"><table cellspacing="0" cellpadding="0" border="0" ><tbody><tr>');
                    dayString.split("").forEach(function(text){
                        temp.push('<th>' + text + '</th>');
                    });
                    temp.push('</tr>');
                    for(var a=0; a<6; a++){
                        temp.push('<tr calweek="' + (a + 1) + '">');
                        for(var b=0; b<7; b++){
                            calday = dayString.charAt(b);
                            temp.push('<td><div calday="' + calday + '" class="itemWrap ' + ( (calday === "六") ? "sat" : ((calday === "日") ? "sun" : "" ) ) + '"><span class="dateWrap">&nbsp;</span><div class="userWrap"></div></div></td>');
                        }
                        temp.push('</tr>');
                    }
                    temp.push('</tbody></table><i class="monthBg"></i></div>');
                    return temp.join("");
                })(),
                reloadData: false, //是否允许每次都重新加载异步数据
                startDate:1, //起始日期，日
                endDate:31, //终止日期，日
                firstDay: "", //第一天是周几
                processDataFn : nfn,
                dateTempleteFn : nfn,//自定义模板函数
                startTime:"1970-01-01", //可用起始日期
                endTime:"2099-01-01" //可用终止日期，如果大于这个月的最后一天，也不会有问题
            };

            //创建
            var newMonth = fish.lang.proto(mMonthFn);
            //扩展默认参数
            fish.lang.extend(defParam, param);
            //扩展参数到新日历对象
            fish.lang.extend(newMonth, defParam);
            newMonth.init();
            return newMonth;
    }
    //月份对象的方法
    mMonthFn = {
        init:function(){
            var that = this;


            if(!this.__elem){

                this.__elem = fish_create(this.calTemp);
                //日期格子节点
                this.__itemElems = fish.all(".itemWrap", this.__elem);
                this.__dateElems = fish.all(".dateWrap", this.__elem);
                this.__userElems = fish.all(".userWrap", this.__elem);

                //设置每个内容的宽高
                this.__itemElems.css("width:" + this.eachWidth + "px;height:" + this.eachHeight + "px");

                //背景
                this.__bgElem = fish.all(".monthBg", this.__elem);

                //设置第一天
                this.firstDay = getFirstDay(this.month);


                //设置宽高
                //this.__dateElems.css("width:" + this.eachWidth + "px;height:" + this.eachHeight + "px");

                this.setDate();
                //console.trace();
                //事件
                this.__itemElems
                .on("click", function(){
                    var uThis = fish.one(this),
                        day = uThis.attr("day"),
                        month = uThis.attr("month"),
                        year = uThis.attr("year"),
                       clickDate = fish.parseDate(year+"-"+month+"-"+day),
                        now;
                        clickDate.setDate(parseInt(day, 10));
                    if(uThis.hasClass("spanEnable") && day && !uThis.hasClass("clickDisable")){
                        now = fish.parseTime( clickDate );
                        that.fn && that.fn.call(that, now);

                    }
                })
                .hover(function(){
                        var it = fish.one(this),
                            uThis = fish.one(this),
                            day = uThis.attr("day"),
                            month = uThis.attr("month"),
                            year = uThis.attr("year"),
                            hoverDate = fish.parseDate(year+"-"+month+"-"+day),
                            nowDate = fish.parseDate(that.month),
                            lastMonthDate = fish.parseDate(nowDate,{months:-1}),
                            nextMonthDate = fish.parseDate(nowDate,{months:1}),
                            data,
                            hoveTimeStr;
                        if(hoverDate.getMonth() == nowDate.getMonth()){
                            data = that.formatData;
                        }else if(hoverDate.getMonth() == lastMonthDate.getMonth()){
                            data = that.lastMonthFormatData;
                        }else if(hoverDate.getMonth() == nextMonthDate.getMonth()){
                            data = that.nextMonthFormatData;
                        }
                        hoveTimeStr = fish.parseTime(hoverDate);
                        hoverDate.setDate(parseInt(day, 10));
                        if(it.hasClass("spanEnable")){
                                it.addClass("spanHover");
                        }

                        that.mouseover && that.mouseover.call(that, hoveTimeStr, this, data ? data[parseInt(day, 10) - 1] : undefined);
                    },function(){
                        var it = fish.one(this),
                            uThis = fish.one(this),
                            day = uThis.attr("day"),
                            month = uThis.attr("month"),
                            year = uThis.attr("year"),
                            nowDate = fish.parseDate(year+"-"+month+"-"+day),
                            now;
                        nowDate.setDate(parseInt(day, 10))
                        now =  fish.parseTime(nowDate);

                        that.mouseout && that.mouseout.call(that, now);

                        if(it.hasClass("spanEnable")){
                            it.removeClass("spanHover");
                        }
                })
            }
        },
        //挂载日历dom元素
        appendTo:function(parent){
            fish.one(parent).html("bottom", this.__elem);
            if(!this.width && !this.height){
//                this.width = this.__elem.width();//系统算的有点问题
//                this.height = this.__elem.height();
                this.width = (7* (this.cal.eachWidth + 2) + 7 + 2);//itemWrap有左右的padding
                this.height =25 + 6*(this.cal.eachHeight+2 +1);//25为星期的高度
            }

            this.__bgElem.css("width:" + this.width + "px;height:" + this.height + "px");

        },
        //在某个元素前插入节点
        insertTo:function(parent,isHide){
            fish.one(parent).html("top", this.__elem);
            if(!this.width && !this.height){
//                this.width = this.__elem.width();//系统算的有点问题
//                this.height = this.__elem.height();
                this.width = (7* (this.cal.eachWidth + 2) + 7 + 2);//itemWrap有左右的padding
                this.height =25 + 6*(this.cal.eachHeight+2 +1);//25为星期的高度
            }
            this.__bgElem.css("width:" + this.width + "px;height:" + this.height + "px;line-height:" + this.height + "px");
        },
        //设置样式值
        css:function(value){
            this.__elem.css(value);
        },
        z:function(value){
            this.__elem.css("z-index:" + value);
        },
        //设置日历可用日期
        _setValidDate:function(){
            var validDate = getValidDateInMonth(this.month, this.startTime, this.endTime);
            this.startDate = validDate.start;
            this.endDate = validDate.end;
        },
        //设置日期
        setDate:function(param){
            //扩展一下
            var param = param || {}, that = this;
            fish.lang.extend(this, param);

            //标准化为当月第一天
            var firstD = fish.parseDate(this.month);
            firstD.setDate(1);
            this.month = fish.parseTime(firstD);
            this.monthIndex = fish.parseDate(this.month).getMonth() + 1;

            this.tomorrow =  fish.parseTime(this.today, {days:1});

            this._setValidDate();


            var firstDay = getFirstDay(this.month),
                firstDayNum = getFirstDay(this.month,"number"),
                lastMonth = fish.parseTime(this.month,{months:-1}),
                nextMonth = fish.parseTime(this.month,{months:1}),
                printMonthD,
                printDate = 0,
                printTime = "",
                startPrint = false,
                stopPrint = false,
                printStatus,
                PRINT_LASTMONTH = -1,
                PRINT_NOWMONTH = 0,
                PRINT_NEXTMONTH = 1,
                specDate,
                thisItem,
                thisDate,
                lastDate = getMonthDays(this.month),
                lastMonthDays = getMonthDays(lastMonth),
                last;
            if(that.fillBlank){
                if(firstDayNum == 0){//上个月一天都不用打印
                    printStatus = PRINT_NOWMONTH;
                    printDate = 0;
                    printMonthD = firstD;

                }else{
                    printStatus = PRINT_LASTMONTH;
                    printDate = lastMonthDays-firstDayNum;
                    printMonthD = fish.parseDate(lastMonth);

                }
            }else{
                printStatus = PRINT_NOWMONTH;
                printDate = 0;
                printMonthD = firstD;
            }

            //this.__itemElems.removeClass("spanNow spanDate spanEnable spanHover spanSpec");
            //this.__itemElems.attr("day", "");
            //this.__dateElems.html("");
            this.__itemElems.each(function(elem, ii){
                thisItem = fish.one(that.__itemElems[ii]);
                thisDate = fish.one(that.__dateElems[ii]);
                thisItem.removeClass("spanNow spanDate spanEnable spanHover spanSpec");

                //判断1号
                if(that.fillBlank||((startPrint || fish.one(elem).attr("calday") === firstDay) && !stopPrint)){

                    startPrint = true;
                    printDate++;

                    //调整printDate,调整打印状态
                    if(that.fillBlank){
                        if(printStatus == PRINT_LASTMONTH){
                            if(printDate > lastMonthDays){
                                printStatus = PRINT_NOWMONTH;
                                printDate = 1;
                                printMonthD = firstD;
                            }
                        }
                       else if(printStatus == PRINT_NOWMONTH){
                            if(printDate > lastDate){
                                printStatus = PRINT_NEXTMONTH;
                                printDate = 1;
                                printMonthD = fish.parseDate(nextMonth);
                            }
                        }
                    }

                    printMonthD.setDate(printDate);

                    printTime = fish.parseTime(printMonthD);
                    specDate = getSpecDate(printTime);
                    if(printStatus!==PRINT_NOWMONTH){
                        thisItem.addClass("notCurMonthDay");
                    }else{
                        thisItem.removeClass("notCurMonthDay");
                    }
                    //当前选中的日期
                    if(printTime === that.today){
                        thisItem.addClass("spanSpec");
                        specDate = {name:"今天"};
                    }
                    else if(printTime === that.tomorrow){
                        thisItem.addClass("spanSpec");
                        specDate = {name:"明天"};
                    }
                    else if(printTime === that.now){
                        thisItem.addClass("spanNow");
                    }
                    //每天的日期
                    thisItem.attr("day", printDate);
                    thisItem.attr("month", printMonthD.getMonth()+1);
                    thisItem.attr("year", printMonthD.getFullYear());


                    if(specDate){
                        thisDate.html(specDate.name);
                    }
                    else{
                        thisDate.html(printDate);
                    }

                    thisItem.addClass("spanDate");
                    //this.startTime, this.endTime this.month
                    //可以被使用的日期 ||that.fillBlank
                    if((!that.fillBlank && that.startDate <= printDate && printDate <= that.endDate) || that.showPast){
                        thisItem.addClass("spanEnable");
                        if(specDate){
                            thisItem.addClass("spanSpec");
                        }
                    }else if((that.fillBlank && fish.parseTime(printMonthD) >=fish.parseTime(that.startTime) && fish.parseTime(printMonthD) <=fish.parseTime(that.endTime)) || that.showPast){//今天之后的下个月能点击
                        thisItem.addClass("spanEnable");
                        if(specDate){
                            thisItem.addClass("spanSpec");
                        }

                    }
                    //到月底了
                    if(lastDate === printDate){
                        stopPrint = true;
                    }


                }
                else{
                    thisDate.html("");
                    thisItem.attr("day", "");
                }


            });

            this.setNow(this.now);

            this.__bgElem.html(this.monthIndex);
        },
        setNow:function(time){
            time = time == ""?fish.one(this.cal.__inputElem).val():time;
            var setDate = fish.parseDate(time),
                nowDate = fish.parseDate(this.month),
                nowElem;
            this.clearNow();
            if(setDate.getFullYear() === nowDate.getFullYear() && setDate.getMonth() === nowDate.getMonth()){
                this.__itemElems.each(function(elem){
                    var thisone = fish.one(elem);
                    if(thisone.attr("day") ==  setDate.getDate() && thisone.attr("month") ==  setDate.getMonth()+1 ){
                        thisone.addClass("spanNow");
                        this.now = fish.parseTime(time);
                        return false;
                    }
                })
            }
        },
        getItemElem:function(day,month){
            if(day==undefined){
                throw "param missing!check getItemElem";
            }else if(isNaN(day)){
                throw "param:day should be numberType!check getItemElem";
            }
            if(month==undefined){
                throw "param missing!check getItemElem";
            }else if(isNaN(month)){
                throw "param:month should be numberType!check getItemElem";
            }
            var dItemElem;
            this.__itemElems.each(function(){
                var eachDay = this.getAttribute("day"),
                    eachMonth = this.getAttribute("month");
                if(day==eachDay&&month==eachMonth){
                    dItemElem = this;
                    return false;
                }
            }) ;
            return dItemElem;
        },
        clearNow:function(){
            this.__itemElems.removeClass("spanNow");
            this.now = "";
        },
        //设置自定义的数据
        setUserDate:function(){

            //是否是包含了异步数据
            if(this.dataUrl && this.processDataFn && this.dateTempleteFn){
                var that = this,
                    monthDate,
                    monthDays,
                    dataUrl = this.dataUrl,
                    dateObj = fish.parseDate(this.month),
                    lastMonth = fish.parseTime(dateObj,{"months":-1}),
                    lastMonthDate = fish.parseDate(lastMonth),
                    lastMonthDays = getMonthDays(lastMonthDate),
                    nextMonth = fish.parseTime(dateObj,{"months":1}),
                    nextMonthDate = fish.parseDate(nextMonth),
                    nextMonthDays = getMonthDays(nextMonthDate),
                    lastMonthData,
                    nextMonthData,
                    keyUId = this._getKeyUID(dateObj);//缓存异步对象和返回的数据对象

                dataUrl = dataUrl.replace("{month}", getFormatedNumberStr(dateObj.getMonth()+1));
                dataUrl = dataUrl.replace("{year}", dateObj.getFullYear());
                //清空
                this.__bgElem.addClass("loadingbg");
                monthDate = fish.parseDate(that.month);//processDataFn函数需要的日期信息
                monthDays = getMonthDays(monthDate);
                this._clearUserDate();//清空之前用户打的缓存数据
                //是否需要重新加载数据
                if(this.reloadData || !this.cal.cache[keyUId]){
                    if(that.__ajaxObjs[keyUId]){
                        try{
                            that.__ajaxObjs[keyUId].abort();
                            that.__ajaxObjs[keyUId] = null;
                        }
                        catch(e){}
                    }
                    this.__ajaxObjs[keyUId] = fish.ajax({
                        url:dataUrl,
                        type:"json",
                        fn:function(data){
                            that.__ajaxObjs[keyUId] = null;
                            if(data){

                                that.cal.cache[keyUId] = data;
                                that.ajaxFn && that.ajaxFn(data);
                                that.formatData = that.processDataFn(data,monthDays,monthDate.getFullYear(),monthDate.getMonth()+1);
                                that._setUserDate();
                                if(that.preLoadingUserData){
                                    that._fillPrevOrNextMonth(dateObj.getFullYear(),dateObj.getMonth()+1);//通知别的日历需要本日历的数据去更新
                                    that._getPrevAndNextMonthUserDate();
                                }
                                that.__bgElem.removeClass("loadingbg");
                            }
                        }
                    });
                }
                else{
                    that.formatData = that.processDataFn(this.cal.cache[keyUId],monthDays,monthDate.getFullYear(),monthDate.getMonth()+1);
                    that._setUserDate();
                    if(that.preLoadingUserData){
                        that._fillPrevOrNextMonth(dateObj.getFullYear(),dateObj.getMonth()+1);//通知别的日历需要本日历的数据去更新
                        that._getPrevAndNextMonthUserDate();
                    }
                    this.__bgElem.removeClass("loadingbg");
                }

            }


        },
        //从缓存中拿上个或下个月的数据，如果有，并且数据是预先加载的（preLoadingUserData：true）。那么打印出来
        _getPrevAndNextMonthUserDate:function(){
            var dateObj = fish.parseDate(this.month),
                lastMonth = fish.parseTime(dateObj,{"months":-1}),
                lastMonthDate = fish.parseDate(lastMonth),
                lastMonthDays = getMonthDays(lastMonthDate),
                lastMonthKeyUID = this._getKeyUID(lastMonthDate),
                nextMonth = fish.parseTime(dateObj,{"months":1}),
                nextMonthDate = fish.parseDate(nextMonth),
                nextMonthDays = getMonthDays(nextMonthDate),
                nextMonthKeyUID = this._getKeyUID(nextMonthDate),
                lastMonthData = this.cal.cache[lastMonthKeyUID],
                nextMonthData = this.cal.cache[nextMonthKeyUID];
                //上个月的，下个月的,如果不存在，主动去请求
                if(lastMonthData){
                    if(this.fillBlank){
                        this.lastMonthFormatData = this.processDataFn(lastMonthData,lastMonthDays,lastMonthDate.getFullYear(),lastMonthDate.getMonth()+1);
                        this._setUserDate("prevMonth");
                    }
                }else{//主动请求
                    if(!this.__ajaxObjs[lastMonthKeyUID]){
                        this._getMonData(lastMonthDate);
                    }

                }
                if(nextMonthData){
                    if(this.fillBlank){
                        this.nextMonthFormatData = this.processDataFn(nextMonthData,nextMonthDays,nextMonthDate.getFullYear(),nextMonthDate.getMonth()+1);
                        this._setUserDate("nextMonth");
                    }
                }else{//主动请求
                    if(!this.__ajaxObjs[nextMonthKeyUID]){
                        this._getMonData(nextMonthDate);
                    }

                }

        },
        //主动发请求,获取某个月的日期
        _getMonData:function(date){
            var dataUrl = this.dataUrl,
                keyUId = this._getKeyUID(date),
                ajaxObj = this.__ajaxObjs[keyUId],
                year = date.getFullYear(),
                month = date.getMonth()+ 1,
                monthDays = getMonthDays(date),
                that = this;
            if(ajaxObj){
                try{
                    ajaxObj.abort();
                    ajaxObj = null;
                }
                catch(e){}
            }
            dataUrl = dataUrl.replace("{month}", month);
            dataUrl = dataUrl.replace("{year}", year);
            //遍历
            this.__ajaxObjs[keyUId] = fish.ajax({
                url:dataUrl,
                type:"json",
                fn:function(data){
                    if(data){
                        //cach the data
                        that.cal.cache[keyUId] = data;
                        that.__ajaxObjs[keyUId] = null;
                        //不重绘那个月份的内容，因为那个月份的内容不知是否处于显示
                        //通知当前日历显示的日历 重绘
                        if(that.fillBlank){
                            that._fillPrevOrNextMonth(year,month);
                        }

                    }
                }
            });

        },
        //返回形如 2012-02的字符串
        _getKeyUID:function(dataObj){
            dataObj = fish.parseDate(dataObj);
            var year = dataObj.getFullYear(),
                month = this._fomateMonth(dataObj.getMonth()+1);
            return year+"-"+ month;

        },
        //主动请求后的回调
        _fillPrevOrNextMonth:function(year,month){
            var focMonthArr = this.cal.monthGroup[this.cal.monthGroup.focus];
            focMonthArr.forEach(function(each){
                var date = fish.parseDate(each.month),
                    currYear = date.getFullYear(),
                    currMonth = date.getMonth() + 1;
                //符合条件月份进行重绘。 在当月的前后一个月
                if(each._isPrevOrNextMonth(currYear,currMonth,year,month)){
                    each._getPrevAndNextMonthUserDate();
                }

            });
        },
        _isPrevOrNextMonth:function(currYear,currMonth,tarYear,tarMonth){
            currYear = parseInt(currYear);
            tarYear = parseInt(tarYear);
            currMonth = parseInt(currMonth);
            tarMonth = parseInt(tarMonth);
            //判断是否是前一个月
            if(currYear == tarYear && currMonth - tarMonth == 1){
                return true;
            }else if(currYear-tarYear == 1 && currMonth==1 && tarMonth==12){
                return true;
            }else{
                //不是前一个月，判断是否是后一个月
                if(currYear == tarYear && tarMonth - currMonth == 1){
                    return true;
                }else if(tarYear- currYear== 1 && tarMonth==1 && currMonth==12){
                    return true;
                }else{
                    return false;
                }
            }

        },
        _fomateMonth:function(month){
            month = parseInt(month);
            if(month<10){
                return "0" + month;
            }else{
                return month;
            }
        },
        //重打用户打印的内容
        _clearUserDate:function(){
            var that = this;
            this.__userElems.each(function(elem, ii){
                fish.one(that.__userElems[ii]).html("");
            });
        },
        //配合的内部处理函数
        _setUserDate:function(type){
            var startPrint = false,
                stopPrint = false,
                that = this,
                dateClickEnable,
                userCont,
                printDate,
                firstDay = getFirstDay(this.month),
                firstDayNum = getFirstDay(this.month,"number"),
                data,
                printDateD,
                year,
                month,
                lastMonthDate = fish.parseDate(this.month,{"months":-1}),
                nextMonthDate = fish.parseDate(this.month,{"months":1}),
                lastDate = getMonthDays(this.month),
                lastMonthDays = getMonthDays(lastMonthDate);
            type = type ||"currMonth";
            //不用打印上个月的，因为没有上个月的格子
            if(firstDayNum == 0 && type == "prevMonth"){
                return;
            }
            switch(type){
                case "prevMonth":
                    printDateD = lastMonthDate;
                    printDate = lastMonthDays-firstDayNum+1;
                    data = that.lastMonthFormatData;
                    break;
                case "nextMonth":
                    printDateD = nextMonthDate;
                    printDate = 1;
                    data = that.nextMonthFormatData;
                    break;
                default :
                case "currMonth":
                    printDate = 1;
                    printDateD = fish.parseDate(this.month);
                    data= that.formatData;
                break;

            }

            year = printDateD.getFullYear();
            month = printDateD.getMonth() + 1;


            this.__userElems.each(function(elem, ii){
                //判断1号
                if(!stopPrint && (startPrint ||
                    ((fish.one(elem).getParent(".itemWrap").attr("calday") === firstDay)&& type=="currMonth")||
                    (type=="prevMonth")||
                    (ii>= (lastDate + firstDayNum)&&type=="nextMonth"))
                   ){
                    startPrint = true;
                    userCont = that.dateTempleteFn(year, month, printDate, data[printDate-1]);
                    if(that.dateClickAbleFn){
                        dateClickEnable = that.dateClickAbleFn(year, month, printDate, data[printDate-1]);
                    }


                    fish.one(that.__userElems[ii]).html(userCont ? userCont : "");
                    printDate++;
                    if(dateClickEnable === false || userCont === false){
                        fish.one(that.__itemElems[ii]).removeClass("spanEnable");
                    }


                    
                    //到月底终止
                    if((lastDate < printDate && type =="currMonth")||
                        (lastMonthDays < printDate && type=="prevMonth")
                        ){
                        stopPrint = true;
                    }
                }
                else{
                    if(type =="currMonth"&&!that.fillBlank){
                        fish.one(that.__userElems[ii]).html("");
                    }

                }
            })
        }


    }
    /*
        将1位数的前面补零
     */
    function getFormatedNumberStr(number){
        number = parseInt(number);
        if(number<10){
            number = "0"+number;
        }
        //统一成字符串
        return number+"";
    };

    var runfirstTime = true;

    fish.extend({
        mCal: function(){
            var that = this, arg = arguments,
                mCalObj;
            if(runfirstTime){
                //防止样式表未加载完成造成宽度计算错误等，之后优化
//                setTimeout(function(){
                    mCalObj =  main.apply(that, arg);
//                }, 1000);
                runfirstTime = false;
            }
            else{
                mCalObj =main.apply(that, arg);
            }
            return mCalObj;
        },
        preventInput: preventInput,
        recoverInput: recoverInput

    })
})();