/** fish登录组件[按需加载]
 * @version 0.1
 * @modify 2012-8-29
 */

;(function(){

    /**
     *  MD5 (Message-Digest Algorithm)
     *  http://www.webtoolkit.info/
     */
    function MD5(string) {
        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                }
                else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            }
            else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }
        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }
        function H(x, y, z) {
            return (x ^ y ^ z);
        }
        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    }

    window.MD5 = MD5;

    //<<--------AjaxObj-------------

    //导出
    var Ajax = function (param) {
        fish.lang.extend(this, param);
    };
    Ajax.prototype = {
        abort: function () {
            this.ajaxObj && this.ajaxObj.abort();
        },
        send: function () {
            this.ajaxObj = fish.ajax({
                type: "json",
                url: this.url,
                timeout: this.timeout,
                data: this.data,
                fn: this.fn,
                err: this.err,
                onTimeout: this.onTimeout
            })
        }

    }
    //----------AjaxObj----------->>


    /**
     * 格式化表单
     * @param {DOM} form 要格式化的表单元素
     */
    function serialize(form) {
        var parts = new Array();
        var field = null;
        for (var i = 0, len = form.elements.length; i < len; i++) {
            field = form.elements[i];
            if (field.name === "") {
                continue;
            }
            switch (field.type) {
                case "password": //密码密文MD5一次
                    parts.push(encodeURIComponent(field.name) + "=" +
                        encodeURIComponent(MD5(field.value)));
                    break;
                case "button":
                    break;
                case "checkbox":
                    if (!field.checked) {
                        break;
                    }
                /* 默认格式 */
                default:
                    parts.push(encodeURIComponent(field.name) + "=" +
                        encodeURIComponent(field.value));
            }
        }
        return parts.join("&");
    }




    //<<-------------登录对象--------------
    function get(id) {
        return document.getElementById(id);
    }
    //闭包捕获
    function closer(that, fn) {
        return function () {
            fn.apply(that, arguments);
        }
    }


    function setTips(obj, text) {
        if (obj) {
            obj.style.visibility = "visible";
            obj.innerHTML = text;
        }
    }
    function hideTips(obj) {
        if (obj) {
            obj.style.visibility = "hidden";
            obj.innerHTML = "";
        }
    }

    //<<--------行为对象-----
    function logObj(param) {
        var nfn = function (){},
            defaultParam = {
                url: "", //请求地址
                timeout: 8000, //超时时间
                inFormId: "", //登录表单的id
                outFormId: "#", //退出表单的id(可选)
                nameInputId: "", //用户名input
                passWordInputId: "", //密码input
                remebInputId: "", //记住密码input
                validCodeInputId: "", //验证码
                enableUsername:true,//允许更改用户名
                loginBtnId: "", //登录按钮
                waitLoginId: "", //登录中的等待
                logoutBtnId: "#", //退出按钮(可选)
                waitLogoutId: "#", //退出中的等待(可选)
                tipsId: "#", //提示信息(可选)
                userNameId: "#", //用户名id(可选)
                onSuccessLogin: nfn, //成功登录的回调(可选)
                onSuccessExit: nfn, //成功退出的回调(可选)
                onPassFailed: nfn, //密码失败的回调(可选)
                onNameFailed: nfn, //用户名错的回调(可选)
                onLoginFailed: nfn, //退出失败的回调(可选)
                onExitFailed: nfn, //退出失败的回调(可选)
                onLogining: nfn, //登录开始的回调(可选)
                onExiting: nfn, //退出开始的回调(可选),
                onAbort: nfn, //手动中断时的回调
                onTimeout: nfn //超时回调(可选)
            }
        fish.lang.extend(defaultParam, param);
        fish.lang.extend(this, defaultParam);
        this.init();
    }

    logObj.prototype = {
        set: function (param) {
            fish.lang.extend(this, param);
        },

        init: function () {
            this.inForm = get(this.inFormId);
            this.outForm = get(this.outFormId);
            this.nameInput = get(this.nameInputId);
            this.passWordInput = get(this.passWordInputId);
            this.remebInput = get(this.remebInputId);
            this.loginBtn = get(this.loginBtnId);
            this.logoutBtn = get(this.logoutBtnId);
            this.waitLogin = get(this.waitLoginId);
            this.waitLogout = get(this.waitLogoutId);
            this.tips = get(this.tipsId);
            this.userName = get(this.userNameId);
            this.validCodeInput = get(this.validCodeInputId);


            var that = this;

            //登录
            this.inForm.onsubmit = function (event) {
                fish.preventDefault(event);
            };
            this.loginBtn.onclick = function () {
                that.login.call(that);
            };
            //退出
            if (this.outForm) {
                this.outForm.onsubmit = function (event) {
                    fish.preventDefault(event);
                };
            }
            if (this.logoutBtn) {
                this.logoutBtn.onclick = function () {
                    that.exit.call(that);
                };
            }




            this.nameInput.setAttribute("placeholderOption", "手机/邮箱");

            this.nameInput.onfocus =
                this.passWordInput.onfocus = function (event) {
                    var elem = this;
                    this.value = fish.trim(this.value);
                    if (this.value === this.getAttribute("placeholderOption")) {
                        this.value = "";
                    }
                    this.style.color = "#000000";
                    //hideTips(that.tips);
                }

            this.nameInput.onclick =
                this.passWordInput.onclick = function(){
                    this.select();
                }

            var fnName;
            this.nameInput.onblur = fnName = function () {
                this.value = fish.trim(this.value);
                if (this.value === "") {
                    this.style.color = "#666666";
                    this.value = this.getAttribute("placeholderOption");
                }
                else if (this.value === this.getAttribute("placeholderOption")) {
                    this.style.color = "#666666";
                }
                else {
                    this.style.color = "#000000";
                }

            };
            fnName.apply(this.nameInput);

            this.nameInput.onkeypress =
                this.passWordInput.onkeypress =
                    this.remebInput.onkeypress = function (e) {
                        //preventDefault(e);
                        var keycode = window.ActiveXObject ? event.keyCode : e.which;
                        if (keycode == 13) {//回车
                            fish.preventDefault(e);
                            that.login();
                        }
                    }
            if (this.validCodeInput) {
                this.validCodeInput.onkeypress = function (e) {
                    var keycode = window.ActiveXObject ? event.keyCode : e.which;
                    if (keycode == 13) {//回车
                        fish.preventDefault(e);
                        that.login();
                    }
                }
            }

            //创建逻辑核心
            this.lCore = new LCore({
                url: this.url,
                timeout: this.timeout,
                //都和超时出错的提示一样
                onTimeout: closer(that, that.onTimeout),
                onError: closer(that, that.onFailed),
                onLoginCallBack: closer(that, that.onLoginCallBack),
                onExitCallBack: closer(that, that.onExitCallBack),
                onStartLogin: closer(that, that.onStartLogin),
                onStartExit: closer(that, that.onStartExit),
                onAbort: closer(that, that.onAbort)
            });


        },

        showLogining: function () {
            this.loginBtn.style.display = "none";
            this.waitLogin.style.display = "block";
            if (this.tips) {
                this.tips.style.visibility = "hidden";
            }

            this.nameInput.disabled =
                this.passWordInput.disabled =
                    this.remebInput.disabled = "disabled";
        },
        showLoginNormal: function () {
            this.loginBtn.style.display = "inline";
            this.waitLogin.style.display = "none";

            if(this.enableUsername){
                this.nameInput.disabled = null;

            }
            this.passWordInput.disabled =
                this.remebInput.disabled = null;

        },

        showExiting: function () {
            if (this.logoutBtn) {
                this.logoutBtn.style.display = "none";
            }
            if (this.waitLogout) {
                this.waitLogout.style.display = "block";
            }

        },
        showExitNormal: function () {
            if (this.logoutBtn) {
                this.logoutBtn.style.display = "inline";
            }
            if (this.waitLogout) {
                this.waitLogout.style.display = "none";
            }
        },

        logState: function () {
            return this.lCore.logState();
        },

        login: function () {
            if (fish.trim(this.nameInput.value).length === 0 || fish.trim(this.nameInput.value) == "手机/邮箱") {
                setTips(this.tips, "请输入您的用户名");
                this.onLoginFailed();
            }
            else if (fish.trim(this.passWordInput.value).length === 0) {
                setTips(this.tips, "请输入您的密码");
                this.onLoginFailed();
            } else if (this.validCodeInput && fish.trim(this.validCodeInput.value).length === 0) {
                setTips(this.tips, "请输入验证码");
                this.onLoginFailed();
            }
            else {
                //开始登陆
                this.lCore.login(this.inForm, this.timeout);
                //清空密码
                this.passWordInput.value = "";
            }
        },

        exit: function () {
            if (this.outForm) {
                this.lCore.exit(this.outForm, this.timeout);
            }
        },

        abort: function () {
            if (this.logState() === "login") {
                this.showLoginNormal();
            }
            else if (this.logState() === "exit") {
                this.showExitNormal();
            }
            if (this.tips) {
                this.tips.style.visibility = "hidden";
            }
            this.lCore.abort();
        },

        onFailed: function (data) {
            if (this.logState() === "login") {
                this.showLoginNormal();
                setTips(this.tips, "抱歉，登录失败，请重试。");
                this.onLoginFailed(data);
            }
            else if (this.logState() === "exit") {
                this.showExitNormal();
                this.onExitFailed(data);
            }
        },
        //一系列事件
        onLoginCallBack: function (data) {
            this.showLoginNormal();
            switch (data.state) {
                case 100:
                    this.onSuccessLogin(data);
                    if (this.userName) {
                        this.userName.innerHTML = data.name;
                    }
                    break;
                case 200:
                    this.onPassFailed(data);
                    this.onLoginFailed(data);
                    this.passWordInput.select();
                    setTips(this.tips, "用户名或密码错误，请重新输入。");
                    break;
                case 300:
                    this.onNameFailed(data);
                    this.onLoginFailed(data);
                    this.nameInput.select();
                    setTips(this.tips, "用户名或密码错误，请重新输入。");
                    break;
                case 400:
                    this.onLoginFailed(data);
                    this.validCodeInput.select();
                    setTips(this.tips, "验证码错误，请重新输入。");
                    break;
                default:
                    this.onFailed(data);
            }
        },
        onExitCallBack: function (data) {
            this.showExitNormal();
            //隐藏提示信息
            if (this.tips) {
                this.tips.style.visibility = "hidden";
            }
            switch (data.state) {
                case 100:
                    this.onSuccessExit(data);
                    //cookie
                    fish.cookie.set({ name: "loginRecord", days: -1 });
                    break;
                default:
                    this.onFailed(data);
            }
        },

        onStartLogin: function () {
            this.onLogining();
            this.showLogining();
        },

        onStartExit: function () {
            this.onExiting();
            this.showExiting();
        }



    }
    //--------行为对象---->>


    //<<-------逻辑对象----

    function LCore(param) {
        var defaultParam = {
            url: "",
            timeout: 8000,
            //连接超时
            onTimeout: function () { },
            //退出时的回调
            onAbort: function () { },
            //连接返回出错的回调
            onError: function () { },
            //登录信息返回后的回调
            onLoginCallBack: function () { },
            //注销信息返回后的回调
            onExitCallBack: function () { },
            //开始登录的回调
            onStartLogin: function () { },
            //开始注销的回调
            onStartExit: function () { }
        }
        fish.lang.extend(defaultParam, param);
        fish.lang.extend(this, defaultParam);
        this.init();
    }


    LCore.prototype = {
        init: function () {
            var that = this;
            this.ajaxObj = new Ajax({
                url: this.url,
                timeout: this.timeout,
                data: "",
                fn: function (data) {
                    if (that.logState() === "login") {
                        that.onLoginCallBack(data);
                    }
                    else if (that.logState() === "exit") {
                        that.onExitCallBack(data);
                    }
                },
                onTimeout: that.onTimeout,
                err: that.onError
            });
        },

        //检查当前状态
        logState: function () {
            if (this.ajaxObj.data.indexOf("action=login") >= 0) {
                return "login";
            }
            else if (this.ajaxObj.data.indexOf("action=exit") >= 0) {
                return "exit";
            }
        },

        //登录开始
        login: function (form) {
            this.onStartLogin();
            var data = serialize(form);
            this.setCookie(data);
            this.ajaxObj.data = data + "&action=login";
            this.ajaxObj.send();
            //this.logining = true;
        },


        //注销开始
        exit: function (form) {
            this.onStartExit();
            this.ajaxObj.data = serialize(form) + "&action=exit";
            this.ajaxObj.send();
        },

        abort: function () {
            this.ajaxObj.abort();
            this.onAbort();
        },

        //使用data数据中的remIt键值来作为保存天数，默认7天
        setCookie: function (data) {
            var dataArray = data.split("&"), days = 7, equalIndex, save = true;
            for (var n = dataArray.length - 1; n >= 0; n--) {
                if (dataArray[n].indexOf("remIt") >= 0 &&
                    dataArray[n].indexOf("remIt") <= (equalIndex = dataArray[n].indexOf("="))) {
                    days = parseInt(dataArray[n].slice(equalIndex + 1));
                    if (isNaN(days) || days <= 0) {
                        fish.cookie.set({ name: "loginRecord", days: -1 });
                        return;
                    }
                    dataArray.splice(n, 1);
                    save = false;
                    break;
                }
            }
            if (save) {
                fish.cookie.set({ name: "loginRecord", days: -1 });
            }
            else {
                fish.cookie.set({ name: "loginRecord", value: dataArray.join("&"), days: days, domain: strHost, encode: false, path: "/" });
            }
        }
    };
    //------逻辑对象----->>


    var reg = {
        passnum     :   /^[\d|{a-zA-Z}]{6}$/,      //验证码正则
        password    :   /^[\d|{a-zA-Z}]{6,16}$/    //密码正则
    }



    function mLogin(param, callback){
        var nfn = function(){},
            def = {
                title           :       "",     //弹出框的标题
                show            :       false,  //时是否显示
                showBooking     :       false,  //是否显示直接预定
                showPartner      :       false,  //是否显示合作登录
                enableUsername  :       true,   //是否允许更改用户名
                username        :       "",     //默认的用户名
                loginUrl        :       "/Member/MemberLoginAjax.aspx",                                 //登录接口地址
                getPassUrl      :       "/GetPasswordAjaxCall.aspx?Type=GetCodeByMoblie",               //获取验证码url
                verifyPassUrl   :       "/GetPasswordAjaxCall.aspx?Type=ValidCodeByMoblie",             //验证url
                resetPassUrl    :       "/GetPasswordAjaxCall.aspx?Type=ChangePassword&typeid=1",       //重置密码的url
                getPassTimeout  :       60,     //找回密码倒计时秒数
                getPassTimer    :       null,   //倒计时的计时器
                reload          :       false,  //登录成功是否刷新
                onLogin         :       nfn,    //登录成功的回调
                onOpen          :       nfn,    //弹出登录窗口的回调
                onPassBoxOpen   :       nfn,    //弹出密码找回的回调
                onResetBoxOpen  :       nfn,    //弹出重置密码框的回调
                onBooking       :       nfn,    //单击直接预定的回调
                onClose         :       nfn     //关闭的回调

            },
            the;


        the = fish.lang.proto(mLoginFn);
        fish.lang.extend(def, param);
        fish.lang.extend(the, def);

        the.init();

        callback && callback(the);
        return the;
    }


    mLoginFn = {
        bulidLogin:function(){
            fish.one(this.holder).html("bottom",
                '<div id="mLogin_login" class="mLogin">\
                    <div class="mLogin_bg"></div>\
                    <div class="mLogin_content clearfix">\
                        <div class="top_login">\
                           <span class="btn_close"></span>\
                        </div>\
                        <div class="mLogin_info">\
                           <h3 class="pg_tit">\
                               登录</h3>\
                           <form action="" id="login_form_pop_mLogin">\
                           <table cellspacing="0" cellpadding="0" border="0" class="login_content">\
                               <tbody>\
                                   <tr class="login_tips">\
                                       <th></th>\
                                       <td><span class=".none" id="titleTips_pop_mLogin" style="visibility:hidden;">用户名或密码错误</span></td>\
                                   </tr>\
                                   <tr>\
                                       <th>\
                                           <label for="account_pop_mLogin">\
                                               登录名</label>\
                                       </th>\
                                       <td>\
                                           <input type="text" placeholder="手机/邮箱" name="name" maxlength="30" id="account_pop_mLogin" placeholderoption="手机/邮箱" >\
                                       </td>\
                                   </tr>\
                                   <tr>\
                                       <th>\
                                           <label for="actpwd_pop_mLogin">\
                                               密码</label>\
                                       </th>\
                                       <td>\
                                           <input type="password" name="pass" maxlength="30" id="actpwd_pop_mLogin">\
                                       </td>\
                                   </tr>\
                                   <tr class="none">\
                                       <th>\
                                       </th>\
                                       <td>\
                                           <input type="checkbox" checked="" id="rem_it_1w_pop_mLogin" class="ceck">\
                                           <label class="ri1_label" for="rem_it_1w_pop_mLogin">\
                                               记住密码（一周）</label>\
                                       </td>\
                                   </tr>\
                                   <tr>\
                                       <th>\
                                       </th>\
                                       <td>\
                                           <a class="login_btn btn_outer clearfix" href="javascript:;" id="sign_in_btn_pop_mLogin"><span class="btn_inner">登&nbsp;录</span></a>\
                                           <span id="logining_pop_mLogin" style="display: none;" class="wait4sign">\
                                               <img alt="" src="http://img1.40017.cn/cn/new_ui/public/images/wait.gif"></span>\
                                           <a class="forget_password" href="http://www.17u.cn/GetPassword.aspx" target="_blank">\
                                               忘记密码？</a>\
                                       </td>\
                                       <tr class="partner none">\
                                           <th></th>\
                                           <td>\
                                               <div class="partnerLogin clearfix">\
                                                    <span class="l_baidu">\
                                                        <a class="a_partner" href="http://passport.17u.cn/Login/IntermediateParty/?FromType=baidu"\
                                                         nhref="http://passport.17u.cn/Login/IntermediateParty/?FromType=baidu&pageurl={backurl}"\
                                                          title="百度帐号绑定" rel="nofollow">百度</a>\
                                                    </span>\
                                               </div>\
                                           </td>\
                                       </tr>\
                                   </tr>\
                               </tbody>\
                           </table>\
                           </form>\
                        </div>\
                        <div class="mLogin_info l_border">\
                           <h3 class="pg_tit">\
                               直接预订</h3>\
                           <div class="yd_content"><p>此预订方式将<span class="spec">无法享受</span>点评奖金、现金券和积分优惠。</p>\
                               <a class="yd_bton btn_outer clearfix" href="javascript:;" id="mLogin_btn"><span class="btn_inner">直接预订</span></a>\
                           </div>\
                        </div>\
                    </div>\
                </div>');


        },

        bulidPass:function(){
            fish.one(this.holder).html("bottom",
                '<div id="mLogin_pass" class="mLogin_content submit_pass clearfix">\
                    <div class="top_login">\
                       <span class="btn_close"></span>\
                    </div>\
                    <p class="sns_sending clearfix">\
                        <span class="tips_top">我们已向您的手机<span class="phonenum"></span>发送验证码，请您收到后输入验证码</span>\
                        <a class="sending_btn btn_a_outer clearfix" href="javascript:;"><span class="btn_a_inner">获取验证码</span></a>\
                    </p>\
                    <p class="sns_valida clearfix">\
                        <label class="valida_label" for="valida_input">您收到的验证码：</label>\
                        <input id="valida_input" class="valida_code" maxlength="6" type=text value=""/>\
                        <span class="valida_tips">请输入6位验证码</span>\
                        <span class="valida_err">验证码错误，请重输</span>\
                    </p>\
                    <p class="btn_line clearfix">\
                        <a class="submit_btn btn_b_outer clearfix" href="javascript:;">\
                            <span class="btn_b_inner">提&nbsp;交</span></a>\
                        <span style="display: none;" class="wait4sign_a submit_btn">\
                        <img alt="" src="http://img1.40017.cn/cn/new_ui/public/images/wait.gif"></span>\
                        <span class="btn_tips"></span>\
                    </p>\
                    <p class="tips_line">\
                        如果您的手机已停机或其他原因无法获取验证码，请致电 4007-777-777 转1 人工服务\
                    </p>\
                </div>');
        },

        bulidResetPass:function(){
            fish.one(this.holder).html("bottom",
                '<div id="mLogin_resetpass" class="mLogin_content new_pass clearfix">\
                    <div class="top_login">\
                       <span class="btn_close"></span>\
                    </div>\
                <table cellspacing="0" cellpadding="0" border="0" class="pass_content">\
                               <tbody>\
                                   <tr>\
                                       <th>\
                                           <label class="passlabel" for="mLogin_resetpassword">\
                                               新密码：</label>\
                                       </th>\
                                       <td>\
                                           <input type="password" class="passinput" id="mLogin_resetpassword" maxlength="30" >\
                                       </td>\
                                       <td>\
                                           <p class="tips">密码由6-16位字符(字母、数字)组成，区分大小写</p><span class="valida_err password_new_err">验证码错误，请重输</span>\
                                       </td>\
                                   </tr>\
                                   <tr>\
                                       <th>\
                                           <label class="passlabel" for="mLogin_repeatpassword">\
                                               确认密码：</label>\
                                       </th>\
                                       <td>\
                                           <input type="password" class="passinput" id="mLogin_repeatpassword" maxlength="30" >\
                                       </td>\
                                       <td>\
                                           <span class="valida_err password_repeat_err">验证码错误，请重输</span>\
                                       </td>\
                                   </tr>\
                                   <tr class="btn_rol">\
                                       <th>\
                                       </th>\
                                       <td colspan="2">\
                                           <a class="pass_btn btn_b_outer clearfix" href="javascript:;"><span class="btn_b_inner">完&nbsp;成</span></a>\
                                           <span style="display: none;" class="wait4sign_a">\
                                               <img alt="" src="http://img1.40017.cn/cn/new_ui/public/images/wait.gif"></span>\
                                               <span class="btn_tips"></span>\
                                       </td>\
                                   </tr>\
                               </tbody>\
                           </table>\
                </div>');
        },

        init : function(){
            var holder, that = this;

            if(!fish.dom("#mLogin_holder")){
                fish.one(document.body).html("bottom", "<div id=mLogin_holder style='display:none'></div>");
            }
            this.holder = fish.dom("#mLogin_holder");
            //登录框
            if(!fish.dom("#mLogin_login")){
                this.bulidLogin();
            }
            this.loginElem = fish.dom("#mLogin_login");
            //提交验证码框
            if(!fish.dom("#mLogin_pass")){
                this.bulidPass();
            }
            this.passElem = fish.dom("#mLogin_pass");
            //密码重置框
            if(!fish.dom("#mLogin_resetpass")){
                this.bulidResetPass();
            }
            this.resetPassElem = fish.dom("#mLogin_resetpass");


            if(!this.enableUsername){
                fish.one("#account_pop_mLogin").attr("disabled", "disabled");
            }

            if(this.username){
                fish.one("#account_pop_mLogin").val(this.username);
            }

            if(this.title){
                fish.all(".mLogin_bg", this.loginElem).html(this.title);
            }
            if(this.showPartner){
                fish.all(".partner", this.loginElem).removeClass("none");
                //合作登录
                fish.all(".a_partner").on("click",function(){
                     this.href=this.getAttribute("nhref").replace("{backurl}",encodeURIComponent(window.location.href));
                });
            }
            function closeBox(){
                fish.mPop.close();
                that.onClose();
            }

            fish.one(".btn_close", this.loginElem).on("click", closeBox)
            fish.one(".btn_close", this.passElem).on("click", closeBox)
            fish.one(".btn_close", this.resetPassElem).on("click", closeBox)


            if(this.showBooking){
                fish.all(".l_border", this.loginElem).css("display:block");
                fish.all(".yd_bton", this.loginElem).on("click", function (){
                    that.onBooking();
                    fish.mPop.close();
                    that.onClose();
                })
            }
            else{
                fish.all(this.loginElem).css("width:298px")
                fish.all(".l_border", this.loginElem).css("display:none");
            }


            //登录组件
            this.loginObj = new logObj({
                url: this.loginUrl,
                enableUsername:this.enableUsername,
                userNameId: "user_name",
                inFormId: "login_form_pop_mLogin",
                nameInputId: "account_pop_mLogin",
                passWordInputId: "actpwd_pop_mLogin",
                remebInputId: "rem_it_1w_pop_mLogin",    //记住密码input
                loginBtnId: "sign_in_btn_pop_mLogin",
                waitLoginId: "logining_pop_mLogin",  //登录中的等待
                tipsId: "titleTips_pop_mLogin",
                onSuccessLogin:function(data){that._loginSuc(data)}
            });
            fish.all("#mLogin_login .forget_password").on("click", function(e){
                fish.preventDefault(e);
                that.getPass();
                that.showPassBox();
                fish.one("#valida_input").val("");
                fish.all("#mLogin_resetpassword").val("");
                fish.all("#mLogin_repeatpassword").val("");
                that._hideVerifyPassTips();
                that._hideResetPassTips();
                that._hideRepeatPassErr();
                that._hideNewPassErr();
                that._hidePassErr();
            });

            //倒计时按钮文字的节点
            this.__timeoutTextElem = fish.one(".sending_btn .btn_a_inner", this.passElem);
            this.__passTipsElem = fish.one(".btn_tips", this.passElem);
            this.__usernameElem  = fish.one("#account_pop_mLogin");

            //倒计时按钮节点
            this.__timeoutBtnElem = fish.one(".sending_btn", this.passElem)
                .on("click", function(){
                    if(!that.__timeoutBtnElem.hasClass("btn_disable")){
                        that.getPass();
                    }
                });
            //验证按钮
            this.__verifyPassBtnElem = fish.one(".submit_btn", this.passElem)
                .on("click", function(){
                    that.verifyPass();
                });
            //重置按钮
            this.__resetPassBtnElem = fish.one(".pass_btn", this.resetPassElem)
                .on("click", function(){
                    that.resetPass();
                });

            this.__resetPassTipsElem = fish.one(".btn_tips", this.resetPassElem)


            this.__passInputElem = fish.all(".valida_code", this.passElem)
                .on("click", function(){
                    this.select();
                })
                .on("focus", function(){
                    that._hidePassErr();
                })
                .on("onkeypress", function(e){
                    var keycode = window.ActiveXObject ? event.keyCode : e.which;
                    if (keycode == 13) {//回车
                        fish.preventDefault(e);
                        that.verifyPass();
                    }
                })

            this.__newPassInputElem = fish.all("#mLogin_resetpassword")
                .on("click", function(){
                    this.select();
                })
                .on("focus", function(){
                    that._hideNewPassErr();
                })
                .on("onkeypress", function(e){
                    var keycode = window.ActiveXObject ? event.keyCode : e.which;
                    if (keycode == 13) {//回车
                        fish.preventDefault(e);
                        that.resetPass();
                    }
                })

            this.__repeatPassInputElem = fish.all("#mLogin_repeatpassword")
                .on("click", function(){
                    this.select();
                })
                .on("focus", function(){
                    that._hideRepeatPassErr();
                })
                .on("onkeypress", function(e){
                    var keycode = window.ActiveXObject ? event.keyCode : e.which;
                    if (keycode == 13) {//回车
                        fish.preventDefault(e);
                        that.resetPass();
                    }
                })

            if(this.show){
                this.open();
            }


        },

        open:function(){
            this.onOpen && this.onOpen();
            fish.mPop({content:this.loginElem});
        },

        //显示密码找回框
        showPassBox : function(){
            this.onPassBoxOpen && this.onPassBoxOpen();
            fish.one(".phonenum", this.passElem).html(this.getUsername());

            fish.mPop({content:this.passElem});
        },
        //显示重置密码框
        showResetBox : function(){
            this.onResetBoxOpen && this.onResetBoxOpen();
            fish.mPop({content:this.resetPassElem});
        },
        //开始倒计时
        startTimeout:function(){
            var that = this, timeN = this.getPassTimeout;
            if(this.getPassTimer){
                clearInterval(this.getPassTimer);
                this.getPassTimer = null;
            }
            this._disableTimeoutBtn();
            this.getPassTimer = setInterval(function(){
                that._setTimeoutText(timeN + "秒后可重发");
                timeN--;
                if(!timeN){
                    that.stopTimeout();
                }
            }, 1000);
        },
        //结束倒计时
        stopTimeout:function(){
            clearInterval(this.getPassTimer);
            this.getPassTimer = null;
            this._setTimeoutText("获取验证码");
            this._enableTimeoutBtn();
        },
        //重新设置用户名
        setUsername : function(newname){
            this.__usernameElem.val(newname);
        },
        //获取验证码
        getPass : function(){
            var that = this;
            if(!this.getPassTimer){
                fish.ajax({
                    url:this.getPassUrl,
                    data:"moblie=" + this.getUsername(),
                    type:"string",
                    fn : function(data){
                        that._getPassCallBack(data);
                    },
                    err : function(data){
                        that._getPassErrBack(data);
                    }
                });
                this._disableTimeoutBtn();
                this.startTimeout();
            }
        },
        //验证验证码
        verifyPass : function(){
            var that = this,
                val = this.__passInputElem.val();

            this._hideVerifyPassTips();

            if(!reg.passnum.test(val)){
                this._showPassErr("验证码错误，请重输");
            }
            else{
                this._hidePassErr();
                this._showPassLoading();

                fish.ajax({
                    url:this.verifyPassUrl,
                    data:"moblie=" + encodeURIComponent( this.getUsername()) + "&code=" + this.getPassNum(),
                    type:"string",
                    fn : function(data){
                        that._hidePassLoading();
                        that._verifyPassCallBack(data);

                    },
                    err : function(data){
                        that._hidePassLoading();
                        that._verifyPassErrBack(data);
                    }
                });
            }


        },
        //重置密码
        resetPass:function(){
            var that = this,
                valNew = this.__newPassInputElem.val(),
                valRepeat = this.__repeatPassInputElem.val();

            this._hideResetPassTips();

            if(!reg.password.test(valNew)){
                this._showNewPassErr("密码输入有误，请重新输入")
            }
            else{
                if(valNew !== valRepeat){
                    this._showRepeatPassErr("两次输入的密码不一致")
                }
                else{
                    this._showResetPassLoading();
                    fish.ajax({
                        url:this.resetPassUrl,
                        data:"newpwd=" + encodeURIComponent( this.getNewPass()),
                        type:"string",
                        fn : function(data){
                            that._hideResetPassLoading();
                            that._resetPassCallBack(data);
                        },
                        err : function(data){
                            that._hideResetPassLoading();
                            that._resetPassErrBack(data);
                        }
                    });
                }
            }



        },
        //获取用户名
        getUsername: function (){
            return fish.trim(fish.one("#account_pop_mLogin").val());
        },
        //获取验证码
        getPassNum : function(){
            return fish.trim(fish.one("#valida_input").val());
        },
        //获取新密码
        getNewPass : function(){
            return fish.trim(fish.one("#mLogin_resetpassword").val());
        },
        //验证验证码的回调
        _verifyPassCallBack : function(data){
            this.onGetPassAjaxBack && this.onGetPassAjaxBack(data);
            if(data && data == 1){
                this._verifyPassSuc();
            }
            else if(data) {
                if (data == "047"){
                    this._showVerifyPassTips('对不起，您的验证码已累计输错10次，请重新点击发送手机验证码。');
                }
                else if (data == "010"){
                    this._verifyPassErrBack();
                }
                else{
                    this._verifyPassErrBack();
                }
            }
            else{
                this._verifyPassErrBack();
            }
        },
        //验证验证码的回调
        _verifyPassErrBack : function(){
            this._showVerifyPassTips("对不起，验证失败，请重试。");
            this.stopTimeout();
            this._enableTimeoutBtn();
        },
        //获取验证码的回调
        _getPassCallBack : function(data){
            this.onGetPassAjaxBack && this.onGetPassAjaxBack(data);
            if(data && data == 1){
                this._getPassSuc();
            }
            else if(data) {
                if (data == "3") {
                    this._showVerifyPassTips("对不起，您本月申请修改密码次数已达上限，如您仍需修改密码，请致电4007-777-777。");
                }
                else if (data == "007"){
                    this._showVerifyPassTips("对不起，您输入的手机号格式有误，请重新输入。");
                }
                else if (data == "049") {
                    this._showVerifyPassTips("对不起，您本月申请修改密码次数已达上限，如您仍需修改密码，请致电4007-777-777。");
                }
                else if (data == "010" || data == "003"){
                    this._showVerifyPassTips("对不起，您的手机号还未注册，立即<a target='_blank' href='http://www.17u.cn/reg.aspx'>注册</a>");
                }
                else{
                    this._getPassErrBack();
                }
            }
            else{
                this._getPassErrBack();
            }
        },
        //获取验证码失败的回调
        _getPassErrBack : function(){
            this._showVerifyPassTips("获取验证码失败，请重试！");
            this.stopTimeout();
        },
        _resetPassCallBack : function(data){
            this.onResetPassAjaxBack && this.onResetPassAjaxBack(data);
            if (data && data == 1) {
                this._resetPassSuc();
            }
            else if(data){
                if (data == "3") {
                    this._showResetPassTips("对不起，您本月申请修改密码次数已达上限，如您仍需修改密码，请致电4007-777-777。");
                }
                else {
                    this._resetPassErrBack();
                }
            }
        },
        _resetPassErrBack:function(){
            this._showResetPassTips("设置失败，请重试！");
        },
        //验证验证码的提示
        _showVerifyPassTips : function(text){
            this.__passTipsElem.css("display:block").html(text);
        },
        _hideVerifyPassTips : function(){
            this.__passTipsElem.css("display:none");
        },
        _showResetPassTips:function(text){
            this.__resetPassTipsElem.css("display:block").html(text);
        },
        _hideResetPassTips:function(){
            this.__resetPassTipsElem.css("display:none");
        },
        _showPassErr:function(text){
            fish.all(".valida_tips", this.passElem).css("display:none");
            fish.all(".valida_err", this.passElem).css("display:inline").html(text);
        },
        _hidePassErr:function(){
            fish.all(".valida_tips", this.passElem).css("display:inline");
            fish.all(".valida_err", this.passElem).css("display:none");
        },
        _showNewPassErr:function(text){
            fish.all(".tips", this.resetPassElem).css("display:none");
            fish.all(".password_new_err", this.resetPassElem).css("display:inline").html(text);
        },
        _hideNewPassErr:function(){
            fish.all(".tips", this.resetPassElem).css("display:block");
            fish.all(".password_new_err", this.resetPassElem).css("display:none");
        },
        _showRepeatPassErr:function(text){
            fish.all(".password_repeat_err", this.resetPassElem).css("display:inline").html(text);
        },
        _hideRepeatPassErr:function(){
            fish.all(".password_repeat_err", this.resetPassElem).css("display:none");
        },
        _showPassLoading:function(){
            if(fish.browser("ms", 6)){
                fish.all(".wait4sign_a", this.passElem).css("display:inline");
            }
            else{
                fish.all(".wait4sign_a", this.passElem).css("display:block");
            }

            fish.all(".btn_b_outer", this.passElem).css("display:none");
        },
        _hidePassLoading:function(){
            fish.all(".wait4sign_a", this.passElem).css("display:none");
            if(fish.browser("ms", 6)){
                fish.all(".btn_b_outer", this.passElem).css("display:inline");
            }
            else{
                fish.all(".btn_b_outer", this.passElem).css("display:block");
            }

        },
        _showResetPassLoading:function(){
            fish.all(".wait4sign_a", this.resetPassElem).css("display:block");
            fish.all(".btn_b_outer", this.resetPassElem).css("display:none");
        },
        _hideResetPassLoading:function(){
            fish.all(".wait4sign_a", this.resetPassElem).css("display:none");
            fish.all(".btn_b_outer", this.resetPassElem).css("display:block");
        },
        //成功登录的回调
        _loginSuc:function(){
            if(this.reload){
                location.reload();
            }
            this.onLogin();
            fish.mPop.close();
            this.onClose();
        },
        //获取验证码成功
        _getPassSuc:function(){
            this.startTimeout();
        },
        //显示获取验证码的失败回调
        _getPassErr : function(){

        },
        //验证验证码成功
        _verifyPassSuc: function (){
            this.showResetBox();
        },
        //验证验证码失败
        _verifyPassErr: function (){

        },
        //重置密码成功
        _resetPassSuc:function(){
            //传值到登录框
            fish.one("#actpwd_pop_mLogin").val(this.getNewPass());
            //触发登录组件的登录
            this.loginObj.login();
        },
        //设置倒计时的文本
        _setTimeoutText:function(text){
            this.__timeoutTextElem.html(text);
        },
        //启用超时按钮
        _enableTimeoutBtn:function(){
            this.__timeoutBtnElem.removeClass("btn_disable");
        },
        //禁用超市按钮
        _disableTimeoutBtn:function(){
            this.__timeoutBtnElem.addClass("btn_disable");
        }
    };




    fish.extend({
        mLogin : mLogin
    });
})();