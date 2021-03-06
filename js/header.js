define(['jquery'],function($){
	var cookie={
		set: function(name, val, expires, path, domain, secure) { //设置cookie
			var cookieText = name + "=" + val;
			if(expires instanceof Date) {
				cookieText += ";expires=" + expires;
			}
			if(path) {
				cookieText += ";path=" + path;
			}
			if(domain) {
				cookieText += ";domain=" + domain;
			}
			if(secure) {
				cookieText += ";secure";
			}
			document.cookie = cookieText;
		},
		get: function(name) { //获取cookie
			var cookieArr = document.cookie.split('; ');
			for(var i = 0; i < cookieArr.length; i++) {
				var nameArr = cookieArr[i].split('=');
				if(nameArr[0] === name) {
					return nameArr[1];
				}
			}
			return null;
		}
	}
	$(function(){
		//获取用户名
		var username=cookie.get("userName");
		if(username&&username!=""){
			$(".login").html(username +"<a class='exit'> 退出</a>");
		}else{
			$(".login").html("[  <a href='login.html'>登录</a>  |  <a href='signin.html'>注册</a>  ]");
		}
		$(".login").on("click",".exit",function(){
			cookie.set("userName","");
			$(".login").html("[  <a href='login.html'>登录</a>  |  <a href='signin.html'>注册</a>  ]");
		})
		var i=-1;
		//我的音平显示和消失
		$(".ul_aboutme li:eq(0)").hover(function(){
			$(this).find("ul").show(200)
		},function(){
			$(this).find("ul").hide(200)
		})
		//客服电话显示和消失
		$(".ul_aboutme li:last").hover(function(){
			$(this).find(".phone_number").stop().animate({height:311})
		},function(){
			$(this).find(".phone_number").stop().animate({height:0})
		})
		//搜索框提示效果及ajax请求数据
		$("div[tip='true'] input").on("focus",function(){
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
				url:"https://www.ingping.com/search/solrCheck?format=json&term="+$("div[tip='true'] input").val(),
				async:true,
				dataType:"jsonp",
				success:function(data){
					if(data.length!=0){
						i=-1;
						$("div[tip='true'] .tip ul").html("");
						data.forEach(function(val){
							var li=$("<li></li>");
							li.text(val);
							$("div[tip='true'] .tip ul").append(li);					
						})
						$("div[tip='true'] .tip ul").slideDown(200);
					}else{
						$("div[tip='true'] .tip ul").slideUp(200,function(){
							$("div[tip='true'] .tip ul").html("");
						});
					}
				}
			});
		})
		//点击提示框内容，提示框消失
		$("div[tip='true'] .tip ul").on("click","li",function(){
			$("div[tip='true'] .tip ul").slideUp(200,function(){
				$("div[tip='true'] .tip ul").html("");
			});
			$("div[tip='true'] input").val($(this).text());
		})
		//按上下键选择提示框内容
		$(document).on("keydown",function(e){
			if($("div[tip='true'] .tip ul").css("display")!="none"){
				var n=$("div[tip='true'] .tip ul li").length;
				if(e.keyCode==40){
					e.preventDefault();
					i++;
					$("div[tip='true'] input").val($("div[tip='true'] .tip ul li").eq(i).text());
					i= i==n-1?-1:i;
				}
				if(e.keyCode==38){
					e.preventDefault();
					i--;
					i= i<=-1?n-1:i;
					console.log(i);
					$("div[tip='true'] input").val($("div[tip='true'] .tip ul li").eq(i).text());
				}
				if(e.keyCode==13){
					e.preventDefault();
					$("div[tip='true'] .tip ul").slideUp(200,function(){
						$("div[tip='true'] .tip ul").html("");
						$("div[tip='true'] .button").trigger("click");
					});
				}
			}			
		})
		//点击搜索
		$("div[tip='true'] .button").on("click",function(){
			console.log(1)
			var val=$("div[tip='true'] input").val();
			location.href="/comp/search?kw="+val+"&sort=monthSalesCount&order=desc&offset=0&max=24";
		});
		//单击空白处提示栏消失（滑出）
		$(document).on("click",function(){
			if($("div[tip='true'] .tip ul").css("display")!="none"){
				$("div[tip='true'] .tip ul").slideUp(200,function(){
					$("div[tip='true'] .tip ul").html("");
				});
			}
		})
		//套餐方案显示淡入淡出效果
		$(".nav_ul .fangan").hover(function(){
			$(this).find(".taozhuang").fadeIn(200)
		},function(){
			$(this).find(".taozhuang").fadeOut(200)
		})
		//小轮播图
		var index=1;
		var img_height=$(".banner_small img").height();
		$(".banner_small img:eq(0)").css("top",img_height);
		var banner_small_timer=setInterval(small_banner,2500)
		$(".banner_small img,.arrow_nav span").hover(function(){
			clearInterval(banner_small_timer);
		},function(){
			banner_small_timer=setInterval(small_banner,2500);
		})
		function small_banner(){
			$(".banner_small img").eq(index).stop().animate({top:-img_height},function(){
				$(this).css("top",img_height)
			})
			index=++index>1?0:index;
			$(".banner_small img").eq(index).stop().animate({top:0});
		}
		$(".banner_small .pre").on("click",function(){
			var i=index-1<0?1:0;
			$(".banner_small img").eq(i).css("top",-img_height);
			$(".banner_small img").eq(index).stop().animate({top:img_height})
			index=--index<0?1:index;
			$(".banner_small img").eq(index).stop().animate({top:0});
		})
		$(".banner_small .next").on("click",function(){
			small_banner();
		})
		//全部商品分类二级菜单显示及隐藏
		if($(".nav_ul .totle .menu_second").css("display")=="none"){
			$(".nav_ul .totle").hover(function(){
				$(this).find(".menu_second").slideDown(300).end().find(".bg_ul").slideDown(300);
			},function(){
				$(this).find(".menu_second").slideUp(300).end().find(".bg_ul").slideUp(300);
			})			
		}
		//全部商品分类三级菜单显示及隐藏
		$(".menu_second li").hover(function(){
			$(this).find(".menu_third").fadeIn(200);
		},function(){
			$(this).find(".menu_third").fadeOut(200);
		})
	})
	return cookie;
})