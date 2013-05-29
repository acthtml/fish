/**
 * @file tcent
 *
 * 以fish为基础的架构，这里绑定所有注册的方法.@see TCent.attachBehaviors()
 *
 * @TODO 添加更加丰富的页面级基础函数。
 *
 * @require fish.js
 * @author 2997@17u.cn
 * @version 1.0  at 2013-1-11
 */
var TCent = TCent || { 'settings': {}, 'behaviors': {}, 'locale': {} };

(function (fish) {
/*
 * 为页面元素绑定所有注册的行为
 *
 * 所谓的行为可以是事件，也可以是元素的固有动作。行为以方法名"attach"注册在TCent.behaviors
 * 对象中，
 * @code
 *   TCent.behaviors.behaviorName = {
 *     attach: function(content, settings){
 *       ... ...
 *     }
 *   }
 * @endcode
 *
 * TCent.attachBehaviors()添加在下面的fish.ready()代码块中，这样，等页面加载好了
 * 就执行相应的绑定函数。当页面中有新的页面元素添加、填充进来时，例如在AJAX/AHAH
 * 中，或者fish.html('bottom','some div')场景中，应当在这些元素添加完成之后执行该
 * 方法，来为新的元素绑定注册的好的行为。
 *
 * 行为应当用
 * @code
 *   fish.all(selector).once('behavior-name',function{
 *     ... ...
 *   })
 * @endcode
 * 这样的方式注册，因为这样才能保证行为的注册行为不会不重复注册两遍，导致意想不
 * 到的错误发生。
 *
 * @param context
 *   需要绑定行为的元素，默认为document。
 *
 * @param settings
 *   为当前元素的配置对象，默认为TCent.settings对象
 *
 * TODO 既然有了注册函数，应该也有解绑函数，但限于fish还没有像detach这样的原生
 * 方法并且在项目中还没碰到这样的需求，所以没实现。
 */
TCent.attachBehaviors = function (context, settings) {
  context = context || document;
  settings = settings || TCent.settings;
  // 所有行为绑定
  for(behavior in TCent.behaviors){
    if(TCent.isFunction(TCent.behaviors[behavior].attach)){
      TCent.behaviors[behavior].attach(context, settings);
    }
  }
};

// 绑定所有行为
fish.ready(function () {
  TCent.attachBehaviors(document, TCent.settings);
});

// 它是个函数吗？
TCent.isFunction = function( fn ){
  return !!fn && !fn.nodeName && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test( fn + "" );
}

// 全局缓存(这个功能还没完成，@see fish.once)
TCent.cache ={};
// 全局唯一字符
TCent.uuid = 0;

})(fish);
