var jsdom = require('jsdom');

var attrs = Object.getOwnPropertyNames(global);
function propagateToGlobal (window) {
    for (var key in window) {
        if (!window.hasOwnProperty(key)) continue
        if (attrs.indexOf(key) >= 0) continue

        global[key] = window[key]
    }
}

module.exports = function(html, scripts) {
    return new Promise(function(resolve, reject) {
        global.window = null;
        global.document = null;
        jsdom.env({
            html: html,
            scripts: scripts,
            done : function (err, window) {
                if (err) {
                    reject(err);
                    return;
                }
                global.window = window;
                global.document = window.document;
                propagateToGlobal(window);
                resolve(window);
            }
        });
    })
}