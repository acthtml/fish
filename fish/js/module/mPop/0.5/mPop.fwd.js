

(function () {

    fish.one(document.body).html("top", "<div id='mPopRuleElem' style='position: absolute;width:100px;height:100px;top:0px;left:-100px;'></div>")
    //TODO:
    var mPopStack = [],
        ruleElem = fish.dom("#mPopRuleElem");

    /**弹出框**/
    /**
    *
    * @param {Object} obj 配置对象
    * 		{string} text:string 弹出框的title,可以不设,有默认值
    * 		{string} width:string 弹出框的宽度,有默认值，可以不设
    * 		{string} height:string 弹出框的高度,有默认值，可以不设
    * 		{boolean} cover 是非允许弹出多个窗口  0.4 isCovers
    * 	   	{boolean} overlay 是否有背景层     0.4 isOverlay     ToDoIE中只显示当前屏幕的背景
    *       {boolean} bgclose 点击背景层是否关闭  0.4 overlayClose
    * 		{boolean} iframe:boolean true:弹出框是个iframe ;false:普通弹层
    * 		{string} src:iframe的地址，不是ifame的时候没有任何意义
    *       {string} className:string 在弹出层最外层结构mPopOutBag上添加类名，进行重置默认样式
    * 		{dom/string} content：普通弹层的内容
    * 		{string} cls:普通弹层的样式名称
    * 	    {boolean} dragable   是否可以拖动   0.4  isDrag
    *      {fn}  beforClose 关闭前fn
    *      {fn}  afterClose 关闭后fn
    *      {obj}   relative   {relativeObj:dom,top:numeber,left:numeber}弹出层相对位置
    * @param boolean bool
    * 			true:显示背景
    * 			false: 不显示
    *
    */

    /**
    弹框组件
    function fn_winBox(obj,bool){
    return new winBox(obj,bool);
    }
    树型组件
    function fn_TreePanel(obj){
    return new TreePanel(obj);
    }**/

    function main(obj) {
        return new winBox(obj);
    }
    main.close = function (notExuteAfterCloseCallBack) {
        for (var i = mPopStack.length - 1; i >= 0; i--) {
            mPopStack.shift().hide(null, notExuteAfterCloseCallBack);
        }
    }

    fish.extend({ mPop: main });

    function winBox(obj) {
        this.obj = obj;
        this.init(obj.isOverlay);
    }

    function pushStack(mPopObj) {
        if (Object.prototype.toString.call(mPopStack) === "[object Array]") {
            mPopStack.push(mPopObj);
        }
        mPopObj.location = mPopStack.length - 1;
    }

    function spliceStack(location, length) {
        if (mPopStack) {
            mPopStack.splice(location, length);
        }
    }

    winBox.checkNone = function (obj) {

    }

    winBox.prototype = {
        init: function (bool) {  //初始化弹层
            if (!this.obj.isCovers) {
                fish.mPop.close();
                if(this.obj.beforeOpen && typeof(this.obj.beforeOpen)){
                    this.obj.beforeOpen();
                }
            }
            var _this = this, //存储this
        	    w = fish.all(document).width(), //视窗宽度
			    h = fish.all(window).height(), //视窗高度
			    mPopOutBag,                    //弹出层最外层的bag
			    iframe,                   //ie下面的遮罩
			    topBag, 				//顶部的bag
       		    title, 				//title的bag
			    closeImg, 				//关闭的图标dom
			    isDrag, 					//是否可拖动
			    contents, 			//主体dom
			    _w = 0,
			    _h = 0,
			    bgBag,
			    bgIframe;

            //容器
            this.obj.containElem = this.obj.containElem ? this.obj.containElem : document.body;

            mPopOutBag = document.createElement("div");
            mPopOutBag.className = "mPopWrapper";
            if (this.obj.className) {
                fish.all(mPopOutBag).addClass(this.obj.className);
            }

            this.obj.overlayClose = this.obj.overlayClose == null ? true : this.obj.overlayClose;



            fish.all(mPopOutBag).on("click", function (e) {
                fish.stopBubble(e);
            })
            mPopOutBag.style.position = "absolute";
            if (fish.one(".mPopWrapper", this.obj.containElem).length == 0) {
                mPopOutBag.style.zIndex = 1000;            
            } else {
                mPopOutBag.style.zIndex = (fish.one(".mPopWrapper", this.obj.containElem)[0].style.zIndex) * 1 + 10;
            }
            //不使用iframe了，采用隐藏select的方法
            //            if (fish.browser("ms", 6)) {
            //                iframe = document.createElement("iframe");
            //                iframe.setAttribute("frameBorder", "no")
            //                iframe.className = "filiternone";
            //                fish.all(iframe).css("width:100%;height:100%;position:absolute;z-index:-1;");
            //                mPopOutBag.appendChild(iframe);
            //            }
            if (this.obj.title) {
                topBag = document.createElement("div");
                topBag.className = "mPopTop";
                fish.all(topBag).css("width:100%;z-index:10;");
                mPopOutBag.appendChild(topBag);
                titleBag = document.createElement("span");
                titleBag.className = "boxTitle";
                // titleBag.style.width = (fish.all(this.obj.content).width() - 20) + "px";
                titleBag.innerHTML = this.obj.title; //?this.obj.title:"请设置title";
                topBag.appendChild(titleBag);

                closeImg = document.createElement("img");
                closeImg.src = "http://img1.40017.cn/cn//new_ui/public/images/mPopClose.png";
                closeImg.className = "closeImg";
                topBag.appendChild(closeImg);
                isDrag = this.obj.dragable == undefined ? true : this.obj.dragable;
                if (typeof topBag.onselectstart) {
                    topBag.onselectstart = function () {
                        return false;
                    }
                }
                if (isDrag) {
                    this._initDrag(topBag);
                }
                this.hide(closeImg);
            }

            contents = document.createElement("div");
            contents.className = "mPopContent";
            if (this.obj.iframe) {
                iframe = document.createElement("iframe");
                iframe.setAttribute("frameBorder", "no");
                fish.all(iframe).css("width:100%;height:100%;position:absolute;z-index:10;");
                contents.appendChild(iframe);
                contents = iframe;
                iframe.src = this.obj.src ? this.obj.src : "";   //src设置
            } else if (this.obj.content) {
                if (typeof this.obj.content == "string") {
                    fish.all(contents).css("z-index:10;width:100%;");
                    contents.innerHTML = this.obj.content;
                } else if (/object/i.test(typeof this.obj.content)) {
                    var content = this.obj.content.nodeType == "1" ? this.obj.content : this.obj.content[0];
                    //this.displayType = fish.all(content).getCss("display");
                    fish.all(content).css("display:block;");
                    this.recordParent = content.parentNode;
                    //TODO:测试下ie的节点还原有没有问题
                    this.recordPoint = content.nextSibling;
                    fish.all(contents).html("bottom", content)//.css("poistion:absolute;z-index:2;");
                }
                if (this.obj.cls) {
                    fish.all(contents).addClass(this.obj.cls);
                }
            }

            this.contents = contents;
            mPopOutBag.appendChild(contents);

            if (bool == undefined || bool) {
                bgBag = document.createElement("div");
                bgBag.className = "bgBag";



                fish.all(bgBag).css("width:" + w + "px;height:" + (h + fish.all(window).scrollTop()) + "px;" +
                                    (this.obj.overlayClose ? "cursor:pointer" : "cursor:default"));



                if (fish.browser("ms", 6)) {
                    //                    bgIframe = document.createElement("iframe");
                    //                    bgIframe.className = "bgIframe";
                    //                    bgIframe.frameborder = "0";
                    //                    fish.all(bgIframe)
                    //					.css("width:" + w + "px;height:" + (h + fish.all(window).scrollTop()) + "px;background-color:transparent;")
                    //					.attr("src", "http://img1.40017.cn/cn/new_ui/public/images/png_cover.png");
                    //                    document.body.appendChild(bgIframe);
                    //                    this.bgIframe = bgIframe;
                    //                    this.hide(bgIframe);
                } else {
                    fish.all(bgBag).css("position:fixed;");
                }

                fish.dom(this.obj.containElem).appendChild(bgBag);

                this.hide(bgBag);

                if (fish.one(".mPopWrapper", this.obj.containElem).length == 0) {
                    bgBag.style.zIndex = 999;
                } else {
                    bgBag.style.zIndex = (fish.one(".mPopWrapper", this.obj.containElem)[0].style.zIndex) * 1 + 1;
                }

                //document.body.insertBefore(mPopOutBag, document.body.children[0]);
                fish.one(ruleElem).html("top", mPopOutBag);

                this.bg = bgBag;
            } else {
                this.hide(this.obj.containElem);
                //document.body.insertBefore(mPopOutBag, document.body.children[0]);
                fish.one(ruleElem).html("top", mPopOutBag);

                if (this.obj.relative) {
                    this.hide(fish.dom(this.obj.relative.relativeObj))
                }
            }

            this.bag = mPopOutBag;

            if (this.obj.className) {
                fish.all(mPopOutBag).addClass(this.obj.className);
            }
            if (this.obj.width) {
                mPopOutBag.style.width = parseInt(this.obj.width, 10) + "px";
            } else {
                mPopOutBag.style.width = fish.all(mPopOutBag).width() + "px";
            }

            if (this.obj.height) {
                mPopOutBag.style.height = parseInt(this.obj.height) + "px";
            } else {
                var topHieght = 0;
                if (this.obj.title) {
                    topHieght = fish.all(topBag).height()
                }
                mPopOutBag.style.height = (fish.all(mPopOutBag).height() + topHieght) + "px";
            }

            var outWidth = fish.all(mPopOutBag).width();
            var outerHeight = fish.all(mPopOutBag).height();

            //console.log(outWidth+"   "+outerHeight)
            if (this.obj.relative) {
                var left = fish.all(this.obj.relative.relativeObj).offset().left;
                var top = fish.all(this.obj.relative.relativeObj).offset().top;
                if (this.obj.relative.left) {
                    left = (left + parseInt(this.obj.relative.left));
                }
                if (this.obj.relative.top) {
                    top = (top + parseInt(this.obj.relative.top) + fish.all(this.obj.relative.relativeObj).height());
                } else {
                    top = (top + fish.all(this.obj.relative.relativeObj).height());
                }
                if (left + outWidth > w) { //超出边界值的判断,top不判断
                    left = w - outWidth;
                }
                left = left + "px";
                top = top + "px";
            } else {
                var top = ((h - outerHeight) < 0 ? 0 + fish.all(window).scrollTop() : ((h - outerHeight) / 2) + fish.all(window).scrollTop()) + "px";
                var left = ((w - outWidth) / 2) + "px"
            }
            //
            fish.all(this.obj.containElem).html("top", mPopOutBag);

            fish.all(mPopOutBag).css("left:" + left + ";top:" + top + ";");
            if (this.obj.title) {
                titleBag.style.width = (outWidth - 50) + "px";
                //fish.all(contents).css("margin-top:" + fish.all(topBag).height() + "px;");
            }
            this.resize();
            this.show();
            pushStack(this);
        },
        hide: function (closeImg, notExuteAfterCloseCallBack) { //关闭弹出层

            if (this.obj.overlayClose == false && closeImg && closeImg.className != "closeImg") {
                return;
            }
            if (!closeImg) {
                this.del(notExuteAfterCloseCallBack);
            }
            // debugger;
            var _this = this;
            if (closeImg) {
                fish.all(closeImg).on("click", function (e) {
                    fish.stopBubble(e);
                    _this.del();
                });
            }



        },
        show: function () {
            this.bag.style.display = "block";
            if (this.bg) {
                this.bg.style.display = "block";
            }
            var allSelect = fish.all("select");
            allSelect.clear(fish.all("select", this.bag));
            allSelect.css("visibility:hidden");

            this.isHide = false;
        },
        del: function (notExuteAfterCloseCallBack) {
            if (this.isHide) return;
            if (this.obj.beforeClose) {
                this.obj.beforeClose.call(this);
            }
            if (this.recordParent) {
                var content = this.obj.content.nodeType == "1" ? this.obj.content : this.obj.content[0];
                //fish.all(content).css("display:" + this.displayType + ";");
                this.recordParent.insertBefore(content, this.recordPoint);

            }
            //            if (this.bgIframe) {
            //                document.body.removeChild(this.bgIframe);
            //            }
            this.obj.containElem.removeChild(this.bag);
            //document.body.removeChild(this.bag);
            if (this.bg) {
                //document.body.removeChild(this.bg);
                this.obj.containElem.removeChild(this.bg);
            }
            this.isHide = true;
            if (this.obj.afterClose && !notExuteAfterCloseCallBack) {
                this.obj.afterClose.call(this);
            }

            spliceStack(this.location, 1);
            var allSelect = fish.all("select");
            allSelect.clear(fish.all("select", this.bag));
            allSelect.css("visibility:visible");
        },
        reset: function () {     //重置弹出层内容
            //this.iframe.src=this.obj.src;
        },
        _initDrag: function (topBag) {  //拖动
            var _this = this;
            fish.all(topBag).on("mousedown", function (e) {
                fish.preventDefault(e)
                e = fish.getEvent(e);
                fish.stopBubble(e);
                var eLeft = e.clientX;
                var eTop = e.clientY;
                var _left = fish.all(this).offset().left;
                var _top = fish.all(this).offset().top;
                _this.isDD = true;
                _this.left = eLeft - _left;
                _this.top = eTop - _top;
                return false;
            })


            fish.all(document).on("mousemove", function (e) {
                //fish.preventDefault(e)
                e = fish.getEvent(e);
                if (!_this.isDD) return;
                /**边界值的计算**/
                var left = e.clientX - _this.left <= 0 ? 0 : e.clientX - _this.left > (fish.all(document).width() - fish.all(_this.bag).width()) ? (fish.all(document).width() - fish.all(_this.bag).width()) : e.clientX - _this.left;
                var top = e.clientY - _this.top <= 0 ? 0 : e.clientY - _this.top > (fish.all(window).height() + fish.all(window).scrollTop() - fish.all(_this.bag).height()) ? (fish.all(window).height() + fish.all(window).scrollTop() - fish.all(_this.bag).height()) : e.clientY - _this.top;
                //console.log(e.clientX - _this.left > (fish.all(window).width() - fish.all(_this.bag).width()))
                fish.all(_this.bag).css("left:" + left + "px;top:" + top + "px;");
                return false;
            })
            fish.all(document).on("mouseup", function (e) {
                fish.preventDefault(e)
                fish.stopBubble(e);
                _this.isDD = false;
            })
        },
        resize: function () {
            if (this.obj.relative) {
                return;
            }
            var _this = this;
            var bagWidth = fish.all(_this.bag).width();
            var bagHeight = fish.all(_this.bag).height();


            fish.one(window).on("resize", function () {
                if (_this.isHide) {
                    return;
                }

                var w_left = fish.all(document).width(),
					window_h = fish.all(window).height(),
					document_h = fish.all(document).height(),
					w_top = window_h > document_h ? window_h : document_h;


                if (_this.bg) {
                    fish.all(_this.bg).css("width:" + w_left + "px;height:" + w_top + "px;")
                    //                    if (_this.bgIframe) {
                    //                        fish.all(_this.bg).css("width:" + w_left + "px;height:" + w_top + "px;")
                    //                    }
                }
                if (_this.bag) {
                    var left = fish.all(_this.bag).offset().left;
                    var top = fish.all(_this.bag).offset().top;
                    var left = w_left - bagWidth < 0 ? 0 : (w_left - bagWidth) / 2;

                    var top = w_top - bagHeight < 0 ? 0 : ((window_h - bagHeight) / 2 + fish.all(window).scrollTop()) < 0 ? 0 : ((window_h - bagHeight) / 2 + fish.all(window).scrollTop());

                    fish.all(_this.bag).css("left:" + left + "px;top:" + top + "px;")
                }
            });

        }
    }

})();


