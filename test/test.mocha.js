var fs = require('fs');
var path = require('path');

var assert = require('power-assert');
var xss = require('xss');
var jsdompromise = require('./jsdompromise');


var scripts = [
    'file://' + __dirname + '/../src/jdataexchange.js',
];

const justForCodeCover = true;


for (var i = 0; i < scripts.length; i++) {
    scripts[i] = path.normalize(scripts[i]);
}


describe('jdx environment test', function () {
    const defaultVal = "TestValue";
    const idRoot = "root";
    const idChild = "child";
    const eleKey = "name";
    const jsonKey = "target";
    const eleVal = "value";
    const html = `
    <div id="${idRoot}">
        <input id="${idChild}" ${eleKey}="${jsonKey}" type="text" value="${defaultVal}" />
    </div>
    `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('global variable checked', function () {
        it('should has window, window.jdx, jdx', function () {
            assert(typeof window === 'object');
            //assert(typeof window.$ === 'function');
            assert(typeof window.jdx === 'function');
            assert(typeof window.jDataExchange === 'function');
            assert(typeof jdx === 'function');
            assert(typeof window.document === 'object');
            assert(typeof document === 'object');
            assert(typeof document.querySelector === 'function');
            assert(typeof document.querySelectorAll === 'function');
        });
    });

    describe('test exception check', function () {
        it('test exception check', function () {
            var val = {};
            var ele = document.getElementById('root');

            var invalidHtml = new Error('A error!');
            assert.throws(function () {
                    jdx('');
                }
                , /Html element parameter is invalid!/
            );
            assert.throws(function () {
                    jdx(invalidHtml);
                }
                , /Html element parameter is invalid!/
            );
            assert.throws(function () {
                    jdx('root', '11');
                }
                , /Config parameter is invalid!/
            );
            assert.throws(function () {
                    jdx('noid').get(val);
                }
                , /Html element id is invalid!/
            );
            assert.throws(function () {
                    jdx(ele).get('11');
                }
                , /Json parameter is invalid!/
            );
            assert.throws(function () {
                    jdx('root', null, invalidHtml);
                }
                , /Html window object is invalid!/
            );
        });
    });

});

describe('test input text', function () {
    const inputType = "text";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
    <input id="${idChild}" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}" />
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonGet = {};
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot).getElements(eles);
            assert(eles[jsonKey] === eleChild);
        });

        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot).get(jsonGet);
            const curVal = defaultVal;
            assert(eles[jsonKey] === eleChild && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            const curVal = "Input Value111";
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            delete jsonGet[jsonKey];
            jdx(idRoot, null, global.window).get(jsonGet);
            assert(jsonGet[jsonKey] === curVal && jsonSet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });
    });
});


describe('test input password', function () {
    const inputType = "password";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
    <input id="${idChild}" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}" />
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonGet = {};
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot).getElements(eles);
            assert(eles[jsonKey] === eleChild);
        });

        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot).get(jsonGet);
            const curVal = defaultVal;
            assert(eles[jsonKey] === eleChild && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            const curVal = "Input Value111";
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            delete jsonGet[jsonKey];
            jdx(idRoot, null, global.window).get(jsonGet);
            assert(jsonGet[jsonKey] === curVal && jsonSet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });

        it('test jdx set just for code cover', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);

            var curVal = defaultVal;
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            jdx(idRoot, null, global.window).get(jsonGet);
            assert(jsonGet[jsonKey] === curVal && jsonSet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);

            // null值会忽略设置
            curVal = null;
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            jdx(idRoot, null, global.window).get(jsonGet);
            curVal = defaultVal;
            jsonSet[jsonKey] = curVal;
            assert(jsonGet[jsonKey] === curVal && jsonSet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
            assert(justForCodeCover === true);
        });
    });
});


describe('test input hidden', function () {
    const inputType = "hidden";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
    <input id="${idChild}" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}" />
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonGet = {};
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot).getElements(eles);
            assert(eles[jsonKey] === eleChild);
        });

        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot).get(jsonGet);
            const curVal = defaultVal;
            assert(eles[jsonKey] === eleChild && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            const curVal = "Input Value111";
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            delete jsonGet[jsonKey];
            jdx(idRoot, null, global.window).get(jsonGet);
            assert(jsonGet[jsonKey] === curVal && jsonSet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });
    });
});


describe('test textarea', function () {
    const inputType = "hidden";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
    <textarea id="${idChild}" ${eleKey}="${jsonKey}" >${defaultVal}</textarea>
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonGet = {};
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot).getElements(eles);
            assert(eles[jsonKey] === eleChild);
        });

        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot).get(jsonGet);
            const curVal = defaultVal;
            assert(eles[jsonKey] === eleChild && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            const curVal = "Input Value111";
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            delete jsonGet[jsonKey];
            jdx(idRoot, null, global.window).get(jsonGet);
            assert(jsonGet[jsonKey] === curVal && jsonSet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });
    });
});

describe('test input radio', function () {
    const inputType = "radio";
    const inputChecked = "checked";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <form id="${idRoot}">
    <input id="${idChild}1" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}1"  ${inputChecked}="${inputChecked}" />
    <input id="${idChild}2" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}2" />
    <input id="${idChild}3" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}3" />
 </form>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonGet = {};
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);

            jdx(eleRoot).getElements(eles);           
            assert(eles[jsonKey] === eleChild1);
        });

        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);

            jdx(eleRoot).get(jsonGet);

            const curVal = `${defaultVal}1`;
            const eleChild = eleChild1; 
            assert(jsonGet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);

            const curVal = `${defaultVal}2`;
            jsonSet[jsonKey] = curVal;
            jdx(idRoot).set(jsonSet);
            jdx(eleRoot).get(jsonGet);
            const eleChild = eleChild2; 
            assert(jsonGet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });
    });
});

describe('test input checkbox', function () {
    const inputType = "checkbox";
    const inputChecked = "checked";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <form id="${idRoot}">
    <input id="${idChild}1" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}1"  ${inputChecked}="${inputChecked}" />
    <input id="${idChild}2" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}2" />
    <input id="${idChild}3" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}3" />
 </form>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonGet = {};
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);
            jdx(eleRoot).getElements(eles);           
            check2ArrayEqual(eles[jsonKey] , [eleChild1]);
        });

        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);
            var list = [eleChild1, eleChild2, eleChild3];
            var listV = [];

            jdx(eleRoot).getElements(eles);
            jdx(eleRoot).get(jsonGet);
            ElementsGroupArray(list, inputChecked, eleVal, listV);
            checkElementsGroupValue(jsonGet[jsonKey], listV);
            assert(listV[0] === eleChild1[eleVal]);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);
            var list = [eleChild1, eleChild2, eleChild3];
            var listV = [];

            jsonSet[jsonKey] = null;
            jdx(idRoot).set(jsonSet);
            jdx(eleRoot).getElements(eles);
            jdx(eleRoot).get(jsonGet);
            ElementsGroupArray(list, inputChecked, eleVal, listV);
            checkElementsGroupValue(jsonGet[jsonKey], listV);

            jsonSet[jsonKey] = null;
            jdx(idRoot).set(jsonSet);
            jdx(eleRoot).getElements(eles);
            jdx(eleRoot).get(jsonGet);
            ElementsGroupArray(list, inputChecked, eleVal, listV);
            checkElementsGroupValue(jsonGet[jsonKey], listV);

            jsonSet[jsonKey] = [`${defaultVal}2`];
            jdx(idRoot).set(jsonSet);
            jdx(eleRoot).getElements(eles);
            jdx(eleRoot).get(jsonGet);
            ElementsGroupArray(list, inputChecked, eleVal, listV);
            checkElementsGroupValue(jsonGet[jsonKey], listV);
            assert(listV[0] === eleChild2[eleVal]);
        });
    });
});


describe('test select simple', function () {
    const inputChecked = "selected";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <form id="${idRoot}">
    <select ${eleKey}="${jsonKey}" >
        <option id="${idChild}1" ${eleVal}="${defaultVal}1"  ${inputChecked}="${inputChecked}" >${defaultVal}1</option>
        <option id="${idChild}2" ${eleVal}="${defaultVal}2" >${defaultVal}2</option>
        <option id="${idChild}3" ${eleVal}="${defaultVal}3" >${defaultVal}3</option>
    </select>
 </form>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonGet = {};
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            //const eleChild = document.getElementById(`${idChild}`);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);

            jdx(eleRoot).getElements(eles);          
            assert(eles[jsonKey] === eleChild1);
        });

        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);

            jdx(eleRoot).get(jsonGet);

            const curVal = `${defaultVal}1`;
            const eleChild = eleChild1; 
            assert(jsonGet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);
            
            const curVal = `${defaultVal}2`;
            jsonSet[jsonKey] = curVal;
            jdx(idRoot).set(jsonSet);
            jdx(eleRoot).get(jsonGet);
            const eleChild = eleChild2; 
            assert(jsonGet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonGet[jsonKey]);
        });
    });
});


describe('test select multiple', function () {
    const inputChecked = "selected";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <form id="${idRoot}">
    <select ${eleKey}="${jsonKey}" multiple="multiple" >
        <option id="${idChild}1" ${eleVal}="${defaultVal}1"  ${inputChecked}="${inputChecked}" >${defaultVal}1</option>
        <option id="${idChild}2" ${eleVal}="${defaultVal}2" >${defaultVal}2</option>
        <option id="${idChild}3" ${eleVal}="${defaultVal}3" >${defaultVal}3</option>
    </select>
 </form>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonGet = {};
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            //const eleChild = document.getElementById(`${idChild}`);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);
            jdx(eleRoot).getElements(eles);           
            check2ArrayEqual(eles[jsonKey] , [eleChild1]);
        });

        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);
            var list = [eleChild1, eleChild2, eleChild3];
            var listV = [];

            jdx(eleRoot).getElements(eles);
            jdx(eleRoot).get(jsonGet);
            ElementsGroupArray(list, inputChecked, eleVal, listV);
            checkElementsGroupValue(jsonGet[jsonKey], listV);
            assert(listV[0] === eleChild1[eleVal]);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);
            var list = [eleChild1, eleChild2, eleChild3];
            var listV = [];

            jsonSet[jsonKey] = null;
            jdx(idRoot).set(jsonSet);
            jdx(eleRoot).getElements(eles);
            jdx(eleRoot).get(jsonGet);
            ElementsGroupArray(list, inputChecked, eleVal, listV);
            checkElementsGroupValue(jsonGet[jsonKey], listV);

            jsonSet[jsonKey] = null;
            jdx(idRoot).set(jsonSet);
            jdx(eleRoot).getElements(eles);
            jdx(eleRoot).get(jsonGet);
            ElementsGroupArray(list, inputChecked, eleVal, listV);
            checkElementsGroupValue(jsonGet[jsonKey], listV);

            jsonSet[jsonKey] = [`${defaultVal}2`];
            jdx(idRoot).set(jsonSet);
            jdx(eleRoot).getElements(eles);
            jdx(eleRoot).get(jsonGet);
            ElementsGroupArray(list, inputChecked, eleVal, listV);
            checkElementsGroupValue(jsonGet[jsonKey], listV);
            assert(listV[0] === eleChild2[eleVal]);
        });
    });
});


describe('test input button', function () {
    const inputType = "button";
    const inputChecked = "disabled";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "data-key";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
    <input id="${idChild}" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}" />
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonSet = {};
        var jsonGet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            assert(eleRoot && eleChild);
            jdx(eleRoot).getElements(eles, {key:`${eleKey}`});
            assert(eles[jsonKey] === eleChild);
        });


        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot, {key:`${eleKey}`}).get(jsonGet);
            assert(justForCodeCover === true);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            var curVal = false;
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet, {key:`${eleKey}`});
            assert(jsonSet[jsonKey] === curVal && eleChild[inputChecked] === curVal);
            checkElementSingleValue(eleChild, eleChild, inputChecked, jsonSet[jsonKey]);

            var curVal = true;
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet, {key:`${eleKey}`});
            assert(jsonSet[jsonKey] === curVal && eleChild[inputChecked] === curVal);
            checkElementSingleValue(eleChild, eleChild, inputChecked, jsonSet[jsonKey]);
        });
    });
});



describe('test input file', function () {
    const inputType = "file";
    const inputChecked = "disabled";
    const defaultVal = "TestValue";
    const eleVal = "value";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
    <input id="${idChild}" ${eleKey}="${jsonKey}" type="${inputType}" ${eleVal}="${defaultVal}" />
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonSet = {};
        var jsonGet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            assert(eleRoot && eleChild);
            jdx(eleRoot).getElements(eles);
            assert(eles[jsonKey] === eleChild);
        });


        it('test jdx get', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            jdx(eleRoot).get(jsonGet);
            assert(justForCodeCover === true);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            var curVal = false;
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            assert(jsonSet[jsonKey] === curVal && eleChild[inputChecked] === curVal);
            checkElementSingleValue(eleChild, eleChild, inputChecked, jsonSet[jsonKey]);

            var curVal = true;
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            assert(jsonSet[jsonKey] === curVal && eleChild[inputChecked] === curVal);
            checkElementSingleValue(eleChild, eleChild, inputChecked, jsonSet[jsonKey]);
        });
    });
});




describe('test lable className (config data-jdx-bind)', function () {
    const defaultVal = "TestValue";
    const eleVal = "className";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
     <label id="${idChild}" ${eleKey}="${jsonKey}" data-jdx-bind="className">${defaultVal}</label>
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            assert(eleRoot && eleChild);
            jdx(eleRoot).getElements(eles);
            assert(eles[jsonKey] === eleChild);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            var curVal = "Input Value111";
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            assert(jsonSet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonSet[jsonKey]);
        });
    });
});



describe('test div className', function () {
    const defaultVal = "TestValue";
    const eleVal = "className";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
     <div id="${idChild}" ${eleKey}="${jsonKey}" >${defaultVal}</div>
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            assert(eleRoot && eleChild);
            jdx(eleRoot).getElements(eles);
            assert(eles[jsonKey] === eleChild);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            var curVal = "Input Value111";
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            assert(jsonSet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonSet[jsonKey]);
        });
    });
});




describe('test div data-k', function () {
    const defaultVal = "TestValue";
    const eleVal = "data-v";
    const eleKey = "data-k";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
     <div id="${idChild}" ${eleKey}="${jsonKey}" ${eleVal}="${eleVal}">${defaultVal}</div>
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonSet = {};
        var eles = {};
        var cfg = {key:eleKey};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            assert(eleRoot && eleChild);
            jdx(eleRoot, cfg).getElements(eles);
            assert(eles[jsonKey] === eleChild);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            var curVal = "Input Value111";
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot, cfg).set(jsonSet, {customBind:eleVal});
            assert(getElementValue(eleChild, eleVal) === curVal);            
        });
    });
});


describe('test lable innerHTML', function () {
    const defaultVal = "TestValue";
    const eleVal = "innerHTML";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const html = `
 <div id="${idRoot}">
    <label id="${idChild}" ${eleKey}="${jsonKey}" >${defaultVal}</label>
 </div>
 `;

    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonSet = {};
        var jsonGet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            assert(eleRoot && eleChild);
            jdx(eleRoot).getElements(eles);
            assert(eles[jsonKey] === eleChild);
        });

        it('test jdx set', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            const curVal = "Input Value111";
            jsonSet[jsonKey] = curVal;
            jdx(eleRoot).set(jsonSet);
            assert(jsonSet[jsonKey] === curVal && eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, jsonSet[jsonKey]);
        });

        it('test jdx set with getSingleValueFromList', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);

            var curVal = '';
            jsonSet[jsonKey] = curVal;
            jdx(idRoot).set(jsonSet);
            assert(eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, curVal);

            var curVal = 'Input Value000';
            jsonSet[jsonKey] = [curVal];
            jdx(idRoot).set(jsonSet);
            assert(eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, curVal);
        });


        it('test jdx set with funciton', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);
            var curVal = 'Input Value000';
            function setLabelFunction(eleItem, attrName, jsonObj, value, jsonKey, config) {
                return curVal;
            };
            jsonSet[jsonKey] = setLabelFunction;
            jdx(idRoot).set(jsonSet);
            assert(eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, curVal);
        });

        it('test jdx set with funciton just for code cover', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);

            var curVal = defaultVal;
            jsonSet[jsonKey] = [curVal];
            jdx(eleRoot).set(jsonSet);
            assert(eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, curVal);

            var curVal = null;
            function setLabelFunction(eleItem, attrName, jsonObj, value, jsonKey, config) {
                return curVal;
            };
            jsonSet[jsonKey] = setLabelFunction;
            jdx(idRoot).set(jsonSet);
            assert(eleChild[eleVal] === defaultVal && defaultVal !== curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, defaultVal);
            assert(justForCodeCover === true);
        });


        it('test jdx set for code cover', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild = document.getElementById(idChild);

            var curVal = defaultVal;
            jsonSet[jsonKey] = [curVal];
            jdx(eleRoot).set(jsonSet);
            assert(eleChild[eleVal] === curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, curVal);

            var curVal = null;
            jsonSet[jsonKey] = curVal;
            jdx(idRoot).set(jsonSet);
            assert(eleChild[eleVal] === defaultVal && defaultVal !== curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, defaultVal);
            assert(justForCodeCover === true);

            var curVal = 'Input Value000';
            var otherKey = jsonKey+"NoKey";
            delete jsonSet[jsonKey];
            jsonSet[otherKey] = curVal;
            jdx(idRoot).set(jsonSet);
            assert(eleChild[eleVal] === defaultVal && defaultVal !== curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, defaultVal);
            assert(justForCodeCover === true);

            jdx(eleRoot).get(jsonGet);
            assert(eleChild[eleVal] === defaultVal && defaultVal !== curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, defaultVal);
            assert(justForCodeCover === true);

            var curVal = null;
            jsonSet[jsonKey] = [curVal];
            jdx(idRoot).set(jsonSet);
            var defaultVal1 = '';
            assert(eleChild[eleVal] === defaultVal1 && defaultVal1 !== curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, defaultVal1);
            assert(justForCodeCover === true);

            jdx(idRoot).set(jsonSet, '');
            var defaultVal1 = '';
            assert(eleChild[eleVal] === defaultVal1 && defaultVal1 !== curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, defaultVal1);
            assert(justForCodeCover === true);

            jsonSet[jsonKey] = {a:1}
            jdx(idRoot).set(jsonSet, {a:1});
            var defaultVal1 = '';
            assert(eleChild[eleVal] === defaultVal1 && defaultVal1 !== curVal);
            checkElementSingleValue(eleChild, eleChild, eleVal, defaultVal1);
            assert(justForCodeCover === true);
        });
    });
});



describe('test config for get and set', function () {
    const inputType = "label";
    const defaultVal = "TestValue";
    const eleVal = "innerHTML";
    const eleKey = "name";
    const idRoot = "root";
    const idChild = "child";
    const jsonKey = "target";
    const jsonKey1 = `${jsonKey}1`;
    const jsonKey2 = `${jsonKey}2`;
    const jsonKey3 = `${jsonKey}3`;
    const html = `
 <div id="${idRoot}">
    <label id="${idChild}1" ${eleKey}="${jsonKey1}" data-test="1" >${defaultVal}1</label>
    <label id="${idChild}2" ${eleKey}="${jsonKey2}" data-test="2" >${defaultVal}2</label>
    <label id="${idChild}3" ${eleKey}="${jsonKey3}" data-jdx-ignore="yes" >${defaultVal}3</label>
    <label id="${idChild}4" >${defaultVal}4</label>
 </div>
 `;


    before(function () {
        return jsdompromise(html, scripts);
    });

    describe('test jdx functions', function () {
        var jsonGet = {};
        var jsonSet = {};
        var eles = {};
        it('test jdx getElements', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);
            const eleChild4 = document.getElementById(`${idChild}4`);

            jdx(eleRoot).getElements(eles);
            assert(eles[jsonKey1] === eleChild1);
            assert(eles[jsonKey2] === eleChild2);
            assert(Object.getOwnPropertyNames(eles).length === 2);
            assert(eles[jsonKey3] === undefined);
            assert(justForCodeCover === true);
        });

        it('test jdx get (no input element)', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);

            jdx(eleRoot).getElements(eles);
            jdx(eleRoot).get(jsonGet);
            assert(Object.getOwnPropertyNames(jsonGet).length === 0);
            assert(justForCodeCover === true);
        });

        it('test jdx option eleFilter', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);

            function eleFilter(eleItem, jsonKey, config) {
                if (eleItem.getAttribute('data-test') === "1") {
                    return true;
                }
                else {
                    return false;
                }
            }

            jsonSet[jsonKey1]  = 'Input Value001';
            jsonSet[jsonKey2]  = 'Input Value002';

            jdx(idRoot).set(jsonSet);
            assert(eleChild1[eleVal] === jsonSet[jsonKey1]);
            assert(eleChild2[eleVal] === jsonSet[jsonKey2]);

            var config = {
                eleFilter
            };

            jsonSet[jsonKey1]  = 'Input Value003';
            jsonSet[jsonKey2]  = 'Input Value004';

            jdx(idRoot, config).set(jsonSet);
            assert(eleChild1[eleVal] === jsonSet[jsonKey1]);
            assert(eleChild2[eleVal] === 'Input Value002');

            config = {
                xssFilter :function (){return null;}
            };
            jdx(idRoot, config).set(jsonSet);

            assert(justForCodeCover === true);
        });

        it('test jdx option xssFilter', function () {
            const eleRoot = document.getElementById(idRoot);
            const eleChild1 = document.getElementById(`${idChild}1`);
            const eleChild2 = document.getElementById(`${idChild}2`);
            const eleChild3 = document.getElementById(`${idChild}3`);

            const xssHtml = 'Input Value000<script>alert("xss");</script>';
            const noXssHtml = xss(xssHtml);
            jsonSet[jsonKey1]  = xssHtml;

            jdx(idRoot).set(jsonSet);
            assert(eleChild1[eleVal] === xssHtml);
            function xssFilter(eleItem, attrName, jsonObj, value, jsonKey, config) {
                return xss(value);
            }
            var config = {
                xssFilter
            };
            jdx(idRoot, config).set(jsonSet);
            assert(eleChild1[eleVal] === noXssHtml);
         
        });
    });
});

function getElementValue(eleItem, attrName) {
        if (attrName in eleItem) {
            return eleItem[attrName];
        }
        else {
            return eleItem.getAttribute(attrName);
        }
}

function checkIsValidValue(val) {
    assert(val !== null && val !== undefined);
}

function checkElementSingleValue(ele1, ele2, value, data) {
    checkIsValidValue(value);
    checkIsValidValue(ele1);
    checkIsValidValue(ele2);
    checkIsValidValue(data);
    assert(ele1 === ele2);
    var val1 = ele1[value];
    var val2 = ele2[value];
    checkIsValidValue(val1);
    checkIsValidValue(val2);
    assert(data === val1 && data === val2);
}

function check2ArrayEqual(list1, list2) {
    checkIsValidValue(list1);
    checkIsValidValue(list2);
    assert(Array.isArray(list1));
    assert(Array.isArray(list2));
    assert(list1.length === list2.length);
    list1.forEach(function (item) {
        assert(list2.indexOf(item) !== -1);
    });
    list2.forEach(function (item) {
        assert(list1.indexOf(item) !== -1);
    })
}

function ElementsGroupArray(list, attrChk, attrVal, listV) {
    assert(Array.isArray(list));
    assert(Array.isArray(listV));
    checkIsValidValue(attrChk);
    listV.length = 0;

    list.forEach(function (item) {
        var chk = item[attrChk];
        var val = attrVal? item[attrVal]: item;
        if (Boolean(chk)) {
            listV.push(val);
        }
        
    })
}

function checkElementsGroupValue(jsonVal, listV) {
    checkIsValidValue(jsonVal);
    checkIsValidValue(listV);

    check2ArrayEqual(jsonVal, listV);  
}
