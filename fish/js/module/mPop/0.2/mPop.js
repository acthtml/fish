(function(){function k(a){return new j(a)}function j(a){this.obj=a;this.init(a.overlay)}fish.one(document.body).html("top","<div id='mPop_ruleElem' style='position: absolute;width:100px;height:100px;top:0px;left:-100px;'></div>");var i=[],l=fish.dom("#mPop_ruleElem");k.close=function(){for(var a=i.length-1;a>=0;a--)i.shift().hide()};fish.extend({mPop:k});j.checkNone=function(){};j.prototype={init:function(a){this.obj.cover||fish.mPop.close();var e=fish.all(document).width(),b=fish.all(window).height(),
d,c,f,h,g;d=document.createElement("div");d.className="outBag";this.obj.className&&fish.all(d).addClass(this.obj.className);this.obj.bgclose=this.obj.bgclose==null?true:this.obj.bgclose;fish.all(d).on("click",function(m){fish.stopBubble(m)});d.style.zIndex=fish.one(".outBag",document.body).length==0?1E3:fish.one(".outBag",document.body)[0].style.zIndex*1+10;if(this.obj.title){f=document.createElement("div");f.className="topBag";fish.all(f).css("width:100%;position:absolute;z-index:10;");d.appendChild(f);
h=document.createElement("span");h.className="boxTitle";h.innerHTML=this.obj.title;f.appendChild(h);g=document.createElement("img");g.src="http://img1.40017.cn/cn//new_ui/public/images/mPopClose.png";g.className="closeImg";f.appendChild(g);c=this.obj.dragable==undefined?true:this.obj.dragable;if(typeof f.onselectstart)f.onselectstart=function(){return false};c&&this._initDrag(f);this.hide(g)}g=document.createElement("div");if(this.obj.iframe){c=document.createElement("iframe");c.setAttribute("frameBorder",
"no");fish.all(c).css("width:100%;height:100%;position:absolute;z-index:10;");g.appendChild(c);g=c;c.src=this.obj.src?this.obj.src:""}else if(this.obj.content){if(typeof this.obj.content=="string"){fish.all(g).css("z-index:10;width:100%;");g.innerHTML=this.obj.content}else if(/object/i.test(typeof this.obj.content)){c=this.obj.content.nodeType=="1"?this.obj.content:this.obj.content[0];fish.all(c).css("display:block;");this.recordParent=c.parentNode;this.recordPoint=c.nextSibling;fish.all(g).html("bottom",
c)}this.obj.cls&&fish.all(g).addClass(this.obj.cls)}this.contents=g;d.appendChild(g);if(a==undefined||a){a=document.createElement("div");a.className="bgBag";fish.all(a).css("width:"+e+"px;height:"+(b+fish.all(window).scrollTop())+"px;"+(this.obj.bgclose?"cursor:pointer":"cursor:default"));fish.browser("ms",6)||fish.all(a).css("position:fixed;");fish.dom(document.body).appendChild(a);this.hide(a);a.style.zIndex=fish.one(".outBag",document.body).length==0?999:fish.one(".outBag",document.body)[0].style.zIndex*
1+1;fish.one(l).html("top",d);this.bg=a}else{this.hide(document.body);fish.one(l).html("top",d);this.obj.relative&&this.hide(fish.dom(this.obj.relative.relativeObj))}this.bag=d;this.obj.className&&fish.all(d).addClass(this.obj.className);d.style.width=this.obj.width?parseInt(this.obj.width,10)+"px":fish.all(d).width()+"px";if(this.obj.height)d.style.height=parseInt(this.obj.height)+"px";else{a=0;if(this.obj.title)a=fish.all(f).height();d.style.height=fish.all(d).height()+a+"px"}a=fish.all(d).width();
c=fish.all(d).height();if(this.obj.relative){b=fish.all(this.obj.relative.relativeObj).offset().left;c=fish.all(this.obj.relative.relativeObj).offset().top;if(this.obj.relative.left)b+=parseInt(this.obj.relative.left);if(this.obj.relative.top)c=c+parseInt(this.obj.relative.top)+fish.all(this.obj.relative.relativeObj).height();else c+=fish.all(this.obj.relative.relativeObj).height();if(b+a>e)b=e-a;b+="px";c+="px"}else{c=(b-c<0?0+fish.all(window).scrollTop():(b-c)/2+fish.all(window).scrollTop())+"px";
b=(e-a)/2+"px"}fish.all(document.body).html("top",d);fish.all(d).css("left:"+b+";top:"+c+";");if(this.obj.title){h.style.width=a-50+"px";fish.all(g).css("margin-top:"+fish.all(f).height()+"px;")}this.resize();this.show();Object.prototype.toString.call(i)==="[object Array]"&&i.push(this);this.location=i.length-1},hide:function(a){if(!(this.obj.bgclose==false&&a&&a.className!="closeImg")){a||this.del();var e=this;fish.all(a).on("click",function(b){fish.stopBubble(b);e.del()})}},show:function(){this.bag.style.display=
"block";if(this.bg)this.bg.style.display="block";var a=fish.all("select");a.clear(fish.all("select",this.bag));a.css("visibility:hidden");this.isHide=false},del:function(){if(!this.isHide){this.obj.beforeClose&&this.obj.beforeClose.call(this);if(this.recordParent)this.recordParent.insertBefore(this.obj.content.nodeType=="1"?this.obj.content:this.obj.content[0],this.recordPoint);document.body.removeChild(this.bag);this.bg&&document.body.removeChild(this.bg);this.isHide=true;this.obj.afterClose&&this.obj.afterClose.call(this);
i&&i.splice(this.location,1);var a=fish.all("select");a.clear(fish.all("select",this.bag));a.css("visibility:visible")}},reset:function(){},_initDrag:function(a){var e=this;fish.all(a).on("mousedown",function(b){fish.preventDefault(b);b=fish.getEvent(b);fish.stopBubble(b);var d=b.clientX;b=b.clientY;var c=fish.all(this).offset().left,f=fish.all(this).offset().top;e.isDD=true;e.left=d-c;e.top=b-f;return false});fish.all(document).on("mousemove",function(b){b=fish.getEvent(b);if(e.isDD){var d=b.clientX-
e.left<=0?0:b.clientX-e.left>fish.all(document).width()-fish.all(e.bag).width()?fish.all(document).width()-fish.all(e.bag).width():b.clientX-e.left;b=b.clientY-e.top<=0?0:b.clientY-e.top>fish.all(window).height()+fish.all(window).scrollTop()-fish.all(e.bag).height()?fish.all(window).height()+fish.all(window).scrollTop()-fish.all(e.bag).height():b.clientY-e.top;fish.all(e.bag).css("left:"+d+"px;top:"+b+"px;");return false}});fish.all(document).on("mouseup",function(b){fish.preventDefault(b);fish.stopBubble(b);
e.isDD=false})},resize:function(){if(!this.obj.relative){var a=this,e=fish.all(a.bag).width(),b=fish.all(a.bag).height();fish.one(window).on("resize",function(){if(!a.isHide){var d=fish.all(document).width(),c=fish.all(window).height(),f=fish.all(document).height();f=c>f?c:f;a.bg&&fish.all(a.bg).css("width:"+d+"px;height:"+f+"px;");if(a.bag){var h=fish.all(a.bag).offset().left,g=fish.all(a.bag).offset().top;h=d-e<0?0:(d-e)/2;g=f-b<0?0:(c-b)/2+fish.all(window).scrollTop()<0?0:(c-b)/2+fish.all(window).scrollTop();
fish.all(a.bag).css("left:"+h+"px;top:"+g+"px;")}}})}}}})();
