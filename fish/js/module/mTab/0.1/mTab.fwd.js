(function () {
    // 参数混合器
    function merge(defaults, customize) {
        if (!customize) {
            return false;
        }
        for (var a in defaults) {
            if (customize[a]) {
                defaults[a] = customize[a];
            }
        }
        return true;
    }

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

    function check(elements) {
        if (!elements.length) {
            throw new Error("mTab 初始化失败");
        }
    }

    function Tab(param, it) {
        // this 即 new Tab(arguments) 返回的实例
        this.cfg = {
            // 标签卡，如 ul li
            tab: false,
            // 标签卡容器，如 #tab ul
            tab_tray: false,
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
        this.org = it;
        if (!merge(this.cfg, param)) {
            throw new Error("没有传递配置对象");
        }
    }

    Tab.prototype = {
        constructor: Tab,
        last_tab: false,
        cur_tab: false,
        last_tray: false,
        cur_tray: false,
        // getRelateContent: function (tab, relation, cts) {
        // var rel = tab[0].getAttribute(relation),
        // l = cts.length;
        // if (l === 1) {
        // return gets(cts[0]);
        // }
        // while (l--) {
        // if (cts[l].getAttribute(relation) === rel) {
        // return gets(cts[l]);
        // }
        // }
        // return false;
        // },
        execute: function () {
            // this 即 new Tab(arguments) 返回的实例
            var it = this,
				i = 0,
				_tabs = [],
				tabs,
				trays,
				cfg = it.cfg,
				org = it.org,
				evt = cfg.event === 'hover' ? 'mouseover' : cfg.event,
				last_tab,
				last_tray,
				cur_tab,
				cur_tray,
                last_tab_parent;

            if (cfg.init) {
                cfg.init.apply(
					{
					    org: it.org,
					    cfg: it.cfg
					}
				);
            }

            // 取得 标签卡
            if (cfg.tab_tray && !cfg.tab) {
                tabs = fish.one(cfg.tab_tray, org);
                check(tabs);
                last_tab_parent = tabs[0];
            } else if (cfg.tab && !cfg.tab_tray) {
                tabs = fish.all(cfg.tab, org);
                check(tabs);
                last_tab_parent = tabs[0].parentNode;
            }

            // 当前标签卡
            // last_tab 赋予 Tab 实例
            if (cfg.replace && cfg.normal) {
                it.last_tab = fish.one('.' + cfg.replace, last_tab_parent);
            } else {
                it.last_tab = fish.one('.' + cfg.append, last_tab_parent);
            }
            // 当前标签卡检验
            check(it.last_tab);

            // 标签卡内容块
            if (cfg.content) {
                trays = fish.all(cfg.content, org);
                check(trays);
                it.last_tray = fish.one(trays[0]);
            }

            function filterDoms(elements) {
                var result = [],
                    l = elements.length;
                while (l--) {
                    if (elements[l].nodeType === 1) {
                        result.unshift(elements[l]);
                    }
                }
                return result;
            }

            function findRelation(tab) {
                var children = tab.parentNode.children,
                    elements = filterDoms(children),
                    l = elements.length;
                if (l < 2) {
                    return -1;
                }
                while (l--) {
                    if (elements[l] === tab) {
                        return l;
                    }
                }
            }

            function toggle_tab(e, it, trays, last_tab_parent) {
                var that = fish.getTarget(e),
					cfg = it.cfg,
					org = it.org,
					isTab = false,
                    theIndexOfTabs;

                do {
                    if (that.parentNode === last_tab_parent) {
                        isTab = true;
                        break;
                    }
                    that = that.parentNode || null;
                } while (that);

                if (isTab && that !== it.last_tab[0]) {
                    theIndexOfTabs = findRelation(that);
                    if (theIndexOfTabs === -1) {
                        return;
                    }
                    it.cur_tab = fish.one(that);
                    if (cfg.replace && cfg.normal) {
                        it.last_tab[0].className = cfg.normal;
                        it.cur_tab[0].className = cfg.replace;
                    } else {
                        it.last_tab.removeClass(cfg.append);
                        it.cur_tab.addClass(cfg.append);
                    }
                    it.last_tab = it.cur_tab;

                    if (trays.length > 1) {
                        it.last_tray.addClass(cfg.none);
                        it.cur_tray = fish.one(trays[theIndexOfTabs]);
                        it.cur_tray.removeClass(cfg.none);
                        it.last_tray = it.cur_tray;
                    }

                    if (cfg.fn) {
                        cfg.fn.apply(
							{
							    org: it.org,
							    cfg: it.cfg
							},
							[it.last_tab, it.last_tray]
						);
                    }

                }
            }


            tabs.on(
				evt,
				function (e) {
				    toggle_tab(e, it, trays, last_tab_parent);
				}
			);


        }
    }


    fish.extend(
        {
            mTab: main
        }
    );

})();