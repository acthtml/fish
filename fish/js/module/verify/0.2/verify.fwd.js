
 /**
 * 如果浏览器能验证的，让浏览器验证
 * html5关于各种input的说明 http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#the-input-element
 * 该组件会需要验证的元素所在的表单会阻止默认的提交。这样做的原因是：Even though Safari supports the constraint validation API, as of ths writing (version 6), Safari will not prevent submission of a form with constraint validation issues. To the user Safari will behave no differently than a browser that doesn't support constraint validation at all.
 *参考 http://www.html5rocks.com/en/tutorials/forms/constraintvalidation/
 *轻量级的浏览器的验证组件的支持 H5F demo http://www.alistapart.com/d/forward-thinking-form-validation/enhanced_2.html
 *重量级的 http://afarkas.github.com/webshim/demos/index.html
 Modernizr.inputtypes:input type的支持情况
 Modernizr.input:input 属性的支持情况（如 placeholder....）

 该组件能验证的并且在html5中已有支持有,并与我们需要的验证原则是一致的
 必填 required  attr

 邮箱 email type
 URL   url type
 数字 number type
 月 month type



 其他验证
     手机 isMobile
     英文 isEnglish
     中文 isChinese
     现金 isCurrency
     整型数 isInt
     浮点数 isDouble
     日期 isDate （在有些支持type=data的浏览器，对date的验证太严格了，如2010-9-3被任务不算日期）
     年 isYear
     日 isDay
     邮编

 TODO 以后待加
 正则  pattern attr
 不包含繁体字
    完整的时机：h5有 A date and time (year, month, day, hour, minute, second, fraction of a second) with the time zone set to UTCdatetime

*/
//-------------------------------
(function () {
    //html5特性检测
    /* Modernizr 2.6.2 (Custom Build) | MIT & BSD
    * Build: http://modernizr.com/download/#-input-inputtypes-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes
    */
    ;
    var Modernizr = (function (window, document, undefined) {

        var version = '2.6.2',

            Modernizr = {},


            docElement = document.documentElement,

            mod = 'modernizr',
            modElem = document.createElement(mod),
            mStyle = modElem.style,

            inputElem = document.createElement('input'),

            smile = ':)',

            toString = {}.toString,

            prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



            omPrefixes = 'Webkit Moz O ms',

            cssomPrefixes = omPrefixes.split(' '),

            domPrefixes = omPrefixes.toLowerCase().split(' '),


            tests = {},
            inputs = {},
            attrs = {},

            classes = [],

            slice = classes.slice,

            featureName,


            injectElementWithStyles = function (rule, callback, nodes, testnames) {

                var style, ret, node, docOverflow,
                    div = document.createElement('div'),
                    body = document.body,
                    fakeBody = body || document.createElement('body');

                if (parseInt(nodes, 10)) {
                    while (nodes--) {
                        node = document.createElement('div');
                        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                        div.appendChild(node);
                    }
                }

                style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
                div.id = mod;
                (body ? div : fakeBody).innerHTML += style;
                fakeBody.appendChild(div);
                if (!body) {
                    fakeBody.style.background = '';
                    fakeBody.style.overflow = 'hidden';
                    docOverflow = docElement.style.overflow;
                    docElement.style.overflow = 'hidden';
                    docElement.appendChild(fakeBody);
                }

                ret = callback(div, rule);
                if (!body) {
                    fakeBody.parentNode.removeChild(fakeBody);
                    docElement.style.overflow = docOverflow;
                } else {
                    div.parentNode.removeChild(div);
                }

                return !!ret;

            },



            isEventSupported = (function () {

                var TAGNAMES = {
                    'select': 'input', 'change': 'input',
                    'submit': 'form', 'reset': 'form',
                    'error': 'img', 'load': 'img', 'abort': 'img'
                };

                function isEventSupported(eventName, element) {

                    element = element || document.createElement(TAGNAMES[eventName] || 'div');
                    eventName = 'on' + eventName;

                    var isSupported = eventName in element;

                    if (!isSupported) {
                        if (!element.setAttribute) {
                            element = document.createElement('div');
                        }
                        if (element.setAttribute && element.removeAttribute) {
                            element.setAttribute(eventName, '');
                            isSupported = is(element[eventName], 'function');

                            if (!is(element[eventName], 'undefined')) {
                                element[eventName] = undefined;
                            }
                            element.removeAttribute(eventName);
                        }
                    }

                    element = null;
                    return isSupported;
                }
                return isEventSupported;
            })(),


            _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

        if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
            hasOwnProp = function (object, property) {
                return _hasOwnProperty.call(object, property);
            };
        }
        else {
            hasOwnProp = function (object, property) {
                return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
            };
        }


        if (!Function.prototype.bind) {
            Function.prototype.bind = function bind(that) {

                var target = this;

                if (typeof target != "function") {
                    throw new TypeError();
                }

                var args = slice.call(arguments, 1),
                    bound = function () {

                        if (this instanceof bound) {

                            var F = function () { };
                            F.prototype = target.prototype;
                            var self = new F();

                            var result = target.apply(
                                self,
                                args.concat(slice.call(arguments))
                            );
                            if (Object(result) === result) {
                                return result;
                            }
                            return self;

                        } else {

                            return target.apply(
                                that,
                                args.concat(slice.call(arguments))
                            );

                        }

                    };

                return bound;
            };
        }

        function setCss(str) {
            mStyle.cssText = str;
        }

        function setCssAll(str1, str2) {
            return setCss(prefixes.join(str1 + ';') + (str2 || ''));
        }

        function is(obj, type) {
            return typeof obj === type;
        }

        function contains(str, substr) {
            return !! ~('' + str).indexOf(substr);
        }

        function testProps(props, prefixed) {
            for (var i in props) {
                var prop = props[i];
                if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                    return prefixed == 'pfx' ? prop : true;
                }
            }
            return false;
        }

        function testDOMProps(props, obj, elem) {
            for (var i in props) {
                var item = obj[props[i]];
                if (item !== undefined) {

                    if (elem === false) return props[i];

                    if (is(item, 'function')) {
                        return item.bind(elem || obj);
                    }

                    return item;
                }
            }
            return false;
        }

        function testPropsAll(prop, prefixed, elem) {

            var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
                props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            if (is(prefixed, "string") || is(prefixed, "undefined")) {
                return testProps(props, prefixed);

            } else {
                props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
                return testDOMProps(props, prefixed, elem);
            }
        } function webforms() {
            Modernizr['input'] = (function (props) {
                for (var i = 0, len = props.length; i < len; i++) {
                    attrs[props[i]] = !!(props[i] in inputElem);
                }
                if (attrs.list) {
                    attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
                }
                return attrs;
            })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
            Modernizr['inputtypes'] = (function (props) {

                for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {

                    inputElem.setAttribute('type', inputElemType = props[i]);
                    bool = inputElem.type !== 'text';

                    if (bool) {

                        inputElem.value = smile;
                        inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                        if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {

                            docElement.appendChild(inputElem);
                            defaultView = document.defaultView;

                            bool = defaultView.getComputedStyle &&
                                defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                                (inputElem.offsetHeight !== 0);

                            docElement.removeChild(inputElem);

                        } else if (/^(search|tel)$/.test(inputElemType)) {
                        } else if (/^(url|email)$/.test(inputElemType)) {
                            bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                        } else {
                            bool = inputElem.value != smile;
                        }
                    }

                    inputs[props[i]] = !!bool;
                }
                return inputs;
            })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        }
        for (var feature in tests) {
            if (hasOwnProp(tests, feature)) {
                featureName = feature.toLowerCase();
                Modernizr[featureName] = tests[feature]();

                classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
            }
        }

        Modernizr.input || webforms();


        Modernizr.addTest = function (feature, test) {
            if (typeof feature == 'object') {
                for (var key in feature) {
                    if (hasOwnProp(feature, key)) {
                        Modernizr.addTest(key, feature[key]);
                    }
                }
            } else {

                feature = feature.toLowerCase();

                if (Modernizr[feature] !== undefined) {
                    return Modernizr;
                }

                test = typeof test == 'function' ? test() : test;

                if (typeof enableClasses !== "undefined" && enableClasses) {
                    docElement.className += ' ' + (test ? '' : 'no-') + feature;
                }
                Modernizr[feature] = test;

            }

            return Modernizr;
        };


        setCss('');
        modElem = inputElem = null;


        Modernizr._version = version;

        Modernizr._prefixes = prefixes;
        Modernizr._domPrefixes = domPrefixes;
        Modernizr._cssomPrefixes = cssomPrefixes;


        Modernizr.hasEvent = isEventSupported;

        Modernizr.testProp = function (prop) {
            return testProps([prop]);
        };

        Modernizr.testAllProps = testPropsAll;


        Modernizr.testStyles = injectElementWithStyles;
        Modernizr.prefixed = function (prop, obj, elem) {
            if (!obj) {
                return testPropsAll(prop, 'pfx');
            } else {
                return testPropsAll(prop, obj, elem);
            }
        };



        return Modernizr;

    })(this, this.document);
    ;
    var _IGNORE_VALID_CLASSNAME = "verifyIgnore";

    var tool = {

        //正则定义
        rule: {
            "isRquire": /.+/,
            "isEnglish": /^[A-Za-z]+$/,
            "isChinese": /^[\u0391-\uFFE5]+$/,
            "isEnOrCn": /^[A-Za-z\u0391-\uFFE5]+$/,
            "isMail": /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            "isUrl": /^http[s]?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
            "isCurrency": /^\d+(\.\d+)?$/,
            "isNumber": /^\d+$/,
            "isInt": /^[0-9]{1,30}$/,
            "isDouble": /^[-\+]?\d+(\.\d+)?$/,
            "isUsername": /[0-9a-zA-Z]{3,20}/ig,
            "isPassword": /^(\w){6,20}$/,
            "isQQ": /[1-9][0-9]{4,}/,
            //todo:以后用脚本来做。有bug"isDate": /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/,
            "isYear": /^(19|20)[0-9]{2}$/,
            "isMonth": /^(0?[1-9]|1[0-2])$/,
            "isDay": /^((0?[1-9])|((1|2)[0-9])|30|31)$/,
            "isHour": /^((0?[1-9])|((1|2)[0-3]))$/,
            "isMinute": /^((0?[1-9])|((1|5)[0-9]))$/,
            "isMobile": /^0?(13|14|15|18)[0-9]{9}$/,
            "isZipcode": /^[1-9]\d{5}$/,
            "isIdCard": /(^\d{15}$)|(\d{17}(?:\d|x|X)$)/, //身份证
            "isIP": /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            "isLimitFile": /^[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
            "isLimitImage": /.+\.(jpg|gif|png|bmp)$/i,
            "isLimitWord": /.+\.(doc|rtf)$/i
        },
        //错误提示的id
        _tipWrapId: 0,
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
            return this.trim(fv);
        },

        // 匹配验证类型和方式
        checkType: function (field, fieldType, validFn) {
            var fv = this.getFieldValue(field), //输入的值
                isBrowserCanHandle = this.detectBrowserCanHandle(fieldType),
                validRegName = this.getValidRegName(fieldType);
            if (fieldType == "fnValid") {
                if (validFn) {
                    return this.toTest("validFn", validFn, fv, field);
                } else {
                    //todo 以后要加上打印调用堆栈，第几行被调用的等调试信息
                    throw "validFn is needed!!!";
                }
            }
            //isBrowserCanHandle=false;
            if (isBrowserCanHandle) {
                //field.checkValidity()是要所有验证都通过，才算通过。。。所以要根据不同类型进行验证。。。
                //return field.checkValidity();
                return this.browserValid(field, fieldType);
            } else {
                if (!validRegName) {
                    //throw "该验证组件暂时不支持\'"+fieldType+"\',请检查\'"+fieldType+"\'是否拼写错误！(not supported)";
                    throw fieldType + ":not supported";
                } else {
                    //return this.doCustomfunction(param) this.testTitle(fv);
                    return this.toTest(fv, validRegName);
                }
            }

        },
        browserValid: function (field, fieldType) {
            if (fieldType == "rq") {
                //若值为空，则 field.validity.valueMissing为true
                return !field.validity.valueMissing;
            } else if (fieldType == "mail" || fieldType == "url" || fieldType == "number" || fieldType == "month") {
                return !field.validity.typeMismatch;
            } else {
                throw "sorry,the valid component don't support " + fieldType;
            }

        },
        //html5 支持的
        _fieldTypeToValidTypeMapping: {
            //rq: Modernizr.input.required,//浏览器的非空验证是，即使输入的是全空格，也能通过验证，所有，这个还是手动验证比较好。
            mail: Modernizr.inputtypes.email,
            url: Modernizr.inputtypes.url,
            number: Modernizr.inputtypes.number,
            month: Modernizr.inputtypes.month
        },
        detectBrowserCanHandle: function (validType) {
            return this._fieldTypeToValidTypeMapping[validType];
        },
        getValidRegName: function (fieldType) {
            return this._fieldTypeToRegMapping[fieldType];
        },
        _fieldTypeToRegMapping: {
            rq: "isRquire",
            eng: "isEnglish",
            chn: "isChinese",
            enOrCn: "isEnOrCn",
            mail: "isMail",
            url: "isUrl",
            currency: "isCurrency",
            number: "isNumber",
            "int": "isInt",
            "double": "isDouble",
            username: "isUsername",
            title: "title",
            password: "isPassword",
            qq: "isQQ",
            // date:"isDate",
            year: "isYear",
            month: "isMonth",
            hour: "isHour",
            minute: "isMinute",
            second: "isMinute", //分和秒的规则一样
            mobile: "isMobile",
            zip: "isZipcode",
            idCard: "isIdCard",
            ip: "isIP",
            file: "isLimitFile",
            image: "isLimitImage",
            word: "isLimitWord"
        },
        //执行用户自定义函数
        doCustomfunction: function (param, inputVal, inputDom) {
            if (typeof param == "string") {
                return eval(param)(inputVal, inputDom);
            } else {
                return param(inputVal, inputDom);
            }
        },

        //正则检测真假
        toTest: function (string, rt, inputVal, inputDom) {
            //var match = string.match(eval("tool.rule." + rt));
            var validFn;
            if (string == "title") {
                return this.testTitle(string);
            } else if (string == "validFn") {
                validFn = rt;
                return this.doCustomfunction(validFn, inputVal, inputDom);
            } else {
                if (tool.rule[rt] == undefined) {
                    throw "verity component system error!";
                }
                var match = string.match(tool.rule[rt]);
                if (match != null) {
                    return true;
                } else {
                    return false;
                }
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
        * @valFn 用户自定义函数 function
        */

        checkTip: function (fieldDom, valType, valFn, validObj) {

            var constraintValidationInfo = {},
                constraintValidationArr,
                isValidFlag = true,
                self = this;
            if (typeof (valType) === "string") {
                valType = fish.trim(valType);
                //对用户自定义的验证方式做处理
                if (valType == "fnValid" && valFn) {
                    isValidFlag = this.checkType(fieldDom, valType, valFn);
                    if (!isValidFlag) {
                        this.showTip(fieldDom, "error", fieldDom.getAttribute("data-err-fn"), validObj.position, validObj.gap, validObj);
                    } else {
                        this.showTip(fieldDom, "right", "验证通过!", validObj.position, validObj.gap, validObj);
                    }
                    return isValidFlag;
                }
                if (fish.trim(valType) == "") {
                    constraintValidationArr = [];
                } else {
                    constraintValidationArr = valType.split(" ");
                }
            }
            //验证规则与验证报错的信息要一样对应
            //            if(constraintValidationArr.length !== valMsgArr.length){
            //                throw "验证类型数量应该与验证报错提示数量一致";
            //            }

            constraintValidationInfo.validArr = constraintValidationArr;
            constraintValidationInfo = this.getAllConstraintValidation(fieldDom, constraintValidationInfo); //获得所有要验证的
            if (tool.isDebug) {
                console.log("验证元素:", fieldDom);
                console.log("计算出的验证规则:" + constraintValidationInfo.validArr);
                console.log("计算出的验证错误提示语:" + constraintValidationInfo.errMsgArr);
            }
            this.convertToH5InputFormat(fieldDom, constraintValidationInfo.validArr); //根据条件约束，将dom改成html5支持的。如：若要验证邮箱：则将type改成email

            if (fieldDom) {
                constraintValidationInfo.validArr.forEach(function (each, index) {
                    //Array的foreach退出不了
                    if (isValidFlag && !self.checkType(fieldDom, each)) {
                        isValidFlag = false;
                        self.showTip(fieldDom, "error", constraintValidationInfo.errMsgArr[index], validObj.position, validObj.gap, validObj);
                        //return false;
                    }
                });
                if (isValidFlag) {
                    this.showTip(fieldDom, "right", "验证通过!", validObj.position, validObj.gap, validObj);
                }
            } else {
                //this.removeTip(fieldDom);
            }
            return isValidFlag;

        },
        //获得所要要验证的约束
        getAllConstraintValidation: function (fieldDom, constraintValidationInfo) {
            var uField = fish.one(fieldDom),
                constraintValidationArr = [],
                errMsgArr = [],
                needValidRequired = uField.attr("required") ? "rq" : false,
                needValidEmail = uField.attr("type") == "email" ? "mail" : false,
                needValidURL = uField.attr("type") == "url" ? "url" : false,
                needValidNumber = uField.attr("type") == "number" ? "number" : false,
                needValidMonth = uField.attr("type") == "month" ? "month" : false,
                self = this;
            //复制数组
            constraintValidationArr = constraintValidationInfo.validArr.slice(0);
            constraintValidationInfo.validArr.forEach(function (each) {
                //constraintValidationArr.push(each);
                self.pushErrMsg(uField, each, errMsgArr);
            });
            //避免重复添加约束条件
            if (constraintValidationInfo.validArr.indexOf("rq") == "-1") {
                //required的验证应该是第一个被验证的
                this.bindRuleAndErrMsg(constraintValidationArr, needValidRequired, this.pushErrMsg, [uField, "rq", errMsgArr], true);
            }
            if (constraintValidationInfo.validArr.indexOf("mail") == "-1") {
                this.bindRuleAndErrMsg(constraintValidationArr, needValidEmail, this.pushErrMsg, [uField, "mail", errMsgArr]);
            }
            if (constraintValidationInfo.validArr.indexOf("url") == "-1") {
                this.bindRuleAndErrMsg(constraintValidationArr, needValidURL, this.pushErrMsg, [uField, "url", errMsgArr]);
            }
            if (constraintValidationInfo.validArr.indexOf("number") == "-1") {
                this.bindRuleAndErrMsg(constraintValidationArr, needValidNumber, this.pushErrMsg, [uField, "number", errMsgArr]);
            }
            if (constraintValidationInfo.validArr.indexOf("month") == "-1") {
                this.bindRuleAndErrMsg(constraintValidationArr, needValidMonth, this.pushErrMsg, [uField, "month", errMsgArr]);
            }
            constraintValidationInfo.validArr = constraintValidationArr;
            constraintValidationInfo.errMsgArr = errMsgArr;
            return constraintValidationInfo;

        },
        /*
        根据条件约束，将dom改成html5支持的。如：若要验证邮箱：则将type改成email
        在ie中，若input的type不支持某个类型，设置时，会报错
        */

        convertToH5InputFormat: function (inputDom, validArr) {
            var uInput = fish.one(inputDom);
            validArr.forEach(function (each) {
                if (each == "rq" && tool._fieldTypeToValidTypeMapping["rq"]) {
                    uInput.attr("required", "required");
                } else if (each == "mail" && tool._fieldTypeToValidTypeMapping["mail"]) {
                    uInput.attr("type", "email");
                } else if (each == "url" && tool._fieldTypeToValidTypeMapping["url"]) {
                    uInput.attr("type", "url");
                } else if (each == "number" && tool._fieldTypeToValidTypeMapping["number"]) {
                    uInput.attr("type", "number");
                } else if (each == "month" && tool._fieldTypeToValidTypeMapping["month"]) {
                    uInput.attr("type", "month");
                }
            });




        },
        //isFirst 为required 的准备，required的验证应该是第一个被验证的
        pushErrMsg: function (uField, type, errMsgArr, isFirst) {
            var eachErrMsg = uField.attr("data-err-" + type);
            if (eachErrMsg) {
                eachErrMsg = fish.trim(eachErrMsg);
            }
            if (eachErrMsg) {
                if (isFirst) {
                    //alert(typeof [].unshift);//测试unshift方法是否浏览器兼容 均支持
                    errMsgArr.unshift(eachErrMsg);
                } else {
                    errMsgArr.push(eachErrMsg);
                }

            } else {
                //throw "没有与验证类型为:"+type+"相匹配的错误信息!";
                throw "lack of errMsg" + type;
            }
        },
        bindRuleAndErrMsg: function (arr, val, pushErrMsgFn, pushErrMsgParamArr, isFirst) {
            if (val != false) {
                if (isFirst) {
                    arr.unshift(val);
                } else {
                    arr.push(val);
                }

                if (pushErrMsgFn && typeof (pushErrMsgFn) == "function") {
                    pushErrMsgFn(pushErrMsgParamArr[0], pushErrMsgParamArr[1], pushErrMsgParamArr[2], isFirst);
                }
            }

        },
        //去除提示及相关样式
        removeTip: function (field) {
            tool.showTip(field, "hide");
        },


        //显示提示消息的样式
        /* 如果需要加默认提示消息，请按如下格式在表单域后添加：//TODO XXX:若多个要验证的input无id属性，则提示信息的id会重名
        * <span id="fieldname$info"><img src="默认消息图标"/>消息</span> [非必须]
        * @param:pos 提示的位置 右边或下面
        * @param:gap 提示框距输入框的距离，默认10
        */
        showTip: function (field, type, msg, pos, gap, validObj) {
            var objField = this.getField(field),
                uField = fish.one(field),
                tipWrapClassName = uField.attr("data-tipWrapId"),
                vipGap = uField.attr("data-gap"), //在dom上配置的距离
                locStr = getLocString(field, pos, gap),
                tipLocArr,
                theTipIndex;
            if (vipGap) {
                gap = vipGap;
            }
            locStr = getLocString(field, pos, gap);


            var uTipWrap = fish.one("." + tipWrapClassName),
                dTipWrap = uTipWrap[0];
            if (dTipWrap) {
                uTipWrap = fish.one(dTipWrap);
                uTipWrap.removeClass("error right");
                uTipWrap.html("remove");
                //dTipWrap.parentNode.removeChild(dTipWrap);
            }
            tool._tipWrapId++;
            tipWrapClassName = "no" + tool._tipWrapId;
            dTipWrap = document.createElement("span");
            uTipWrap = fish.one(dTipWrap);
            uTipWrap.addClass(tipWrapClassName);
            uField.attr("data-tipWrapId", tipWrapClassName);


            //缓存位置信息
            if (validObj) {
                tipLocArr = validObj.__tipLocArr;
                theTipIndex = getTheTipIndex(tipLocArr, field);
                tipLocArr[theTipIndex].uTip = uTipWrap;
                if (tool.isDebug && uTipWrap.length == 0) {
                    console.trace();
                    throw "tipElem not finded";
                }
                tipLocArr[theTipIndex].position = pos;
                tipLocArr[theTipIndex].gap = gap;
            } else if (tool.isDebug) {
                console.log("----------------------");
                console.log(arguments);
            }
            uTipWrap.css(locStr);
            switch (type) {

                case "error":
                    dTipWrap.innerHTML = msg;
                    uTipWrap.addClass("error");
                    objField.parentNode.insertBefore(dTipWrap, objField.nextSibling);
                    break;

                case "right":
                    dTipWrap.innerHTML = "";
                    uTipWrap.addClass("right");
                    objField.parentNode.insertBefore(dTipWrap, objField.nextSibling);
                    break;
                case "hide":
                    break;
            }
        }
    }

    function getTheTipIndex(arr, dInputElem) {
        var isFind = false,
            tipIndex;
        arr.forEach(function (elem, index) {
            if (!isFind) {
                if (elem.dInputElem == dInputElem) {
                    isFind = true;
                    tipIndex = index;
                }
            }
        });
        if (isFind) {
            return tipIndex;
        } else {
            return false;
        }

    }

    //单个域的验证
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
                utilFn = function (e) {
                    //fish.preventDefault(e);
                    that.doValid();
                },
                uInput = fish.one(this.dom);
            if (tagName == "select") {
                uInput.on("change", utilFn);
            } else {
                uInput.on("change", utilFn);

            }
            try {
                uInput.on("invalid", function (evt) {
                    fish.preventDefault(evt); //浏览器的默认的错误弹框
                })
            } catch (exc) {
                //ie等浏览器不支持，若不做处理，则报错。
            }

        },

        doValid: function () {
            var that = this;
            //改对象已经被回收
            if (that.param.isDestroy) {
                return true;
            }
            var rValue = tool.checkTip(this.dom, this.type, null, this.param), //
                rfnValue,
                uValidElem = fish.one(this.dom);
            //忽略验证
            if (uValidElem.hasClass(_IGNORE_VALID_CLASSNAME)) {
                tool.removeTip(this.dom); //隐藏之前的验证信息
                return true;
            }
            if (rValue && this.fn) {//用户自定的方法最后验证
                rfnValue = tool.checkTip(this.dom, "fnValid", this.fn, this.param);
                this.pass = rValue && rfnValue;
            } else {
                this.pass = rValue;
            }
            return this.pass;
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
                    fn: valFn,
                    param: that
                });
                //储存需要重新计算tip位置的信息
                if (that.isDebug) {
                    console.log("valid is inited", this);
                }
                that.__tipLocArr[n] = {};
                that.__tipLocArr[n].dInputElem = this;
                that.__tipLocArr[n].gap = that.gap;
                that.__tipLocArr[n].position = that.position;
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
        },
        isIgnoreValid: function (isIgnore, elem) {
            var uElem = fish.one(elem);
            if (isIgnore) {
                uElem.addClass(_IGNORE_VALID_CLASSNAME);
            } else {
                uElem.removeClass(_IGNORE_VALID_CLASSNAME);
            }
        },
        destroy: function () {// 把
            this.isDestroy = true;
            //清除以前的一些tip
            this.__tipLocArr.forEach(function (each) {
                if (each.uTip && each.uTip.length > 0) {
                    try {
                        each.uTip.html("remove");
                    } catch (ex) {
                    }

                    each.uTip = false;
                }
            });
        },
        resetAllTipLoc: function () {
            //            console.dir(this.__tipLocArr);
            this.__tipLocArr.forEach(function (each) {
                var uInputElem = fish.one(each.dInputElem),
                   offset = uInputElem.offset(),
                   left = offset.left,
                   top = offset.top;
                each.position = each.position || "right";
                each.gap = parseInt(each.gap);
                if (each.position == "right") {
                    left += (each.gap + uInputElem.width());
                } else {
                    top += (each.gap + uInputElem.height());
                }
                if (each.uTip && each.uTip.length > 0) {
                    each.uTip.css("left:" + left + "px;top:" + top + "px;");
                }


            });
            if (this.isDebug) {
                console.dir(this.elem);
                console.dir(this.__tipLocArr);
            }
        }

    };
    //根据相对元素relativeElem，获得位置字符串
    function getLocString(relativeElem, pos, gap) {
        gap = gap || 10;
        pos = pos || "right";
        var uRelElem = fish.one(relativeElem),
            relOffset = uRelElem.offset(),
            w = uRelElem.width(),
            h = uRelElem.height(),
            top = relOffset.top,
            left = relOffset.left,
            cssStr = "position:absolute;";
        gap = parseInt(gap, 10);
        if (pos == "right") {
            left += (w + gap);
        } else if (pos == "bottom") {
            top += (h + gap);
        }
        cssStr += ("left:" + left + "px;top:" + top + "px;");
        return cssStr;
    };


    function main(__elem, param) {
        var defParam = {
            elem: __elem,
            type: [],
            all: [],
            pass: false,
            fail: function () { },
            success: function () { },
            isDebug: false,
            position: "right",
            gap: 10,
            __tipLocArr: []


        }
        fish.lang.extend(defParam, param);
        fish.lang.extend(this, defParam);
        if (defParam.isDebug) {
            tool.isDebug = true;
        }
        this.init();

    }

    fish.extend({
        verify: function (param) {
            return new main(this, param);

        }
    })

    //fish.extend(new Validator());
})()





