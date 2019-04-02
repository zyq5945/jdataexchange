

/*
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
var filter = function(eleItem, attrName, jsonObj, value, jsonKey, config) {
    var fmt = eleItem.getAttribute('data-jdx-format');
    <!--moment是时间库处理函数-->
    if (typeof moment === 'undefined') {
        alert("Please read examples.md");
        return null;
    }
    var dt = moment(jsonObj['curDateTime'], jsonObj['dataFormat']);
    var val = dt.format(fmt);
    return val;
}


var input = jdx('myinput');
var output = jdx('mydisplay');
var data = {};

function resetVal() {
    data.curDateTime ='2017-4-7 19:31:22';
    data.dataFormat = 'YYYY-MM-DD HH:mm:ss';
    input.set({json:JSON.stringify(data, null, 4)});
    setVal() ;
}

function setVal() {
    var temp = {};
    input.get(temp);
    data = JSON.parse(temp.json);
    data.curDateTimeEx = filter;
    output.set(data);
}

function load() {
    resetVal();
}
