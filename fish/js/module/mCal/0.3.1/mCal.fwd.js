(function () {

    function pint(str) {
        return parseInt(str, 10);
    }

    function parseTime(string, tParam, getObj) {
        _parseTime_.hasCallOnce = false;
        return _parseTime_(string, tParam, getObj);
    }

    //修正日期
    function _parseTime_(string, tParam, getObj) {
        if (typeof string === "object") {
            var y = string.getFullYear(),
                m = string.getMonth() + 1,
                d = string.getDate(),
                h = string.getHours(),
                mi = string.getMinutes(),
                s = string.getSeconds();
        }
        else {
            string = string ? string : "";
            var s = string.split("-"),
                y = parseInt(s[0], 10),
                m = parseInt(s[1], 10),
                d = parseInt(s[2], 10),
                h = mi = s = 0;
        }
        var date = new Date(),
            temp,
            param = {
                years: 0,
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                timeMode: null
            };

        //有效日期
        if (y && m && d) {
            fish.lang.extend(param, tParam);
            //增量
            y = y + param.years;
            m = m + param.months;
            d = d + param.days;
            h = h + param.hours;
            mi = mi + param.minutes;
            s = s + param.seconds;

            temp = new Date(y, m - 1, d, h, mi, s);
            y = temp.getFullYear();
            m = temp.getMonth() + 1;
            d = temp.getDate();
            h = temp.getHours();
            mi = temp.getMinutes();
            s = temp.getSeconds();



            m = m < 10 ? ("0" + m) : m;
            d = d < 10 ? ("0" + d) : d;
            h = h < 10 ? ("0" + h) : h;
            mi = mi < 10 ? ("0" + mi) : mi;
            s = s < 10 ? ("0" + s) : s;

            var rt;
            //特使格式
            if (param.timeMode) {
                rt = param.timeMode
                .replace("YYYY", y)
                .replace("MM", m)
                .replace("DD", d)
                .replace("hh", h)
                .replace("mm", mi)
                .replace("ss", s);
            }
            else {
                rt = [y, m, d].join("-");
            }
            rt = getObj ? { y: y, m: m, d: d, h: h, mi: mi, s: s} : rt;
            return rt;
        }
        else if (!arguments.callee.hasCallOnce) { //无效日期,直接返回今天的日期
            arguments.callee.hasCallOnce = true;
            return arguments.callee([date.getFullYear(),
                            date.getMonth() + 1,
                            date.getDate()].join("-"), tParam, getObj);
        }
    }
    //转换字符串为日期对象，可以传入累加的年月日
    function parseDate(string, param) {
        var dateObj = parseTime(string, param, true);
        return new Date(pint(dateObj.y), pint(dateObj.m) - 1, pint(dateObj.d), pint(dateObj.h), pint(dateObj.mi), pint(dateObj.s));
    }
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


    var dateNow, calElem;
    /**
    * 控件执行入口
    * @param {Object} param 参数对象
    */
    function exec(param, show) {
        var date = param;
        var txt = fish.dom(date.inputElem);
        if (!txt) {
            return;
        }
        //preventInput(txt); //控制文本使用权限
        if (!calElem) {
            //创建
            var timeContent = document.createElement("div");
            timeContent.id = "mCalendar";
            timeContent.onselectstart = function () {
                return false;
            }
            document.body.appendChild(timeContent);
            var iframe = document.createElement("iframe");
            iframe.className = "if";
            timeContent.appendChild(iframe);
            var dateList = document.createElement("div");
            dateList.className = "date";
            timeContent.appendChild(dateList);
            var div_top = document.createElement("div");
            dateList.appendChild(div_top);
            div_top.className = "top";
            var goo = fish.browser("webkit") ? "webkit_nextMonth" : "nextMonth";
            div_top.innerHTML = "<span class='lastMonthBg' id='date_lastSpan'>" +
			"<span class='lastMonth' ></span></span>" +
			"<h4 class='lastText' id='tbl_lastMonth_input'>xxxx年xx月</h4>" +
			"<span class='nextMonthBg' id='date_nextSpan'><span class='" +
			goo +
			"' ></span></span>" +
			"<h4 class='nextText' id='tbl_nextMonth_input'>xxxx年xx月</h4>";
            var math1 = document.createElement("div");
            math1.className = "contentTime1 contentTime clearfix";
            math1.innerHTML = "<table cellspacing='0' cellpadding='0' id='tbl_lastMonth' border='0'><tbody><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></tbody></table><i class='monthBg' >1</i>";
            dateList.appendChild(math1);
            var math2 = document.createElement("div");
            math2.className = "contentTime2 contentTime clearfix";
            math2.innerHTML = "<table cellspacing='0' cellpadding='0' id='tbl_nextMonth' border='0'><tbody><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></tbody></table><i class='monthBg'>12</i>";
            dateList.appendChild(math2);

            date.calElem = calElem = timeContent;
            timeContent.className = "mCalendar";
            fish.all(date.calElem).css("display:none;");
        }
        else {
            date.calElem = calElem;
        }

        fish.dom("#date_lastSpan").onclick = function () {
            var inputDate = date.inputElem._mCalDate_;
            inputDate._addNum -= 4;
            addMonth("#tbl_lastMonth", inputDate);
            addMonth("#tbl_nextMonth", inputDate);
        }
        fish.dom("#date_nextSpan").onclick = function () {
            var inputDate = date.inputElem._mCalDate_;
            addMonth("#tbl_lastMonth", inputDate);
            addMonth("#tbl_nextMonth", inputDate);
        }



        if (!date.inputElem.bindCal) {
            var all;
            //TODO:一个要改进的地方，在一个input绑定的了日历之后，已经不能再重新指定日历的相关元素。在原先的结构上已经不好改了。没办法。
            if (date.elem) {
                var all = fish.all(date.elem);
                all[all.length] = date.inputElem;
                all.length++;
            }
            var elem = all ? all : date.inputElem;
            var showIt = function () {
                var inputDate = date.inputElem._mCalDate_;
                inputDate.time = "";
                exec(inputDate, true);
            }

            fish.one(date.calElem).effect({
                elem: elem,
                type: "click",
                interShow: false,
                interFn: showIt
            });
            date.inputElem.bindCal = true;
        }

        date.calElem.className = "mCalendar" + (date.css ? (" " + date.css) : "");


        //设置默认初始时间
        date._lastTime = date.time = txt.value = parseTime(date.time ? date.time : txt.value);
        //设置月份

        //奇数月份在前
        var timeMonth = parseInt(date.time.split("-")[1], 10);
        if (timeMonth && !(timeMonth % 2)) {
            date._addNum = -1;
        }
        else {
            date._addNum = 0;
        }
        dateNow = date.inputElem._mCalDate_ = date;
        if (show) {

            

            addMonth("#tbl_lastMonth", date);
            addMonth("#tbl_nextMonth", date);
            var coord = fish.one(txt).offset(),
                txtH = fish.one(txt).height(),
                viewWidth = fish.one(window).width(),
                calWidth = 450,
                leftDistance;
            if (viewWidth - coord.left >= calWidth + 20) {
                leftDistance = coord.left
            } else {
                leftDistance = coord.left - 20 - (calWidth - (viewWidth - coord.left));
            }
            fish.all(date.calElem).css("top:" + (coord.top + txtH) + "px; left:" + leftDistance + "px;");

            close(function () {
                fish.all(date.calElem).css("display:block;");
            });
            
        }
        else {
            date._addNum += 2;
        }
    }

    /**
    * 添加日历
    */
    function addMonth(id, date) {
        var table = fish.dom(id)
        var input = fish.dom(id + "_input");
        var monthBg = table.parentNode.getElementsByTagName("i");
        var IS_SPECIAL_DAY = "s";
        var HOVER_CLASS = "hover";
        var SELECT_CLASS = "sel";
        var RAW_CLASS = "r";
        var DAY = "d";

        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        var timetxt = parseTime(date.time.split("-")[0] + "-" + date.time.split("-")[1] + "-01", { months: date._addNum });

        var top = timetxt.split("-");
        if (monthBg.length > 0) {
            //月份背景
            monthBg[0].innerHTML = parseInt(top[1], 10);
        }
        input.innerHTML = top[0] + "年" + top[1] + "月";
        var execTime = top[0] + "-" + top[1] + "-1";
        date._addNum++;
        var nowDate = new Date(Date.parse(execTime.replace(/-/g, '/')));
        // 获取是星期几
        var nowday = nowDate.getDay();
        // 生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        nowDate.setMonth(nowDate.getMonth() + 1);
        // 将日期设置为0
        nowDate.setDate(0);
        // 返回当月的天数			   
        var allDayNum = nowDate.getDate(0);
        var newTr;
        var newTdNum = allDayNum;
        if (nowday != 7) {
            newTdNum = newTdNum + nowday;
        }
        for (var i = 1; i <= 42; i++) {
            var nowPrintDay = i - nowday;
            if (i % 7 == 1) {
                //添加一行
                newTr = table.insertRow(table.rows.length);
            }
            if (nowday != 7 && i <= nowday) {
                //添加本月1号前的空白列
                var newTd0 = newTr.insertCell((i % 7) - 1);
                //设置列内容和属性
                newTd0.innerHTML = "  ";
                newTd0.className = "td02";
                var span = document.createElement("span");
                span.innerHTML = " ";
                span.className = "spanOut";
                newTd0.appendChild(span);
                continue;
            }
            else if (i > newTdNum) {
                //添加本月最后一天的空白列
                var newTd0 = newTr.insertCell((i % 7) - 1);
                //设置列内容和属性
                newTd0.innerHTML = "  ";
                newTd0.className = "td02";
                var span = document.createElement("span");
                span.innerHTML = " ";
                span.className = "spanOut";
                newTd0.appendChild(span);
                continue;
            }
            else {
                //添加列
                var newTd0 = newTr.insertCell((i % 7) - 1);
                //设置列内容和属性
                newTd0.className = "td01";
                var span = document.createElement("span");
                var dateInfo = getDateInfo(nowDate.getFullYear(), nowDate.getMonth() + 1, nowPrintDay);
                if (dateInfo == -1) {
                    span.innerHTML = nowPrintDay;
                    span.className = "spanOut";
                    span.setAttribute(IS_SPECIAL_DAY, "false");
                } else {
                    span.innerHTML = "";
                    span.className = dateInfo.className;
                    span.setAttribute(IS_SPECIAL_DAY, "true");
                    span.setAttribute(RAW_CLASS, dateInfo.className);
                    span.setAttribute(DAY, dateInfo.day);
                }
                span.setAttribute("m", top[0] + "-" + top[1]);


                span.onmouseover = function () {
                    if (this.getAttribute(IS_SPECIAL_DAY) == "true") {
                        this.className = this.getAttribute(RAW_CLASS) + " " + HOVER_CLASS;
                    } else {
                        this.className = "spanHover";
                    }

                };
                span.onmouseout = function () {
                    if (this.getAttribute(IS_SPECIAL_DAY) == "true") {
                        this.className = this.getAttribute(RAW_CLASS);
                    } else {
                        this.className = "spanOut";
                    }
                };

                //获取今天日期给予特殊样式
                var addrt = false, addOverTime = false;
                var ol_Year = nowDate.getFullYear();
                var ol_Month = nowDate.getMonth();
                var ol_Day = nowDate.getDate();

                var nowTime = new Date();
                var now_Year = nowTime.getFullYear();
                var now_Month = nowTime.getMonth();
                var now_Day = nowTime.getDate();

                //判断是否是今天
                if (now_Year > ol_Year) {
                    addrt = true;
                }
                else if (now_Year == ol_Year) {
                    if (now_Month > ol_Month) {
                        addrt = true;
                    }
                    else if (now_Month == ol_Month) {
                        if (now_Day > (nowPrintDay)) {
                            addrt = true;
                        }
                    }
                }
                //结束日期
                if (date.endTime) {
                    var endDate = date.endTime.split('-');
                    if (endDate.length > 0) {
                        if (parseInt(endDate[0]) < nowDate.getFullYear()) {
                            addrt = true;
                        }
                        else if (parseInt(endDate[0]) == nowDate.getFullYear()) {
                            if (parseInt(endDate[1], 10) < (nowDate.getMonth() + 1)) {
                                addrt = true;
                            }
                            else if (parseInt(endDate[1], 10) == (nowDate.getMonth() + 1)) {
                                if (parseInt(endDate[2], 10) < (nowPrintDay)) {
                                    addrt = true;
                                }
                            }
                        }
                    }
                }
                //开始日期
                if (date.startTime) {
                    var startDate = date.startTime.split('-');
                    if (startDate.length > 0) {
                        if (parseInt(startDate[0]) > nowDate.getFullYear()) {
                            addrt = true;
                        }
                        else if (parseInt(startDate[0]) == nowDate.getFullYear()) {
                            if (parseInt(startDate[1], 10) > (nowDate.getMonth() + 1)) {
                                addrt = true;
                            }
                            else {
                                if (parseInt(startDate[1], 10) == (nowDate.getMonth() + 1)) {
                                    if (parseInt(startDate[2], 10) >= (nowPrintDay)) {
                                        addrt = true;
                                    }
                                }
                            }
                        }
                    }
                }

                //绑定过去样式
                if (addrt && !date.showPast) {
                    span.className = "spanOver";
                    if (span.innerHTML == "") {
                        span.innerHTML = span.getAttribute(DAY);
                    }
                    span.onmouseover = span.onmouseout = function () {
                        if (this.getAttribute(IS_SPECIAL_DAY) == "true") {
                        } else {
                            this.className = "spanOver";
                        }

                    };
                }
                else {
                    span.onclick = function () {
                        var m = this.getAttribute("m"),
                            day = this.getAttribute(DAY) ? this.getAttribute(DAY) : this.innerHTML;
                        date._lastTime = m + "-" + day;
                        if (this.innerHTML.length == 1) {
                            date._lastTime = m + "-0" + day;
                        }
                        //设置选择的日期
                        if (date.inputElem) {
                            date.inputElem.value = date._lastTime;
                        }
                        //date.calElem.style.display = "none";
                        close(function () {
                            //判断是否有事件绑定
                            if (date.fn) {
                                date.fn(date._lastTime);
                            }
                        });

                    };
                }
                //绑定今天样式
                if (now_Year == ol_Year && now_Month == ol_Month && now_Day == (nowPrintDay)) {
                    span.innerHTML = "";
                    span.className = "spanDay";
                    span.setAttribute(DAY, nowPrintDay);
                    span.setAttribute(IS_SPECIAL_DAY, "true");
                    span.setAttribute(RAW_CLASS, span.className);
                }
                //绑定明天样式
                if (now_Year == ol_Year && now_Month == ol_Month && now_Day + 1 == (nowPrintDay)) {
                    span.innerHTML = "";
                    span.className = "spanTomo";
                    span.setAttribute(IS_SPECIAL_DAY, "true");
                    span.setAttribute(DAY, nowPrintDay);
                    span.setAttribute(RAW_CLASS, span.className);
                }
                //绑定选择过的日期
                if (date._lastTime != null) {
                    var cliyear = date._lastTime.split("-")[0];
                    var cliMonth = date._lastTime.split("-")[1];
                    var cliDay = date._lastTime.split("-")[2];
                    var clickDate = new Date(cliyear, cliMonth - 1, cliDay);
                    var printDate = new Date(ol_Year, ol_Month, nowPrintDay);
                    //  show 过去能否能点
                    if (isShowSE(clickDate, printDate, date)) {


                        if (span.getAttribute(IS_SPECIAL_DAY) == "true") {
                            span.className = span.getAttribute(RAW_CLASS) + " clickDate";
                        } else {
                            span.className = "clickDate";
                        }
                        span.onmouseout = function () {
                            if (this.getAttribute(IS_SPECIAL_DAY) == "true") {
                                this.className = this.getAttribute(RAW_CLASS) + " clickDate";
                            } else {
                                this.className = "clickDate";
                            }
                        };
                    }
                }

                newTd0.appendChild(span);
            }
        }
    }

    function close(fn) {
        //TODO:close all
        setTimeout(function () {
            dateNow.calElem.style.display = "none";
            fn && fn();
        }, 50)
    }
    function main(p) {
        var param = p || {};
        var date = {
            css: "",
            time: "",
            open: false,
            startTime: "",
            endTime: "",
            inputElem: this[0],
            showPast: false,
            fn: null,
            calElem: null,
            monthNum : 2,
            month : [],
            _lastTime: null,
            _nowMonth: 0
        };
        fish.lang.extend(date, param);
        //return exec(date, date.open);
        var newCal = fish.lang.proto(calFn);
        newCal.guid = "tc-" + fish.guid();
        newCal.init();
        return newCal;
    }

    main.close = close;


    var calFn = {
        init : function(){
            var outer = '<div id="'+ this.guid +'">'+
                '<iframe class="if" src="http://img1.40017.cn/cn/new_ui/public/images/png_cover.png"></iframe>'+
                '<div class="date">'+
                    '<div class="top">' +
                        '<span class="lastMonthBg">' +
                            '<span class="lastMonth"></span>' +
                        '</span>' +
                        '<h4 class="lastText"></h4>' +
                        '<span class="nextMonthBg" id="date_nextSpan">' +
                            '<span class="webkit_nextMonth"></span>' +
                        '</span>' +
                        '<h4 class="nextText"></h4>'+
                    '</div></div></div>';
            fish.one("body").html("bottom", outer);

            this.calElem = fish.dom("#" + this.guid);

            //设置月份，如果已经初始化就不用再设置了。
            for(var n=0, nmax=this.monthNum*3; n<nmax; n++){
                if(!this.month[n]){
                    this.month[n] = this.initMonth();
                }
                else{
                    this.month[n].set();
                }
            }

        },
        initMonth:function(){
            var newMonth = fish.lang.proto(this._calMonthFn);
            var inner =  '<div class="contentTime1 contentTime clearfix">'+
                        '<table cellspacing="0" cellpadding="0" id="tbl_lastMonth" border="0">'+
                            '<tbody>'+
                            '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';
            for(var n=0;n<6;n++){
                inner += '<tr>';
                    for(var i=0; i<7;i++){
                        inner += '<td class="td01"><span></span></td>';
                    }
                inner += '</tr>';
            }
            inner = inner + '</tbody></table><i class="monthBg">7</i></div>';
            newMonth.guid = fish.guid();
            return newMonth;
        },
        open : function(){

        },
        close : function(){

        },
        _calMonthFn : {
            setMonth : function(){

            }
        }
    };


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
			eachDay,
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
    fish.extend({
        mCal: main,
        preventInput: preventInput,
        recoverInput: recoverInput,
        parseTime: parseTime,
        parseDate: parseDate
    });
})();