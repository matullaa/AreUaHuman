$(document).ready(function () {

    //Spinning Object to wait for loading
    $.blockUI({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#f69211',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5
//            color: '#f69211'
        },
        message: '<H3>Wait human,page is loading....</H3>'
    });

    //Invoking AYAH PHP
    getOutput();

    // AYAH is sending back IFRAME with game. It also permit to listen to JS event as it use postMessage() method.
    if (!window.addEventListener) {
        window.attachEvent('onmessage', receiveMessage);
    } else {
        window.addEventListener("message", receiveMessage, false);
    }

    // process the form
    $('form').submit(function (event) {
//        console.log("submit form");
        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'name': $('input[name=name]').val(),
            'session_secret': $('input[name=session_secret]').val()
        };

        // process the form
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: 'http://10.139.55.214/badHuman/php/sample.php', // the url where we want to POST
            data: formData, // our data object
            dataType: 'html', // what type of data do we expect back from the server
            encode: true
        })
            // using the done promise callback
            .done(function (data) {
                alert(data);
            });

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
        document.getElementById("submit_AYAH").disabled = true;
    });
});

function receiveMessage(event) {
//    console.log(event.type);
    if (AYAH.isIframeCommSupported()) {
        // Defines which events to listen for and which functions to call when those events occur
        AYAH.addGameStartHandler(handleEvent);
        AYAH.addGameCompleteHandler(handleEvent);
    } else {
        // Defines what happens if postMessage() is not supported
        alert("iframe communication is not supported!");
    }
}

// Declares the function to handle the events
function handleEvent(e) {
    // GameComplete Event has been triggered
    if (e.type == 'gameComplete') {
        document.getElementById("submit_AYAH").disabled = false;
    }
}

function getOutput() {

    getRequest(
        'http://10.139.55.214/badHuman/php/sample.php', // URL for the PHP file
        drawOutput,  // handle successful request
        drawError    // handle error
    );

    return false;
}

// handles drawing an error message
function drawError() {
    var container = document.getElementById('output');
    container.innerHTML = 'You cannot play!';
    setTimeout($.unblockUI, 2000);
}

// handles the response, adds the html
function drawOutput(responseText) {
    $('#output').html(responseText);
    setTimeout($.unblockUI, 2000);
}

// helper function for cross-browser request object
function getRequest(url, success, error) {
    var req = false;

    if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        req = new XDomainRequest();
    }
    else {
        try {
            // most browsers
            req = new XMLHttpRequest();

        } catch (e) {
            // IE
            try {
                req = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                // try an older version
                try {
                    req = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    try {
                        // IE.8 does not support XHR CORS natively
                        req = new XDomainRequest();
                    } catch (e) {
                        return false;
                    }
                }
            }
        }
    }

    if (!req) return false;

    if (typeof success != 'function') success = function () {
        alert("success");
    };

    if (typeof error != 'function') error = function () {
        alert("error");
    };

//    req.onreadystatechange = function () {
//        if (req.readyState == 4) {
//            return req.status === 200 ?
//                success(req.responseText) : error(req.status);
//        }
//    }

    // Response handlers.
    req.onload = function () {
        //do what you want with the response. Remember to use xhr.responseText for ie8 compatibility, because it doesn't have .responseXML
        if (req.responseXML) {
            xml = this.responseXML;
        } else if (req.responseText) {
//            alert("success for xhr");
            success(req.responseText);
        }
    }

    req.onerror = function () {
        //do what you want on error
//        alert("error for xhr");
        error(req.status);
    }

    req.open("GET", url, false);
    req.send(null);
    return req;
}


/*
 The code below has been put in comments
 because it was part of the test
 */

//function xdr(url, method, data, callback, errback) {
//    var req;
//
//    if (XMLHttpRequest) {
//        req = new XMLHttpRequest();

//        if ('withCredentials' in req) {
//            req.open(method, url, true);
//            req.onerror = errback;
//            req.onreadystatechange = function () {
//                if (req.readyState === 4) {
//                    if (req.status >= 200 && req.status < 400) {
//                        callback(req.responseText);
//                    } else {
//                        errback(new Error('Response returned with non-OK status'));
//                    }
//                }
//            };
//            req.send(data);
//        }
//    } else if (XDomainRequest) {
//        req = new XDomainRequest();
//        req.open(method, url);
//        req.onerror = errback;
//        req.onload = function () {
//            callback(req.responseText);
//        };
//        req.send(data);
//    } else {
//        errback(new Error('CORS not supported'));
//    }
//}


//function doRequest(url, success, error) {
//
//    // Create the XHR object.
//    var xhr = new XMLHttpRequest();
//
//    if ("withCredentials" in xhr) {
//        // XHR for Chrome/Firefox/Opera/Safari.
//        xhr.open('get', url, true);
//    } else if (typeof XDomainRequest != "undefined") {
//        // XDomainRequest for IE.
//        xhr = new XDomainRequest();
//        xhr.open('get', url);
//    } else {
//        // CORS not supported.
//        xhr = null;
//    }
//
//    if (!xhr) {
//        return;
//    }
//
//    // Response handlers.
//    xhr.onload = function () {
//        console.log(xhr);
//        //do what you want with the response. Remember to use xhr.responseText for ie8 compatibility, because it doesn't have .responseXML
//        if (xhr.responseXML) {
//            xml = this.responseXML;
//        } else if (xhr.responseText) {
//            //xml = new ActiveXObject('Microsoft.XMLDOM');
//            //xml.loadXML(xhr.responseText);
//            alert("success for xhr");
//            success(xhr.responseText);
//        }
//    }
//
//    xhr.onerror = function () {
//        //do what you want on error
//        alert("error for xhr");
//        error(xhr.status);
//    }
//
//    //these blank handlers need to be set to fix ie9 http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
//    xhr.onprogress = function () {
//    }
//    xhr.ontimeout = function () {
//    }
//
//    xhr.onreadystatechange = function () {
//        if (xhr.readyState == 4) {
//            return xhr.status === 200 ?
//                success(xhr.responseText) : error(xhr.status);
//        }
//    }
//
//    //do it, wrapped in timeout to fix ie9
//    setTimeout(function () {
//        xhr.send();
//    }, 0)
//
//}

//function getSuccessOutput() {
//    $.ajax({
//        url: 'http://10.139.55.214/badHuman/php/sample.php',
//        cache: false,
//        complete: function (response) {
//            $('#output').html(response.responseText);
//        },
//        error: function () {
//            $('#output').html('Bummer: there was an error!');
//        }
//    });
//    return false;
//}

//function replaceScriptsRecurse(node) {
//    if (nodeScriptIs(node)) {
//        var script = document.createElement("script");
////        script.text = node.innerHTML;
//        script.text = node.src;
//
//        node.parentNode.replaceChild(script, node);
//    }
//    else {
//        var i = 0;
//        var children = node.childNodes;
//        while (i < children.length) {
//            replaceScriptsRecurse(children[i]);
//            i++;
//        }
//    }
//
//    return node;
//}
//function nodeScriptIs(node) {
//    return node.getAttribute && node.getAttribute("type") == "text/javascript";
//}
//
//function stripAndExecuteScript(text) {
//    var scripts = '';
//    var cleaned = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function () {
//        scripts += arguments[1] + '\n';
//        return '';
//    });
//
//    if (window.execScript) {
//        window.execScript(scripts);
//    } else {
//        var head = document.getElementsByTagName('head')[0];
//        var scriptElement = document.createElement('script');
//        scriptElement.setAttribute('type', 'text/javascript');
//        scriptElement.innerText = scripts;
//        head.appendChild(scriptElement);
//        head.removeChild(scriptElement);
//    }
//    return cleaned;
//}
//
//function insertHtml(id, html) {
//    var ele = document.getElementById(id);
//    ele.innerHTML = html;
//    var codes = ele.getElementsByTagName("script");
//    for (var i = 0; i < codes.length; i++) {
//        eval(codes[i].text);
//    }
//}

//function dolistener() {
//    if (AYAH.isIframeCommSupported()) {
//        // Defines which events to listen for
//        // and which functions to call when those events occur
//        AYAH.addGameStartHandler(handleEvent);
//        AYAH.addGameCompleteHandler(handleEvent);
//    } else {
//        // Defines what happens if postMessage() is not supported
//        alert("iframe communication is not supported!");
//    }
//}

//    $("#fancy").fancybox({
//        'scrolling': 'no',
//        'margin': 0,
//        'padding': 0,
//        'titleShow': false,
//        'opacity': true,
//        'width': '600px',
//        'modal': true,
//        'height': '700px',
//        'transitionIn': 'fade',
//        'transitionOut': 'fade',
////        'showCloseButton': true,
////        'autoDimensions': true,
////        'autoScale': true,
//        'autosize': false,
////        'type': 'inline',
//        'onClosed': function () {
//            $("#login_error").hide();
//        }
//    });
