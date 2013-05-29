/**
* input 自定义属性以确定验证类型
* vType="addfn" 验证类型  eng chn mail url currency number int double username password qq
* card
* phone
* zip
* mobile

* vMsg="没有通过验证" 错误提示
* vFn ="fn" 自定义函数
* check(); 手动调用验证结果（真| 假） [非必须，如果被调用，则表单默认onsubmit事件验证失效]


*/
//-------------------------------
(function () {

    var tool = {

        //正则定义
        rule: {
            "isRquire": /.+/,
            "isEnglish": /^[A-Za-z]+$/,
            "isChinese": /^[\u0391-\uFFE5]+$/,
            "isMail": /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            "isUrl": /^http[s]?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
            "isCurrency": /^\d+(\.\d+)?$/,
            "isNumber": /^\d+$/,
            "isInt": /^[0-9]{1,30}$/,
            "isDouble": /^[-\+]?\d+(\.\d+)?$/,
            "isUsername": /[0-9a-zA-Z]{3,20}/ig,
            "isPassword": /^(\w){6,20}$/,
            "isQQ": /[1-9][0-9]{4,}/,
            "isDate": /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/,
            "isYear": /^(19|20)[0-9]{2}$/,
            "isMonth": /^(0?[1-9]|1[0-2])$/,
            "isDay": /^((0?[1-9])|((1|2)[0-9])|30|31)$/,
            "isHour": /^((0?[1-9])|((1|2)[0-3]))$/,
            "isMinute": /^((0?[1-9])|((1|5)[0-9]))$/,
            "isMobile": /^(13|14|15|18)[0-9]{9}$/,
            "isPhone": /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
            "isZipcode": /^[1-9]\d{5}$/,
            "isBodycard": /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
            "isIP": /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            "isLimitFile": /^[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
            "isLimitImage": /.+\.(jpg|gif|png|bmp)$/i,
            "isLimitWord": /.+\.(doc|rtf)$/i
        },

        //取得表单域数组
        getField: function (fiedName) {
            return fiedName;
        },


        //表单域单项验证检测，并输出相关样式和消息结果
        checkField: function (fields, types, msg, Rq) {
            var isgood = true;

            if ((fields && types && msg) || (Rq != "" && Rq != undefined && msg != "" && this.getFieldValue(fields) != "")) {
                if (!this.checkType(fields, types, Rq)) {
                    isgood = false;
                }
            }
            return isgood;
        },

        //取得表单域值
        getFieldValue: function (fieldName) {
            var fld = this.getField(fieldName);
            var fv = fld.value;
            /*
            if (fld.length == 1) {
            if (fld[0].nodeName.toLowerCase() == "select") {
            fv = fld[0].options[fld[0].selectedIndex].value;
            } else {
            fv = fld[0].value;
            }
            } else {
            for (var i = 0; i < fld.length; i++) {
            if (fld.item(i).checked == true) {
            fv = fld.item(i).value;
            break;
            }
            }
            }
            */
            return this.trim(fv);
        },

        // 匹配验证类型和方式
        checkType: function (field, fieldType, param) {
            var fv = this.getFieldValue(field);

            if (fv == "" || fv == null) {
                return false;
            }

            switch (fieldType) {
                case "rq":
                    return this.toTest(fv, "isRquire");
                    break;
                case "eng":
                    return this.toTest(fv, "isEnglish");
                    break;
                case "chn":
                    return this.toTest(fv, "isChinese");
                    break;
                case "mail":
                    return this.toTest(fv, "isMail");
                    break;
                case "url":
                    return this.toTest(fv, "isUrl");
                    break;
                case "currency":
                    return this.toTest(fv, "isCurrency");
                    break;
                case "number":
                    return this.toTest(fv, "isNumber");
                    break;
                case "int":
                    return this.toTest(fv, "isInt");
                    break;
                case "double":
                    return this.toTest(fv, "isDouble");
                    break;
                case "username":
                    return this.toTest(fv, "isUsername");
                    break;
                case "title":
                    return this.testTitle(fv);
                    break;
                case "password":
                    return this.toTest(fv, "isPassword");
                    break;
                case "qq":
                    return this.toTest(fv, "isQQ");
                    break;
                case "date":
                    return this.toTest(fv, "isDate");
                    break;
                case "year":
                    return this.toTest(fv, "isYear");
                    break;
                case "month":
                    return this.toTest(fv, "isMonth");
                    break;
                case "hour":
                    return this.toTest(fv, "isHour");
                    break;
                case "minute":
                    return this.toTest(fv, "isMinute");
                    break;
                case "second":
                    return this.toTest(fv, "isMinute");
                    break;
                case "mobile":
                    return this.toTest(fv, "isMobile");
                    break;
                case "phone":
                    return this.toTest(fv, "isPhone");
                    break;
                case "zip":
                    return this.toTest(fv, "isZipcode");
                    break;
                case "card":
                    return this.toTest(fv, "isBodycard");
                    break;
                case "ip":
                    return this.toTest(fv, "isIP");
                    break;
                case "file":
                    return this.toTest(fv, "isLimitFile");
                    break;
                case "image":
                    return this.toTest(fv, "isLimitImage");
                    break;
                case "word":
                    return this.toTest(fv, "isLimitWord");
                    break;
                case "addfn":
                    return this.doCustomfunction(param);
                    break;
                default:
                    return this.toTest(fv, "isRquire");
            }
        },

        //执行用户自定义函数
        doCustomfunction: function (param) {
            if (typeof param == "string") {
                return eval(param)();
            } else {
                return param();
            }
        },

        //正则检测真假
        toTest: function (string, rt) {
            var match = string.match(eval("tool.rule." + rt));
            if (match != null) {
                return true;
            } else {
                return false;
            }
        },

        //文本格式化去空格
        trim: function (string) {
            return string.replace(/(^\s*)|(\s*$)/g, "");
        },

        //检测两个变量是否相等
        equalTo: function (val1, val2) {
            return (val1 == val2) ? true : false;
        },

        //检测中英文字符长度是否在1~200范围内
        testTitle: function (string) {
            var sl = string.match(/[^ -~]/g) == null ? string.length : string.length + string.match(/[^ -~]/g).length;
            if (sl <= 0 || sl > 200) {
                return false;
            } else {
                return true;
            }
        },

        /**
        * 验证是否通过并显示提示信息.
        * @fieldDom 元素节点 dom
        * @valType 验证类型 string
        * @valMsg 错误提示 string
        * @valRq 用户自定义函数 function 
        */

        checkTip: function (fieldDom /*此处是dom节点,原来是dom名称*/, valType, valMsg, valRq) {

            var pass = false,
                type = valType.split(" ");


            if (fieldDom && type[0] != "" && type[0] != null && type[0] != undefined && valMsg != "" || (valRq != "" && fieldDom.value != "")) {

                if (this.checkType(fieldDom, type[0], valRq)) {
                    this.showTip(fieldDom, "right", "验证通过!");
                    pass = true;
                } else {
                    this.showTip(fieldDom, "error", valMsg);
                    pass = false;
                }
            } else {
                this.removeTip(fieldDom);
                pass = true;
            }
            return pass;
        },

        //去除提示及相关样式
        removeTip: function (field) {

            var objField = tool.getField(field);
            objField.style.background = "";
            for (var i = 0; i < objField.length; i++) {
                objField[i].style.background = "";
            }
            var getSpan = document.getElementById(field.id + "$info");
            if (getSpan) {
                getSpan.parentNode.removeChild(getSpan);
            }
        },

        //显示提示消息的样式
        /* 如果需要加默认提示消息，请按如下格式在表单域后添加：
        * <span id="fieldname$info"><img src="默认消息图标"/>消息</span> [非必须]
        */
        showTip: function (field, type, msg) {
            var objField = this.getField(field);

            var getSpan = document.getElementById(field.id + "$info");
            if (getSpan) {
                getSpan.parentNode.removeChild(getSpan);
            }
            var spanEl = document.createElement("span");
            spanEl.id = field.id + "$info";
            switch (type) {

                case "error":
                    spanEl.innerHTML =  msg;
                    //spanEl.style.color = "red";
                    fish.one(spanEl).addClass("error");
                    objField.parentNode.insertBefore(spanEl, objField.nextSibling);
                    //objField.style.background = "#FFDFDD";
                    break;

                case "right":
                   // spanEl.innerHTML =  msg;
                    //spanEl.style.color = "green";
                    fish.one(spanEl).addClass("right");
                    objField.parentNode.insertBefore(spanEl, objField.nextSibling);
                   // objField.style.background = "#DCFFDD";
                    break;
            }
        }
    }


    function singleMain(param) {

        var defParam = {
            dom: null,
            pass: false,
            type: "",
            fail: "错误"
        }

        fish.lang.extend(defParam, param);
        fish.lang.extend(this, defParam);
        this.init();
    }


    singleMain.prototype = {

        init: function () {
            var tagName = this.dom.nodeName.toLowerCase(),
                that = this,
                utilFn = function () {
                    that.doValid();
                };
            if (tagName == "select") {

                fish.on("change", utilFn, this.dom);
            } else {

                fish.on("blur", utilFn, this.dom);
            }
        },

        doValid: function () {

            var rValue = tool.checkTip(this.dom, this.type, this.fail, this.fn);
            this.pass = rValue;
            return rValue;
        }
    }



    main.prototype = {

        init: function () {
            //本验证对象
            var that = this;
            this.elem.each(function (elem, n) {

                var valType = fish.one(this).attr("vType"),
                    valFail = fish.one(this).attr("vMsg"),
                    valFn = eval(fish.one(this).attr("vFn"));

                that.all[n] = new singleMain({
                    dom: elem,
                    type: valType,
                    fail: valFail,
                    fn: valFn
                });

            });

        },
        check: function () {
            var result = true;
            for (var n = 0; n < this.all.length; n++) {
                if (!this.all[n].doValid()) {
                    result = false;
                }
            }
            return result;
        }
    }

    function main(__elem, param) {
        var defParam = {
            elem: __elem,
            type: [],
            all: [],
            pass: false,
            fail: function () { },
            success: function () { }
        }
        fish.lang.extend(defParam, param);
        fish.lang.extend(this, defParam);
        this.init();

    }

    fish.extend({
        verify: function (param) {
            return new main(this, param);

        }
    })

    //fish.extend(new Validator());
})()