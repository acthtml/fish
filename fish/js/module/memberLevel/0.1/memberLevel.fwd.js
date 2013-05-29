/* 幻灯*/

;(function(){
    //会员信息保存
    var oneState, memberLevelQueue = [], ajaxing;

    function execQueue(){
        while(memberLevelQueue.length){
            memberLevelQueue.pop()();
        }
    }

    function main(paramInput){
        var that = this,
            param = {
                memberInfoUrl:"http://www.17u.cn/AjaxHelper/TopLoginHandler.aspx?channel=Index&action=check&asyncRefid=0&date=" + new Date(),
                activeMemberUrl:"http://www.17u.cn/AjaxHelper/TopLoginHandler.aspx?action=addgrovaule"
            };
        fish.lang.extend(param, paramInput);

        if(fish.one(this).attr("memberlevelinited") === "true"){
            return;
        }

        that.addClass("level_pic");

        param.actMemberElem = function() {
             var thatOffset = that.offset(),
                 left_div = thatOffset.left + "px",
                 top_div = thatOffset.top + 25 + "px",
                 inner_class = oneState.level,
                 remo_class = 'lev_' + oneState.level,
                 inner_pic = 'pic_lef_' + inner_class,
                 inner_picr = 'my_level_' + inner_class;

             if (oneState.level == "1") {
                 that.addClass(remo_class);
                 that.html("top", '<a href="javascript:;" title="点击获取特权" class="relo" style="left:' + left_div + ';top:' + top_div + '" class="leve_pop"></a>');
                 //点亮特权
                 var thatRelo = fish.all(".relo", that).on("click", function () {
                     fish.ajax({
                         url: param.activeMemberUrl,
                         type: "jsonp",
                         timeout:8000,
                         fn: function (data) {
                             if(data && data.state === 100){
                                 window.location.reload();
                             }
                         }
                     });
                 });
                 fish.one(window).on("resize", function(){
                     thatOffset = that.offset();
                     left_div = thatOffset.left + "px";
                     top_div = thatOffset.top + 25 + "px";
                     thatRelo.css("left:" + left_div + ";top:" + top_div);
                 })
             }
             else if(oneState.spec && oneState.level){
                 that.addClass(remo_class);
                 that.html("top", '<div class="level_Id level_box leve_pop" style="display:none;left:' + left_div + ';top:' + top_div + '"><span class="inner_pic pic_lef"></span> <div class="pic_rig"><span class="my_lev my_level">我的等级：</span><div class="tg_groupTop group_today"><div class="group_center_main group_center" style="overflow: hidden; position: relative;">' +
                     '<ul class="rgt_tgList"></ul></div><div class="group_left tg_last"></div><div class="group_right_bf tg_next"></div></div><a href="http://www.17u.cn/zhuanti/member/" target="_blank" class="link" title="查看我的会员特权">查看我的会员特权>></a></div></div>');
                 var soli_li = fish.one(".rgt_tgList", that);
                 for (var n = 0; n < oneState.spec.length; n++) {
                      var add_li = document.createElement("li");
                      add_li.className = oneState.spec[n];
                      soli_li.html("bottom", add_li);
                  }
                  fish.require("mSlider", move_slider);
                  fish.all(".level_picId", that).addClass(remo_class);
                  fish.all(".inner_pic", that).addClass(inner_pic);
                  fish.all(".my_lev", that).addClass(inner_picr);
                  fish.one(".level_Id", that).effect({ elem: that, type: "hover" });
             }
            else{
                 that.css("display:none");
             }
         }

        //cn登录信息
        if(window.loginState){
            oneState = param.state = window.loginState;
            param.actMemberElem();
        }
        else{
            //先压栈
            memberLevelQueue.push(function(){
                param.actMemberElem();
            });
            //保证只有一个异步发生，其余都在等待
            if(!ajaxing){
                ajaxing = true;
                fish.ajax({
                    url: param.memberInfoUrl,
                    type: "jsonp",
                    timeout: 8000,
                    fn: function(data){
                        oneState = param.state = data;
                        ajaxing = false;
                        execQueue();
                    },
                    err:function(){
                        ajaxing = false;
                    }
                });
            }

        }



        fish.one(this).attr("memberlevelinited", "true");
        var topSlider;
        function btn_fn(){

            if(topSlider.boundary === "end"){
                fish.all(".tg_last", that).removeClass("group_left").addClass("group_left_bf");
                fish.all(".tg_next", that).removeClass("group_right_bf").addClass("group_right");
            }
            else if(topSlider.boundary === "begin"){
                fish.all(".tg_next", that).removeClass("group_right").addClass("group_right_bf");
                fish.all(".tg_last", that).removeClass("group_left_bf").addClass("group_left");
            }
            else{
                fish.all(".tg_next", that).removeClass("group_right_bf").addClass("group_right");
                fish.all(".tg_last", that).removeClass("group_left_bf").addClass("group_left");
            }
        }



        function move_slider(){
            fish.one(".level_Id", that).css("display:block");

            fish.one(".tg_groupTop", that).mSlider({
                autoScroll: false,
                showNav: false,
                scrollNum:1,
                moveTime: 1500,
                arrows: true,
                prevBtn: ".tg_next",
                content:".rgt_tgList li",
                canvas:".rgt_tgList",
                nextBtn: ".tg_last",
                nextFn: btn_fn,
                prevFn: btn_fn
            },function(obj){
                topSlider = obj;
            });
            fish.one(".level_Id", that).css("display:none");
        }
    }


    fish.extend({
        memberLevel:main
    })
})();
