(function () {

    var SINGLE_CAL_WIDTH = 223,
        TOL_CAL_WIDTH,
        CAL_HEIGHT = 223,
        CAL_TIT_SPETEXT_MARGIN_L,
        CAL_TIT_NORTEXT_MARGIN_L,
        gMCalId = 0,
        gIsIn;

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


    function fInitSizeConst(param) {
        var eachH = param.eachH + 2, //边框
            eachW = param.eachW + 2,
            eachCalMargin = param.eachCalMargin;
        SINGLE_CAL_WIDTH = eachW * 7 + eachCalMargin - 2;
        CAL_HEIGHT = (param.eachH + 3) * 6 + 50 + 2; //日历有六行； 50：日历头的高度 1 边框
        CAL_TIT_SPETEXT_MARGIN_L = eachW * 2.5 - 23; //23：上过月或下个月的按钮的宽度
        CAL_TIT_NORTEXT_MARGIN_L = eachW * 2.5;
        TOL_CAL_WIDTH = (SINGLE_CAL_WIDTH + 10) * param.monthNum - 10;

    }
    /**
    * 控件执行入口
    * @param {Object} param 参数对象
    */
    function exec(param, show) {
        var exitMCalId,
            exitCalElem;
        fInitSizeConst(param);
        var dInputDateElem = param.inputElem,
            i,
            length;
        if (!dInputDateElem) {
            return;
        }
        if(show){
            param.beforeOpen && param.beforeOpen.call(param);
        }


        if ((exitMCalId = dInputDateElem.getAttribute("data-mcalId")) == null) {
            dInputDateElem.setAttribute("data-mcalId", ++gMCalId);
            param.mCalId = gMCalId;
            // @tag:reDrawMCal
            var timeContent = document.createElement("div"),
            iframe = document.createElement("iframe"),
                dateList = document.createElement("div"),
                div_top = document.createElement("div"),
                sEachTitle = "",
                sEachCont = "",
                sTitle = "<div class = 'top'>",
                sCont = "";
            timeContent.id = "mCalendar" + param.mCalId;
            timeContent.onselectstart = function () {
                return false;
            }
            document.body.insertBefore(timeContent, document.body.firstChild);

            fish.one(timeContent).css("width:" + (TOL_CAL_WIDTH + 4) + "px;height:" + (CAL_HEIGHT + 4) + "px;");

            iframe.className = "if";
            iframe.src = "http://img1.40017.cn/cn/new_ui/public/images/png_cover.png";
            iframe.style.cssText = "width:" + (TOL_CAL_WIDTH + 4) + "px;height:" + (CAL_HEIGHT + 4) + "px;";
            timeContent.appendChild(iframe);

            dateList.className = "date";
            timeContent.appendChild(dateList);




            dateList.appendChild(div_top);
            div_top.className = "top";
            for (i = 0, length = param.monthNum; i < length; i++) {
                if (i == 0 && length == 1) {//单个日历定制
                    sEachTitle = makeOneMonthCalTit("one");
                    sEachCont = makeOneMonthCalCont("first");
                } else if (i == 0) {
                    sEachTitle = makeOneMonthCalTit("first");
                    sEachCont = makeOneMonthCalCont("first");
                } else if (i == length - 1) {
                    sEachTitle = makeOneMonthCalTit("last");
                    sEachCont = makeOneMonthCalCont("last");
                } else {
                    sEachTitle = makeOneMonthCalTit("mcal" + i, i);
                    sEachCont = makeOneMonthCalCont("mcal" + i);
                }
                sTitle += sEachTitle;
                sCont += sEachCont;
            }
            sTitle += "</div>";
            dateList.innerHTML = sTitle + sCont;
            fish.one(dateList).css("width:" + TOL_CAL_WIDTH + "px;");
            param.calElem = timeContent;
            timeContent.className = "mCalendar";
            fish.all(param.calElem).css("display:none;");
        }

        if (!param.calElem && (exitCalElem = fish.all("#mCalendar" + exitMCalId)).length) {
            param.calElem = exitCalElem[0];
        }

        fish.dom("#mCalendar" + param.mCalId + " .date_lastSpan").onclick = function () {
            param._DFirstDrawTime = fish.parseDate(param._DFirstDrawTime, { months: -param.monthNum });
            fMakeCalCont(param);
            // console.log("prev");
        }
        fish.dom("#mCalendar" + param.mCalId + " .date_nextSpan").onclick = function () {
            param._DFirstDrawTime = fish.parseDate(param._DFirstDrawTime, { months: param.monthNum });
            fMakeCalCont(param);
            // console.log("next");
        }
        //设置单个
        //fish.all(".mCalendar .date .spanOver ").css("height:" + "px;width:" + "px;");

        if (!dInputDateElem.bindCal) {

            var elem = fish.all(dInputDateElem);
            //TODO:一个要改进的地方，在一个input绑定的了日历之后，已经不能再重新指定日历的相关元素。在原先的结构上已经不好改了。没办法。
            if (param.elem) {
                elem[elem.length] = param.elem;
                elem.length++;
            }
            elem[elem.length] = fish.dom(".date", param.calElem);
            elem.length++;
            function showIt() {
                exec(param, true);
            }


            fish.all(elem).on(
                "focus", 
                showIt
            );
            
            fish.all(elem).on(
                "keydown",
                function(e) {
                    var key;
                    if (e.keyCode) {
                        key = e.keyCode;
                    } else if (e.which) {
                        key = e.which;
                    }
                    key === 9 && close(param);
                }
            );

            fish.all(elem).on("change", function (event) {
                var org = fish.trim(this.value),
                    parsed = fish.parseTime(org);
                    
                if(param.showPast){
                    this.value = parsed;
                }else {
                    if(fish.parseDate(parsed).getTime() < fish.parseDate(param.startTime).getTime() ) {
                        this.value = param.startTime;
                    } else {
                        this.value = parsed;
                    }
                }
                // showIt();
                /* var that = this;
                setTimeout(function () {
                    if (!gIsIn) {
                        close(param);
                    }

                    gIsIn = false;
                }, 0); */
                // org === parsed ? (this.value = org) : (this.value = param.startTime || parsed);
                // this.value = fish.parseTime(this.value) ? 
                // this.value = param.startTime;
                //this.value = fish.parseTime(this.value);
            });
            //不能绑在click上，click包括mousedown和mouseup，导致blur时用setTimeout的时机不对
            /* fish.all(elem).on("mousedown", function (e) {
                var that = fish.getTarget(e);
                gIsIn = true;
                showIt();
                fish.stopBubble(e);
            }); */
            /*
            fish.one("body").on("mousedown", function (e) {

                if (gIsIn) {
                    gIsIn = false;
                    return;
                }
                var tarElem = fish.one(fish.getTarget(e)).getParent(".mCalendar"),
                    dParentElem = fish.one(tarElem).getParent(".mCalendar");

                if (dInputDateElem != fish.dom(fish.getTarget(e)) && tarElem != param.calElem && (dParentElem)) {
                    close(param);
                }
                console.log("body");
            });
            */
            fish.on(
                "click",
                function(e) {
                    var that = fish.getTarget(e);
                    while(that !== null) {
                        if(fish.one(that).hasClass("mCalendar") || that === dInputDateElem) {
                            return;
                        }
                        that = that.parentNode;
                    }
                    close(param);
                },
                document
            );

            dInputDateElem.bindCal = true;
        }
        if (!param.calElem) {
            return;
        }
        param.calElem.className = "mCalendar" + (param.css ? (" " + param.css) : "");

        //设置默认初始时间

        param._lastTime = dInputDateElem.value;
        // param._lastTime = param.time = dInputDateElem.value = fish.parseTime(param.time ? param.time : dInputDateElem.value);
        // !param._DFirstDrawTime && (param._DFirstDrawTime = fish.parseDate(param._lastTime));
        param._DFirstDrawTime = fish.parseDate(dInputDateElem.value);
        param._DFirstDrawTime.setDate("1");
        //奇数月份在前
        // var timeMonth = parseInt(param.time.split("-")[1], 10);
        var timeMonth = parseInt(param._lastTime.split("-")[1], 10);
        if (timeMonth && !(timeMonth % 2)) {
            param._addNum = -1;
        }
        else {
            param._addNum = 0;
        }
        if (show) {



            fMakeCalCont(param);

            //close(function () {
            if (param.pop) {

                fish.require("mPop", function () {
                    if (fish.all(param.calElem).getCss("display") !== "block") {
                        fish.all(param.calElem).css("display:block;");
                        fish.mPop({
                            content: param.calElem,
                            beforClose: function () {
                                fish.all(param.calElem).css("display:none;");
                            }
                        })
                    }

                })
            }
            else {
                var coord = fish.one(dInputDateElem).offset(),
                    dInputDateElemH = fish.one(dInputDateElem).height(),
                    viewWidth = fish.one(window).width(),
                    leftDistance;
                if (viewWidth - coord.left >= TOL_CAL_WIDTH + 20) {
                    leftDistance = coord.left
                } else {
                    leftDistance = coord.left - 20 - (TOL_CAL_WIDTH - (viewWidth - coord.left));
                }
                fish.all(param.calElem).css("top:" + (coord.top + dInputDateElemH) + "px; left:" + leftDistance + "px;");

                fish.all(param.calElem).css("display:block;");
            }

            //});

        }

    }

    function makeOneMonthCalTit(type, sPlace) {
        var goo = fish.browser("webkit") ? "webkit_nextMonth" : "nextMonth",
            sTit = "<div class = 'floatL' style = 'width:" + SINGLE_CAL_WIDTH + "px;'>";
        if (type == "one") {//单日历
            return sTit + "<span class='lastMonthBg date_lastSpan'>" +
			"<span class='lastMonth'></span></span>" +
            "<span class='nextMonthBg date_nextSpan'><span class='" +
			    goo +
			"' ></span></span>" +
			"<h4 class='lastText mCalTitleFir'  style = 'margin-left:" + CAL_TIT_SPETEXT_MARGIN_L + "px;'>xxxx年xx月</h4></div>";
        } else if (type == "first") {
            return sTit + "<span class='lastMonthBg date_lastSpan'>" +
			"<span class='lastMonth'></span></span>" +
			"<h4 class='lastText  mCalTitleFir'  style = 'margin-left:" + CAL_TIT_SPETEXT_MARGIN_L + "px;'>xxxx年xx月</h4></div>";

        } else if (type == "last") {
            sTit = "<div class = 'floatL' style = 'width:" + SINGLE_CAL_WIDTH + "px;margin-left:10px'>";
            return sTit + "<span class='nextMonthBg date_nextSpan' ><span class='" +
			    goo +
			"' ></span></span>" +
			"<h4 class='nextText  mCalTitleLast' style = 'margin-left:" + CAL_TIT_SPETEXT_MARGIN_L + "px;'>xxxx年xx月</h4></div>";

        } else {
            sTit = "<div class = 'floatL' style = 'width:" + SINGLE_CAL_WIDTH + "px;margin-left:10px'>";
            return sTit + "<span class='nomalMonthBg'></span>" +
			"<h4 class='normalText mCalTitleMid" + sPlace + "' style = 'margin-left:" + CAL_TIT_NORTEXT_MARGIN_L + "px;'>xxxx年xx月</h4></div>";
        }
    };

    function makeOneMonthCalCont(type) {
        var sCont = "";

        if (type == "first") {
            sCont = "<div class = 'contentTime1 contentTime clearfix'>";
            sCont += "<table cellspacing='0' cellpadding='0' class='tbl_lastMonth' border='0'><tbody><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></tbody></table><i class='monthBg none' >1</i>";
            sCont += "</div>";
            return sCont;
        } else if (type == "last") {
            sCont = "<div class = 'contentTime2 contentTime clearfix'>";
            sCont += "<table cellspacing='0' cellpadding='0' class='tbl_nextMonth' border='0'><tbody><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></tbody></table><i class='monthBg none'>12</i>";
            sCont += "</div>";
            return sCont;
        } else {
            sCont = "<div class = 'contentTimeMiddle contentTime clearfix'>";
            sCont += "<table cellspacing='0' cellpadding='0' class=" + type + " border='0'><tbody><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></tbody></table><i class='monthBg none' >1</i>";
            sCont += "</div>";
            return sCont;
        }
    };

    /**
    * 添加日历
    */
    function addMonth(id, /*日历参数*/param, /*@type:Date,月份已经调整*/DDrawDate, /*显示年月的头的选择器*/sTitleSelector, ajaxData) {

        var table = fish.dom(id),
            dCalTitle = fish.dom(sTitleSelector),
            monthBg = table.parentNode.getElementsByTagName("i"),
            IS_SPECIAL_DAY = "s",
            HOVER_CLASS = "hover",
            SELECT_CLASS = "sel",
            RAW_CLASS = "r",
            DAY = "d",
            nYear = DDrawDate.getFullYear(),
            nMonth = DDrawDate.getMonth() + 1,
            nDrawDay = DDrawDate.getDay()/*画的那天是星期几*/,
                nowTime = new Date(),
                nNowYear = nowTime.getFullYear(),
               nNowMonth = nowTime.getMonth() + 1,
               nNowDate = nowTime.getDate(),
               ajaxDataIndex = 0,
               tempUrl = param.ajaxUrl;

        if (!ajaxData) {
            if (param.processData && param.makeItemView && typeof (tempUrl) == "string" && typeof (param.processData) == "function") {
                tempUrl = tempUrl.replace("{year}", nYear);
                tempUrl = tempUrl.replace("{month}", nMonth);
                fish.ajax({
                    url: tempUrl,
                    type: "json",
                    fn: function (data) {
                        data = param.processData(data);
                        addMonth(id, param, DDrawDate, sTitleSelector, data);
                    }
                });
                return;
            }
        }

        if (param.isDebuge) {
            if (DDrawDate.getDate() != 1) {
                console.error("传入的DDrawDate的必须为当月的第一天！！！");
            }
        }
        var hasInit = table.getAttribute("inited") == "true";

        if (monthBg.length > 0) {
            //月份背景
            monthBg[0].innerHTML = parseInt(nMonth, 10);
            fish.one(monthBg[0]).css("height:" + CAL_HEIGHT + "px;width:" + SINGLE_CAL_WIDTH + "px;margin-top:-" + (CAL_HEIGHT / 2 + 40) + "px;");
            fish.one(monthBg[0]).removeClass("none");
        }
        dCalTitle.innerHTML = nYear + "年" + nMonth + "月";


        var allDayNum = fGetDayOfMonth(DDrawDate);
        var newTr;
        var newTdNum = allDayNum,
            spanHTML;
        if (nDrawDay != 7) {
            newTdNum = newTdNum + nDrawDay;
        }


        var trs, spans;

        if (hasInit) {
            trs = fish.all("tr", table);
            tds = fish.all("td", table);
            items = fish.all(".itemWrap", table);
        }
        for (var i = 1; i <= 42; i++) {
            var nowPrintDay = i - nDrawDay;
            if (i % 7 == 1) {
                //添加一行
                if (!hasInit) {
                    newTr = table.insertRow(table.rows.length);
                }
                else {
                    newTr = trs[parseInt(i % 7, 10)];
                }

            }
            var newTd0, span;
            if (!hasInit) {
                newTd0 = newTr.insertCell((i % 7) - 1);
                newTd0.innerHTML = "";
                var itemWrap = document.createElement("div"),
                    span = document.createElement("span"),
                    useWrap = document.createElement("div");
                span.className = "dateWrap";
                itemWrap.className = "itemWrap";
                useWrap.className = "useWrap";
                itemWrap.style.cssText = "height:" + (param.eachH) + "px;width:" + (param.eachW) + "px;float:left;display:inline;overflow:hidden;";
                newTd0.appendChild(itemWrap);
                itemWrap.appendChild(span);
                itemWrap.appendChild(useWrap);
            } else {
                newTd0 = tds[i - 1];
                itemWrap = items[i - 1];
                span = fish.dom(".dateWrap", itemWrap);
                span.className = "dateWrap";
                itemWrap.className = "itemWrap";
            }

            if ((nDrawDay != 7 && i <= nDrawDay) || i > newTdNum) {
                //添加本月1号前的空白列
                //设置列内容和属性
                span.innerHTML = "";
                fish.one(".useWrap", itemWrap).html("");
                newTd0.className = "td02";
                itemWrap.className = "spanOut" + " itemWrap";
                itemWrap.onmouseover = itemWrap.onmouseout = itemWrap.onclick = null;

                continue;
            } else {
                //添加列
                //设置列内容和属性
                newTd0.className = "td01";
                var dateInfo = getDateInfo(nYear, nMonth, nowPrintDay);
                if (dateInfo == -1) {
                    span.innerHTML = nowPrintDay;

                    itemWrap.className = itemWrap.className + " spanOut";
                    itemWrap.setAttribute(IS_SPECIAL_DAY, "false");
                    itemWrap.setAttribute(DAY, nowPrintDay);


                } else {
                    span.innerHTML = "";
                    span.className = span.className + " " + dateInfo.className;

                    itemWrap.className = itemWrap.className + " spanOut";
                    itemWrap.setAttribute(IS_SPECIAL_DAY, "true");
                    itemWrap.setAttribute(RAW_CLASS, itemWrap.className);
                    itemWrap.setAttribute(DAY, dateInfo.day);
                }
                //spanHTML = getOutterHTML(span);
                if (param.makeItemView && typeof (param.makeItemView) == "function" && ajaxData) {
                    fish.one(".useWrap", itemWrap).html(makeItemFn(nYear, nMonth, nowPrintDay, ajaxData[ajaxDataIndex++]));
                }
                if (nMonth < 10) {
                    //span.setAttribute("m", nYear + "-0" + nMonth);
                    itemWrap.setAttribute("m", nYear + "-0" + nMonth);
                } else {
                    //span.setAttribute("m", nYear + "-" + nMonth);
                    itemWrap.setAttribute("m", nYear + "-" + nMonth);
                }



                itemWrap.onmouseover = function () {
                    if (this.getAttribute(IS_SPECIAL_DAY) == "true") {
                        this.className = this.getAttribute(RAW_CLASS) + " " + HOVER_CLASS;
                    } else {
                        //this.className = this.className !== "" ? this.className + " spanHover" : " spanHover";
                        fish.one(this).addClass("spanHover")
                    }

                };
                itemWrap.onmouseout = function () {
                    if (this.getAttribute(IS_SPECIAL_DAY) == "true") {
                        this.className = this.getAttribute(RAW_CLASS);
                    } else {
                        this.className = "itemWrap spanOut";
                    }
                };

                //获取今天日期给予特殊样式
                var addrt = false, addOverTime = false;



                //判断是否是今天
                if (nNowYear > nYear) {
                    addrt = true;
                } else if (nNowYear == nYear) {
                    if (nNowMonth > nMonth) {
                        addrt = true;
                    } else if (nNowMonth == nMonth) {
                        if (nNowDate > (nowPrintDay)) {
                            addrt = true;
                        }
                    }
                }
                //结束日期
                if (param.endTime) {
                    var endDate = param.endTime.split('-');
                    if (endDate.length > 0) {
                        if (parseInt(endDate[0]) < nYear) {
                            addrt = true;
                        }
                        else if (parseInt(endDate[0]) == nYear) {
                            if (parseInt(endDate[1], 10) < nMonth) {
                                addrt = true;
                            }
                            else if (parseInt(endDate[1], 10) == nMonth) {
                                if (parseInt(endDate[2], 10) < (nowPrintDay)) {
                                    addrt = true;
                                }
                            }
                        }
                    }
                }

                //开始日期
                if (param.startTime) {
                    var startDate = param.startTime.split('-');
                    if (startDate.length > 0) {
                        if (parseInt(startDate[0]) > nYear) {
                            addrt = true;
                        }
                        else if (parseInt(startDate[0]) == nYear) {
                            if (parseInt(startDate[1], 10) > nMonth) {
                                addrt = true;
                            }
                            else {
                                if (parseInt(startDate[1], 10) == nMonth) {
                                    if (parseInt(startDate[2], 10) >= (nowPrintDay)) {
                                        addrt = true;
                                    }
                                }
                            }
                        }
                    }
                }
                // console.log("param._DFirstDrawTime", param._DFirstDrawTime);
                // 所选日期前不能打印成有效日期

                /* if (param._lastTime) {

                    var limitDay = param._lastTime.split("-")[2];
                    if (limitDay.indexOf("0") === 0) {
                        limitDay = limitDay.substring(1);
                    }
                    if (parseInt(limitDay, 10) > nowPrintDay) {
                        if (addMonth.markCount < 1) {
                            addrt = true;
                            console.log(3);
                        }
                    }
                }
                console.log(limitDay, "   ", nowPrintDay); */


                //绑定过去样式
                if (addrt && !param.showPast) {
                    itemWrap.className = "itemWrap spanOver";
                    span.className = "dateWrap";
                    if (span.innerHTML == "") {
                        span.innerHTML = itemWrap.getAttribute(DAY);
                    }

                    itemWrap.onmouseover = itemWrap.onmouseout = itemWrap.onclick = null;
                } else {
                    itemWrap.onclick = function (e) {
                        var m = this.getAttribute("m"),
                            day = this.getAttribute(DAY) ? this.getAttribute(DAY) : this.innerHTML;
                        param._lastTime = m + "-" + day;
                        if (parseInt(day, 10) <= 9) {
                            param._lastTime = m + "-0" + day;

                        }
                        //设置选择的日期
                        param.inputElem.value = param._lastTime;
                        if (param.inputElem && param.showDay) {
                            fShowItemDay(param.inputElem, param._lastTime, param); //显示星期
                        }
                        //param.calElem.style.display = "none";

                        close(param, function () {
                            //判断是否有事件绑定
                            if (param.fn) {
                                param.fn(param._lastTime);
                            }
                        });

                    };
                }
                //绑定今天样式
                if (nNowYear == nYear && nNowMonth == nMonth && nNowDate == (nowPrintDay)) {
                    span.innerHTML = "";
                    span.className = "spanDay" + " dateWrap";
                    itemWrap.setAttribute(DAY, nowPrintDay);
                    itemWrap.setAttribute(IS_SPECIAL_DAY, "true");
                    itemWrap.setAttribute(RAW_CLASS, itemWrap.className);
                }
                //绑定明天样式
                if (fish.parseTime(nYear + "-" + nMonth + "-" + nowPrintDay) == fish.parseTime(new Date(), { days: 1 })) {
                    //if (fish.parseTime(ol_Year + "-" + (ol_Month + 1) + "-" + nowPrintDay) == fish.parseTime(new Date(), { days: 1 })) {
                    span.innerHTML = "";
                    span.className = "spanTomo" + " dateWrap";
                    itemWrap.setAttribute(IS_SPECIAL_DAY, "true");
                    itemWrap.setAttribute(DAY, nowPrintDay);
                    itemWrap.setAttribute(RAW_CLASS, itemWrap.className);
                }
                //绑定选择过的日期
                if (param._lastTime != null) {
                    var cliyear = param._lastTime.split("-")[0];
                    var cliMonth = param._lastTime.split("-")[1];
                    var cliDay = param._lastTime.split("-")[2];
                    var clickDate = new Date(cliyear, cliMonth, cliDay);
                    var printDate = new Date(nYear, nMonth, nowPrintDay);
                    //  show 过去能否能点
                    if (isShowSE(clickDate, printDate, param)) {


                        if (itemWrap.getAttribute(IS_SPECIAL_DAY) == "true") {
                            itemWrap.className = itemWrap.getAttribute(RAW_CLASS) + " clickDate";
                        } else {
                            itemWrap.className = "clickDate" + " itemWrap";
                        }
                        itemWrap.onmouseout = function () {
                            if (this.getAttribute(IS_SPECIAL_DAY) == "true") {
                                this.className = this.getAttribute(RAW_CLASS) + " clickDate";
                            } else {
                                this.className = "clickDate" + " itemWrap";
                            }
                        };
                    }
                }
                //给所有的日期span加统一的类名
                itemWrap.className = itemWrap.className + " dateWrap";

            }
        }

        //标记已经初始化
        table.setAttribute("inited", "true");
    }
    //关闭日历框
    function close(param, fn) {

        if (param.pop) {
            fish.require("mPop", function () {
                fish.mPop.close();
            })

        }
        else {
            param.calElem.style.display = "none";
        }

        fn && fn();
        gIsIn = false;
    };
    //关闭所有的日历框
    function closeAllCal() {
        var i = 1,
            length = gMCalId + 1;
        for (; i < length; i++) {
            fish.dom("#mCalendar" + i).style.display = "none";
        }

    };
    function main(p) {
        var param = p || {};
        /*@tag:params*/
        var date = {
            css: "",
            time: "",
            open: false,
            startTime: fish.parseTime(new Date()),
            endTime: "",
            inputElem: this[0],
            showPast: false,
            fn: null,
            calElem: null,
            _lastTime: null,
            beforeOpen : function(){},
            fontSize: 12, //input框中的字号
            _DFirstDrawTime: null, //画的第一个框的月份时间 @type:Date
            eachH: 30, //单元格的高度包括边框
            eachW: 30, //单元格的宽度包括边框
            eachCalMargin: 10, //日历之间的间距
            monthNum: 2, //显示几个日历框
            showDay: false, //在日历的input框显示星期
            isAjax: false,
            ajaxFn: false
        };

        if (date.inputElem && date.inputElem.getAttribute("data-mcalid") != null) {//不确定如果某属性不存在在所有的浏览器是否都为null,故用!=
            date.mCalId = date.inputElem.getAttribute("data-mcalid");
        }
        fish.lang.extend(date, param);
        exec(date, date.open);

        return {
            setAjaxUrl: function (url) {
                date.ajaxUrl = url;
            }
        }
    }

    main.close = close;

    /*
    是否要显示输入框的输入日期的显示效果 SE ：select effect
    */
    function isShowSE(selectDate, printDate, data) {
        var dateNow = new Date();
        var startTime = data.startTime ? parseStringToDate(data.startTime) : new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
        if (selectDate - printDate === 0) {
            if (data.showPast) {
                return true;
            }
            else if ((selectDate - startTime) >= 0) {
                return true;
            }
        }

        return false;
    };
    function parseStringToDate(str, split) {
        if (typeof (str) != "string") {
            return new Date();
        }
        var dateStr = str.replace(/-/g, "/");
        return new Date(Date.parse(dateStr));
    };
    /**
    * 获得单元格的显示内容的信息
    */
    function getDateInfo(year, month, day) {
        var specialDate = _getSpecialDate(),
			compareDate = new Date(year, month - 1, day),
			res = _indexOfSpecialDate(compareDate, specialDate);
        return res; //res {name : "元旦",className : "yuandan",day : "1"} || -1

    };
    function _getSpecialDate() {
        var specialDate = {
            specialDate: [
				{
				    date: "2011-01-01",
				    name: "元旦",
				    className: "yuandan"
				},
				{
				    date: "2011-12-25",
				    name: "圣诞节",
				    className: "圣诞"
				},

				{
				    date: "2012-01-01",
				    name: "元旦",
				    className: "yuandan"
				},
                {
                    date: "2012-02-22",
                    name: "除夕",
                    className: "chuxi"
                },
				{
				    date: "2012-04-04",
				    name: "清明",
				    className: "qingming"
				}, {
				    date: "2012-05-01",
				    name: "劳动节",
				    className: "wuyi"
				}, {
				    date: "2012-06-01",
				    name: "儿童节",
				    className: "liuyi"
				},
				{
				    date: "2012-06-23",
				    name: "端午",
				    className: "duanwu"
				},
                	{
                	    date: "2012-08-23",
                	    name: "qixi",
                	    className: "qixi"
                	},
				{
				    date: "2012-09-30",
				    name: "中秋",
				    className: "zhongqiu"
				},
				{
				    date: "2012-10-01",
				    name: "国庆",
				    className: "guoqing"
				},
                {
                    date: "2012-12-25",
                    name: "圣诞",
                    className: "shendan"
                },
				{
				    date: "2013-01-01",
				    name: "元旦",
				    className: "yuandan"
				}
			]

        };
        return specialDate;
    };
    function _indexOfSpecialDate(theCompareDate, specialDate) {
        if (!specialDate) {
            return -1;
        }
        var data = specialDate.specialDate,
			index,
			length,
			eachData,
			indexDay,
			lengthDay,
			each,
			eachDay,
			eachDayDate,
			eachYear,
			res = -1;
        //遍历
        for (index = 0, length = data.length; index < length; index++) {
            each = data[index];
            eachDay = each.date;
            eachDayDate = new Date(eachDay.replace(/-/g, "/"));

            if (compareDate(eachDayDate, theCompareDate, false)) {
                res = {};
                res.name = each.name;
                res.className = each.className;
                res.day = eachDayDate.getDate() + "";
                return res;
            } else {
                continue;
            }

        };
        return -1;



    };

    function compareDate(date1, date2, ignoreY) {
        var year1 = date1.getFullYear(),
			month1 = date1.getMonth(),
			day1 = date1.getDate(),
			year2 = date2.getFullYear(),
			month2 = date2.getMonth(),
			day2 = date2.getDate(),
			flag = false;
        if (ignoreY) {
            if (month1 == month2 && day1 == day2) {
                flag = true;
            }
        } else {
            if (date1.getTime() == date2.getTime()) {
                flag = true;
            }
        }
        return flag;
    };
    /*@tag:viewFn start*/
    function fMakeCalCont(param) {
        var _DDrawTime = param._DFirstDrawTime,
            i,
            length;
        addMonth.markCount = 0;
        for (i = 0, length = param.monthNum; i < length; i++) {
            if (i == 0) {
                addMonth("#mCalendar" + param.mCalId + " .tbl_lastMonth", param, _DDrawTime, "#mCalendar" + param.mCalId + " .mCalTitleFir");

            } else if (i == length - 1) {
                addMonth("#mCalendar" + param.mCalId + " .tbl_nextMonth", param, _DDrawTime, "#mCalendar" + param.mCalId + " .mCalTitleLast");
            } else {
                addMonth("#mCalendar" + param.mCalId + " .mcal" + i, param, _DDrawTime, "#mCalendar" + param.mCalId + " .mCalTitleMid" + i);
            }
            _DDrawTime = fish.parseDate(_DDrawTime, { months: 1 });
            addMonth.markCount++;
        }
    };

    /*@viewFn end*/

    /*@tag:toolFn start*/
    /*
    *@describute : 获得当前时间的月份的天数
    */
    function fGetDayOfMonth(dDate) {
        var dTemp = new Date(dDate),
    nDay;
        dTemp.setMonth(dTemp.getMonth() + 1);
        dTemp.setDate(0);
        nDay = dTemp.getDate();
        return nDay;
    }
    //显示星期
    function fShowItemDay(dInputElem, sTime, param) {
        var sDay = fish.parseDate(sTime).getDay(),
            uDayWrap = fish.one(".mCalendar" + param.mCalId),
            uInputElem = fish.one(dInputElem);
        if (uDayWrap.length == 0) {
            uDayWrap = fish.one(document.createElement("div"));
            uDayWrap.addClass("dayWrap");
            uDayWrap.addClass("mCalendar" + param.mCalId);
            uDayWrap.css("height:" + uInputElem.height() + "px;" +
                "line-height:" + uInputElem.height() + "px;" +
                "left:" + (uInputElem.offset().left + uInputElem.width() - 52) + "px;" +
                 "top:" + uInputElem.offset().top + "px;" +
                 "font-size:" + fGetFontSize(uInputElem) + ";"); //fGetFontSize的值带px
            document.body.appendChild(uDayWrap[0]);
            uDayWrap.on("click", function () {
                // param.time = "";
                exec(param, true);
            });
        }
        switch (sDay) {
            case 1:
                sDay = "一";
                break;
            case 2:
                sDay = "二";
                break;
            case 3:
                sDay = "三";
                break;
            case 4:
                sDay = "四";
                break;
            case 5:
                sDay = "五";
                break;
            case 6:
                sDay = "六";
                break;
            case 0:
                sDay = "日";
                break;
        }
        uDayWrap.html("星期" + sDay);


    };
    function fGetFontSize(dElem) {
        try {
            var fontSize = fish.one(dElem).getCss("font-size");
            return fontSize;
        } catch (e) {
            return 12;
        }


    }
    /*@toolFun end*/
    function getOutterHTML(elem) {
        var tempElem = elem.cloneNode(true),
					parentElem = document.createElement("div"),
					html;
        parentElem.appendChild(tempElem);
        html = parentElem.innerHTML;
        parentElem = null;
        return html;
    }
    fish.extend({
        mCal: main,
        preventInput: preventInput,
        recoverInput: recoverInput

    });
})();