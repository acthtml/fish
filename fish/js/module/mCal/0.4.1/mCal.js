(function(){function w(b){fish.all(b?b:this).each(function(c){if(!c.getAttribute("_preventInput_")){c.style.imeMode="disabled";c.onkeydown=function(e){fish.preventDefault(e)};c.oncontextmenu=function(){return false};c.onselectstart=function(){return false};c.setAttribute("_preventInput_","true")}})}function x(b,c){var e=fish.dom(b.inputElem);if(e){w(e);if(u)b.calElem=u;else{var a=document.createElement("div");a.id="mCalendar";a.onselectstart=function(){return false};document.body.insertBefore(a,document.body.firstChild);
var f=document.createElement("iframe");f.className="if";f.src="http://img1.40017.cn/cn/new_ui/public/images/png_cover.png";a.appendChild(f);f=document.createElement("div");f.className="date";a.appendChild(f);var g=document.createElement("div");f.appendChild(g);g.className="top";var k=fish.browser("webkit")?"webkit_nextMonth":"nextMonth";g.innerHTML="<span class='lastMonthBg' id='date_lastSpan'><span class='lastMonth' ></span></span><h4 class='lastText' id='tbl_lastMonth_input'>xxxx\u5e74xx\u6708</h4><span class='nextMonthBg' id='date_nextSpan'><span class='"+
k+"' ></span></span><h4 class='nextText' id='tbl_nextMonth_input'>xxxx\u5e74xx\u6708</h4>";g=document.createElement("div");g.className="contentTime1 contentTime clearfix";g.innerHTML="<table cellspacing='0' cellpadding='0' id='tbl_lastMonth' border='0'><tbody><tr><th>\u65e5</th><th>\u4e00</th><th>\u4e8c</th><th>\u4e09</th><th>\u56db</th><th>\u4e94</th><th>\u516d</th></tr></tbody></table><i class='monthBg' >1</i>";f.appendChild(g);g=document.createElement("div");g.className="contentTime2 contentTime clearfix";
g.innerHTML="<table cellspacing='0' cellpadding='0' id='tbl_nextMonth' border='0'><tbody><tr><th>\u65e5</th><th>\u4e00</th><th>\u4e8c</th><th>\u4e09</th><th>\u56db</th><th>\u4e94</th><th>\u516d</th></tr></tbody></table><i class='monthBg'>12</i>";f.appendChild(g);b.calElem=u=a;a.className="mCalendar";fish.all(b.calElem).css("display:none;")}fish.dom("#date_lastSpan").onclick=function(){var j=b.inputElem._mCalDate_;j._addNum-=4;p("#tbl_lastMonth",j);p("#tbl_nextMonth",j)};fish.dom("#date_nextSpan").onclick=
function(){var j=b.inputElem._mCalDate_;p("#tbl_lastMonth",j);p("#tbl_nextMonth",j)};if(!b.inputElem.bindCal){var h;if(b.elem){h=fish.all(b.elem);h[h.length]=b.inputElem;h.length++}a=h?h:b.inputElem;fish.one(b.calElem).effect({elem:a,type:"click",interShow:false,interFn:function(){var j=b.inputElem._mCalDate_;j.time="";x(j,true)}});b.inputElem.bindCal=true}b.calElem.className="mCalendar"+(b.css?" "+b.css:"");b._lastTime=b.time=e.value=fish.parseTime(b.time?b.time:e.value);parseInt(b.time.split("-")[1],
10);b._addNum=0;y=b.inputElem._mCalDate_=b;if(c){p("#tbl_lastMonth",b);p("#tbl_nextMonth",b);a=fish.one(e).offset();e=fish.one(e).height();h=fish.one(window).width();h=h-a.left>=470?a.left:a.left-20-(450-(h-a.left));fish.all(b.calElem).css("top:"+(a.top+e)+"px; left:"+h+"px;");fish.all(b.calElem).css("display:block;")}else b._addNum+=2}}function p(b,c){var e=fish.dom(b),a=fish.dom(b+"_input"),f=e.parentNode.getElementsByTagName("i"),g=e.getAttribute("inited")=="true",k=fish.parseTime(c.time.split("-")[0]+
"-"+c.time.split("-")[1]+"-01",{months:c._addNum}).split("-");if(f.length>0)f[0].innerHTML=parseInt(k[1],10);a.innerHTML=k[0]+"\u5e74"+k[1]+"\u6708";a=k[0]+"-"+k[1]+"-1";c._addNum++;a=new Date(Date.parse(a.replace(/-/g,"/")));f=a.getDay();a.setMonth(a.getMonth()+1);a.setDate(0);var h,j=a.getDate(0);if(f!=7)j+=f;var z,A;if(g){z=fish.all("tr",e);tds=fish.all("td",e);A=fish.all("span",e)}for(var o=1;o<=42;o++){var n=o-f;if(o%7==1)h=g?z[parseInt(o%7,10)]:e.insertRow(e.rows.length);var i,d;if(g){i=tds[o-
1];d=A[o-1]}else{i=h.insertCell(o%7-1);i.innerHTML="  ";d=document.createElement("span");i.appendChild(d)}d.className="";if(f!=7&&o<=f||o>j){i.className="td02";d.innerHTML=" ";fish.all(d).addClass("spanOver");d.onmouseover=d.onmouseout=d.onclick=null}else{i.className="td01";i=E(a.getFullYear(),a.getMonth()+1,n);if(i==-1){d.innerHTML=n;fish.all(d).addClass("spanOut");d.setAttribute("s","false");d.setAttribute("d",n)}else{d.innerHTML=i.name;fish.all(d).addClass("spanOut spec");d.setAttribute("s","true");
d.setAttribute("d",i.day)}d.setAttribute("m",k[0]+"-"+k[1]);d.onmouseover=function(){this.getAttribute("s")=="true"?fish.all(this).addClass("spechover"):fish.all(this).addClass("spanHover")};d.onmouseout=function(){this.getAttribute("s")=="true"?fish.all(this).removeClass("spechover"):fish.all(this).removeClass("spanHover")};var m=false;i=a.getFullYear();var r=a.getMonth();a.getDate();var q=new Date,s=q.getFullYear(),t=q.getMonth();q=q.getDate();if(s>i)m=true;else if(s==i)if(t>r)m=true;else if(t==
r)if(q>n)m=true;if(c.endTime){var l=c.endTime.split("-");if(l.length>0)if(parseInt(l[0])<a.getFullYear())m=true;else if(parseInt(l[0])==a.getFullYear())if(parseInt(l[1],10)<a.getMonth()+1)m=true;else if(parseInt(l[1],10)==a.getMonth()+1)if(parseInt(l[2],10)<n)m=true}if(c.startTime){l=c.startTime.split("-");if(l.length>0)if(parseInt(l[0])>a.getFullYear())m=true;else if(parseInt(l[0])==a.getFullYear())if(parseInt(l[1],10)>a.getMonth()+1)m=true;else if(parseInt(l[1],10)==a.getMonth()+1)if(parseInt(l[2],
10)>=n)m=true}if(m&&!c.showPast){d.className="spanOver";if(d.innerHTML=="")d.innerHTML=d.getAttribute("d");d.onmouseover=d.onmouseout=function(){};d.onclick=null}else d.onclick=function(F){var B=this.getAttribute("m"),v=this.getAttribute("d")?this.getAttribute("d"):this.innerHTML;c._lastTime=B+"-"+v;if(parseInt(v,10)<=9)c._lastTime=B+"-0"+v;if(c.inputElem)c.inputElem.value=c._lastTime;C(function(){c.fn&&c.fn(c._lastTime)});fish.stopBubble(F)};if(s==i&&t==r&&q==n){d.innerHTML="\u4eca\u5929";fish.all(d).addClass("spanDay");
d.setAttribute("d",n);d.setAttribute("s","true")}if(fish.parseTime(i+"-"+(r+1)+"-"+n)==fish.parseTime(new Date,{days:1})){d.innerHTML="\u660e\u5929";fish.all(d).addClass("spanTomo");d.setAttribute("s","true");d.setAttribute("d",n)}if(c._lastTime!=null){m=c._lastTime.split("-")[0];s=c._lastTime.split("-")[1];t=c._lastTime.split("-")[2];if(G(new Date(m,s-1,t),new Date(i,r,n),c)){fish.all(d).addClass("clickDate");d.onmouseout=function(){}}}}}e.setAttribute("inited","true")}function C(b){y.calElem.style.display=
"none";b&&b()}function D(b){var c={css:"",time:"",open:false,startTime:"",endTime:"",inputElem:this[0],showPast:false,fn:null,calElem:null,_lastTime:null,_addNum:0};fish.lang.extend(c,b||{});x(c,c.open)}function G(b,c,e){var a=new Date;if(e.startTime){a=e.startTime;if(typeof a!="string")a=new Date;else{a=a.replace(/-/g,"/");a=new Date(Date.parse(a))}}else a=new Date(a.getFullYear(),a.getMonth(),a.getDate());if(b-c===0)if(e.showPast)return true;else if(b-a>=0)return true;return false}function E(b,
c,e){var a={specialDate:[{date:"2013-01-01",name:"\u5143\u65e6"},{date:"2013-02-09",name:"\u9664\u5915"},{date:"2013-02-10",name:"\u6625\u8282"},{date:"2013-02-24",name:"\u5143\u5bb5"},{date:"2013-04-04",name:"\u6e05\u660e"},{date:"2013-05-01",name:"5.1"},{date:"2013-06-01",name:"6.1"},{date:"2013-06-12",name:"\u7aef\u5348"},{date:"2013-08-13",name:"\u4e03\u5915"},{date:"2013-09-19",name:"\u4e2d\u79cb"},{date:"2013-10-01",name:"\u56fd\u5e86"},{date:"2013-12-25",name:"\u5723\u8bde"},{date:"2012-04-04",
name:"\u6e05\u660e"},{date:"2012-05-01",name:"5.1"},{date:"2012-06-01",name:"6.1"},{date:"2012-06-23",name:"\u7aef\u5348"},{date:"2012-08-23",name:"\u4e03\u5915"},{date:"2012-09-30",name:"\u4e2d\u79cb"},{date:"2012-10-01",name:"\u56fd\u5e86"},{date:"2012-12-25",name:"\u5723\u8bde"}]};a:{b=new Date(b,c-1,e);if(a){a=a.specialDate;var f,g;e=-1;e=0;for(f=a.length;e<f;e++){c=a[e];g=c.date;var k=g=new Date(g.replace(/-/g,"/")),h=b;k.getFullYear();k.getMonth();k.getDate();h.getFullYear();h.getMonth();h.getDate();
var j=false;if(k.getTime()==h.getTime())j=true;if(j){e={};e.name=c.name;e.day=g.getDate()+"";b=e;break a}}}b=-1}return b}var y,u;D.close=C;fish.extend({mCal:D,preventInput:w,recoverInput:function(b){fish.all(b?b:this).each(function(c){if(c.getAttribute("_preventInput_")){c.style.imeMode="";c.onkeydown=c.oncontextmenu=c.onselectstart=null;c.setAttribute("_preventInput_","")}})}})})();
