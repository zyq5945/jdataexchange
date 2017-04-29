
<!--函数 function(eleItem, jsonKey, config) 返回true表示处理该eleItem,否则忽略-->
function filter1(eleItem, jsonKey, config){
    var flag = eleItem.getAttribute('data-flag');
    return flag==="1";
}

<!--函数 function(eleItem, jsonKey, config) 返回true表示处理该eleItem,否则忽略-->
function filter0(eleItem, jsonKey, config){
    var flag = eleItem.getAttribute('data-flag');
    return flag==="0";
}


var getVal = function() {
    var data = {};
    jdx('myform').get(data);
    jdx('mydisplay').set({json:JSON.stringify(data, null, 4)})
}

var setVal = function() {
    var temp = {};
    jdx('mydisplay').get(temp);
    data = JSON.parse(temp.json);
    jdx('myform').set(data);
}

function getVal1() {
    var data = {};
    jdx('myform').get(data, {eleFilter: filter1});
    jdx('mydisplay').set({json:JSON.stringify(data, null, 4)})
}

function setVal1() {
    var temp = {};
    jdx('mydisplay').get(temp);
    data = JSON.parse(temp.json);
    jdx('myform').set(data, {eleFilter: filter1});
}

function getVal0() {
    var data = {};
    jdx('myform', {eleFilter: filter0}).get(data);
    jdx('mydisplay').set({json:JSON.stringify(data, null, 4)})
}

function setVal0() {
    var data = {};
    var temp = {};
    jdx('mydisplay').get(temp);
    data = JSON.parse(temp.json);
    jdx('myform', {eleFilter: filter0}).set(data);
}

function load() {
    var data = {};
    data._csrf = new Date().toUTCString();
    jdx('myform').set(data);
}
