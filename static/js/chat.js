/**
 * Created by yang on 16-8-30.
 */
function caluWarpHeight() {
    $("#warp").height($(window).height()-$("header").outerHeight());
}
function caluDFHeight() {
    $("#dialogs-friends").height($("#persons").height()-$("#persons-search").outerHeight()-$("#persons-tab").outerHeight());
}
function caluChatHeight($room) {
    var $messagesDiv=$room.children("#room-messages");
    $messagesDiv.height($room.height()-$messagesDiv.prev().outerHeight()-$messagesDiv.next().outerHeight());
}
function initHeight() {
    caluWarpHeight();
    caluDFHeight();
    caluChatHeight($("#room"));
}
function initScroll($content,$container,$scroll,TOB) {
    if($content.length && $container.length && $scroll.length){
        if($content.height()>$container.height()) {
            var containerHeight = $container.height(),
                contentHeight=$content.height(),
                scrollHeight;
            $scroll.height(containerHeight * containerHeight / contentHeight);
            scrollHeight=$scroll.height();
            $container.unbind("hover").hover(function () {
                $scroll.fadeIn(200);
                var doWheelScroll = function (event) {
                    var perDistance,
                        delta = event.wheelDelta ? event.wheelDelta : event.detail;
                    perDistance = delta > 0 ? 75 : -75;
                    if (TOB === "bottom") {
                        perDistance *= -1;
                    }
                    var newScrollCoord = parseInt($scroll.css(TOB)) + perDistance,
                        maxScrollCoord = containerHeight - $scroll.height(),
                        newContentCoord = parseInt($content.css(TOB)) - perDistance * (contentHeight - containerHeight) / (containerHeight - scrollHeight);
                    if (newScrollCoord < 0) {
                        newScrollCoord = 0;
                        newContentCoord = 0;
                    } else if (newScrollCoord > maxScrollCoord) {
                        newScrollCoord = maxScrollCoord;
                        newContentCoord = -(contentHeight - containerHeight);
                    }
                    if (!$scroll.is(":animated")) {
                        if (TOB === "top") {
                            $scroll.animate({
                                top: newScrollCoord,
                            }, 75, "swing");
                            $content.animate({
                                top: newContentCoord,
                            }, 75, "swing");
                        } else if (TOB === "bottom") {
                            $scroll.animate({
                                bottom: newScrollCoord,
                            }, 75, "swing");
                            $content.animate({
                                bottom: newContentCoord,
                            }, 75, "swing");
                        }
                    }
                    ;
                    return false;
                };
                $container.unbind("DOMMouseScroll mousewheel").bind("DOMMouseScroll mousewheel", doWheelScroll);
                $scroll.mousedown(function (event) {
                    var startY = event.pageY,
                        startScrollCrood = parseInt($scroll.css(TOB));
                    $("html,body").mousemove(function (event) {
                        var newScrollCrood,
                            maxScrollCrood = containerHeight - $scroll.height();
                        if (TOB === "top") {
                            newScrollCrood = startScrollCrood + event.pageY - startY;
                        } else {
                            newScrollCrood = startScrollCrood - (event.pageY - startY);
                        }
                        if (newScrollCrood < 0) {
                            newScrollCrood = 0;
                        } else if (newScrollCrood > maxScrollCrood) {
                            newScrollCrood = maxScrollCrood;
                        }
                        var newContentScroll = newScrollCrood * (containerHeight - contentHeight) / maxScrollCrood;
                        $scroll.css(TOB, newScrollCrood);
                        $content.css(TOB, newContentScroll);
                    });
                    $("html,body").mouseup(function () {
                        $("html,body").unbind("mousemove");
                    });
                });
            },function (event) {
                $scroll.fadeOut(200);
            });
        }else{
            $container.unbind("hover");
        }
    }
}

function switchTab(event) {
    var $tab=$(event.target).parent();
    if(!$tab.hasClass("current") && !$("#dialogs-friends-container").is(":animated")){
        $tab.addClass("current");
        if($tab.attr('name')==='friends'){
            $tab.prev().removeClass("current");
            $("#dialogs-friends-container").animate({
                left:parseInt($("#dialogs-friends-container").css("left"))-$("#dialogs").width()
            },200,"linear");
        }else{
            $tab.next().removeClass("current");
            $("#dialogs-friends-container").animate({
                left:parseInt($("#dialogs-friends-container").css("left"))+$("#friends").width()
            },200,"linear");
        }
    }
}

function createDialogHtml(dialog,aimUsername) {
    var res="",
        who,
        message,
        messages=dialog["messages"];
    for(var i=0;i<messages.length;i++){
        who=messages[i]["name"]===aimUsername?'aim':'me';
        message="<div class='dialog-";
        message+=who;
        message+="' data-time='";
        message+=messages[i]["time"];
        message+="'><div class='";
        message+=who;
        message+="-head'><img src='";
        message+=messages[i]["head"];
        message+="'></div><div class='";
        message+=who;
        message+="-message'><div class='";
        message+=who;
        message+="-message-box'><div class='";
        message+=who;
        message+="-message-content'><p class='content'>";
        message+=messages[i]["content"];
        message+="</p></div><div class='arrow-border'></div><div class='arrow'></div></div><div style='clear: both'></div></div></div>";
        res=message+res;
    }
    res="<div class='room-dialog'><time class='dialog-time'>"+dialog['time']+"</time>"+res;
    return res;
}

function transLeftDialigTime(time) {
    var matches=/(\d{4})\-(\d{2})\-(\d{2})\s+(\d{2})\:(\d{2})\:(\d{2})/gi.exec(time);
    var now=new Date(),
        theTime=new Date(matches[1],parseInt(matches[2])-1,matches[3],matches[4],matches[5],matches[6]);
    var sameDay=function (x,y) {
        return x.getFullYear()===y.getFullYear() && x.getMonth()===y.getMonth() && x.getDate()===y.getDate();
    }
    return sameDay(now,theTime)? theTime.getHours()+':'+theTime.getMinutes():theTime.getMonth()+1+'-'+theTime.getDate();
}

function chooseDialog(event) {
    var $theDialog=$(event.target).closest("li"),
        aimUsername=$theDialog.find("span.dialog-name").text();
    if(!$theDialog.hasClass("now")) {
        $.ajax({
            url: '/webchat/choose-chat/',
            type: 'POST',
            data: {
                username: aimUsername,
            },
            success: function (data, textStatus) {
                var jsonObj=eval("("+data+")");
                if (jsonObj['res']==='success'){
                    $("#room-name").text(aimUsername);
                    $("#room").show();
                    var dialogs=jsonObj['dialogs'],
                        dialogsHtml="";
                    for(var i=0;i<dialogs.length;i++){
                        dialogsHtml=createDialogHtml(dialogs[i],aimUsername)+dialogsHtml;
                    }
                    $("#room-content").html(dialogsHtml);
                    $("#chat-send textarea").focus();
                    initScroll($("#room-content"),$("#room-messages"),$("div.chat-scroll"),"bottom");

                    var $lastMessage=$("#room-content .room-dialog:last>div");
                    $theDialog.find("span.dialog-time").text(transLeftDialigTime($lastMessage.attr("data-time")));
                    $theDialog.find("span.dialog-content").text($lastMessage.find("p.content").text());
                }
            },
        });
        $theDialog.find("span.dialog-count").text('0').hide();
        $theDialog.addClass("now").siblings(".now").removeClass("now");
    }
}

function chooseFriend(event) {
    var $aimLi=$(event.target).closest("li");
    var aimUsername=$aimLi.find("div.friend-name").text().trim();
    var $dialogLi=$("#dialogs li").filter(function (index) {
        return $(this).find("span.dialog-name").text().trim()===aimUsername;
    });
    if($dialogLi.length){
        $dialogLi.detach().prependTo("#dialogs").click();
    }else{
        var dialog="<li><div class='dialog-img'><img src='";
        dialog+=$aimLi.find("div.friend-img img").attr("src");
        dialog+="'></div><div class='dialog-info'><div class='dialog-head'><span class='dialog-name'>";
        dialog+=aimUsername;
        dialog+="</span><span class='dialog-time'></span></div><div class='dialog-message'><span class='dialog-content'></span><span class='dialog-count'>0</span></div></div></li>";
        $(dialog).prependTo("#dialogs").click();
        $(dialog).find("span.dialog-count").hide();
    }
    $("span.dialogs-tab a").click();
    $("#dialogs").css("top",0);
    $("#friends").css("top",0);
    initScroll($("#dialogs"),$("#dialogs-container"),$("#dialogs-scroll"),"top");
}
$(document).ready(function () {
    initHeight();
    initScroll($("#dialogs"),$("#dialogs-container"),$("#dialogs-scroll"),"top");
    initScroll($("#friends"),$("#friends-container"),$("#friends-scroll"),"top");
    $("#persons-tab").click(switchTab);
    $(window).resize(function () {
        initHeight();
        $("#dialogs").css("top",0);
        $("#friends").css("top",0);
        $("#dialogs-scroll").css("top",0);
        $("#friends-scroll").css("top",0);
        $("div.room-content").css("bottom",0);
        $("div.chat-scroll").css("bottom",0);
        initScroll($("#dialogs"),$("#dialogs-container"),$("#dialogs-scroll"),"top");
        initScroll($("#friends"),$("#friends-container"),$("#friends-scroll"),"top");
        initScroll($("#room-content"),$("#room-messages"),$("div.chat-scroll"),"bottom");
    });
    //initScroll($("div.room-content"),$("div.room-messages"),$("div.chat-scroll"),"bottom");
    $("#dialogs-container").click(chooseDialog);
    $("#friends-container").click(chooseFriend);
});