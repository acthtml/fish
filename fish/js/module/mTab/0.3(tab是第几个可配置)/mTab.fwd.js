(function () {
    // tab 主方法
    // this 即 fish.all(element) 或者 fish.one(element)
    function main(param) {
        // console.log(this);
        // console.log(this.length);
        var l = this.length;
        while (l--) {
            new Tab(param, fish.one(this[l])).execute();
        }
        // var one = this.length > 1 ? fish.one(this[0]) : this;
        // new Tab(param, one).execute();
    }

    function check(elements,errMsg) {
        if (elements.length == 0) {
            throw errMsg;
        }
    }

    function Tab(param, uTabComponentWrap) {
        // this 即 new Tab(arguments) 返回的实例
        this.cfg = {
            // 标签卡，如 ul li
            tab: false,
            // 标签卡容器，如 #tab ul
            tab_tray: false,
            tabWrap:false,//tabWrap是tab_tray的别名
            // 以追加类名的方式，显示或隐藏标签卡内容
            append: 'crt',
            // 以覆盖类名的方式，显示或隐藏标签卡内容
            replace: false,
            // 非当前标签卡类名，如 normal
            normal: false,
            // 标签卡内容，如 #tab .content
            content: false,
            // 标签卡内容隐藏类名，如 none
            none: 'none',
            // 标签卡动作触发事件，如 click 或 hover
            event: 'click',
            // rel 关联 id，以后扩展
            // rel: 'relid',
            // 标签卡初始化回调函数
            init: false,
            // 点击标签卡触发回调函数
            fn: false
        }
        this.org = uTabComponentWrap;
        if(!param){
            throw "param missing!check param";
        }
        fish.lang.extend(this.cfg,param);
    }

    Tab.prototype = {
        constructor: Tab,
        execute: function () {
            // this 即 new Tab(arguments) 返回的实例
            var tabObj = this,
				i = 0,
                cfg = tabObj.cfg,
                uTabComponentWrap = tabObj.org,
				uTabWrap,
                dTabs,
				uConts,
				evtType = cfg.event === 'hover' ? 'mouseover' : cfg.event,
				current_tab,
				cur_tab,
                dTabWrap,
                tabIndex,
                tabNum;
            tabObj.isReplaceTabClass = cfg.replace && cfg.normal;

            //用户的自定义的初始化回调
            if (cfg.init && typeof(cfg.init) ==="function") {
                cfg.init.apply({
                    org: tabObj.org,
                    cfg: tabObj.cfg
                });
            }

            cfg.tabWrap = cfg.tabWrap?cfg.tabWrap:cfg.tab_tray;

            // 取得 标签卡以及标签卡的父级
            if (cfg.tabWrap && !cfg.tab) {
                uTabWrap = fish.all(cfg.tabWrap);
                dTabs = filterDoms(uTabWrap[0].children);
                check(uTabWrap,"tabs is need! check param:tab_tray or param:tabWrap");
                dTabWrap = uTabWrap[0];
            } else if (cfg.tab && !cfg.tabWrap) {
                uTabWrap = fish.one(fish.dom(cfg.tab, uTabComponentWrap).parentNode);
                dTabs = filterDoms(uTabWrap[0].children);
                check(uTabWrap,"tabs is need! check param:tab");
                dTabWrap = uTabWrap[0];
            }else{
                throw "param error!only one of param:tab and param:tab_tray or param:tabWrap is needed!";
            }

            //给tab加其对应的内容块的下标的属性
            for(tabIndex=0,tabNum = dTabs.length; tabIndex< tabNum;tabIndex++){
                dTabs[tabIndex].setAttribute("data-mTabIndex",tabIndex);
            }

            // 获得当前选中的tab
            if (tabObj.isReplaceTabClass) {
                tabObj.uCurrent_tab = fish.one('.' + cfg.replace, dTabWrap);
            } else {
                tabObj.uCurrent_tab = fish.one('.' + cfg.append, dTabWrap);
            }

            check(tabObj.uCurrent_tab,"current tab  is not fetched, check param:replace");

            // 获得所有内容块，以及选中tab对应的内容块
            if (cfg.content) {
                uConts = fish.all(cfg.content, uTabComponentWrap);
                check(uConts,"tab content is not fetched,check param:content");
                tabObj.uCurrent_cont = fish.one(uConts[0]);//默认为第一个为选中的内容
            }else{
                throw "missing param:content";
            }


            uTabWrap.on(
				evtType,
				function (evt) {
				    toggle_tab(evt, tabObj, uConts, dTabWrap);
				}
			);


        }

    }
    //从元素数组中获得dom元素
    function filterDoms(elements) {
        var result = [],
            l = elements.length;
        while (l--) {
            if (elements[l].nodeType === 1) {
                result.unshift(elements[l]);
            }
        }
        return result;
    };

    function getTabIndex(tab) {
        return parseInt(tab.getAttribute("data-mTabIndex"));
    };
    function toggle_tab(e, tabObj, uConts, dTabWrap) {
        var that = fish.getTarget(e),
            cfg = tabObj.cfg,
            org = tabObj.org,
            isTab = false,
            theIndexOfTabs;

        do {
            if (that.parentNode === dTabWrap) {
                isTab = true;
                break;
            }
            that = that.parentNode || null;
        } while (that);

        if (isTab && that !== tabObj.uCurrent_tab[0]) {
            theIndexOfTabs = getTabIndex(that);
            if (theIndexOfTabs === -1) {
                return;
            }
            tabObj.cur_tab = fish.one(that);
            if (tabObj.isReplaceTabClass) {
                tabObj.uCurrent_tab[0].className = cfg.normal;
                tabObj.cur_tab[0].className = cfg.replace;
            } else {
                tabObj.uCurrent_tab.removeClass(cfg.append);
                tabObj.cur_tab.addClass(cfg.append);
            }
            tabObj.uCurrent_tab = tabObj.cur_tab;
            if (uConts.length > 1) {
                uConts.addClass(cfg.none);
                tabObj.uCur_cont = fish.one(uConts[theIndexOfTabs]);
                tabObj.uCur_cont.removeClass(cfg.none);
                tabObj.uCurrent_cont = tabObj.uCur_cont;
            }

            if (cfg.fn) {
                cfg.fn.apply(
                    {
                        org: tabObj.org,
                        cfg: tabObj.cfg
                    },
                    [tabObj.uCurrent_tab, tabObj.uCurrent_cont,theIndexOfTabs]
                );
            }

        }
    };



    fish.extend(
        {
            mTab: main
        }
    );

})();