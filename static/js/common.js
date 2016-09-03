/**
 * Created by yang on 16-8-21.
 */
var MyEventUtil={

    addHandler: function(element,type,handler){
        if(element.addEventListener && type!="submit"){
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent){
            element.attachEvent("on"+type,handler);
        }else{
            element["on"+type]=handler;
        }
    },

    removeHandler: function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent("on"+type,handler);
        }else{
            element["on"+type]=null;
        }
    },

    getEvent: function(event){
        return event?event:windows.event;
    },

    getTarget:function(event){
        return event.target || event.srcElement;
    },

    preventDefault: function(event){
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
    stopPropagation: function(event){
        if(event.stopPropagation){
            event.stopPropagation;
        }else{
            event.cancelBubble=true;
        }
    },
    getButton: function(event){
        if(doucment.implementation.hasFeature("MouseEvents","2.0")){
            return event.button;//0 is left,1 is center,2 is right;
        }else{
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 4:
                    return 1;
                case 2:
                case 6:
                    return 2;
            }
        }
    },

    getCharCode: function(){
        if(typeof event.charCode=="number"){
            return event.charCode;
        }else{
            return event.keyCode;
        }
    },


};

function createXHR(){
    if (typeof XMLHttpRequest!="undefined"){
        return new XMLHttpRequest();
    }else if(typeof  ActiveXObject!="undefined"){
        if(typeof arguments.callee.activeXString!="string"){
            var versions=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],
                i,
                len;
            for(i=0,len=versions.length;i<len;i++){
                try{
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString=versions;
                    break;
                }catch (ex){
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString)
    }else{
        throw new Error("No XHR object available");
    }
}

function addURLParam(url,name,value){
    if(url.indexOf("?")==-1){
        url+="?";
    }else{
        url+="&"
    }
    url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
    return url;
}
$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
$(document).ready(function () {
   $("a").focus(function () {
       $(this).blur();
   })
});