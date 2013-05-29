(function () {
    var mSlider = function (pParam, callback) {
        if (!this[0]) { return; }

        var param = {
            scrollNum: 1,
            autoScroll: true,
            moveTime: 3500,
            direction: "scrollLeft",
            // 边界判断，用于幻灯运行到边界处暂停，比如水平运动时，到达最后一张，属于结束边界，到达第一张属于开始边界
            // 默认 false，做边界判断。如不需要边界判断，指定 true
            circle: false,
            canvas: ".mSlider_con ul",
            content: ".mSlider_con li",
            nav: ".mSlider_nav li",
            // 新增缩略图模式，如果需要，需指定showNav: "thumbNail"（观察需求）
            showNav: "orange",
            // 新增，默认 slide，fade 需指定 aniType: "fade"
            aniType: "slide",
            // 新增，默认 240 毫秒，如果指定，如：fadeTime: 100，100 的类型为（Number），那么需符合公式 fadeTime × 2 < moveTime
            fadeTime: 240,
            // 新增，默认 false，如果需要导航箭头，需指定 arrows: true
            arrows: false,
            // 新增，默认 false，如果需要导航箭头的主题，需指定 arrowTheme: "sunny"(目前只有默认，默认导航风格是团购)
            arrowTheme: false,
            // 不开放！新增，默认 ""，如果需要指定上一个箭头容器内的 innerHTML，需指定 prevHTML: "文字或标签结构字符串"
            // prevHtml: "",
            // 不开放！新增，默认 ""，如果需要指定下一个箭头容器内的 innerHTML，需指定 nextHTML: "文字或标签结构字符串"
            // nextHtml: "",
            // 新增，默认 false，如果需要指定点击上一个箭头时执行自定义操作，需指定 
            // prevFn: function(obj) {
            //     // obj 是 mslider 返回的对象
            //     // obj 有一些默认操作
            //     //  startScroll: startAnim, 开始幻灯
            //     //  stopScroll: stopAnim, 停止幻灯
            //     //  scrollTo: goTo, 跳到某个幻灯片
            //     //  scrollNext: goNext, 走到下一个幻灯片
            //     //  scrollPrev: goPrev 返到下一个幻灯片
            // }
            prevFn: false,
            // 新增，默认 false，如果需要指定点击上一个箭头时执行自定义操作，需指定 
            // nextFn: function(obj) {
            //     // obj 是 mslider 返回的对象
            //     // obj 有一些默认操作
            //     //  startScroll: startAnim, 开始幻灯
            //     //  stopScroll: stopAnim, 停止幻灯
            //     //  scrollTo: goTo, 跳到某个幻灯片
            //     //  scrollNext: goNext, 走到下一个幻灯片
            //     //  scrollPrev: goPrev 返到下一个幻灯片
            // }
            nextFn: false,
            // 上一个按钮的选择器，必须和下一个按钮选择器同传，同传后忽略 arrowTheme，如 prevBtn: "#last_btn"
            prevBtn: false,
            // 下一个按钮的选择器，必须和上一个按钮选择器同传，同传后忽略 arrowTheme，如 prevBtn: "#next_btn"
            nextBtn: false
        };

        fish.lang.extend(param, pParam);

        var rule,
            resetRule,
            preArrow,
            nextArrow,
            //边界预留的数目
            boundaryNum = 1,
            nowWH = 0, // 宽度
            nowNum = 0,
        // topTimeout, //幻灯定时器
            allCon = fish.all(param.content, this),
            allNum = allCon.length,
            theLayer = fish.all(param.canvas, this),
            that = this,
            allNav,
            animer,
            lastAnimer,
            currentAnimer,
            oneWH,
            styleType,
            contentType,
            scrollWH,
            tt,
            fadeImgs,
            lastOne,
            currentOne,
        // fadeCache = [],
            zIndex = allNum,
            gLastNum,
            previousNum,
            mSliderObj = {};

        // 上一个，下一个箭头添加
        if (param.arrows) {
            if (!param.prevBtn && !param.nextBtn) {
                switch (param.arrowTheme) {
                    default:
                        fish.one(this[0].parentNode).html("top", "<div id=\"id_mSlider_prev\" class=\"mSlider_arrow mSlider_prev group_left\"><span id=\"tg_last\" class=\"mSlider_arrow_inner mSlider_prev_inner btn01_a\"></span></div>");
                        fish.one(this[0].parentNode).html("bottom", "<div id=\"id_mSlider_next\" class=\"mSlider_arrow mSlider_next group_right\"><span id=\"tg_next\" class=\"mSlider_arrow_inner mSlider_next_inner btn02_a\"></span></div>");
                        prevArrow = fish.dom("#tg_last");
                        nextArrow = fish.dom("#tg_next");
                        break;
                }
            } else {
                //先找子集再找全局
                prevArrow = fish.dom(param.prevBtn, this);
                prevArrow = prevArrow ? prevArrow : fish.dom(param.prevBtn);
                nextArrow = fish.dom(param.nextBtn, this);
                nextArrow = nextArrow ? nextArrow : fish.dom(param.nextBtn);
            }
            // param.prevHtml && fish.one(prevArrowInner).html(param.prevHtml);
            // param.nextHtml && fish.one(nextArrowInner).html(param.nextHtml);
        }

        //对msilider0.1做兼容
        if (param.direction == "x") {
            param.direction = "scrollLeft";
        } else if (param.direction == "y") {
            param.direction = "scrollTop";
        }
        switch (param.direction) {
            case "scrollLeft":
            case "scrollRight":
                styleType = "left";
                contentType = "width";
                oneWH = allCon.width();
                boundaryNum = parseInt( fish.one(theLayer[0].parentNode).width() / oneWH, 10);
                break;
            case "scrollTop":
            case "scrollBottom":
                styleType = "top";
                contentType = "height";
                oneWH = allCon.height();
                boundaryNum = parseInt( fish.one(theLayer[0].parentNode).height() / oneWH, 10);
                break;
            default:
                styleType = "left";
                contentType = "width";
                oneWH = allCon.width();
                break;
        }

        scrollWH = oneWH * param.scrollNum;



        this.css("position:relative;overflow:hidden;");
        theLayer.css("position:relative;" + contentType + ":" + (allNum + 1) * oneWH + "px");

        // 如果动画类型是 渐变（fade）
        if (param.aniType === "fade") {

            if (fish.browser("ms", 8) || fish.browser("ms", 6) || fish.browser("ms", 7)) {
                rule = "filter:alpha(opacity=100);";
                resetRule = "filter:alpha(opacity=1);";
            } else {
                rule = "opacity:1;";
                resetRule = "opacity:0.01";
            }

            theLayer.css(contentType + ":" + oneWH + "px");
            fadeImgs = fish.all(param.content, that);
            fadeImgs.css("display: none;" + resetRule);
            lastOne = fish.one(fadeImgs[0]);
            lastOne.css("display: block;" + rule);
            fadeImgs.each(
                function (ele) {
                    fish.one(ele).css("position: absolute; z-index: " + (zIndex--) + ";top: 0; left: 0;");
                }
            );

        }



        //给个参数来设置自动滚动
        if (param.autoScroll) {
            tt = setTimeout(up_load, param.moveTime);
            this.hover(
                stopAnim,
                startAnim
            );
        }

        if (param.showNav) {
            //先自动生成nav小橘色方块
            var navHtml = "", titleA, title, widthNav, prevArrow, prevArrowInner, nextArrow, nextArrowInner;

            switch (param.showNav) {
                case "orange":
                    navHtml += "<ul class='mSlider_nav_orange mSlider_nav'>";
                    for (var i = 0, imax = allNum; i < imax; i++) {
                        navHtml += "<li><a href='javascript:void(0)'>" + (i + 1) + "</a></li>";
                    }
                    navHtml += "</ul>"

                    this.html("bottom", navHtml);
                    break;
                case "bottom-green":
                    navHtml = '<div class="mSlider_nav_bg"></div><div class="mSlider_nav_bottom_green mSlider_nav clearfix"><div class="holder clearfix">';
                    titleA = fish.all("a", theLayer);
                    widthNav = oneWH * param.scrollNum / allNum + "px";
                    for (var i = 0, imax = allNum; i < imax; i++) {
                        title = fish.one(titleA[i]).attr("title");
                        navHtml += '<a style="width:' + widthNav + ';" href="javascript:void(0);" title="' + title + '"><span>' + title + '</span><i class="outter">◆</i></a>';
                    }
                    navHtml += "</div></div>";

                    this.html("bottom", navHtml);

                    //设置该主题的默认nav索引
                    param.nav = ".mSlider_nav a";

                    break;
                case "earth-yellow":
                    navHtml = '<div class="mSlider_nav_bg"></div><div class="mSlider_nav_earth_yellow mSlider_nav clearfix"><div class="holder clearfix">';
                    titleA = fish.all("a", theLayer);
                    widthNav = oneWH * param.scrollNum / allNum + "px";
                    for (var i = 0, imax = allNum; i < imax; i++) {
                        title = fish.one(titleA[i]).attr("title");
                        navHtml += '<a style="width:' + widthNav + ';" href="javascript:void(0);" title="' + title + '"><span>' + title + '</span><i class="outter">◆</i></a>';
                    }
                    navHtml += "</div></div>";

                    this.html("bottom", navHtml);

                    //设置该主题的默认nav索引
                    param.nav = ".mSlider_nav a";

                    break;
                case "thumbnail":
                    navHtml += "<ul class='mSlider_nav_thumbnail mSlider_nav clearfix'>";
                    navHtml += thumbnailHandler();
                    navHtml += "</ul>"
                    // param.nav = ".mSlider_nav li";
                    this.html("bottom", navHtml);
                    break;
            }
            allNav = fish.all(param.nav, this);
            if (param.showNav === "thumbnail") {
                allNav.hover(
                    cursorOver,
                    function () { return; }
                );
            } else {
                allNav.on("mouseover", cursorOver);
            }

        }

        function thumbnailHandler() {
            var str = "",
                i = 0;
            while (i < allNum) {
                str += "<li><img src=" + fish.all("a", allCon[i++]).attr("small") + " /></li>";
            }
            return str;
        }

        function cursorOver(e) {
            var b = this;
            var n = 0;
            var bton = allNav.removeClass("current");
            var current = null;
            for (var i = 0; i < bton.length; i++) {
                if (b === bton[i]) {
                    n = i;
                }
            }
            fish.one(b).addClass("current");

            goTo(n);
        }

        //先默认给第一个样式来了
        fish.one(allNav).addClass("current");

        function goTo(n) {
            previousNum = nowNum;
            if (param.circle && animer) {
                return;
            }

            nowNum = n;

            param.circle && fixNum();

            mSliderObj.index = nowNum;
            if (nowNum === 0) {
                mSliderObj.boundary = "begin"
            } else if (nowNum === allNum - boundaryNum) {
                mSliderObj.boundary = "end"
            } else {
                mSliderObj.boundary = false;
            }

            // console.dir(mSliderObj);

            if (nowNum > previousNum) {
                if (param.beforeNextFn && typeof param.beforeNextFn === "function") {
                    param.beforeNextFn(mSliderObj);
                    up_mTop(param.nextFn);
                } else {
                    up_mTop(param.nextFn);
                }

            } else if (nowNum < previousNum) {
                if (param.beforePrevFn && typeof param.beforePrevFn === "function") {
                    param.beforePrevFn(mSliderObj);
                    up_mTop(param.prevFn);
                } else {
                    up_mTop(param.prevFn);
                }

            } else {
                return;
            }

        }

        function goNext() {
            if (param.circle && animer) {
                return;
            }
            goTo(nowNum + 1);
        }
        function goPrev() {
            // 坑爹的代码，就这样写吧，如果是循环的幻灯，就不能再动画的时候再发生动画 得等动画结束
            // 
            if (param.circle && animer) {
                return;
            }
            goTo(nowNum - 1);

        }

        function fixNum() {
            if (nowNum >= allNum) {
                nowNum = 0;
            }
            else if (nowNum < 0) {
                nowNum = allNum - 1;
            }
        }

        function startAnim() {
            if (tt) {
                clearTimeout(tt);
            }
            tt = setTimeout(up_load, param.moveTime);
        }

        function stopAnim() {
            clearTimeout(tt);
        }

        function up_mTop(fn) {

            switch (param.aniType) {
                case "slide":
                    if (nowNum > allNum - 1) {
                        nowNum = 0;
                    }
                    if (/* nowNum < 0 */param.circle && nowNum < previousNum) {
                        // 如果是循环滚动，需要不停的修改节点位置,很多bug，比如nowNum是负数的时候，就不重写结构了
                        // 以上遗留的注释需要留心，当前的情况未必如上所说，但务必需求留心
                        var appendTime = param.scrollNum;
                        for (var n = 0; n < appendTime; n++) {
                            fish.one(theLayer).html("top", fish.all(param.content + ":last-child", that));
                        }
                        theLayer.css(styleType + ":" + (-scrollWH) + "px");
                        scrollWH = 0;
                    }

                    if (param.circle) {
                        nowWH = -scrollWH;
                    } else {
                        nowWH = -nowNum * scrollWH;
                    }


                    animer = theLayer.anim(styleType + ":" + nowWH + "px", 300, function () {
                        if (param.circle) {
                            //如果是循环滚动，需要不停的修改节点位置,很多bug，比如nowNum是负数的时候，就不重写结构了
                            if (nowNum < previousNum) {
                                scrollWH = oneWH * param.scrollNum;
                                nowNum++;
                            } else {
                                var appendTime = param.scrollNum;
                                if (param.direction == "scrollLeft" || param.direction == "scrollTop") {
                                    for (var n = 0; n < appendTime; n++) {
                                        fish.one(theLayer).html("bottom", fish.all(param.content + ":first-child", that));
                                    }
                                } else {
                                    for (var n = 0; n < appendTime; n++) {
                                        fish.one(theLayer).html("top", fish.all(param.content + ":last-child", that));

                                    }

                                }
                                theLayer.css(styleType + ":0px");
                                nowNum--;
                                if (nowNum < 0) {
                                    nowNum = allNum - 1;
                                }
                            }
                        }
                        if (fn && typeof (fn) === "function") {
                            fn(mSliderObj);
                        }
                        animer = null;
                    });

                    break;
                case "fade":

                    if (!lastAnimer || !currentAnimer) {
                        currentOne = fish.one(fadeImgs[nowNum]);
                        lastAnimer = lastOne.anim(
                            resetRule,
                            param.fadeTime,
                            function () {
                                lastOne.css("display: none;");
                                lastAnimer = null;
                                lastOne = currentOne;
                            }
                        );

                        currentAnimer = currentOne.css("display:block;").anim(
                            rule,
                            param.fadeTime,
                            function () {
                                currentAnimer = null;
                            }
                        );
                    } else {
                        if (lastAnimer) {
                            lastAnimer.stop();
                            fish.one(lastAnimer.elem).css("display: none;" + resetRule);
                            lastAnimer = null;
                        }
                        if (currentAnimer) {
                            currentAnimer.stop();
                            lastOne = fish.one(currentAnimer.elem);
                            currentAnimer = null;
                            currentOne = fish.one(fadeImgs[nowNum]);
                            lastAnimer = fish.one(lastOne).anim(
                                resetRule,
                                param.fadeTime,
                                function () {
                                    lastOne.css("display: none;");
                                    lastAnimer = null;
                                    lastOne = currentOne;
                                }
                            );
                            currentAnimer = currentOne.css("display:block;").anim(
                                rule,
                                param.fadeTime,
                                function () {
                                    currentAnimer = null;
                                }
                            );
                        }
                    }

                    break;

            }
            if (allNav) {
                allNav.removeClass("current");
                fish.one(allNav[nowNum]).addClass("current"); //XXX在循环模式下有问题
            }

        }

        function up_load() {

            if (param.direction == "scrollLeft" || param.direction == "scrollTop") {
                goNext();
            } else {
                goPrev();
            }

            tt = setTimeout(up_load, param.moveTime);
        };

        mSliderObj.startScroll = startAnim;
        mSliderObj.stopScroll = stopAnim;
        mSliderObj.scrollTo = goTo;
        mSliderObj.scrollNext = goNext;
        mSliderObj.scrollPrev = goPrev;
        mSliderObj.boundary = "begin";
        mSliderObj.index = 0;

        if (prevArrow && nextArrow) {
            fish.one(prevArrow).on(
                "click",
                function () {

                    if (!param.circle && mSliderObj.boundary === "begin") {
                        return;
                    } else {
                        mSliderObj.scrollPrev();
                    }
                    // console.dir(mSliderObj);

                }
            );
            fish.one(nextArrow).on(
                "click",
                function () {

                    if (!param.circle && mSliderObj.boundary === "end") {
                        return;
                    } else {
                        mSliderObj.scrollNext();
                    }
                    // console.dir(mSliderObj);

                }
            )
        }


        callback && callback(mSliderObj);

        return mSliderObj;
    }
    fish.extend({
        mSlider: mSlider
    });
})();
