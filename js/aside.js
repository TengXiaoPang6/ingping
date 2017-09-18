define(["jquery"],function($){
	$(window).load(function(){
		$(".aside .suggest").hover(function(){
			$(".suggest img").attr("src","../img/suggest_hover.png")
		},function(){
			$(".suggest img").attr("src","../img/suggest.png")
		})
		$(".aside li").hover(function(){
			$(this).find(".s").animate({left:-94,opacity:1})
		},function(){
			$(this).find(".s").animate({left:0,opacity:0})
		})
	})
})