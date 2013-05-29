(function () {
    var placeHolderImgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY0RkEyNjlDQTYyQTExRTE4QTEzOTI0OUM1OERFNkVEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY0RkEyNjlEQTYyQTExRTE4QTEzOTI0OUM1OERFNkVEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjRGQTI2OUFBNjJBMTFFMThBMTM5MjQ5QzU4REU2RUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjRGQTI2OUJBNjJBMTFFMThBMTM5MjQ5QzU4REU2RUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5K9V7MAAAABlBMVEXMzMwAAADTMzNkAAAADElEQVR42mJgAAgwAAACAAFPbVnhAAAAAElFTkSuQmCC";
    var placeHolderImgName = "grey.png";
    var loadingPicSrc = "http:\/\/img1.40017.cn/cn/comm/images/cn/public/transparent_loading.gif"; //15*15
    var transparentPicSrc = "http:\/\/img1.40017.cn/cn/new_ui/public/images/transparent.gif";
    function lazyLoad(option) {
        init(option, this);
    };
    function init(option, elems) {
        var settings = {
            preSpace: 0,
            failurelimit: 10,
            //effect: "fadeIn",
            attr: "orisrc",
            container: window,
            aniTime: 300
        };
        if (option) {
            fish.lang.extend(settings, option);
        }
        setTimeout(function () {
            scrollHandler(elems, settings);
        }, 2000);
        notLoadImg(elems, settings);
        fish.one(settings.container).on("scroll", function () {
            scrollHandler(elems, settings);
        });
    };

    function notLoadImg(elems, settings) {
        if (elems.each) {
            elems.each(function () {
                var self = this;

                /* Save original only if it is not defined in HTML. */
                if (undefined == fish.one(self).attr(settings.attr)) {
                    fish.one(self).attr(settings.attr, fish.one(self).attr("src"));
                }
                //替换图片 


                if (settings.placeholder) {
                    fish.one(self).attr("src", settings.placeholder);
                } else {
                    //都用统一的转圈的图片
                    var img = fish.one(self);
                    img.attr("src", transparentPicSrc);
                    //如下这样写效率比较高
                    img[0].style.cssText = "background:url(" + loadingPicSrc + ") scroll no-repeat center center #fff";

                    /*
                    //ie 6,7不支持图片src的内容为base64编码的字符串
                    if (fish.browser("ms", 6) || fish.browser("ms", 7)) {
                    fish.one(self).attr("src", getPlaceHolderImgLoc());

                    } else {
                    fish.one(self).attr("src", placeHolderImgBase64);
                    }
                    */

                }

                self.loaded = false;

            });
        }
    };
    function scrollHandler(elements, settings) {

        settings.timer && clearTimeout(settings.timer);
        settings.timer = setTimeout(function () {
            var counter = 0;
            elements.each(function () {
                if (abovethetop(this, settings) ||
            	    leftofbegin(this, settings)) {
                    //
                }
                else
                    if (!belowthefold(this, settings) &&
                    !rightoffold(this, settings)) {
                        
                        appearIt(this, settings);
                        //elements.clear(this);
                    }
                    else {
                        if (counter++ > settings.failurelimit) {
                            return false;
                        }
                    }
            });
        }, 100);
        /*
        elements.clear(function () {
        //如果出错或者载入完成，移除这张图片
        return !(!(this.loaded === true) && !(this.err === true));
        });

        */


    };
    function appearIt(elem, settings) {
        var showElem = fish.one(elem);
        if (!elem.loaded) {
            showElem.attr("src", showElem.attr(settings.attr));
            elem.removeAttribute(settings.attr);
            //标记出错
            showElem.onerror = function () {
                elem.err = true;
            }
        }


    };
    //XXX 希望以后能把这四个方法合并成一个方法
    function belowthefold(element, settings) {
        //可视区域之下
        if (settings.container === undefined || settings.container === window) {
            var fold = fish.one(window).height() + fish.one(window).scrollTop();
        } else {
            var fold = fish.one(settings.container).offset().top + fish.one(settings.container).height();
        }
        return fold <= fish.one(element).offset().top - settings.preSpace;
    };

    function rightoffold(element, settings) {
        //可视区域之右
        if (settings.container === undefined || settings.container === window) {
            var fold = fish.one(window).width() + fish.one(window).scrollLeft();
        } else {
            var fold = fish.one(settings.container).offset().left + fish.one(settings.container).width();
        }
        return fold <= fish.one(element).offset().left - settings.preSpace;
    };

    function abovethetop(element, settings) {
        //可视区域之上
        if (settings.container === undefined || settings.container === window) {
            var fold = fish.one(window).scrollTop();
        } else {
            var fold = fish.one(settings.container).offset().top;
        }
        return fold >= fish.one(element).offset().top + settings.preSpace + fish.one(element).height();
    };

    function leftofbegin(element, settings) {
        //可视区域之左
        if (settings.container === undefined || settings.container === window) {
            var fold = fish.one(window).scrollLeft();
        } else {
            var fold = fish.one(settings.container).offset().left;
        }
        return fold >= fish.one(element).offset().left + settings.preSpace + fish.one(element).width();
    };
    function getPlaceHolderImgLoc() {
        var matchSrc = "",
            scriptSrc = "",
            placeHolderImgLoc = "",
            indexOfLasyLoad = -1,
            indexOfImgLoc = -1;
        fish.all("script").each(function () {
            //内联元script不存在src属性
            if (!fish.one(this).attr("src")) {
                return;
            }
            indexOfLasyLoad = fish.one(this).attr("src").indexOf("lazyLoad");
            if (indexOfLasyLoad > -1) {
                scriptSrc = fish.one(this).attr("src");
                matchSrc = scriptSrc.match(/.*(?=lazyLoad\.)/g)[0];
                return false;
            }

        });
        placeHolderImgLoc = matchSrc + placeHolderImgName;
        return placeHolderImgLoc;
    }

    fish.extend({
        lazyLoad: lazyLoad
    });
})();








