require(["config.min"],function(){
	require(['jquery','header'],function($){
		$(function(){
			//缩略图效果
			$(".magnifying .thumbnail ul").on("mouseenter","li",function(){
				$(this).addClass("active").siblings().removeClass("active");
				$(this).parents('.thumbnail').siblings(".big").find('li').eq($(this).index()).animate({opacity:1}).siblings().animate({opacity:0});
			})
			$(".magnifying .thumbnail .fl,.magnifying .thumbnail .fr").on("click",function(e){
				var i=$(this).siblings('ul').find('li[class=active]').index();
				var count=$(this).siblings('ul').find('li').length;
				if(e.target.className=="fl"){
					i=i==0?(count-1):--i;					
				}else{
					i=i==(count-1)?0:++i;
				}
				$(this).siblings('ul').find('li').eq(i).addClass("active").siblings().removeClass("active");
				$(this).parent().siblings(".big").find('li').eq(i).animate({opacity:1}).siblings().animate({opacity:0});
			})
			//放大镜效果
			var t=$(".magnifying .big").offset().top;
			var l=$(".magnifying .big").offset().left;
			var w=$(".magnifying .big").width();
			var h=$(".magnifying .big").height();
			var multiple=3;
			$(".magnifying .bg").css("width",w/multiple);
			$(".magnifying .bg").css("height",h/multiple);
			$(".magnifying .big").on("mousemove",function(e,m){
				let mouse={
					x:e.pageX||m.x,
					y:e.pageY||m.y
				}
				let bg={
					top:Math.min(h-$(".magnifying .bg").height()+1,Math.max(0,mouse.y-t-$(".magnifying .bg").height()/2)),
					left:Math.min(w-$(".magnifying .bg").width()+2,Math.max(0,mouse.x-l-$(".magnifying .bg").width()/2))
				}
				let index=$(".magnifying .small li[class='active']").index();
				let src=$(".magnifying .big img").eq(index).attr("src");
				$(".magnifying .bg").css("top",bg.top).css("left",bg.left).show(200);
				$(".magnifying .bigbig").css("background-image","url("+src+")")
					.css("background-size",multiple*w+"px "+multiple*h+"px")
					.css("background-position",-bg.left*multiple+"px "+-bg.top*multiple+"px")
					.show(200)
			})
			$(".magnifying .bg").on("mousewheel DOMMouseScroll",function(e){
				e.preventDefault();
				var dir=e.originalEvent.wheelDelta<0?1:0 || e.originalEvent.detail>0?1:0;
				if(dir){
					multiple=multiple>=4?4:(multiple+0.1);
					$(".magnifying .bg").css("width",w/multiple)
					$(".magnifying .bg").css("height",h/multiple)
					$(".magnifying .big").trigger("mousemove",{x:e.pageX,y:e.pageY});
				}else{
					multiple=multiple<=1?1:(multiple-0.1);
					$(".magnifying .bg").css("width",w/multiple)
					$(".magnifying .bg").css("height",h/multiple)
					$(".magnifying .big").trigger("mousemove",{x:e.pageX,y:e.pageY});
				}
			})
			$(".magnifying .big").on("mouseleave",function(){
				$(".magnifying .bg").hide(200);
				$(".magnifying .bigbig").hide(200);
			})
		})
	})
})