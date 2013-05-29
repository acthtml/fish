 //自动下拉提示AutoComplete
    /*
    params = {
    inputId:"文本框id,必填",
    parentId:"下拉菜单div父div的Id,可选，默认添加到body上",
    className:"下拉菜单的样式,可选",
    firstSelected:"下拉提示第一个是否被选中,true,false,默认true",
    userIe6bug:"是否屏蔽ie6bug,true,false,默认true"
    }
    */
    AutoComplete = function (params) {
		var defaults ={
				input: null,
				popup: null,
                className:"listbox_se",
				//data: null,//
				//witchType:null,//
				current: -1,
				defaultValue: "",
				parentDoc: null,
				firstSelected: true,
				userIe6bug: true,
                
				finshFun: function () {
				}

			}
		fish.lang.extend(defaults,params);
		fish.lang.extend(this,defaults);
        this.init(defaults);
    }
    AutoComplete.prototype = {
        init: function (params) {
            var that = this;
            that.input = document.getElementById(params.inputId);
            that.popup = document.createElement("div");
            if (!that.isNullOrEmpty(params.className)) {
                that.popup.className = params.className;
            }

            //that.data = params.data;
			//that.witchType = params.witchType;
			
            if (!that.isNullOrEmpty(params.parentId)) {
                that.parentDoc = document.getElementById(params.parentId);
            } else {
                that.parentDoc = document.body;
            }
            that.parentDoc.appendChild(this.popup);
            
			fish.on("click",function (e) {
                
                var it = fish.getTarget(e);
                while(it !== null) {
                    if(it === that) {
                        return;
                    }
                    it = it.parentNode;
                }
                fish.one(that.popup).addClass("none");

            },document);
         
            if (params.firstSelected === false) {
                that.firstSelected = false;
            }
            if (params.userIe6bug === true) {
                this.userIe6bug = true;
            }
			if (typeof (params.finshFun) === "function") {
				that.finshFun = params.finshFun;
			}
        },
		
		//判断是否为空或者Null
        isNullOrEmpty: function (str) {
            if (str != null && fish.trim(str).length > 0) {
                return false;
            } else {
                return true;
            }
        },

		hide : function () {
            
            fish.one(this.popup).addClass("none");
            this.popup.innerHTML = "";
        },
      
        show: function (obj, witchType) {
            
            this.popup.innerHTML = "";
            if (this.userIe6bug === true) {
                this.popup.innerHTML = '<iframe scrolling="no" frameborder="0" class="iframeie6"></iframe>'
            }
            
            var hotelChain = obj["HotelChain"];
            var hotelList = obj["HotelList"];
            var data = null;
            var inputValue = this.input.value.toString();
            this.defaultValue = inputValue;
            var myfdl = document.createElement("dl");
            var myfdt = document.createElement("dt");

            

            switch(witchType){
               case "city":
                     data = obj;
                     myfdt.innerHTML = "输入中文/拼音/或↑↓键选择";
               break;
               case "hotelname":
                    if(hotelChain.length && hotelList.length) {
                        data = [hotelChain].concat(hotelList);
                    }else if(hotelChain.length && !hotelList.length) {
                        data = [hotelChain];
                    }else if(!hotelChain.length && hotelList.length) {
                        data = hotelList;
                    }else {
                        // 走吧不要显示了，但是这对括弧永远不会有执行流经过！
                        data = [];
                        return;
                    }
                     myfdt.innerHTML = obj.Title;
               break;
               case "position":
                     data = obj.HotelLocationList;
                     myfdt.innerHTML = obj.Title;
               break;
               default:
                     data = obj;
                     myfdt.innerHTML = "输入中文/拼音或↑↓键选择";
               break;
            }
           
            myfdl.appendChild(myfdt);
            var aliasName, 
                englishName, 
                abbr, 
                myfdd, 
                nameKey = obj.HotelNameKeys;
			
			//todo 需要写个正则过滤下括弧等特殊符号，暂时没想起来如何过滤
//            try{
//                  var rex = new RegExp('^' + inputValue, 'i');
//               }
//            catch(e){

//            }
            
            for (var i = 0; i < data.length; i++) {

                aliasName = data[i][1];
                myfdd = document.createElement("dd");
                myfdd.title = aliasName;
                myfdd.index = i;
				switch(witchType){
					case "city":
						aliasName = data[i][1];
						englishName = data[i][3];
						myfdd.title = aliasName;
						myfdd.setAttribute("cid",data[i][5]);
						myfdd.setAttribute("ctype",data[i][2]);
						myfdd.innerHTML = '<span class="citypy">' + englishName+ '</span><span class="cityhy">' + aliasName + '</span>';
						break;
					case "hotelname":
                            try{
                                    var regex = new RegExp(nameKey, "gi");
                               }
                            catch(e){
                            }
							myfdd.setAttribute("cid",data[i][0]);
                            myfdd.setAttribute("ctype",data[i][2]);
						    if(i == data.length - 1 && data.length > 10){
							    var str = "更多含“" + nameKey + "”的酒店";
							    nameKey = nameKey.replace(regex, '<span class="yellow">' + nameKey + '</span>');
							    var str1 = "更多含“" + nameKey + "”的酒店";
							    myfdd.title = str;
							    myfdd.innerHTML = str1;
						    }else{
							    //myfdd.setAttribute("hType",data[i].type);
							    //myfdd.setAttribute("cid",data[i][0]);
//                                  try{
//							            var regex = new RegExp(inputValue, "gi");
//                                  }
//                                   catch(e){

//                                  }
							    aliasName = aliasName.replace(regex, '<span class="yellow">' + inputValue + '</span>');
							    myfdd.innerHTML =   aliasName ;
						    }
						break;
					case "position":
						myfdd.setAttribute("cid",data[i][0]);
						myfdd.setAttribute("ctype",data[i][2]);
                        try{
						    var regex = new RegExp(inputValue, "gi");
                        }
                        catch(e){

                        }
						aliasName = aliasName.replace(regex, '<span class="yellow">' + inputValue + '</span>');
						myfdd.innerHTML = '<span class="cityhyword">' + aliasName + '</span>';
						break;
					default:
                        try{
						    var regex = new RegExp(inputValue, "gi");
                        }
                        catch(e){
                        }
						aliasName = aliasName.replace(regex, '<span class="yellow">' + inputValue + '</span>');
						myfdd.innerHTML = '<span class="cityhyword">' + aliasName + '</span>';
						break;
				}
                myfdl.appendChild(myfdd);
            }
            this.popup.appendChild(myfdl);
            fish.one(this.popup).removeClass("none");
            this.parentDoc.style.display = "block";
            this.initEvent(witchType);
        },
        initEvent: function (witchType) {
            var that = this;
            var els = that.popup.getElementsByTagName("dd");
            if (that.firstSelected) {
                if (els.length > 0) {
                    els[0].className = "on";
                    
                }
            }
            that.current = -1;
            var clearListStyle = function () {
                for (var i = 0; i < els.length; i++) {
                    els[i].className = "";
                }
            }
            var inputTextValue = function (key) {
                if (key.indexOf("更多含")!=-1)
                {
                    that.input.value = key.split("“")[1].split("”")[0];
                }
                else
                {
                that.input.value = key;
                }
            }
			var inputAttrValue = function(){

				var ctype   = this.getAttribute("ctype"),
						cid = this.getAttribute("cid");
				if (ctype != undefined){
					that.input.setAttribute("ctype",ctype);
				}
				if (cid != undefined){
					that.input.setAttribute("cid",cid);
				}
			}
			
				//keydown keyup enter Handler
			var handleInput = function(witchType){
				switch(witchType){
                    case "hotelname":
                        if(that.current <= -1){
							that.input.setAttribute("cid",0);
							that.input.setAttribute("ctype",2);
						}else{
							that.input.setAttribute("ctype",els[that.current].getAttribute("ctype"));
							that.input.setAttribute("cid",els[that.current].getAttribute("cid"));
						}
                    break;
					case "city":
					case "position":
					default:
						if(that.current <= -1){
							that.input.setAttribute("ctype",0);
							that.input.setAttribute("cid",0);
						}else{
							that.input.setAttribute("ctype",els[that.current].getAttribute("ctype"));
							that.input.setAttribute("cid",els[that.current].getAttribute("cid"));
						}
					break;
				}
			}
			/*
			//set input attribute
			var setInputAttr = function(witchType){
				var args = [].slice.call(arguments,0);
				switch(witchType){
					case "city":
							if (args[0] != undefined){
								that.input.setAttribute("cid",args[0]);
							}
							if (args[1] != undefined){
								that.input.setAttribute("ctype",args[1]);
							}
						break;
					case "position":
							if (args[0] != undefined){
								that.input.setAttribute("ctype",args[0]);
							}
							if (args[1] != undefined){
								that.input.setAttribute("cid",args[1]);
							}
						break;
				}
			}
			//according Type bind right Attribute
			var bindRightAttr = function(witchType){
				switch(witchType){
					case "city":
						if(that.current == "-1"){
							setInputAttr(0,0);
						}else{
							setInputAttr(els[that.current].cid,els[that.current].ctype);
						}
						break;
					case "position":
					default:
						if(that.current == "-1"){
							setInputAttr(0,0);
						}else{
							setInputAttr(els[that.current].ctype,els[that.current].cid);
						}
					break;
				}
			}
            */
            that.input.onkeydown = function (event) {
                event = event || window.event;
                if (event.keyCode == 40) {
                    clearListStyle();
                    //Down
                    if(that.current === els.length) {
                        that.current = 0;
                    }else {
                        that.current++;
                    }
                    
                    if (that.current >= els.length) {
                        that.current = -1;
                        inputTextValue(that.defaultValue)
						handleInput(witchType);
						
                    } else {
                        els[that.current].className = "on";
                        inputTextValue(els[that.current].title.toString());
						handleInput(witchType);
                    }
					fish.preventDefault(event);
                } else if (event.keyCode == 38) {
                    clearListStyle();
                    //UP
                    if(that.current === -1) {
                        that.current = els.length - 1;
                    }else {
                        that.current--;
                    }

                    if (that.current <= -1) {
                        handleInput(witchType);
                        that.current = els.length;
                        inputTextValue(that.defaultValue);
                        
                    } else {
                        els[that.current].className = "on";
                        inputTextValue(els[that.current].title.toString());
						handleInput(witchType);
                    }
                } else if (event.keyCode == 13) {
                    //Enter
                    if (that.current > -1 && that.current < els.length) {
                        inputTextValue(els[that.current].title.toString());
                    }
					
                    fish.one(that.popup).addClass("none");
                    that.current = -1;
                    //that.finshFun();
                }
                // console.log(that.current);
            }
            for (var i = 0; i < els.length; i++){
                els[i].onmouseover = function (event){
                    clearListStyle();
                    this.className = "on";
                    that.current = this.index;
                }
                els[i].onclick = function (event){
                    that.current = -1;
                    inputTextValue(this.title.toString());
                    
                    fish.one(that.popup).addClass("none");
					inputAttrValue.call(this);
                  //add some Actions
                }
            }
        }
    }
    AutoComplete.prototype.constructor = AutoComplete;﻿
	fish.extend({
                autoComplete: function(params){
                    return new AutoComplete(params);
               }
            });