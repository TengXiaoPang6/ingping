define(["jquery"],function($){
	$(window).load(function(){
		$(".aside .suggest").hover(function(){
			$(".suggest img").attr("src","../img/suggest_hover.png")
		},function(){
			$(".suggest img").attr("src","../img/suggest.png")
		})
		$(".kefu").hover(function(){
			$(this).find(".phone_number").css("display","block").animate({opacity:1,left:-231},300)
		},function(){
			$(this).find(".phone_number").animate({left:0,opacity:0},300,function(){
				$(this).css("display","none")
			})
		})
		$(".user_info").hover(function(){
			$(this).find(".info").css("display","block").animate({opacity:1,left:-265},300)
		},function(){
			$(this).find(".info").animate({left:0,opacity:0},300,function(){
				$(this).css("display","none")
			})
		})
		$(".to_top .ma").hover(function(){
			$(this).find(".img").fadeIn(200);
		},function(){
			$(this).find(".img").fadeOut(200);
		})
		//柯里化判断是否火狐和IE浏览器
		var scrolltop=(function(){
			if(navigator.userAgent.indexOf("Firefox")>-1 || navigator.userAgent.indexOf("Trident")>-1){
				return function(){
					if(document.documentElement.scrollTop>0){
						$(".to_top .top").fadeIn(500);
					}else{
						$(".to_top .top").fadeOut(200);
					}
				}
			}else{
				return function(){
					if($("body").scrollTop()>0){
						$(".to_top .top").slideDown(500);
					}else{
						$(".to_top .top").slideUp(500);
					}
				}
			}
		})()
		scrolltop();
		$(window).on("scroll",function(){
			scrolltop();
		})
		$(".to_top .top").on("click",function(){
			$("body").animate({scrollTop:0})
		})
	})
})