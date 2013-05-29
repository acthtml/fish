(function () {
    function mFixing(param,ctx) {
        var isIe = false,
            showType = param.showType,
            fixed = param.fixed,
            fn = param.fn,
            isTop,//滚动元素是否在顶部，只有 showType为float时才有用到。
            isScroll = false;
        if(showType == "fixed" || showType == "float"){
            fish.one(param.elem).css("display:block");
            if(showType == "fixed"){
                isShowFixing();
            }
        }else{
            fish.one(param.elem).css("display:none");
        }
        function howDirection(itops,ibottoms){
            var contentLeft, contentRight;
            if(param.content){
                contentLeft = fish.all(param.content).offset().left;             //获取父标签的相对left
                contentRight = fish.all(window).width() - fish.all(param.content).width() - contentLeft;     //获取父标签的相对right
            }
            if(isIe){
                if(param.top != null){
                    fish.one(param.elem).css("top:" + itops + "px");
                }
                if(param.bottom != null){
                    fish.one(param.elem).css("top:" + ibottoms + "px");
                }
                fish.one(param.elem).css("position: absolute;");
            }else{
                if(param.top != null){
                    fish.one(param.elem).css("top:" + param.top + "px");
                }
                if(param.bottom != null){
                    fish.one(param.elem).css("bottom:" + param.bottom + "px");
                }
                fish.one(param.elem).css("position: fixed;");
            }
            if(param.left != null){
                fish.one(param.elem).css("left: " + (param.left + (contentLeft ? contentLeft : 0)) + "px;");
            }
            if(param.right != null){
                fish.one(param.elem).css("right: " + (param.right + (contentRight ? contentRight : 0)) + "px;");
            }
        }

        function isShowFixing(windowScrollTop,boxtop){
            if (fish.browser("ms", 6)) {
                if(windowScrollTop || boxtop){
                    var bottoms = windowScrollTop + fish.all(window).height() - param.bottom - fish.one(param.elem).height();
                    var tops =  windowScrollTop + parseInt(param.top,10);
                    if(showType == "float"){
                        tops = windowScrollTop + parseInt(param.top,10);
                    }
                    isIe = true;
                    howDirection(tops,bottoms);
                }else if(showType == "fixed"){
                    var btms = fish.all(window).height() - param.bottom - fish.one(param.elem).height();
                    var tps = param.top;
                    isIe = true;
                    howDirection(tps,btms);
                }
            } else {
                isIe = false;
                howDirection();
            }
//            if(showType == "fixed"){
//                fish.one(param.elem).css("display:block");
//            }
            if(showType == "top"){
                fish.one(param.elem).anim("opacity: 1", 100, {
                    fn:function () {
                        fish.one(param.elem).css("display:block");
                    }
                });
            }
        }

        var oriTop = fish.one(param.elem).offset().top,
            oriHeight = fish.one(param.elem).height(),
            windowHeight = fish.one(window).height();

        function mFixInit(){
            var scrollTop = fish.all(window).scrollTop();     //获取window的y方向滚动条位置数值
            isScroll = true;
            switch(showType)
            {
                case "top":
                    if (scrollTop) {
                        isShowFixing(scrollTop);
                    } else{
                        fish.one(param.elem).anim("opacity: 0", 500, {
                            fn:function () {
                                fish.one(param.elem).css("display:none");
                            }
                        });
                    }
                    break;
                case "float":
                    if(scrollTop > oriTop){
                        isTop = true;
                        isShowFixing(scrollTop,oriTop);
                    }
                    else if(scrollTop + windowHeight < oriTop){
                        if(param.floatBottom){
                            isTop = false;
                            isShowFixing(scrollTop,oriTop);
                        }
                    }
                    else{
                        isTop = false;
                        fish.all(param.elem).css("position:;left:;right:;top:;bottom:;display:;");
                    }
                    break;
                case "fixed":
                    isShowFixing(scrollTop);
                    break;
            }
        }
        //todo 在ie6有个小bug：先将浏览器缩小至出现横向滚动条的位置，然后将横向滚动条向右脱，然后最大化窗口，横向滚动条没消失。
        fish.all(window).on("scroll", function () {
            mFixInit();
            if(param.fn){
                param.fn.call(fish.one(param.elem),isTop);
            }
        });
        fish.all(window).on("resize", function () {
            mFixInit();
            if(param.fn){
                param.fn.call(fish.one(param.elem),isTop);
            }
        });
        if(showType == "top"){
            fish.one(param.elem).on("click", function () {
                document.documentElement.scrollTop = document.body.scrollTop = 0;
            })
        }
    }
    fish.extend({
        mFix:function (param) {
            var _this = this;
            for (var i = 0; i < _this.length; i++) {
                var x = {};
                for (var j in param) {
                    x[j] = param[j];
                }
                x.elem = _this[i];
                mFixing(x);
            }
//            return {
//                positin:function(){
//                    var scrollTop = fish.all(window).scrollTop();
//                    isShowFixing(scrollTop);
//                }
//            }
        }
    });
})();

