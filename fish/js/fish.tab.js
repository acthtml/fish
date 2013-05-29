/**
 * @function 写个fish.tab插件
 *
 * 有初始化，有click,bebeforeClick,init
 * 点击.tab-nav a，为其和其对应的.tab-item添加"active"样式名。初始化为第一绑定active
 *
 * @code
 *    fish.all('.tab').tab({
 *      //初始化函数
 *      init : function(elem,index){
 *        this.index //this指向tab对象
 *      }
 *    });
 *    //配置方法去看 Tab.prototype吧，有机会补上。
 * @endcode
 *
 * @require fish.js
 * @author 2997@17u.cn
 * @version 1.0  at 2013-4-9
 *
 * @see Tab();
 */
(function(){
  fish.extend({tab : function(config){
    if(!config){
      config = {};
    }
    config.entry = this;

    new Tab(config);

    return this;
  }});


  /**
   * @function Tab()
   *
   * 所谓的tab必须要有这样的结构
   * .tab
   *    .tab-nav
   *      (li > a.current) * n
   *    .tab-items
   *      .tab-item.current * n
   *
   * @code
   *   var mytab = Tab({
   *     entry:fish.one('.tab')
   *   });
   *   var current_tab = mytab.getCurrentTab();
   * @endcode
   */
  function Tab(config){
    if(!config){
      config = {};
    }
    return this._init(config);
  }
  Tab.prototype = {
    // 可以说是_construct
    _init : function(config){
      // empty config.entry
      if(!config && !config.entry && !config.entry.length){
        return null;
      }

      // config
      for(key in config){
        this[key] = config[key];
      }

      // init start
      this.tabs = getChildNodes(fish.all('.tab-nav',this.entry)[0]);
      this.panes = getChildNodes(fish.all('.tab-items',this.entry)[0]);
      // 绑定index
      this.tabs.each(function(elem,i){
        fish.dom('a', elem).index = i;
        fish.one('a',elem).on('click', function(e){
          fish.preventDefault(e);
        })
      })
      // init
      this.init.call(this);

      //beforeClick & click
      var that = this;
      this.tabs.on(this.event,function(e){
        that.trigger = fish.one(this);
        if(that.beforeClick.call(that)){
          that.click.call(that);
          that.afterClick.call(that);
        }
      });

      return this;
    },
    initialIndex : 0,
    event : 'click',
    // 当前tab fish实体
    entry : null,
    // 所有的tabs
    tabs : null,
    // 所有的panes
    panes : null,
    // 当前tab
    current_tab : null,
    // 当前pane
    current_pane : null,
    // 当前第几个tab
    index : 0,
    // 触发效果的元素，一般是被点击的tab
    trigger : null,
    beforeClick : function(){
      // 返回true才会执行接下来的click。
      return true;
    },
    click : function(){
      if(this.current_tab){
        this.current_tab.removeClass('active');
      }
      if(this.current_pane){
        this.current_pane.removeClass('active');
      }


      var trigger = fish.all('a',this.trigger),
          index = this.index  = trigger[0].index;
      this.current_tab = trigger.addClass('active');
      this.current_pane = fish.all(this.panes[index]).addClass('active');
    },
    afterClick : function(){
      return true;
    },
    init : function(){
      this.current_tab = fish.all('a',this.tabs[this.initialIndex]).addClass('active');
      this.current_pane = fish.all(this.panes[this.initialIndex]).addClass('active');
      this.index = this.initialIndex;
    }
  }

  //获取直接子元素，返回fish对象
  function getChildNodes(dom){
    var nodes = [];
    for(var i = 0; i < dom.childNodes.length; i++){
      if(dom.childNodes[i].nodeType == 1){
        nodes.push(dom.childNodes[i]);
      }
    }

    return fish.all(nodes);
  }
})();
