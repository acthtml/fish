(function(){function m(a){function g(b,l){var d,e;if(a.content){d=fish.all(a.content).offset().left;e=fish.all(window).width()-fish.all(a.content).width()-d}if(j){a.top!=null&&fish.one(a.elem).css("top:"+b+"px");a.bottom!=null&&fish.one(a.elem).css("top:"+l+"px");fish.one(a.elem).css("position: absolute;")}else{a.top!=null&&fish.one(a.elem).css("top:"+a.top+"px");a.bottom!=null&&fish.one(a.elem).css("bottom:"+a.bottom+"px");fish.one(a.elem).css("position: fixed;")}if(a.left!=null)fish.one(a.elem).css("left: "+
(a.left+(d?d:0))+"px;");if(a.right!=null)fish.one(a.elem).css("right: "+(a.right+(e?e:0))+"px;")}function c(b,l){if(fish.browser("ms",6))if(b||l){var d=b+fish.all(window).height()-a.bottom-fish.one(a.elem).height(),e=b+parseInt(a.top,10);if(f=="float")e=b+parseInt(a.top,10);j=true;g(e,d)}else{if(f=="fixed"){d=fish.all(window).height()-a.bottom-fish.one(a.elem).height();e=a.top;j=true;g(e,d)}}else{j=false;g()}f=="top"&&fish.one(a.elem).anim("opacity: 1",100,{fn:function(){fish.one(a.elem).css("display:block")}})}
function h(){var b=fish.all(window).scrollTop();switch(f){case "top":b?c(b):fish.one(a.elem).anim("opacity: 0",500,{fn:function(){fish.one(a.elem).css("display:none")}});break;case "float":if(b>k){i=true;c(b,k)}else if(b+n<k){i=false;c(b,k)}else{i=false;fish.all(a.elem).css("position:;left:;right:;top:;bottom:;display:;")}break;case "fixed":c(b)}}var j=false,f=a.showType,i;if(f=="fixed"||f=="float"){fish.one(a.elem).css("display:block");f=="fixed"&&c()}else fish.one(a.elem).css("display:none");var k=
fish.one(a.elem).offset().top;fish.one(a.elem).height();var n=fish.one(window).height();fish.all(window).on("scroll",function(){h();a.fn&&a.fn.call(fish.one(a.elem),i)});fish.all(window).on("resize",function(){h();a.fn&&a.fn.call(fish.one(a.elem),i)});if(f=="top")fish.one(a.elem).on("click",function(){document.documentElement.scrollTop=document.body.scrollTop=0})}fish.extend({mFix:function(a){for(var g=0;g<this.length;g++){var c={},h;for(h in a)c[h]=a[h];c.elem=this[g];m(c)}}})})();
