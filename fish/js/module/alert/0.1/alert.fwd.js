(function () {
	//alert html
    fish.one(document.body).html("top", "<div style='display:none;'><div id='alertBox' class='alert_box'><div id='alertContent' class='alert_content'></div><a  id='alertBtn' class='alert_btn' href='javascript:void(0);'><span class='mid'>确定</span><span class='right'></span></a></div></div>");
	//confirm html
	fish.one(document.body).html("top", "<div style='display:none;'><div id='confBox' class='conf_box'><div id='confContent' class='conf_content'></div><a id='confOkBtn' class='conf_okbtn' href='javascript:void(0);'><span class='mid'>确定</span><span class='right'></span></a><a id='confCelBtn' class='conf_celbtn' href='javascript:void(0);'><span class='mid'>取消</span><span class='right'></span></a></div></div>");
    var alertBox = fish.dom("#alertBox"),
		alertContent = fish.dom("#alertContent"),
		alertFn,
		confBox = fish.dom("#confBox"),
		confContent = fish.dom("#confContent"),
		okFn,
		cancelFn;
    fish.on("click", function () {
		fish.mPop.close();
		if(typeof(alertFn) == "function"){
			alertFn();
		}
    }, "#alertBtn");

   
    function mAlert(txt, fn) {
        fish.one(alertContent).html(txt);
		alertFn = fn;
		return fish.mPop({
			title:"显示",
			content:fish.dom("#alertBox")
		})
    }

    fish.extend({
        alert: function (txt, fn) {
            return mAlert(txt, fn);
        }
    });
	
	//confirm
	function mConfirm(txt, okfn,cancelfn){
		fish.one(confContent).html(txt);
		okFn = okfn;
		cancelFn = cancelfn;
		return fish.mPop({
			title:"提示",
			content:fish.dom("#confBox")
		});
	}
	fish.on("click",function(){
		fish.mPop.close();
		if(typeof(okFn) == "function"){
			okFn();
		}
	},"#confOkBtn");
	
	fish.on("click",function(){
		fish.mPop.close();
		if(typeof(cancelFn) == "function"){
			cancelFn();
		}
	},"#confCelBtn");
	
	fish.extend({
        confirm: function (txt, okfn, cancelfn) {
            return mConfirm(txt, okfn, cancelfn);
        }
    });
	
})();