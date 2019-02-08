/*
 ******************************************************************************
 * @file     jdataexchange.js
 * @author   zyq5945@126.com
 * @version  V0.02
 * @date     2019/02/08
 * @licence  MIT
 * @brief    一个用来做html界面元素与json数据进行交换的javascript库
 ******************************************************************************
 */

(function () {
    // 默认配置参数
    var defaultConfig = {
        // element属性值与json键一一对应起来，默认是element的name属性
        // 调用set函数的会做两个特殊处理：
        // 当有同名的函数存在会调用函数计算结果值给element，返回null或者undefined忽略设置
        /* function(eleItem, attrName, jsonObj, value, jsonKey, config)
         *
         * @brief 通过调用同名的function，将返回值设置给eleItem的attrName属性
         * @param eleItem 要设置的element
         * @param attrName 要设置的element的要设置的属性名称
         * @param jsonObj 对应的jsonObj
         * @param value 原始value将要设置给element的attrName属性
         * @param jsonKey 对应的jsonObj的key
         * @param config 配置参数
         * @return 最终的value将要设置给element的attrName属性，返回null或者undefined忽略设置
         */
        
        key: 'name',

        // 函数 function(eleItem, jsonKey, config) 返回true表示处理该eleItem,否则忽略
        eleFilter: null,

        // 函数 function((eleItem, attrName, jsonObj, value, jsonKey, config) 返回进行xss处理后的字符串值，返回null或者undefined忽略设置
        xssFilter: null,

        // 忽略处理element的data-jdx-ignore属性为true的元素
        ignoreFlag: 'data-jdx-ignore',

        // 将设置data-jdx-bind绑定的属性值
        customBind: 'data-jdx-bind',

        // 需要处理的只有一个值域的element
        htmlElements: [
            {name: 'textarea', value: 'value', input: true},
            {name: 'label', value: 'innerHTML'},
            {name: 'button', value: 'disabled'},
            {name: 'a', value: 'href'},
            {name: 'img', value: 'src'},
            {name: 'td', value: 'innerHTML'},
            {name: 'tr', value: 'className'},
            {name: 'h1', value: 'innerHTML'},
            {name: 'h2', value: 'innerHTML'},
            {name: 'h3', value: 'innerHTML'},
            {name: 'h4', value: 'innerHTML'},
            {name: 'h5', value: 'innerHTML'},
            {name: 'h6', value: 'innerHTML'},
            {name: 'span', value: 'innerHTML'},
            {name: 'p', value: 'innerHTML'},
            {name: 'div', value: 'className'}
        ]
    };

    function arrayIndexOf(list, val) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] === val) return i;
        }
        return -1;
    }

    function arraySafeRemove(list, val) {
        var index = arrayIndexOf(list, val);
        if (index > -1) {
            list.splice(index, 1);
        }
    }

    function arraySafePush(list, val) {
        var index = arrayIndexOf(list, val);
        if (index === -1) {
            list.push(val)
        }
    }

    function arrayForeach(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback.call(null, list[i], i, list);
        }
    }

    function isValidValue(val) {
        return val !== null && val !== undefined;
    }

    function isValidString(name) {
        return name && typeof name === 'string';
    }

    // NOTE： IETester下测试function是object
    function isValidFunction(func) {
        return func && (typeof func === 'function' || typeof func === 'object');
    }

    function isValidObject(jsonObj) {
        return jsonObj && typeof jsonObj === 'object';
    }

    function isValidHtmlElenent(htmlEle) {
        return htmlEle && isValidFunction(htmlEle.getElementsByTagName);
    }

    function isValidHtmlWindow(w) {
        return w
            && typeof w === 'object'
            && w.document
            && typeof w.document === 'object'
            && isValidFunction(w.document.getElementById);
    }

    function checkJsonObjectIsValid(jsonObj) {
        if (!isValidObject(jsonObj)) {
            throw new Error('Json parameter is invalid!');
        }
    }

    function checkConfigIsValid(jsonObj) {
        if (!isValidObject(jsonObj)) {
            throw new Error('Config parameter is invalid!');
        }
    }

    function checkWindowIsValid(w) {
        if (!isValidHtmlWindow(w)) {
            throw new Error('Html window object is invalid!');
        }
    }

    function setCheckedToList(jsonObj, jsonKey, jsonValue, isChecked, config) {

        var list = jsonObj[jsonKey] || [];

        if (isChecked) {
            arraySafePush(list, jsonValue);
        }
        else {
            arraySafeRemove(list, jsonValue);
        }

        jsonObj[jsonKey] = list;
        return jsonObj;
    }

    function getCheckedFromList(jsonObj, jsonKey, val, config) {

        var list = jsonObj[jsonKey];
 
        if (!list || !list.length || list.length === 0) {
            return false;
        }

        var index = arrayIndexOf(list, val);
        return index !== -1;
    }

    function getSingleValueFromList(jsonObj, jsonKey, config) {

        var list = jsonObj[jsonKey];

        if (!list || !list.length || list.length === 0) {
            return '';
        }

        return list.join(' ');
    }


    function mergeConfig(dstConfig, srcConfig) {
        if (isValidObject(srcConfig)) {
            for (var prop in srcConfig) {
                if (srcConfig.hasOwnProperty(prop)) {
                    dstConfig[prop] = srcConfig[prop];
                }
            }
        }
        return dstConfig;
    }

    function getElementValue(eleItem, attrName) {
        if (attrName in eleItem) {
            return eleItem[attrName];
        }
        else {
            return eleItem.getAttribute(attrName);
        }
    }

    function setElementValue(eleItem, attrName, value) {
        if (attrName in eleItem) {
            eleItem[attrName] = value;
        }
        else {
            eleItem.setAttribute(attrName, value);
        }
    }

    function setValueWithFilter(eleItem, attrName, jsonObj, value, jsonKey, config) {
        var func = config.xssFilter;
        if (isValidFunction(func)) {
            value = func.call(null, eleItem, attrName, jsonObj, value, jsonKey, config);
        }

        if (isValidValue(value) && isValidValue(attrName)) {
            setElementValue(eleItem, attrName, value);
        }
    }

    function setValueWarpFilter(eleItem, attrName, jsonObj, value, jsonKey, config) {
        if (!isValidObject(value) && isValidFunction(value)) {
            var ret = value.call(jsonObj, eleItem, attrName, jsonObj, value, jsonKey, config);
            if (isValidValue(ret)) {
                setValueWithFilter(eleItem, attrName, jsonObj, ret, jsonKey, config);
            }
        }
        else {
            if (isValidObject(value)) {
                setValueWithFilter(eleItem, attrName, jsonObj, getSingleValueFromList(jsonObj, jsonKey, config), jsonKey, config);
            }
            else if (isValidValue(value)) {
                setValueWithFilter(eleItem, attrName, jsonObj, value, jsonKey, config);
            }
        }
    }

    function getValueWithGroup(eleItem, attrName, jsonObj, jsonKey, group, single, config) {
        var jsonValue = getElementValue(eleItem, attrName);
        if (isValidValue(group)) {
            var bGroup = getElementValue(eleItem, group);
            if (single) {
                if (bGroup) {
                    jsonObj[jsonKey] = jsonValue;  
                }
                else if (jsonObj[jsonKey] === jsonValue){
                    jsonObj[jsonKey] = '';    
                }    
            }
            else {
                setCheckedToList(jsonObj, jsonKey, jsonValue, bGroup, config);
            }           
        }
        else {
            jsonObj[jsonKey] = jsonValue;
        }
    }

    function setValueWithGroup(eleItem, attrName, jsonObj, jsonKey, group, single, config) {
        if (!(jsonKey in jsonObj)) {
            return;
        }

        if (isValidValue(group)) {
            if (single) {
                var jsonValue = jsonObj[jsonKey] === getElementValue(eleItem, attrName);
                setValueWarpFilter(eleItem, group, jsonObj, jsonValue, jsonKey, config);    
            }
            else {
                var jsonValue = getCheckedFromList(jsonObj, jsonKey, getElementValue(eleItem, attrName), config);
                setValueWarpFilter(eleItem, group, jsonObj, jsonValue, jsonKey, config);
            }  
            
        }
        else {
            var jsonValue = jsonObj[jsonKey];
            setValueWarpFilter(eleItem, attrName, jsonObj, jsonValue, jsonKey, config);
        }
    }


    /*
     * @brief jDataExchange的构造函数
     * @param htmlEle 需要进行操作的element对象，也可以是element的id字符串
     * @param config 配置参数，可以不写，如有效将和defautlConfig合并成新的配置参数
     * @param win window对象，默认在浏览器中不需要设置，在nodejs中，当htmlEle为字符串时需要设置win对象
     * @return 本例类实例对象
     */
    function DataExchange(htmlEle, config, win) {
        if (!(this instanceof DataExchange)) {
            return new DataExchange(htmlEle, config, win);
        }

        if (!(isValidHtmlElenent(htmlEle)
            || isValidString(htmlEle))) {
            throw new Error('Html element parameter is invalid!');
        }
        else if (isValidString(htmlEle)) {
            var w = win || root;
            checkWindowIsValid(w);
            this.windowObj = w;
        }

        if (config) {
            checkConfigIsValid(config);
        }

        this.config = DataExchange.defaultConfig;
        this.config = this.getConfig(config, false);
        this.htmlEle = htmlEle;

        return this;
    }

    DataExchange.defaultConfig = defaultConfig;

    /*
     * @brief 将form的输入element值获取到json对象
     * @param jsonObj json对象
     * @param paramConfig 配置参数，可以不写，如有效将和当前实例的配置对象合并成新的配置参数
     * @return 本例类实例对象
     */
    DataExchange.prototype.get = function (jsonObj, paramConfig) {
        var config = this.getConfig(paramConfig, true);

        checkConfigIsValid(config);
        checkJsonObjectIsValid(jsonObj);

        var that = this;
        arrayForeach(config.htmlElements, function configElements(tagEle) {
            that.filterForeach(tagEle.name, config, function element2Json(eleItem, jsonKey) {
                if (!tagEle.input) {
                    return;
                }

                var attrName = getElementValue(eleItem, config.customBind) || tagEle.value;
                getValueWithGroup(eleItem, attrName, jsonObj, jsonKey, null, false, config);
            });
        });

        this.filterForeach('input', config, function input2Json(eleItem, jsonKey) {
            var type = getElementValue(eleItem, 'type');
            switch (type) {
                case 'radio':
                    getValueWithGroup(eleItem, 'value', jsonObj, jsonKey, 'checked', true, config);
                    break;
                case 'checkbox':
                    getValueWithGroup(eleItem, 'value', jsonObj, jsonKey, 'checked', false, config);
                    break;

                case 'file':
                case 'button':
                case 'reset':
                case 'submit':
                    break;
                default:
                    getValueWithGroup(eleItem, 'value', jsonObj, jsonKey, null, false, config);
                    break;
            }
        });

        this.filterForeach('select', config, function select2Json(eleItem, jsonKey) {
            var multiple = getElementValue(eleItem, 'multiple');
            arrayForeach(eleItem.getElementsByTagName('OPTION'), function option2Json(eleOption) {
                getValueWithGroup(eleOption, 'value', jsonObj, jsonKey, 'selected', !multiple, config);
            });
        });

        return this;
    };

    /*
     * @brief 将json对象的值设置到html界面元素中
     * @param jsonObj json对象
     * @param paramConfig 配置参数，可以不写，如有效将和当前实例的配置对象合并成新的配置参数
     * @return 本例类实例对象
     */
    DataExchange.prototype.set = function (jsonObj, paramConfig) {
        var config = this.getConfig(paramConfig, true);

        checkConfigIsValid(config);
        checkJsonObjectIsValid(jsonObj);

        var that = this;
        arrayForeach(config.htmlElements, function configElements(tagEle) {
            that.filterForeach(tagEle.name, config, function json2Element(eleItem, jsonKey) {
                var attrName = getElementValue(eleItem, config.customBind) || tagEle.value;
                setValueWithGroup(eleItem, attrName, jsonObj, jsonKey, null, false, config);
            });
        });

        this.filterForeach('input', config, function json2Input(eleItem, jsonKey) {
            var type = getElementValue(eleItem, 'type');
            var jsonValue = null;
            switch (type) {
                case 'radio':
                    setValueWithGroup(eleItem, 'value', jsonObj, jsonKey, 'checked', true, config);
                    break;
                case 'checkbox':
                    setValueWithGroup(eleItem, 'value', jsonObj, jsonKey, 'checked', false, config);
                    break;
                case 'file':
                case 'button':
                case 'reset':
                case 'submit':
                    setValueWithGroup(eleItem, 'disabled', jsonObj, jsonKey, null, false, config);
                    break;
                default:
                    // NOTE some time have an error, html5 element validate ?!                   
                    setValueWithGroup(eleItem, 'value', jsonObj, jsonKey, null, false, config);            
                    break;
            }
        });

        this.filterForeach('select', config, function json2Select(eleItem, jsonKey) {
            var multiple = getElementValue(eleItem, 'multiple');
            arrayForeach(eleItem.getElementsByTagName('OPTION'), function json2Option(eleOption) {
                setValueWithGroup(eleOption, 'value', jsonObj, jsonKey, 'selected', !multiple, config);
            });
        });

        return this;
    };

    /*
     * @brief 将html的element对象获取到json对象
     * @param jsonObj json对象
     * @param paramConfig 配置参数，可以不写，如有效将和当前实例的配置对象合并成新的配置参数
     * @return 本例类实例对象
     */
    DataExchange.prototype.getElements = function (jsonObj, paramConfig) {
        var config = this.getConfig(paramConfig, true);

        checkConfigIsValid(config);
        checkJsonObjectIsValid(jsonObj);

        var that = this;
        arrayForeach(config.htmlElements, function configElements(tagEle) {
            that.filterForeach(tagEle.name, config, function element2Json(eleItem, jsonKey) {
                jsonObj[jsonKey] = eleItem;
            });
        });

        this.filterForeach('input', config, function input2Json(eleItem, jsonKey) {
            var type = getElementValue(eleItem, 'type');
            switch (type) {
                case 'radio':
                case 'checkbox':
                    setCheckedToList(jsonObj, jsonKey, eleItem, eleItem.checked, config);
                    break;
                case 'file':
                case 'button':
                case 'reset':
                case 'submit':
                default:
                    jsonObj[jsonKey] = eleItem;
                    break;
            }
        });

        this.filterForeach('select', config, function select2Json(eleItem, jsonKey) {
            arrayForeach(eleItem.getElementsByTagName('OPTION'), function option2Json(eleOption) {
                setCheckedToList(jsonObj, jsonKey, eleOption, eleOption.selected, config);
            });

        });

        return this;
    };

    /*
     * @brief 获取需要操作的根html
     * @return 根html
     */
    DataExchange.prototype.getRootElement = function () {
        var htmlEle = this.htmlEle;
        if (isValidString(htmlEle)) {
            htmlEle = this.windowObj.document.getElementById(htmlEle);
            if (!isValidHtmlElenent(htmlEle)) {
                throw new Error('Html element id is invalid!');
            }
        }

        return htmlEle;
    };

    /*
     * @brief  获取标签数组进行筛选后进行回调
     * @param tagName tag标签名称
     * @param paramConfig 配置参数，可以不写，如有效将和当前实例的配置对象合并成新的配置参数
     * @param callback 符合过滤条件的回调函数
     * @return 无
     */
    DataExchange.prototype.filterForeach = function (tagName, paramConfig, callback) {
        var config = this.getConfig(paramConfig, true);
        var htmlEle = this.getRootElement();
        arrayForeach(htmlEle.getElementsByTagName(tagName), function htmlForeach(eleItem) {
            if (getElementValue(eleItem, config.ignoreFlag)) {
                return;
            }

            var jsonKey = getElementValue(eleItem, config.key);
            if (!isValidString(jsonKey)) {
                return;
            }

            var eleFilter = config.eleFilter;
            if (isValidFunction(eleFilter)) {
                if (!eleFilter.call(null, eleItem, jsonKey, config)) {
                    return;
                }
            }

            callback.call(null, eleItem, jsonKey, config);
        });
    };

    /*
     * @brief  合并配置选项
     * @param config 需要合并的配置选项
     * @param customConfig 是否重新定义配置选项
     * @return 合并后的配置选项
     */
    DataExchange.prototype.getConfig = function (config, customConfig) {
        if (!isValidObject(config)
            || config === this.config) {
            return this.config;
        }
        else if (customConfig && config && config._customConfig) {
            return config;
        }
        else {
            var opts = {_customConfig: customConfig};
            mergeConfig(opts, this.config);
            mergeConfig(opts, config);
            return opts;
        }
    };


    /* jdataexchange ignore next */
    var root = typeof window === 'object' ? window : (typeof global === 'object' ? global : this);

    var jDataExchange = DataExchange;

    /* jdataexchange ignore next */
    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = jDataExchange;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return jDataExchange;
        });
    }
    // included directly via <script> tag
    else {
        root.jdx = root.jDataExchange = jDataExchange;
    }
})();