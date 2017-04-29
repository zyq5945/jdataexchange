
<!--函数 function((eleItem, attrName, jsonObj, value, jsonKey, config) 返回进行xss处理后的字符串值，返回null或者undefined忽略设置-->
<!--高版本的浏览器有的已经做了xss处理-->
var filter = function(eleItem, attrName, jsonObj, value, jsonKey, config) {
    var flag = eleItem.getAttribute('data-dangerousHtml');
    if (flag === 'yes') {
        return value;
    }
    else if (flag === 'ignore') {
        return null;
    }
    else {
        <!--filterXSS是xss库处理函数-->
        if (typeof filterXSS === 'undefined') {
            alert("Please read examples.md");
            return '';
        }
        var val = filterXSS(value);
        return val;
    }
}

var config = {xssFilter: filter}
var input = jdx('myinput');
var output = jdx('mydisplay', config);
var data = {};

function resetVal() {
    data = {
        "dangerousHtml": 'Safe Html <script>alert("xss");</script>'
    };

    input.set({json:JSON.stringify(data, null, 4)});
    setVal() ;
}

function setVal() {
    var temp = {};
    input.get(temp);
    data = JSON.parse(temp.json);
    output.set(data);
}

function load() {
    resetVal();
}
