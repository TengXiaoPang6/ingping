require(["config.min"],function(){
	require(["jquery","header","footer","aside"],function($){
		$(function(){
			//左侧导航栏
			$(".left_nav").css("left",($(window).width()-1200)/2-32);
			$(window).resize(function(){
				$(".left_nav").css("left",($(window).width()-1200)/2-32);
				$(".fix_nav_bg").width($(window).width());
				var banner_img_left=($(window).width()-1200)/2+$(".menu_second").width();
				$(".banner img").css("margin-left",banner_img_left);
				$(".banner .news").css("left",banner_img_left+770);
			})
			var f_top=$(".floor:eq(0)").position().top;
			var f_height=$(".floor:eq(0)").height()+35;
			$(".left_nav li:not(:first,:last)").on("click",function(){
				$("body").animate({scrollTop:f_top+f_height*($(this).index()-1)-100});
			})
			$(".left_nav li:last").on("click",function(){
				$("body").animate({scrollTop:0});
			})
			//固定顶部搜索栏及左侧导航栏出现消失
			//柯里化判断是否火狐和IE浏览器
			var scrolltop=(function(){
				if(navigator.userAgent.indexOf("Firefox")>-1 || navigator.userAgent.indexOf("Trident")>-1){
					return function(){
						if(document.documentElement.scrollTop>600){
							$(".fix_nav_bg").slideDown(200);
							$(".left_nav").fadeIn(200);
						}else{
							$(".fix_nav_bg").slideUp(200);
							$(".left_nav").fadeOut(200);
						}
						if(document.documentElement.scrollTop>1400){
							var index=parseInt((document.documentElement.scrollTop-f_top+400)/f_height);
							if(index<7){
								$(".left_nav li").eq(index+1).addClass("active").siblings().removeClass("active");
							}
						}else{
							$(".left_nav li").removeClass("active");
						}
					}
				}else{
					return function(){
						if($("body").scrollTop()>600){
							$(".fix_nav_bg").slideDown(200);
							$(".left_nav").fadeIn(200);
						}else{
							$(".fix_nav_bg").slideUp(200);
							$(".left_nav").fadeOut(200);
						}
						if($("body").scrollTop()>1400){
							var index=parseInt(($("body").scrollTop()-f_top+400)/f_height);
							if(index<7){
								$(".left_nav li").eq(index+1).addClass("active").siblings().removeClass("active");
							}
						}else{
							$(".left_nav li").removeClass("active");
						}
					}
				}
			})()
			scrolltop();		
			$(".fix_nav_bg").width($(window).width());
			$(document).on("scroll",function(){
				scrolltop();
			})
			//搜索框提示效果及ajax请求数据
			$("div[tip='false'] input").on("focus",function(){
				if($(this).val()=="网络K歌爆款套装享优惠"){
					$(this).val("");
				}
			}).on("blur",function(){
				if($(this).val().trim()==""){
					$(this).val("网络K歌爆款套装享优惠");
				}
			}).on("input",function(){
				$.ajax({
					type:"get",
					url:"https://www.ingping.com/search/solrCheck?format=json&term="+$("div[tip='false'] input").val(),
					async:true,
					dataType:"jsonp",
					success:function(data){
						if(data.length!=0){
							i=-1;
							$("div[tip='false'] .tip ul").html("");
							data.forEach(function(val){
								var li=$("<li></li>");
								li.text(val);
								$("div[tip='false'] .tip ul").append(li);					
							})
							$("div[tip='false'] .tip ul").slideDown(200);
						}else{
							$("div[tip='false'] .tip ul").slideUp(200,function(){
								$("div[tip='false'] .tip ul").html("");
							});
						}
					}
				});
			})
			//点击提示框内容，提示框消失
			$("div[tip='false'] .tip ul").on("click","li",function(){
				$("div[tip='false'] .tip ul").slideUp(200,function(){
					$("div[tip='false'] .tip ul").html("");
				});
				$("div[tip='false'] input").val($(this).text());
			})
			//按上下键选择提示框内容
			$(document).on("keydown",function(e){
				if($("div[tip='false'] .tip ul").css("display")!="none"){
					var n=$("div[tip='false'] .tip ul li").length;
					if(e.keyCode==40){
						e.preventDefault();
						i++;
						$("div[tip='false'] input").val($("div[tip='false'] .tip ul li").eq(i).text());
						i= i==n-1?-1:i;
					}
					if(e.keyCode==38){
						e.preventDefault();
						i--;
						i= i<=-1?n-1:i;
						console.log(i);
						$("div[tip='false'] input").val($("div[tip='false'] .tip ul li").eq(i).text());
					}
					if(e.keyCode==13){
						e.preventDefault();
						$("div[tip='false'] .tip ul").slideUp(200,function(){
							$("div[tip='false'] .tip ul").html("");
							$("div[tip='false'] .search .button").trigger("click");
						});
					}
				}			
			})
			//单击空白处提示栏消失（滑出）
			$(document).on("click",function(){
				if($("div[tip='false'] .tip ul").css("display")!="none"){
					$("div[tip='false'] .tip ul").slideUp(200,function(){
						$("div[tip='false'] .tip ul").html("");
					});
				}
			})
			//设置轮播图图片位置
			var banner_img_left=($(window).width()-1200)/2+$(".menu_second").width();
			$(".banner img").css("margin-left",banner_img_left);
			//轮播图右侧资讯栏目位置
			$(".banner .news").css("left",banner_img_left+770);
			//大轮播图
			var banner_index=0;
			var banner_length=$(".banner .ul_img li").length;
			$(".banner .ul_img li").eq(banner_index).siblings().css("display","none");
			var banner_timer=setInterval(banner_move,3000);
			function banner_move(){
				var next=(banner_index+1>banner_length-1)?0:banner_index+1;
				$(".banner .ul_img li").eq(banner_index).fadeOut(300).end().eq(next).fadeIn(300);
				$(".ul_dot li").eq(next).addClass("active").siblings().removeClass("active");
				banner_index=(banner_index+1>banner_length-1)?0:++banner_index;
			}
			//鼠标悬停停止轮播
			$(".banner .ul_img li,.ul_dot li").hover(function(){
				clearInterval(banner_timer);
			},function(){
				banner_timer=setInterval(banner_move,3000);
			})
			//轮播图下方长方形导航
			$(".ul_dot").width($(".ul_dot li").length*45);
			$(".ul_dot li").on("click",function(){
				var li_index=$(".ul_dot li[class='active']").index();
				$(".banner .ul_img li").eq(li_index).fadeOut(300).end().eq($(this).index()).fadeIn(300);
				$(this).addClass("active").siblings().removeClass("active");
				banner_index=$(this).index()
			})
			//公告栏背景图片移动及内容切换
			$(".news .info>li:not(:first)").find("ul").css("display","none");
			$(".news .info>li>a").hover(function(){
				var i=$(this).parent().index();
				var x=i*55+15;
				$(this).parent().find("ul").fadeIn(500).end().siblings().find("ul").fadeOut(500)
				$(this).parent().addClass("active").siblings().removeClass("active");
				$(".news .info").css("background-position-x",x);
			})
			//图片导航鼠标悬停效果
			$(".img_nav a").hover(function(){
				$(this).find(".bg1").stop().animate({left:-120});
				$(this).find(".bg2").stop().animate({left:120});
			},function(){
				$(this).find(".bg1").stop().animate({left:-280});
				$(this).find(".bg2").stop().animate({left:280});
			})
			//加载尾部
			$(".footer_con").load("../html/footer.html");
		})
	})
})

