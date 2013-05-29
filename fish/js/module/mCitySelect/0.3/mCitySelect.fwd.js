/**
 * SeleList
 * @version 2011-04-27 v1.0
 */
//<<-------级联城市----------
(function(){
	var cityData = [{
	    "id": 3106,
	    "name": "国内",
	    "children": [
	    	{"id": 2,"name": "安徽"},
	    	{"id": 3,"name": "北京"},
	    	{"id": 4,"name": "福建"},
	    	{"id": 5,"name": "甘肃"},
	    	{"id": 6,"name": "广东"},
	    	{"id": 7,"name": "广西"},
	    	{"id": 8,"name": "贵州"},
	    	{"id": 9,"name": "海南"},
	    	{"id": 10,"name": "河北"},
	    	{"id": 11,"name": "河南"},
	    	{"id": 12,"name": "黑龙江"},
	    	{"id": 13,"name": "湖北"},
	    	{"id": 14,"name": "湖南"},
	    	{"id": 15,"name": "吉林"},
	    	{"id": 16,"name": "江苏"},
	    	{"id": 17,"name": "江西"},
	    	{"id": 18,"name": "辽宁"},
	    	{"id": 19,"name": "内蒙古"},
	    	{"id": 20,"name": "宁夏"},
	    	{"id": 21,"name": "青海"},
	    	{"id": 22,"name": "山东"},
	    	{"id": 23,"name": "山西"},
	    	{"id": 24,"name": "陕西"},
	    	{"id": 25,"name": "上海"},
	    	{"id": 26,"name": "四川"},
	    	{"id": 27,"name": "天津"},
	    	{"id": 28,"name": "西藏"},
	    	{"id": 29,"name": "新疆"},
	    	{"id": 30,"name": "云南"},
	    	{"id": 31,"name": "浙江"},
	    	{"id": 32,"name": "重庆"},
	    	{"id": 33,"name": "香港"},
	    	{"id": 34,"name": "澳门"},
	    	{"id": 35,"name": "台湾"}
	    ]
	}];


	function findBy(type, value, data) {
	    for (var n = 0; n < data.length; n++) {
	        if (data[n][type] == value) {
	            return data[n].children;
	        }
	    }
	}

	/**
	* 创建级联下拉单
	* @param {Object} data
	* @param {Object} elemArray
	* @param {Object} elemArray.query 该级联下拉单的索引字符串
	* @param {Object} elemArray.firstTxt 该级联下拉单的默认第一条信息
	* @param {Object} elemArray.ajaxData 该级联下拉单没有数据时的请求地址
	* @param {Object} elemArray.onchange 该级联下拉单的onchange事件，回调函数
	*/
	var SeleList = function (elemArray, data) {
        this.data = [];
	    this.elem = [];
        this.firstTxt = [];
        this.ajaxData = [];
        this.onchange = [];
	    for (var n = 0; n < elemArray.length; n++) {
            this.data[n] = elemArray[n].data;
	        this.elem[n] = fish.dom(elemArray[n].query);
	        this.firstTxt[n] = elemArray[n].firstTxt;
	        this.ajaxData[n] = elemArray[n].ajaxData;
	        this.onchange[n] = elemArray[n].onchange;
	    }

	    this.allData = cityData; //默认国内城市数据
	    this.init();

	    return this;
	}

	SeleList.prototype = {
	    init: function () {
	        this.setFirstTxt();

	        for (var n = 0; n < this.elem.length; n++) {
	            if(typeof this.data[n] === "number"){
                    this.data[n] = findBy("id", this.data[n], this.allData);
                }
                if(this.data[n]){
                    this.bulid(n);
                }
	        }
	        this.bindElem();
	    },

	    /**
	    * 设置默认下拉单 
	    */
	    setFirstTxt: function () {
	        for (var n = 0; n < this.elem.length; n++) {
                this.removeSele(n);
                this.elem[n].options[0] = new Option(this.firstTxt[n]);
            }
	    },

	    setData: function (array, n, param, callback) {
	        this.data[n] = array;
	        this.bulid(n, param);
            callback && callback();
	    },
        //绑事件
	    bindElem: function () {
	        var that = this;
	        for (var n = 0; n < this.elem.length; n++) {
                //一个大闭包
                (function (n) {
                    fish.one(that.elem[n]).on("change", function () {
                        var nextArray;
                        if (this.selectedIndex > 0) {
                            nextArray = findBy("id", this.options[this.selectedIndex].getAttribute("_id"), that.data[n]);
                        }
                        if (that.onchange[n]) {
                            that.onchange[n](this, this.selectedIndex);
                        }
                        if (nextArray) {
                            if (that.elem[n + 1]) {
                                that.data[n + 1] = nextArray;
                                that.bulid(n + 1);
                            }
                        }
                        else if (that.ajaxData[n + 1] && that.elem[n].selectedIndex != 0) {
                            that.ajaxSetData(n + 1);

                        }
                    });
                })(n);
	        }
	    },
        ajaxSetData:function(index, param, callback){
            var url, that = this, prevOptions = this.elem[index-1];
            if (that.ajaxData && prevOptions) {
                url = that.ajaxData[index](prevOptions.options[prevOptions.selectedIndex].getAttribute("_id"));
                fish.ajax({
                    cache: true,
                    type:"jsonp",
                    url: url,
                    fn: function (data) {
                        if(data && data.result){
                            that.setData(data.result, index, param, callback);
                        }
                    }
                });
            }
        },
        //清空某个下拉框的数据
	    removeSele: function (n) {
	        var length = this.elem[n].length,
			sele = this.elem[n];
	        for (var i = length - 1; i >= 0; i--) {
	            sele.options[i] = null;
	        }
	    },
        //创建第n个下拉菜单的内容，然后再绑定n+1个下拉框的数据 省份0，市 1，区2
	    bulid: function (n, param) {
            //对应的下拉内容无数据，则不创建
            if(this.data[n]){
                //param参数包含过滤信息
                this.removeSele(n);//清空下拉菜单的值
                var length = this.data[n].length,
                    sele = this.elem[n],
                    data = this.data[n],
                    allEnable = true;
                if (this.firstTxt[n] !== null) {
                    var newOpt = new Option(this.firstTxt[n], this.firstTxt[n]);
                    newOpt.setAttribute("_id", 0);
                    try {
                        sele.add(newOpt, null); // standards compliant
                    }
                    catch (ex) {
                        sele.add(newOpt); // IE only
                    }

                    sele.selectedIndex = 0;
                }
                if(param && param.only){
                    allEnable = false;
                }

                for (i = 0; i < length; i++) {
                    if ((data[i].name !== "0" && allEnable)
                        || (!allEnable && data[i].name === param.only)) {
                        var newOpt = new Option(data[i].name, data[i].name);
                        newOpt.setAttribute("_id", data[i].id);
                        try {
                            sele.add(newOpt, null); // standards compliant
                        }
                        catch (ex) {
                            sele.add(newOpt); // IE only
                        }
                        //默认选中
                        if(param && param.selected === data[i].name){
                        	(function(seled,ii){
                        		setTimeout(function(){
                        			seled.selectedIndex = ii + 1;
                        		},0);
                        	})(sele,i);
                        }

                    }
                }
                this.bulid(n + 1);
            }
	    }

	}

	fish.extend({
        mCitySelect: function(param, callback){
            //第一个使用国内的省数据，直接使用id
            var aParam = [];
            if(param.province){
                aParam.push({query:param.province, firstTxt:param.provinceFirstText ? param.provinceFirstText : "请选择省", data:3106});
            }
            if(param.city){
                aParam.push({query:param.city, firstTxt:param.cityFirstText ? param.cityFirstText : "请选择市", ajaxData: param.cityAjaxUrl ? param.cityAjaxUrl: function (provid) {
                        return "http://www.17u.cn/hotel/ajax/HotelAjaxCall.aspx?action=GetCityByProvince&id=" + provid;
                    }
                });
            }
            if(param.area){
                aParam.push({query:param.area, firstTxt:param.areaFirstText ? param.areaFirstText : "请选择区/县", ajaxData: param.areaAjaxUrl ? param.areaAjaxUrl:function (cityid) {
                        return "http://www.17u.cn/hotel/ajax/HotelAjaxCall.aspx?action=GetAreaByCity&id=" + cityid;
                    }
                });
            }
            var oList = new SeleList(aParam);
            callback && callback(oList);
            return oList;
        }
    })
})();
//---------级联城市-------->>
