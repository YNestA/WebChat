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
    var registerDiv="<div class='register-container'><span id='register-close'><img src='";
    registerDiv+=closeIconh;
    registerDiv+="'></span><div class='register-title'>注册</div><form id='register-form'><input type='text' name='username' placeholder='用户昵称'><input type='password' name='password' placeholder='用户密码' ><input type='password' name='passwordR' placeholder='重复密码'><input type='email' name='email' placeholder='注册邮箱'><span id='do-register'>提 交</span></form></div>"

    $("body").append(registerDiv);
    $("div.register-container").show().addClass("register-open-anmi");
    $("#register-close").click(closeRegister);

    var doRegister=function () {
        var $registerForm=$("#register-form"),
             $inputs=$("#register-form input");
        var checkInput={
            username:function ($theInput) {
                if($theInput.val().length>14){
                    $theInput.myTip({message:'用户昵称长度不可超过14',direction:"right"});
                }else if(!/^[^\s]*$/g.test($theInput.val())){
                    $theInput.myTip({message:'用户名不可包含空白字符',direction:"right"});
                }
            },
            password:function ($theInput) {
                if($theInput.val().length<6 ||$theInput.val().lenght>30){
                    $theInput.myTip({message:'密码长度必须在6-30之间',direction:"right"});
                }
            },
            passwordR:function ($theInput) {
                if($theInput.val()!=$("#register-form input[name='password']").val()){
                    $theInput.myTip({message:"两次密码输入不一致",direction:"right"});
                }
            },
            email:function ($theInput) {
                if (!/^([0-9a-zA-Z\_\-])+@([0-9a-zA-Z\_\-])+(\.[0-9a-zA-Z\_\-])+/g.test($theInput.val())){
                    $theInput.myTip({message:"邮箱格式有误",direction:"right"});
                }
            }
        }
        for(var i=0;i<$inputs.length;i++){
            console.log(i);
            var $theInput=$inputs.eq(i);
            if(!$theInput.val()){
                $theInput.myTip({message:"此项不能为空",direction:"right"});
            }else{
                checkInput[$theInput.attr('name')]($theInput);
            }
        }

    };
    $("#do-register").click(doRegister);
}

$(document).ready(function () {
    $("#register-a").click(showRegister);
    $("#login-form").submit(function () {
        if(!($("#login-form :input[name='username']").val()&& $("#login-form :input[name='password']").val())){
            $("#login-form .error-message").text("用户名或密码不能为空").show();
            return false;
        }
    });
});
