/**
 * @file fish once 插件
 *
 * 对指定元素的操作只执行一次，即使再次执行程序也没有用。在TCent架构下，你经常会
 * 看到。
 *
 * 代码示例：.something的绑定事件，只有第一次生效：
 * @code
 *   fish.all(".something").once('something', function(){
 *     fish.all(this).on('click',function(){
 *       alert("我绑定成功了。")
 *     })
 *   })//执行之后，类名会添加一个.something-processed类名。
 *   fish.all(".something").once('something', function(){
 *     //以下代码不会被执行到。
 *     fish.all(this).on('click',function(){
 *       alert("我又想被绑定，可是因为上面有fish.once的存在并且标示符又是一致的，所以我没有绑定成功。")
 *     })
 *   })
 * @endcode
 * 当然你也可以这样使用(这个功能还没完成。)
 * @code
 *   fish.all('.something').once(function(){
 *     .... // 这样元素就会自定生成一个 fish-once-$id 的类名表示已经绑定了。
 *   })
 * @endcode
 *
 * @TODO 里面用到了isFunction()来测试是否有这个函数，应该从TCent提出来，做成独立
 * 插件，或者放到fish核心中去。
 * @see TCent.isFunction()
 *
 * @param id
 *   给绑定元素来个唯一标示符，如果同一个元素，并且标示符都一样，则回调函数不会
 *   执行。元素被绑定之后会自动增加一个.id-processed 类名。
 * @param fn
 *   绑定回调函数。对未进行绑定的元素运行回调函数，绑定过的函数则直接忽略。
 *
 * @require fish.js,TCent.js
 * @author 2997@17u.cn
 * @version 1.0  at 2013-1-11
 */

(function(){
  fish.extend({once : function(id,fn){
    // @TODO 模拟cache、uuid，现在先把其放在TCent中。
    if (typeof id != 'string') {
      // 将唯一标示符放入缓存中。
      if (!(id in TCent.cache)) {
        TCent.cache[id] = ++TCent.uuid;
      }
      // 确保总有一个fn参数，即使它不存在。
      if (!fn) {
        fn = id;
      }
      id = 'fish-once-' + TCent.cache[id];
    }

    // 把已处理过的元素过滤掉。因为fish没有not或者过滤方法，本来可以简单的这样
    // 实现：elements = fish.all(this).not(name).addClass("name");
    // @TODO 这儿完成之后，做个fish.not插件
    var name = id + '-processed';
    var elements = [];
    for(i=0;i<this.length;i++){
      element = fish.all(this[i]);
      if(!element.hasClass(name)){
        element.addClass(name);
        elements.push(fish.dom(element));
      }
    }

    elements = fish.all(elements);
    return TCent.isFunction(fn) ? elements.each(fn) : elements;
  }})
})();
