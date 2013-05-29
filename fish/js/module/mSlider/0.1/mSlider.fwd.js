(function () {
    var mSlider = function (pParam, callback) {
        if (!this[0]) return;

        var param = {
            scrollNum: 1,
            autoScroll: true,
            moveTime: 3500,
            direction: "x",
            showNav: "orange",
            circle: false,
            canvas: ".mSlider_con",
            content: ".mSlider_con li",
            nav: ".mSlider_nav li",
            // slide 滑动幻灯
            // fade 渐变幻灯
            aniType: "fade",
            fadeTime: 240,
            arrows: false,
            prevHtml: "",
            nextHtml: ""
        },
            rule,
            resetRule;
        
        console.log(param.arrows);

        fish.lang.extend(param, pParam);

        // 上一个，下一个箭头添加
        if (param.arrows) {
            prevArrow = document.createElement("div");
            prevArrow.className = "mSlider_arrow mSlider_prev";
            prevArrowInner = document.createElement("div");
            prevArrowInner.className = "mSlider_arrow_inner mSlider_prev_inner";
            prevArrow.appendChild(prevArrowInner);

            nextArrow = document.createElement("div");
            nextArrow.className = "mSlider_arrow mSlider_next";
            nextArrowInner = document.createElement("div");
            nextArrowInner.className = "mSlider_arrow_inner mSlider_next_inner";
            nextArrow.appendChild(nextArrowInner);

            this.html("bottom", prevArrow);
            this.html("bottom", nextArrow);

            fish.all([prevArrow, nextArrow]).css("position: absolute; z-index: 100;");

            param.prevHtml && fish.one(prevArrowInner).html(param.prevHtml);
            param.nextHtml && fish.one(nextArrowInner).html(param.nextHtml);
        }

        if (fish.browser("ms", 8) || fish.browser("ms", 6) || fish.browser("ms", 7)) {
            rule = "filter:alpha(opacity=100);";
            resetRule = "filter:alpha(opacity=0);";
        } else {
            rule = "opacity:1;";
            resetRule = "opacity:0";
        }

        if (param.aniType === "fade") {
            param.direction = false;
        }
        var nowWH = 0, // 宽度
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
            oneWH = param.direction === "x" ? allCon.width() : allCon.height(),
            styleType = param.direction === "x" ? "left" : "top",
            contentType = param.direction === "x" ? "width" : "height",
            scrollWH = oneWH * param.scrollNum,
            tt,
            fadeImgs,
            lastOne,
            currentOne,
            fadeCache = [],
            zIndex = allNum;

        this.css("position:relative;overflow:hidden;");
        theLayer.css("position:relative;" + contentType + ":" + (allNum + 1) * oneWH + "px");
        // 如果动画类型是 渐变（fade）
        if (param.aniType === "fade") {
            fadeImgs = fish.all(param.content + " img", that).css("display: none;" + resetRule);
            lastOne = fish.one(fadeImgs[0]);
            lastOne.css("display: block;" + rule);
            allCon.each(
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
                    //                    for (var i = 0, imax = allNum; i < imax; i++) {
                    //                        navHtml += "<li><img src=" + fish.one("img", allCon[i]).attr("src") + " /></li>";
                    //                    }
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
            if (param.circle && animer) {
                return;
            }
            nowNum = n;
            !param.circle && fixNum();
            up_mTop();
        }

        function goNext() {
            if (param.circle && animer) {
                return;
            }
            goTo(++nowNum);
        }
        function goPrev() {
            //坑爹的代码，就这样写吧，如果是循环的幻灯，就不能再动画的时候再发生动画 得等动画结束
            if (param.circle && animer) {
                return;
            }
            goTo(--nowNum);
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
            //            if (topTimeout) {
            //                clearTimeout(topTimeout);
            //            }
            if (tt) {
                clearTimeout(tt);
            }
            tt = setTimeout(up_load, param.moveTime);
        }

        function stopAnim() {
            clearTimeout(tt);
        }

        function up_mTop() {
            var current = null,
                last = null;

            switch (param.aniType) {
                case "slide":
                    if (nowNum < 0) {
                        //如果是循环滚动，需要不停的修改节点位置,很多bug，比如nowNum是负数的时候，就不重写结构了
                        var appendTime = -nowNum * param.scrollNum;
                        for (var n = 0; n < appendTime; n++) {
                            theLayer.html("top", fish.all(param.content + ":last-child", that));
                        }
                        theLayer.css(styleType + ":" + (nowNum * scrollWH) + "px");
                        nowNum = 0;
                    }

                    nowWH = -(nowNum * scrollWH);

                    animer = theLayer.anim(styleType + ":" + nowWH + "px", 300, function () {
                        if (param.circle && nowNum > 0) {
                            //如果是循环滚动，需要不停的修改节点位置,很多bug，比如nowNum是负数的时候，就不重写结构了
                            // console.log("let me in!"); // but no
                            var appendTime = nowNum * param.scrollNum;
                            for (var n = 0; n < appendTime; n++) {
                                theLayer.html("bottom", fish.all(param.content + ":first-child", that));
                            }
                            theLayer.css(styleType + ":0px");
                            nowNum = 0;
                        }
                        animer = null;
                    });

                    break;
                case "fade":
                    // fadeImgs.css("display:none;" + resetRule);

                    if (!lastAnimer || !currentAnimer) {
                        currentOne = fish.one(fadeImgs[nowNum]);
                        lastAnimer = lastOne.anim(
                            resetRule,
                            param.fadeTime,
                            function () {
                                lastOne.css("display: none;");
                                lastAnimer = null;
                                if (fadeCache.length && !currentAnimer) {
                                    goTo(fadeCache.pop());
                                    fadeCache = [];
                                }
                            }
                        );
                        currentAnimer = currentOne.css("display:block;").anim(
                            rule,
                            param.fadeTime,
                            function () {
                                lastOne = currentOne;
                                currentAnimer = null;
                                if (fadeCache.length && !lastAnimer) {
                                    goTo(fadeCache.pop());
                                    fadeCache = [];
                                }
                            }
                        );
                    } else {
                        fadeCache.push(nowNum);
                        // console.log(fadeCache);
                    }

                    break;

            }
            if (allNav) {
                allNav.removeClass("current");
                fish.one(allNav[nowNum]).addClass("current");
            }

        }

        function up_load() {
            // console.log(new Date().getSeconds());
            goNext();
            tt = setTimeout(up_load, param.moveTime);
        }
        var mSliderObj = {
            startScroll: startAnim,
            stopScroll: stopAnim,
            scrollTo: goTo,
            scrollNext: goNext,
            scrollPrev: goPrev
        };

        if (prevArrow && nextArrow) {
            fish.one(prevArrow).on(
                "click",
                function () {
                    mSliderObj.scrollPrev();
                }
            );
            fish.one(nextArrow).on(
                "click",
                function () {
                    mSliderObj.scrollNext();
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
