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
    var $messagesDiv=$("#room-messages");
    $messagesDiv.height($room.height()-$messagesDiv.prev().outerHeight()-$messagesDiv.next().outerHeight());
}
function initHeight() {
    caluWarpHeight();
    caluDFHeight();
    caluChatHeight($("#room"));
}

function getMoreRecord(aimUsername,$messages) {
    $messages.data("isGeting","true");
    $.ajax({
        url:'/webchat/get-more-records/',
        type:'POST',
        data:{
            username:aimUsername,
            time:$messages.find(".room-dialog:first>div:first").attr('data-time'),
        },
        success:function (data,textStatus) {
            var jsonObj=eval("("+data+")");
            if(jsonObj['res']==='success'){
                var dialogs=jsonObj['dialogs'],
                    dialogsHtml="";
                $("#chat-loading").remove();
                if(dialogs.length) {
                    for (var i = 0; i < dialogs.length; i++) {
                        dialogsHtml = createDialogHtml(dialogs[i], aimUsername) + dialogsHtml;
                    }
                    $messages.prepend($(dialogsHtml));
                    initScroll($("#room-content"), $("#room-messages"), $("div.chat-scroll"), 'bottom',true);
                }else{
                    $messages.data("noOlder","true");
                }
            }
            $messages.data("isGeting","false");
        },
        beforeSend:function (XMLHttpRequest) {
            var $loading=$("<div id='chat-loading'><img src='/static/image/chat/chat_loading.gif'></div>");
            $messages.prepend($loading);
        },
        complete:function (XMLHttpRequest,textStatus) {
        },
    });
}

function initScroll($content,$container,$scroll,TOB,scrollNotMove) {
    if($content.length && $container.length && $scroll.length){
        if(!scrollNotMove) {
            $content.css(TOB, 0);
            $scroll.css(TOB, 0);
        }
        if($content.height()>$container.height()) {
            var containerHeight = $container.height(), //容器高度
                contentHeight=$content.height(),        //内容高度
                scrollHeight=containerHeight * containerHeight / contentHeight; //滚动条高度
            $scroll.animate({'height':scrollHeight},500);
            $container.unbind("mouseenter mouseleave mouseover mouseout").hover(function () {
                $scroll.fadeIn(200);
            },function (event) {
                $scroll.fadeOut(200);
            });
            var doWheelScroll = function (event) {
                    var delta = event.wheelDelta ? event.wheelDelta : event.detail*40,
                        perDistance = delta > 0 ? 50 : -50,
                        speed=150;
                    if (TOB === "bottom") {
                        perDistance *= -1;
                    }
                    var newScrollCoord = parseInt($scroll.css(TOB)) + perDistance,
                        maxScrollCoord = containerHeight - scrollHeight,
                        newContentCoord = parseInt($content.css(TOB)) - perDistance * (contentHeight - containerHeight) / (containerHeight - scrollHeight);
                    if (newScrollCoord < 0) {
                        newScrollCoord = 0;
                        newContentCoord = 0;
                    } else if (newScrollCoord > maxScrollCoord) {
                        if(parseInt($scroll.css(TOB))===parseInt(maxScrollCoord)&&$container.attr("id")==="room-messages"){
                            if($content.data("isGeting")!=="true" && $content.data("noOlder")!=="true") {
                                getMoreRecord($container.prev().find("#room-name").text(), $content);
                            }
                            return;
                        }
                        newScrollCoord = maxScrollCoord;
                        newContentCoord = -(contentHeight - containerHeight);
                    }
                    if (!$scroll.is(":animated")) {
                        if (TOB === "top") {
                            $scroll.animate({
                                top: newScrollCoord,
                            }, speed);
                            $content.animate({
                                top: newContentCoord,
                            }, speed);
                        } else if (TOB === "bottom") {
                            $scroll.animate({
                                bottom: newScrollCoord,
                            }, speed);
                            $content.animate({
                                bottom: newContentCoord,
                            }, speed);
                        }
                    }
                    ;
                    return false;
                };
                $container.unbind("DOMMouseScroll mousewheel").bind("mousewheel DOMMouseScroll", doWheelScroll);
                $scroll.unbind("mousedown").mousedown(function (event) {
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

        }else{
            $container.unbind("mouseleave mouseenter mouseover mouseout DOMMouseScroll mousewheel");
            $scroll.unbind().hide();
        }
    }
}

function switchTab(event) {
    var $tab=$(event.target).closest("span");
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

function createMessage(messageInfo,who) {
    var message="<div class='dialog-";
    message+=who;
    message+="' data-time='";
    message+=messageInfo["time"];
    message+="'><div class='";
    message+=who;
    message+="-head'><img src='";
    message+=messageInfo["head"];
    message+="'></div><div class='";
    message+=who;
    message+="-message'><div class='";
    message+=who;
    message+="-message-box'><div class='";
    message+=who;
    message+="-message-content'><p class='content'>";
    message+=messageInfo["content"];
    message+="</p></div><div class='arrow-border'></div><div class='arrow'></div></div><div style='clear: both'></div></div></div>";
    return message;
}

function createDialogHtml(dialog,aimUsername) {
    var res="",
        who,
        message,
        messages=dialog["messages"];
    for(var i=0;i<messages.length;i++){
        who=messages[i]["name"]===aimUsername?'aim':'me';
        res=createMessage(messages[i],who)+res;
    }
    res="<div class='room-dialog'><time class='dialog-time'>"+dialog['time']+"</time>"+res+'</div>';
    return res;
}

function transTimeTojsDate(time) {
    var matches=/(\d{4})\-(\d{2})\-(\d{2})\s+(\d{2})\:(\d{2})\:(\d{2})/gi.exec(time);
    return new Date(matches[1],parseInt(matches[2])-1,matches[3],matches[4],matches[5],matches[6]);
}

function transLeftDialigTime(time) {
    var now=new Date(),
        theTime=transTimeTojsDate(time);
    var sameDay=function (x,y) {
        return x.getFullYear()===y.getFullYear() && x.getMonth()===y.getMonth() && x.getDate()===y.getDate();
    }
    var minute=(function () {
        var x=theTime.getMinutes();
        if (x<10){
            x='0'+x;
        }
        return x;
    })();
    return sameDay(now,theTime)? theTime.getHours()+':'+minute:theTime.getMonth()+1+'-'+theTime.getDate();
}

/*
function addMessage($newMessage,time) {

}
*/

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
                    $("#chat-send textarea").val("");
                    $("#room").show();
                    caluChatHeight($("#room"));
                    var dialogs=jsonObj['dialogs'],
                        dialogsHtml="";
                    for(var i=0;i<dialogs.length;i++){
                        dialogsHtml=createDialogHtml(dialogs[i],aimUsername)+dialogsHtml;
                    }
                    $("#room-content").data("noOlder","false").html(dialogsHtml);
                    $("#chat-send textarea").focus();
                    initScroll($("#room-content"),$("#room-messages"),$("div.chat-scroll"),"bottom");

                    var updateLeft=function () {
                        var $lastMessage=$("#room-content .room-dialog:last>div:last");
                        $theDialog.find("span.dialog-time").text(transLeftDialigTime($lastMessage.attr("data-time")));
                        $theDialog.find("span.dialog-content").text($lastMessage.find("p.content").text());
                    }

                    $("#chat-send textarea").unbind('keydown').keydown(function (event) {
                        if(event.ctrlKey && event.keyCode==13){
                            $(this).val($(this).val()+'\n');
                        }else if(event.keyCode==13){
                            event.preventDefault();
                            var $that=$(this);
                            $.ajax({
                                url:'/webchat/send-utu-message/',
                                type:'POST',
                                data:{
                                    username:aimUsername,
                                    message:$that.val(),
                                },
                                success:function (data,textStatus) {
                                    var jsonObj=eval('('+data+')');
                                    if(jsonObj['res']==='success'){
                                        var who=jsonObj["name"]===aimUsername?'aim':'me',
                                            newMessageHtml=createMessage(jsonObj,who),
                                            $lastMessage=$("#room-content .room-dialog:last>div:last");
                                        if(transTimeTojsDate(jsonObj['time']).getTime()/1000-transTimeTojsDate($lastMessage.attr('data-time')).getTime()/1000<300){
                                            $lastMessage.after($(newMessageHtml));
                                        }else{
                                            newMessageHtml="<div class='room-dialog'><time class='dialog-time'>"+transLeftDialigTime(jsonObj["time"])+"</time>"+newMessageHtml+'</div>';
                                            $("#room-content").append($(newMessageHtml));
                                        }
                                        updateLeft();
                                        initScroll($("#room-content"),$("#room-messages"),$("div.chat-scroll"),"bottom");
                                    }
                                }
                            });
                            $(this).val('');
                        }
                    });
                    updateLeft();

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
function polling() {
    var username=$("#header-user li.header-username span").text().trim();
    $.ajax({
        url: "/webchat/polling/",
        type:'POST',
        data:{
            username:username,
        },
        success:function (data,textStatus) {
            console.log(data);
            var jsonObj=eval('('+data+')');
            if(jsonObj['res']==='success'){
                var records=jsonObj['records'];
                for(var i=records.length-1;i>=0;i--){
                    var messages=records[i],
                        $theDialog;
                    $theDialog=$("#dialogs li").filter(function () {
                        return $(this).find("span.dialog-name").text()===messages[0]? true:false;
                    });
                    if($theDialog.length) {
                        $theDialog.find("span.dialog-time").text(transLeftDialigTime(messages[1][0]['time']));
                        $theDialog.find("span.dialog-content").text(messages[1][0]['content']);
                        $theDialog.detach().prependTo($("#dialogs"));
                        if (messages[0] === $("#room-name").text()) {
                            for (var i = messages[1].length - 1; i >= 0; i--) {
                                var newMessageHtml = createMessage(messages[1][i], "aim"),
                                    $lastMessage = $("#room-content .room-dialog:last>div:last");
                                if (transTimeTojsDate(messages[1][i]['time']).getTime() / 1000 - transTimeTojsDate($lastMessage.attr('data-time')).getTime() / 1000 < 300) {
                                    $lastMessage.after($(newMessageHtml));
                                } else {
                                    newMessageHtml = "<div class='room-dialog'><time class='dialog-time'>" + transLeftDialigTime(jsonObj["time"]) + "</time>" + newMessageHtml + '</div>';
                                    $("#room-content").append($(newMessageHtml));
                                }
                            }
                            $.ajax({
                                url:"/webchat/check-someone-messages/",
                                type:"POST",
                                data:{
                                  username:messages[0],
                                },
                                success:function (data,textStatus) {

                                },
                            });//发送checked消息
                            initScroll($("#room-content"), $("#room-messages"), $("div.chat-scroll"), "bottom");
                        } else {
                            $theDialog.find("span.dialog-count").text(messages[1].length).show();
                        }
                    }else{
                        var dialog="<li><div class='dialog-img'><img src='";
                            dialog+=messages[1][0]["head"];
                            dialog+="'></div><div class='dialog-info'><div class='dialog-head'><span class='dialog-name'>";
                            dialog+=messages[0];
                            dialog+="</span><span class='dialog-time'>";
                            dialog+=transLeftDialigTime(messages[1][0]["time"]);
                            dialog+="</span></div><div class='dialog-message'><span class='dialog-content'>";
                            dialog+=messages[1][0]["content"];
                            dialog+="</span><span class='dialog-count'>"+messages[1].length+"</span></div></div></li>";
                        $(dialog).prependTo("#dialogs");
                    }
                initScroll($("#dialogs"),$("#dialogs-container"),$("#dialogs-scroll"),"top");
                }
            }
        },
    });
}
function headerUserDrop(event) {
    event.stopPropagation();
    var $dropdownList=$("#header-dropdown-list");
    $dropdownList.show().click(function (event) {
        event.stopPropagation();
    });
    $("html,body").bind("click",hideDropDown=function () {
        $dropdownList.hide();
        $("html,body").unbind("click",hideDropDown);
    });
}
function signOut(event) {
    $.ajax({
        url:"/webchat/sign-out/",
        type:"POST",
        data:{
            
        },
        success:function (data,textStatus) {
            if(data==="success") {
                //location.replace(location.href);
                location.href="/webchat/"
            }
        }
    });
}
$(document).ready(function () {
    initHeight();
    initScroll($("#dialogs"),$("#dialogs-container"),$("#dialogs-scroll"),"top");
    initScroll($("#friends"),$("#friends-container"),$("#friends-scroll"),"top");
    $("#persons-tab").click(switchTab);
    $(window).resize(function () {
        initHeight();
        initScroll($("#dialogs"),$("#dialogs-container"),$("#dialogs-scroll"),"top");
        initScroll($("#friends"),$("#friends-container"),$("#friends-scroll"),"top");
        initScroll($("#room-content"),$("#room-messages"),$("div.chat-scroll"),"bottom");
    });
    $("#dialogs-container").click(chooseDialog);
    $("#friends-container").click(chooseFriend);
    var pollingID=setInterval(polling,1500);
    $("li.header-user-dropdown").click(headerUserDrop);
    $("#header-dropdown-list ul li.sign-out").click(signOut);
});