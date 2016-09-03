/**
 * Created by yang on 16-8-30.
 */
function caluWarpHeight() {
    $("#warp").height($(window).height()-$("header").outerHeight());
}
function caluDFHeight() {
    $("#dialogs-friends").height($("#persons").height()-$("#persons-search").outerHeight()-$("#persons-tab").outerHeight());
}
function initHeight() {
    caluWarpHeight();
    caluDFHeight();
}
function initPersonsScroll($content,$container,$scroll,start) {
    if (!start){
        start=0;
    }
    if($content&&$container&&$scroll){
        if($content.height()>$container.height()) {
            var containerHeight = $container.height(),
                contentHeight=$content.height(),
                scrollHeight;
            $scroll.height(containerHeight * containerHeight / contentHeight);
            scrollHeight=$scroll.height();
            $content.hover(function () {
                $scroll.fadeIn(200);
                var doWheelScroll = function (event) {
                    var perDistance,
                        delta = event.wheelDelta ? event.wheelDelta : event.detail;
                    perDistance=delta>0?50:-50;
                    var newScrollTop = parseInt($scroll.css('top')) + perDistance,
                        maxScrollTop = containerHeight - $scroll.height(),
                        newContentTop=parseInt($content.css('top'))-perDistance*(contentHeight-containerHeight)/(containerHeight-scrollHeight);
                    if (newScrollTop < 0) {
                        newScrollTop = 0;
                        newContentTop=0;
                    } else if (newScrollTop > maxScrollTop) {
                        newScrollTop = maxScrollTop;
                        newContentTop=-(contentHeight-containerHeight);
                    }
                    if (!$scroll.is(":animated")) {
                        $scroll.animate({
                            top: newScrollTop,
                        }, 75,"linear");
                       $content.animate({
                            top:newContentTop,
                        },75,"linear");
                    }
                };
                MyEventUtil.addHandler($content.get(0), "mousewheel", doWheelScroll);
                MyEventUtil.addHandler($content.get(0), "DOMMouseScroll", doWheelScroll); //针对火狐
            }, function () {
                $scroll.fadeOut(200);

            });
        }
    }
}
function switchTab(event) {
    var $tab=$(event.target).parent();
    if(!$tab.hasClass("current")){
        $tab.addClass("current");
        if($tab.attr('name')=='friends'){
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

$(document).ready(function () {
    initHeight();
    $(window).resize(caluWarpHeight);
    initPersonsScroll($("#dialogs"),$("#dialogs-friends"),$("#dialogs-scroll"),0);
    initPersonsScroll($("#friends"),$("#dialogs-friends"),$("#friends-scroll"),0);
    $("#persons-tab").click(switchTab);
});