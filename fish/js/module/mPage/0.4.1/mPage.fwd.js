﻿(function () {
    var regexpPagenum = /{pagenum}/i;

    function mPaging(param) {
        if (!param.url) {
            return;
        }


        //param.singleSize =  param.singleSize ? param.singleSize : 2 ;
        this.param = param;

        this.param.startWithAjax = this.param.startWithAjax != null ? this.param.startWithAjax : true;
        this.init();
    }



    mPaging.appendA = function (text, className, bagDiv, thisObj) {
        var a = document.createElement("a");
        a.innerHTML = text;
        a.setAttribute("href", "javascript:void(0);");
        var pageMess = mPaging.changeText(text, thisObj);


        if (pageMess.cls) {
            a.className = className + " " + pageMess.cls;
        } else {
            a.className = className
        }
        if (parseInt(pageMess.pageNum) > 0) {
            a.onclick = function () {
                if (thisObj.CURRENT_PAGE == pageMess.pageNum) {
                    return;
                }
                thisObj.paging(pageMess.pageNum);
            };
        }

        bagDiv.appendChild(a);
        return a;
    }

    mPaging.changeText = function (text, thisObj) {
        var pageMess = {};
        switch (text) {
            case "首页":
                if (thisObj.CURRENT_PAGE - 1 <= 0) {
                    pageMess.pageNum = -3;
                    pageMess.cls = "indexGrey"
                } else {
                    pageMess.pageNum = 1;
                    pageMess.cls = "indexNormal"
                }
                break;
            case "上一页":
                if (thisObj.CURRENT_PAGE - 1 <= 0) {
                    pageMess.pageNum = -1;
                    pageMess.cls = "prevGrey"
                } else {
                    pageMess.pageNum = thisObj.CURRENT_PAGE - 1;
                    pageMess.cls = "prevNormal"
                }
                break;
            case "下一页":
                if (thisObj.CURRENT_PAGE + 1 > thisObj.TOTAI_SIZE) {
                    pageMess.pageNum = -2;
                    pageMess.cls = "nextGrey"
                } else {
                    pageMess.pageNum = thisObj.CURRENT_PAGE + 1;
                    pageMess.cls = "nextNormal"
                }
                break;
            case "末页": if (thisObj.CURRENT_PAGE + 1 > thisObj.TOTAI_SIZE) {
                pageMess.pageNum = -4;
                pageMess.cls = "lastGrey"
            } else {
                pageMess.pageNum = thisObj.TOTAI_SIZE;
                pageMess.cls = "lastNormal"
            }
                break;
            default: pageMess.pageNum = text; break;
        }
        return pageMess;
    }

    mPaging.prototype = {
        init: function () {
            this.CURRENT_PAGE = this.num = 1;
            //this.loadCss(this.param.cls);
            if(this.param.startWithAjax){
                //直接开始异步分页
                this.paging(1);
            }
            else if(this.param.size){
                //先手动初始化，再异步分页
                this.build(this.param.size);
            }
        },

        paging: function (num) {
            num = num <= 0 ? 1 : num
            if (this.TOTAI_SIZE) {
                num = num > this.TOTAI_SIZE ? this.TOTAI_SIZE : num;
            }
            var _this = this,url,old = false;

            //兼容以前
            if(this.param.url.indexOf("{pagenum}")>0){
                url = this.param.url.replace(regexpPagenum, num);
            }else{
                old = true;
                if(/\?/i.test(this.param.url)){
                    url = this.param.url+"&"+this.param.args.pageNO+"="+num;
                }else{
                    url = this.param.url+"?"+this.param.args.pageNO+"="+num;
                }
            }

            if(typeof this.param.beforeAjaxFn === "function"){
                this.param.beforeAjaxFn.call(this, num);
            }

            fish.ajax({
                url: url,
                type: this.param.ajaxType || "json",
                fn: function (data) {
                    _this.CURRENT_PAGE = _this.now = num;
                    if(old && data && data.totalSize){
                        _this.build(data.totalSize, num);
                    }
                    _this.param.callback.call(_this, data, num);
                }
            })
        },
        build: function (_size) {
            var size = parseInt(_size,10);
            if(size == 1) {
                this.param.appendTo.html("");
                return;
            };
            this.TOTAI_SIZE = size;
            var _this = this;

            //清空分页
            this.param.appendTo.html("");

            var bagDiv = document.createElement("div");
            bagDiv.className = "bag_page";
            if (this.param.skip) {
                var textInput = document.createElement("input");
                textInput.type = "text";
                textInput.value = _this.CURRENT_PAGE;
                bagDiv.appendChild(textInput);
                var textButton = document.createElement("input");
                textButton.type = "button";
                textButton.value = "跳转";
                textButton.onclick = function () {
                    var skipPage = parseInt(textInput.value) > size ? size : parseInt(textInput.value);
                    _this.paging(skipPage);
                }
                bagDiv.appendChild(textButton);
            }

            if (typeof this.param.firstLast == "undefined" || this.param.firstLast) {
                mPaging.appendA("首页", "guidnum", bagDiv, this)
            }

            if (typeof this.param.prevNext == "undefined" || this.param.prevNext) {
                mPaging.appendA("上一页", "guidnum", bagDiv, this)
            }
            var pageSatrt = 1,pageEnd = 1;

            if (size > 6) {
                if (_this.CURRENT_PAGE <= 4 ) {
                    pageSatrt = 1;
                    pageEnd = 6;
                } else if (_this.CURRENT_PAGE>size-3 ) {
                    pageSatrt = size - 5;
                    pageEnd = size;
                } else {
                    pageSatrt = _this.CURRENT_PAGE - 3;
                    pageEnd = _this.CURRENT_PAGE + 2;
                }

            } else {
                pageSatrt = 1;
                pageEnd = size;
            }


            for (var i = pageSatrt; i <= pageEnd; i++) {
                if (i == _this.CURRENT_PAGE) {
                    var css = "pagenum currentpage";
                } else {
                    var css = "pagenum";
                }
                mPaging.appendA(i, css, bagDiv, this);
            }

            if(_this.CURRENT_PAGE<size-2 && size > 6){
                var pDom = document.createElement("span");
                pDom.innerHTML = "..."
                pDom.className = "mr10";
                bagDiv.appendChild(pDom);
            }
//            if (size > 6) {
//
//                var pDom = document.createElement("span");
//                pDom.innerHTML = "..."
//                pDom.className = "mr10";
//                bagDiv.appendChild(pDom);
//
//                for (var i = size - 2; i <= (size > 6 ? size : 0); i++) {
//                    if (i == _this.CURRENT_PAGE) {
//                        var css = "pagenum currentpage";
//                    } else {
//                        var css = "pagenum";
//                    }
//                    mPaging.appendA(i, css, bagDiv, this);
//                }
//            }
            if (typeof this.param.prevNext == "undefined" || this.param.prevNext) {
                mPaging.appendA("下一页", "guidnum", bagDiv, this)
            }

            if (typeof this.param.firstLast == "undefined" || this.param.firstLast) {
                mPaging.appendA("末页", "guidnum", bagDiv, this)
            }

            //console.log(this.param.appendTo)
            this.param.appendTo[0].appendChild(bagDiv);
        }
    }


    fish.extend({
        mPage: function (param) {
            param.appendTo = this;
            return new mPaging(param);
        }
    })
})()