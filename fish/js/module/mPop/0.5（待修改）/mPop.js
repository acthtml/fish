(function(){function k(a){return new j(a)}function j(a){this.obj=a;this.init(a.isOverlay)}fish.one(document.body).html("top","<div id='mPopRuleElem' style='position: absolute;width:100px;height:100px;top:0px;left:-100px;'></div>");var h=[],l=fish.dom("#mPopRuleElem");k.close=function(a){for(var d=h.length-1;d>=0;d--)h.shift().hide(null,a)};fish.extend({mPop:k});j.checkNone=function(){};j.prototype={init:function(a){if(!this.obj.isCovers){fish.mPop.close();this.obj.beforeOpen&&typeof this.obj.beforeOpen&&
this.obj.beforeOpen()}var d=fish.all(document).width(),b=fish.all(window).height(),c,f,e,g;this.obj.containElem=this.obj.containElem?this.obj.containElem:document.body;c=document.createElement("div");c.className="mPopWrapper";this.obj.className&&fish.all(c).addClass(this.obj.className);this.obj.overlayClose=this.obj.overlayClose==null?true:this.obj.overlayClose;fish.all(c).on("click",function(i){fish.stopBubble(i)});c.style.position="absolute";c.style.zIndex=fish.one(".mPopWrapper",this.obj.containElem).length==
0?1E3:fish.one(".mPopWrapper",this.obj.containElem)[0].style.zIndex*1+10;if(this.obj.title){e=document.createElement("div");e.className="mPopTop";fish.all(e).css("width:100%;z-index:10;");c.appendChild(e);titleBag=document.createElement("span");titleBag.className="boxTitle";titleBag.innerHTML=this.obj.title;e.appendChild(titleBag);g=document.createElement("img");g.src="http://img1.40017.cn/cn//new_ui/public/images/mPopClose.png";g.className="closeImg";e.appendChild(g);f=this.obj.dragable==undefined?
true:this.obj.dragable;if(typeof e.onselectstart)e.onselectstart=function(){return false};f&&this._initDrag(e);this.hide(g)}g=document.createElement("div");g.className="mPopContent";if(this.obj.iframe){f=document.createElement("iframe");f.setAttribute("frameBorder","no");fish.all(f).css("width:100%;height:100%;position:absolute;z-index:10;");g.appendChild(f);g=f;f.src=this.obj.src?this.obj.src:""}else if(this.obj.content){if(typeof this.obj.content=="string"){fish.all(g).css("z-index:10;width:100%;");
g.innerHTML=this.obj.content}else if(/object/i.test(typeof this.obj.content)){f=this.obj.content.nodeType=="1"?this.obj.content:this.obj.content[0];fish.all(f).css("display:block;");this.recordParent=f.parentNode;this.recordPoint=f.nextSibling;fish.all(g).html("bottom",f)}this.obj.cls&&fish.all(g).addClass(this.obj.cls)}this.contents=g;c.appendChild(g);if(a==undefined||a){a=document.createElement("div");a.className="bgBag";fish.all(a).css("width:"+d+"px;height:"+(b+fish.all(window).scrollTop())+"px;"+
(this.obj.overlayClose?"cursor:pointer":"cursor:default"));fish.browser("ms",6)||fish.all(a).css("position:fixed;");fish.dom(this.obj.containElem).appendChild(a);this.hide(a);a.style.zIndex=fish.one(".mPopWrapper",this.obj.containElem).length==0?999:fish.one(".mPopWrapper",this.obj.containElem)[0].style.zIndex*1+1;fish.one(l).html("top",c);this.bg=a}else{this.hide(this.obj.containElem);fish.one(l).html("top",c);this.obj.relative&&this.hide(fish.dom(this.obj.relative.relativeObj))}this.bag=c;this.obj.className&&
fish.all(c).addClass(this.obj.className);c.style.width=this.obj.width?parseInt(this.obj.width,10)+"px":fish.all(c).width()+"px";if(this.obj.height)c.style.height=parseInt(this.obj.height)+"px";else{a=0;if(this.obj.title)a=fish.all(e).height();c.style.height=fish.all(c).height()+a+"px"}e=fish.all(c).width();a=fish.all(c).height();if(this.obj.relative){b=fish.all(this.obj.relative.relativeObj).offset().left;a=fish.all(this.obj.relative.relativeObj).offset().top;if(this.obj.relative.left)b+=parseInt(this.obj.relative.left);
if(this.obj.relative.top)a=a+parseInt(this.obj.relative.top)+fish.all(this.obj.relative.relativeObj).height();else a+=fish.all(this.obj.relative.relativeObj).height();if(b+e>d)b=d-e;b+="px";a+="px"}else{a=(b-a<0?0+fish.all(window).scrollTop():(b-a)/2+fish.all(window).scrollTop())+"px";b=(d-e)/2+"px"}fish.all(this.obj.containElem).html("top",c);fish.all(c).css("left:"+b+";top:"+a+";");if(this.obj.title)titleBag.style.width=e-50+"px";this.resize();this.show();Object.prototype.toString.call(h)==="[object Array]"&&
h.push(this);this.location=h.length-1},hide:function(a,d){if(!(this.obj.overlayClose==false&&a&&a.className!="closeImg")){a||this.del(d);var b=this;if(a)fish.all(a).on("click",function(c){fish.stopBubble(c);b.del()})}},show:function(){this.bag.style.display="block";if(this.bg)this.bg.style.display="block";var a=fish.all("select");a.clear(fish.all("select",this.bag));a.css("visibility:hidden");this.isHide=false},del:function(a){if(!this.isHide){this.obj.beforeClose&&this.obj.beforeClose.call(this);
if(this.recordParent)this.recordParent.insertBefore(this.obj.content.nodeType=="1"?this.obj.content:this.obj.content[0],this.recordPoint);this.obj.containElem.removeChild(this.bag);this.bg&&this.obj.containElem.removeChild(this.bg);this.isHide=true;this.obj.afterClose&&!a&&this.obj.afterClose.call(this);h&&h.splice(this.location,1);a=fish.all("select");a.clear(fish.all("select",this.bag));a.css("visibility:visible")}},reset:function(){},_initDrag:function(a){var d=this;fish.all(a).on("mousedown",
function(b){fish.preventDefault(b);b=fish.getEvent(b);fish.stopBubble(b);var c=b.clientX;b=b.clientY;var f=fish.all(this).offset().left,e=fish.all(this).offset().top;d.isDD=true;d.left=c-f;d.top=b-e;return false});fish.all(document).on("mousemove",function(b){b=fish.getEvent(b);if(d.isDD){var c=b.clientX-d.left<=0?0:b.clientX-d.left>fish.all(document).width()-fish.all(d.bag).width()?fish.all(document).width()-fish.all(d.bag).width():b.clientX-d.left;b=b.clientY-d.top<=0?0:b.clientY-d.top>fish.all(window).height()+
fish.all(window).scrollTop()-fish.all(d.bag).height()?fish.all(window).height()+fish.all(window).scrollTop()-fish.all(d.bag).height():b.clientY-d.top;fish.all(d.bag).css("left:"+c+"px;top:"+b+"px;");return false}});fish.all(document).on("mouseup",function(b){fish.preventDefault(b);fish.stopBubble(b);d.isDD=false})},resize:function(){if(!this.obj.relative){var a=this,d=fish.all(a.bag).width(),b=fish.all(a.bag).height();fish.one(window).on("resize",function(){if(!a.isHide){var c=fish.all(document).width(),
f=fish.all(window).height(),e=fish.all(document).height();e=f>e?f:e;a.bg&&fish.all(a.bg).css("width:"+c+"px;height:"+e+"px;");if(a.bag){var g=fish.all(a.bag).offset().left,i=fish.all(a.bag).offset().top;g=c-d<0?0:(c-d)/2;i=e-b<0?0:(f-b)/2+fish.all(window).scrollTop()<0?0:(f-b)/2+fish.all(window).scrollTop();fish.all(a.bag).css("left:"+g+"px;top:"+i+"px;")}}})}}}})();
