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

function checkRegister(XMLHttpRequest) {
    var $registerForm=$("#register-form"),
        $inputs=$("#register-form input"),
        flag=true;
    var doErrorTip=function ($input,mess,dire) {
        flag=false;
        $input.myTip({
            message:mess,
            direction:dire,
        });
    }
    var checkInput={
        username:function ($theInput) {
            if($theInput.val().length>30){
                doErrorTip($theInput,'用户昵称长度不可超过30','right');
            }else if(!/^[0-9a-zA-Z\-\_\+]+$/g.test($theInput.val())){
                doErrorTip($theInput,'用户名只能包含字母，数字，-，_，+，','right');
            }
        },
        password:function ($theInput) {
            if($theInput.val().length<6 ||$theInput.val().lenght>30){
                doErrorTip($theInput,'密码长度必须在6-30之间','right');
            }
        },
        passwordR:function ($theInput) {
            if($theInput.val()!=$("#register-form input[name='password']").val()){
                doErrorTip($theInput,"两次密码输入不一致",'right');
            }
        },
        email:function ($theInput) {
            if (!/^([0-9a-zA-Z\_\-])+@([0-9a-zA-Z\_\-])+(\.[0-9a-zA-Z\_\-])+/g.test($theInput.val())){
                doErrorTip($theInput,"邮箱格式有误",'right');
            }
        }
    }
    for(var i=0;i<$inputs.length;i++){
        var $theInput=$inputs.eq(i);
        if(!$theInput.val()){
            doErrorTip($theInput,"此项不能为空",'right');
        }else{
            checkInput[$theInput.attr('name')]($theInput);
        }
    }
    return flag;
}

function showRegister() {
    var closeIcons='/static/image/register/close_s.png',
        closeIconh='/static/image/register/close_h.png';

    createShade();
    var registerDiv="<div class='register-container'><span id='register-close'><img src='";
    registerDiv+=closeIconh;
    registerDiv+="'></span><div class='register-title'>注册</div><form id='register-form'><input type='text' name='username' placeholder='用户昵称'><input type='password' name='password' placeholder='用户密码' ><input type='password' name='passwordR' placeholder='重复密码'><input type='email' name='email' placeholder='注册邮箱'><span id='do-register'>提 交</span></form></div>"

    $("body").append(registerDiv);
    $("div.register-container").show().addClass("register-open-anmi");
    $("#register-close").click(closeRegister);

    var doRegister=function () {
        var $registerForm=$("#register-form");
        $.ajax({
            url: '/webchat/register/',
            type:'POST',
            data:{
                username:$("#register-form input[name='username']").val(),
                password:$("#register-form input[name='password']").val(),
                passwordR:$("#register-form input[name='passwordR").val(),
                email:$("#register-form input[name='email']").val(),
            },
            beforeSend:checkRegister,
            success:function (data,status) {
                var theJson=eval('('+data+')');
                console.log(0);
                if(theJson['success']=='True'){
                    console.log(1);
                    $.myAlert("注册成功，3s后转至主页");
                    setTimeout(function () {
                        window.location.href=theJson['userURL'];
                    },3000);
                }else{
                    $("#register-form input[name='"+theJson['errorName']+"']").myTip({message:theJson['message'],direction:'right'});
                }
            },
        });
    }
    ;
    $("#do-register").click(doRegister);
}

$(document).ready(function () {
    $("#register-a").click(showRegister);
    $("#login-form").submit(function () {
        if(!($("#login-form :input[name='username']").val()&& $("#login-form :input[name='password']").val())){
            var $errorDiv=$("#login-form div.error-message");
            if($errorDiv.length){
                $errorDiv.text("用户名或密码不能为空");
            }else {
                $(this).prepend("<div class='error-message'>用户名或密码不能为空</div>");
            }
            return false;
        }
        location.replace(location.href);
        $("#login-form :submit").attr('disabled',true);
    });

});
