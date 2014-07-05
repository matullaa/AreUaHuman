$(document).ready(function () {

    $.blockUI({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        },
        message: '<H3>Wait human,page is loading....</H3>',
    });

    getOutput();

    // process the form
    $('form').submit(function (event) {
        console.log("submit form");
        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'name': $('input[name=name]').val(),
            'session_secret': $('input[name=session_secret]').val()
        };

        // process the form
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: 'php/sample.php', // the url where we want to POST
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
    });

});

function getSuccessOutput() {
    $.ajax({
        url: 'php/sample.php',
        cache: false,
        complete: function (response) {
            $('#output').html(response.responseText);
        },
        error: function () {
            $('#output').html('Bummer: there was an error!');
        }
    });
    return false;
}

function getOutput() {
    getRequest(
        'php/sample.php', // URL for the PHP file
        drawOutput,  // handle successful request
        drawError    // handle error
    );
    return false;
}
// handles drawing an error message
function drawError() {
    var container = document.getElementById('output');
    container.innerHTML = 'Bummer: there was an error!';
}
// handles the response, adds the html
function drawOutput(responseText) {
    $('#output').html(responseText);
    setTimeout($.unblockUI, 2000);

}

// Declares the function to handle the events
function handleEvent(e) {
    // Defines what happens when an event occurs
    alert(e.type)
}

// helper function for cross-browser request object
function getRequest(url, success, error) {
    var req = false;
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
                return false;
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
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            return req.status === 200 ?
                success(req.responseText) : error(req.status);
        }
    }
    req.open("GET", url, true);
    req.send(null);
    return req;
}


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

function dolistener() {
    if (AYAH.isIframeCommSupported()) {
        // Defines which events to listen for
        // and which functions to call when those events occur
        AYAH.addGameStartHandler(handleEvent);
        AYAH.addGameCompleteHandler(handleEvent);
    } else {
        // Defines what happens if postMessage() is not supported
        alert("iframe communication is not supported!");
    }
}

