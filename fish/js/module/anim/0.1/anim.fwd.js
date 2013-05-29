// emile.js (c) 2009 Thomas Fuchs
// Licensed under the terms of the MIT license.
// @modify kares
(function (win) {
	//<<----- hack animFrame, use animationFrame if enable
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !win.requestAnimationFrame; ++x) {
		win.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		win.cancelAnimationFrame =
			win[vendors[x] + 'CancelAnimationFrame'] || win[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!win.requestAnimationFrame || !win.cancelAnimationFrame) {
		win.requestAnimationFrame = function (fn) {
			return setTimeout(function () {
				fn(+new Date())
			}, 1)
		};
		win.cancelAnimationFrame = function (h) {
			clearTimeout(h)
		};
	}
	//------->>
	function interpolate(source, target, pos) {
		return (source + (target - source) * pos).toFixed(3);
	}
	function parse(prop) {
		var m = prop.match(/[\-\d\.]+/g),
		num = m && m[0],
		q = prop.split(num),
		pnum = parseFloat(num);
		//kares split to array, to support transform, and cut off color support
		return {
			v : pnum ? pnum : 0,
			f : interpolate,
			u : q
		};
	}
	function normalTarget(target) {
		var i = target.length,
		pTarget = [];
		while (i--) {
			pTarget[(pTarget[i] = target[i])] = parse(target[pTarget[i]]);
		}
		return pTarget;
	}
	
	//<<-------main function
	/**
	* @param {String} style 样式表属性，指定动画过程的目标样式
	* @param {Number} time 动画时间（毫秒），制定动画效果的执行时间
	* @param {Function|Object} param 动画执行完毕后的回调函数 | 如果这个参数为对象，则是动画的配置参数
	*         Object.fn     {Function} 动画执行完毕后的回调函数
	*         Object.easing {Function} 动画执行的轨迹函数
	* @return {Object} 本次动画对象
	*         Object.elem   {NodeList} 参与本次动画的元素
	*         Object.stop   {Function} 停止动画
	*/
	function main(style, time, param) {
		var i = this.length,
		j = this.length,
		k = 0,
		obj = {
			elem : [],
			stop : stop
		},
		fn = ((param && param.fn) || param) || null;
		param = param || {};
		param.time = time;
		while (i--) {
			obj.elem.push(ani(this[i], style, param, function (el) {
					k++;
					if (k >= j) {
						typeof fn === "function" && fn()
					}
				}));
		}
		return obj;
	}
	//stop animation
	function stop() {
		var i = this.elem.length;
		while (i--) {
			cancelAnimationFrame(this.elem[i].timer())
		}
	}
	// get and set func for elements
	function timer(h) {
		if (h)
			this.animHandler = h;
		return this.animHandler;
	}
	//----->>
	//exec function
	function ani(el, style, opts, after) {
		el.timer = timer;
		var nTarget = fish.css.normalize(style),
		target = normalTarget(nTarget),
		comp = el.currentStyle ? el.currentStyle : getComputedStyle(el, null),
		prop,
		current = {},
		start,
		finish,
		dur = opts.time || 200,
		currentStyle,
		easing = opts.easing || function (pos) {
			return (Math.sqrt(Math.sqrt(pos * 16))) / 2;
		},
		nowH = el.timer(),
		i = target.length;
		
		//use style obj if enable
		while (i--) {
			prop = target[i];
			currentStyle = el.style[prop] || comp[prop];
			if (currentStyle) {
				current[prop] = parse(currentStyle);
			}
		}
		nowH != null && cancelAnimationFrame(nowH);
		//<<----- use animationFrame, record time, use animFrame func
		requestAnimationFrame(function (t) {
			start = t;
			finish = t + dur;
		});
		el.timer(requestAnimationFrame(function (time) {
				var pos = time >= finish ? 1 : (time - start) / dur,
				i = target.length;
				while (i--) {
					prop = target[i];
					if (current[prop]) {
						el.style[prop] = target[prop].u[0] + target[prop].f(current[prop].v, target[prop].v, easing(pos)) + target[prop].u[1];
					}
				}
				if (time >= finish) {
					cancelAnimationFrame(el.timer());
					after && after(el)
				} else {
					el.timer(requestAnimationFrame(arguments.callee))
				}
			}));
		//----->>
		return el;
	}
	//to fish
	fish.extend({
		anim : main
	});
})(window);