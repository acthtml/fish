/**
 *
 */

// doT.js
// 2011, Laura Doktorova, https://github.com/olado/doT
//
// doT.js is an open source component of http://bebedo.com
// Licensed under the MIT license.
// http://olado.github.com/doT/
//
(function() {
 //   "use strict";
    var doT = {
        version: '0.2.0',
        templateSettings: {
            evaluate:    /\{\{([\s\S]+?)\}\}/g,
            interpolate: /\{\{=([\s\S]+?)\}\}/g,
            encode:      /\{\{!([\s\S]+?)\}\}/g,
            use:         /\{\{#([\s\S]+?)\}\}/g,
            define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
            iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
            varname: 'it',
            strip: true,
            append: true,
            selfcontained: false
        },
        cache:{}, //模板函数缓存
        template: undefined //fn, compile template
    };


    var startend = {
        append: { start: "'+(",      end: ")+'",      startencode: "'+fish.encodeHTML(" },
        split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=fish.encodeHTML("}
    }, skip = /$^/;

    function resolveDefs(c, block, def) {
        return ((typeof block === 'string') ? block : block.toString())
            .replace(c.define || skip, function(m, code, assign, value) {
            if (code.indexOf('def.') === 0) {
                code = code.substring(4);
            }
            if (!(code in def)) {
                if (assign === ':') {
                    def[code]= value;
                } else {
                    eval("def['"+code+"']=" + value);
                }
            }
            return '';
        })
        .replace(c.use || skip, function(m, code) {
            var v = eval(code);
            if(code === "def.temp"){
                throw new Error("forbin def.temp in template");
                return;
            }
            return v ? resolveDefs(c, v, def) : v;

        });
    }

    function saveToCache(str, data){
        doT.cache[str] = data;
    }
    function getFromCache(str){
        return doT.cache[str];
    }

    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
    }

    doT.template = function(tmpl, def) {
        var c = doT.templateSettings, cacheString, cacheFn;
       
        var cse = c.append ? startend.append : startend.split, str, needhtmlencode, sid=0, indv;

        if(def){
            //这个情况不会直接查缓存，所以先解析 def
            str = resolveDefs(c, tmpl, def);
            if(!(cacheFn = getFromCache(str))){
                //没有命中缓存，保存缓存字符串
                cacheString = str;
            }
        }
        else{
            //这个可以直接查缓存
            if(!(cacheFn = getFromCache(tmpl))){
                //没有命中缓存，保存缓存字符串
                cacheString = tmpl;
                //然后开始解析
                str = resolveDefs(c, tmpl, {});
            }
        }

        //如果前面都没有命中缓存
        if(!cacheFn){
            str = ("var out='" + (c.strip ? str
    					    		.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ')
    					            .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
                .replace(/'|\\/g, '\\$&')
                .replace(c.interpolate || skip, function(m, code) {
                    return cse.start + unescape(code) + cse.end;
                })
                .replace(c.encode || skip, function(m, code) {
                    needhtmlencode = true;
                    return cse.startencode + unescape(code) + cse.end;
                })
                .replace(c.conditional || skip, function(m, elsecase, code) {
                    return elsecase ?
                        (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
                        (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
                })
                .replace(c.iterate || skip, function(m, iterate, vname, iname) {
                    if (!iterate) return "';} } out+='";
                    sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
                    return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
                        +vname+"=arr"+sid+"["+indv+"+=1];out+='";
                })
                .replace(c.evaluate || skip, function(m, code) {
                    return "';" + unescape(code) + "out+='";
                })
                + "';return out;")

                .replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
                .replace(/(\s|;|}|^|{)out\+='';/g, '$1').replace(/\+''/g, '')
                .replace(/(\s|;|}|^|{)out\+=''\+/g,'$1out+=');
        }



        try {
            if(!cacheFn){
                cacheFn = new Function(c.varname, str);
                saveToCache(cacheString, cacheFn);
            }
            return cacheFn;
        } catch (e) {
            if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
            throw e;
        }
    };
    
    function templateFn(dom, data){
    	var temp = dom.temp;
    	if(typeof dom === "string"){
    		if(data){
    			return doT.template(dom)(data);
    		}else{
    			return doT.template(dom);
    		}
    	}else if(typeof dom === "object"){
    		fish.lang.extend(doT.templateSettings, dom);
    		if(data){
    			return doT.template(temp, dom)(data);
    		}else{
    			return doT.template(temp, dom);
    		}
    	}
    }
    
    fish.extend({
    	template : templateFn,
    	encodeHTML : (function() {
            var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
                matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
            return function(code) {
                return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : code;
            };
        })()
    }) 

}());