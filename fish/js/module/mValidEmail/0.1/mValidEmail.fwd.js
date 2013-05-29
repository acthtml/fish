(function () {
    var config = {
        overlay: false,
        bgclose: true,
        email: "",
        url: "http://member.17u.cn/AjaxHandler/VerificationEmailInterface.aspx",
        data: "action=setsendemail&email=",
        fn: function () { } // TODO 成功后默认的处理函数
    };
    fish.extend({
        /**
        * @param	{boolean}		bgclose		单击背景是否关闭组件，true为关闭，false为不关闭，默认为true，只有在overlay为true的情况下才有效
        *           {string}		email		当前的email，默认为空
        *			{string}		url			请求的地址，默认为"http://member.17u.cn/AjaxHandler/VerificationEmailInterface.aspx"，url和打他要配合使用
        *			{string}		data		发送的数据，格式为URL的请求参数串，结尾时"email="，email为请求参数名，可以替换，例如："action=setsendemail&email="
        *			{function}		fn			成功后关闭窗口后的回调函数，默认不做处理
        * 
        **/
        //	{boolean}		overlay		是否显示灰色背景，true为显示，false为不显示，默认为false，暂时不开放
        mValidEmail: function (param) {
            fish.lang.extend(config, param);
            var validateEmail = document.getElementById("validateEmail");
            if (validateEmail === null) {
                validateEmail = createValidateEmail();
            }
            if (config.email != "") {
                fish.one("input.validateEmailEmail", validateEmail).removeClass("textPlaceholder").val(config.email);
            }
            // require
            fish.mPop({
                //overlay: config.overlay,
                bgclose: config.bgclose,
                content: validateEmail,
                width: "395px"
            });
        }
    });
    /* 
    * @param input的元素，可以扩展到id, 节点元素，节点元素数组
    *
    */
    function addPlaceholder(ele) {
        var tagName = ele.nodeName;
        if (tagName == null || tagName.toLowerCase() != "input") {
            return;
        }
        var className = "textPlaceholder";
        fish.one(ele).addClass(className);
        ele.value = ele.getAttribute("text-placeholder");
        fish.one(ele).on("focus", function () {
            if (ele.value == ele.getAttribute("text-placeholder")) {
                ele.value = "";
                fish.one(ele).removeClass(className);
            }
        });
        fish.one(ele).on("blur", function () {
            if (ele.value === "") {
                ele.value = ele.getAttribute("text-placeholder");
                fish.one(ele).addClass(className);
            }
        });
    }

    function createValidateEmail() {
        var validateEmail = document.createElement("div");
        validateEmail.id = "validateEmail";
        validateEmail.innerHTML = '<div class="header"><span class="acronym">完善邮箱&nbsp;</span><span class="explain">现在完善并验证您的邮箱，即可获得100成长值</span><a class="validateEmailClose"></a></div><table><tr style="height: 20px;"><td></td><td></td></tr><tr><td></td><td style="padding-bottom: 10px;"><span class="invalidMessage none"></span></td></tr><tr><td class="label">你的邮箱:</td><td><input  class="validateEmailEmail" text-placeholder="请输入E-mail(如a@b.c)"></td></tr><tr><td></td><td style="padding: 8px 2px;"><a class="validateEmailSubmit" href="javascript:void(0);">确定<a></td></tr><tr><td></td><td class="prompt">点击确定后，请在24小时内至您的新邮箱查收验证邮件</td></tr><table>';
        fish.all("a.validateEmailClose", validateEmail).on("click", function () {
            fish.mPop.close();
        });
        var emailInput = fish.one("input.validateEmailEmail", validateEmail)[0];
        var invalidMessage = fish.one(".invalidMessage", validateEmail);
        addPlaceholder(emailInput);
        function showInvalidMessage(message) {
            invalidMessage.html(message);
            invalidMessage.removeClass("none");
            fish.one(emailInput).addClass("invalid");
        }
        function hideInvalidMessage() {
            invalidMessage.addClass("none");
            fish.one(emailInput).removeClass("invalid");
        }
        fish.one(emailInput).on("focus", function (e) {
            hideInvalidMessage();
        });
        fish.all("a.validateEmailSubmit", validateEmail).on("click", function (e) {
            if (emailInput.value === "" || emailInput.value == emailInput.getAttribute("text-placeholder") || !fish.valida.email(emailInput.value)) {
                showInvalidMessage('请填写正确的邮箱地址');
                return;
            }
            else {
                hideInvalidMessage();
            }
            fish.ajax({
                url: config.url,   // TODO 地址可以配置
                openType: "get",
                type: "json",
                data: config.data + emailInput.value,
                fn: function (data) {
                    switch (data.status) {
                        case "101":
                        case "102":
                            showInvalidMessage("出错了，请重试");
                            break;
                        case "201":
                            showInvalidMessage("请填写正确的邮箱地址");
                            break;
                        case "401":
                            showInvalidMessage("该邮箱已存在");
                            break;
                        case "501":
                            fish.mPop.close();
                            break;
                        case "301":
                        case "300":
                            fish.mPop.close();
                            if (typeof config.fn === "function") {
                                config.fn(data);
                            }
                            else {
                                // fish.alert("设置成功！");
                            }
                            break;
                        default:
                            break;
                    }
                }
                /*,
                err: function() {
                showInvalidMessage("出错了，请重试");
                }
                */
            });
        });
        return validateEmail;
    }
})();