/**
 * Created by yang on 16-8-24.
 */

function createShade(){
    $("body").append("<div id='shade'></div>");
    $("#header,#warp,#footer,header,footer").css('filter','blur(1px)');
}

function removeShade() {
    $("#shade").remove();
    $("#header,#warp,#footer,header,footer").css('filter','');
}

function closeRegister() {
    var $registerDiv=$("div.register-container");
    $registerDiv.addClass("register-close-anmi")
    setTimeout(function(){
        removeShade();
        $registerDiv.remove();
    },200);
}

function showRegister() {
    var closeIcons='/static/image/register/close_s.png',
        closeIconh='/static/image/register/close_h.png';

    createShade();
    var registerDiv="<div class='register-container'>" +
        "<span id='register-close'><img src='"+closeIconh+"'></span>" +
        "<div class='register-title'>注册</div><form id='register-form'><input type='text' name='username' placeholder='用户昵称'>" +
        "<input type='password' name='password' placeholder='用户密码'><input type='password' name='passwordR' placeholder='重复密码'>" +
        "<input type='email' name='email' placeholder='注册邮箱'><span id='do-register'>提 交</span></form></div>"
    $("body").append(registerDiv);
    $("div.register-container").show().addClass("register-open-anmi");
    $("#register-close").click(closeRegister);
}

$(document).ready(function () {
    $("#register-a").click(showRegister);
});
