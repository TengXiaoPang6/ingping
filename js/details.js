require(["config.min"],function(){
	require(['jquery','header','aside'],function($){
		$(function(){
			//获取地址栏id参数
			var index=location.href.indexOf("id=");
			var id=location.href.substr(index+3);
			//ajax请求商品数据
			$.ajax({
				url:"../json/"+id+".json",
				timeout:10000,
				error:function(){
					$(".big .loading").text("加载失败，请检查网络！");
					$("title").text("欢迎来到音平商城");
				},
				success:function(data){
					setTimeout(function(){
						$(".big .loading").fadeOut(200).remove();
						var productPosition=data.productPosition;
						var productName=data.productName;
						var guarantee=data.guarantee;
						var productPrice=data.productPrice;
						var img_small=data.img_small;
						var img_big=data.img_big;
						var productID=data.productID;
						var details=data.details;
						//商品位置
						for(var i=0;i<productPosition.length-1;i++){
							var a=$("<a href=''></a>");
							a.text(productPosition[i]);
							var span=$("<span></span>");
							span.text(" ＞ ");
							$(".details .position").append(a);
							$(".details .position").append(span);
						}
						var p=$("<p></p>");
						p.text(productPosition[productPosition.length-1]);
						$(".details .position").append(p);
						//商品名称
						$(".details .thing .name").text(productName);
						$("title").text(productName);
						//商品保修
						$(".details .thing .guarantee").text(guarantee);
						//商品价格
						$(".details .price .money span i").text(productPrice);
						$(".comment .nav .pri p span").text(productPrice);
						//商品小图
						for(var i=0;i<img_small.length;i++){
							var li=$("<li></li>");
							if(i==0){
								li.addClass("active");
							}
							var img=$("<img src=''/>");
							img.attr("src",img_small[i]);
							li.append(img);
							$(".magnifying .thumbnail .small").append(li);
						}
						//商品大图
						for(var i=0;i<img_big.length;i++){
							var li=$("<li></li>");
							if(i==0){
								li.addClass("active");
							}
							var img=$("<img src=''/>");
							img.attr("src",img_big[i]);
							li.append(img);
							$(".magnifying .big").append(li);
						}
						//商品编号
						$(".magnifying .share p span").text(productID);
						//商品详情
						for(var i=0;i<details.length;i++){
							var li=$("<li></li>");
							li.text(details[i])
							$(".comment .content .text ul").append(li);
						}
					},4000);
				}
			})
			//活动促销
			$.ajax({
				type:"get",
				url:"/api/advertising/getAdvertisingByCno?cno=170728",
				dataType:"jsonp",
				jsonp:"jsoncallback",
				timeout:10000,
				error:function(){
					$(".promotion .loading").text("加载失败，请检查网络！");
				},
				success:function(data){
					setTimeout(function(){
						$(".promotion .loading").remove();
						for(var i=0;i<data.length;i++){
							var li=$("<li></li>");
							var span=$("<span></span>");
							span.text(data[i].name);
							var a=$("<a href='' target='_blank'></a>");
							a.attr("href",data[i].url);
							a.text(data[i].title);
							li.append(span).append(a);
							$(".thing .promotion ul").append(li);
						}
					},4000)
				}
			})
			//图文详情
			$.ajax({
				type:"get",
				url:"/api/product/getDescription?id="+id,
				async:true,
				timeout:10000,
				error:function(){
					$(".photo .loading").text("加载失败，请检查网络！");
				},
				success:function(data){
					setTimeout(function(){
						$(".photo .loading").remove();
						$(".content .photo .im").append(data.description);
						content_height();
					},4000);
				}
			});
			//评论数
			$.ajax({
				type:"get",
				url:"/api/product/getCommentCount?productId="+id,
				async:true,
				success:function(data){
					//好评度
					var g;
					if(data.goodCount+data.badCount+data.midCount==0){
						g=1;
					}else{
						g=parseInt((data.goodCount)/(data.goodCount+data.badCount+data.midCount)*100);
					}
					var m=parseInt((data.midCount)/(data.goodCount+data.badCount+data.midCount)*100);
					var b=parseInt((data.badCount)/(data.goodCount+data.badCount+data.midCount)*100);
					$(".details .price .good span").text(g+"%");
					$(".details .price .fr a:eq(0) span").text(data.goodCount);
					$(".details .price .fr a:eq(1) span").text(data.imgCount);
					$(".comment .nav ul li:eq(2) span").text("("+(data.goodCount+data.badCount+data.midCount)+")");
					$(".pinglun .overall .totle p:eq(1) span").text(g);
					$(".pinglun .overall .totle p:eq(2) span").text(data.goodCount+data.badCount+data.midCount);
					$(".pinglun .overall .pro li:eq(0) p span").text("("+g+"%)");
					$(".pinglun .overall .pro li:eq(0) .good").width(g);
					$(".pinglun .overall .pro li:eq(0) .bad").width(100-g);
					$(".pinglun .overall .pro li:eq(1) p span").text("("+(100-g-b)+"%)");
					$(".pinglun .overall .pro li:eq(1) .good").width(m);
					$(".pinglun .overall .pro li:eq(1) .bad").width(100-m);
					$(".pinglun .overall .pro li:eq(2) p span").text("("+b+"%)");
					$(".pinglun .overall .pro li:eq(2) .good").width(b);
					$(".pinglun .overall .pro li:eq(2) .bad").width(100-b);
				}
			})
			//咨询数
			$.ajax({
				type:"get",
				url:"/api/product/proConsult?dataType=json&offset0=&max=0&sort=createDate&order=desc&id="+id,
				async:true,
				success:function(data){
					$(".comment .nav ul li:eq(3) span").text("("+(data.count)+")");
				}
			});
			function template(id,data){
				var str=$(id).text();
				str="print(`"+str+"`)";
				str=str.replace(/<%=(.+)%>/g,"`);print($1);print(`");
				str=str.replace(/<%(.+)%>/g,"`);$1print(`");
				console.log(data.length);
				var funstrr=`
				(function(data){
					var htmll="";
					function print(s){
						htmll+=s;
					}
					${str};
					return htmll;
				})
				`;
				var realfun=eval(funstrr);
				var res=realfun(data);
				return res;
			}
			//缩略图效果
			$(".magnifying .thumbnail ul").on("mouseenter","li",function(){
				$(this).addClass("active").siblings().removeClass("active");
				$(this).parents('.thumbnail').siblings(".big").find('li').eq($(this).index()).stop().animate({opacity:1}).siblings("li").stop().animate({opacity:0});
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
			//点击加减号
			$(".thing .buy .plus span").on("click",function(){
				var num=parseInt($(this).parent().prev().html());
				if($(this).index()){
					num=num==1?1:num-1;
				}else{
					num+=1;
				}
				$(this).parent().prev().html(num);
			})
			//商品详情栏固定
			var top=$(".comment .details_img .nav").offset().top;
			/*var zheng_top=$(".comment .photo>img").offset().top;
			var zheng_left=$(".comment .photo>img").offset().left;*/
			var left=$(".comment .details_img .nav").offset().left;
			function co(){
				if($("body").scrollTop()>=top){
					$(".comment .details_img .nav,.comment .guide").css({
						"position":"fixed",
						"top":0,
					})
					$(".comment .details_img .nav").css({
						"left":left
					})
					$(".comment .details_img").css({
						"top":50,
						"left":200
					});
				}else{
					$(".comment .details_img .nav,.comment .guide").css({
						"position":"relative",
					})
					$(".comment .details_img .nav").css({
						"left":0
					})
					$(".comment .details_img").css({
						"top":0,
						"left":0
					});
				}
				if($("body").height()-$("body").scrollTop()<=1193){
					$(".comment .guide dl").fadeOut(200);
				}else{
					$(".comment .guide dl").fadeIn(200);
				}
				/*if($("body").scrollTop()>=zheng_top-100){
					$(".comment .photo>img").css({
						"position":"fixed",
						"top":100,
						"left":zheng_left+768
					})
				}else{
					$(".comment .photo>img").css({
						"position":"relative",
						"top":0,
						"left":0
					})
				}*/
			}
			co();
			$(window).on("scroll",function(){
				co()
			})
			function content_height(){
				var hei=$(".content>div").length;
				var height;
				for(var i=0;i<hei;i++){
					if($(".content>div").eq(i).css("display")=="block"){
						height=$(".content>div").eq(i).height();
						console.log(i,height);
					}
				}
				$(".content").height(height+50);
				$(".comment").height(height+100);
			}
			var offset=0;
			var offset2=0;
			$(".comment .nav ul li").on("click",function(){
				setTimeout(function(){
					content_height();
				},300)
				setTimeout(function(){
					co();
				},1400)
				if($(this).index()==2){
					//评论
					$(".zixun .dl .loading").html('<img src="../img/loading.gif" />  loading……');
					$.ajax({
						type:"get",
						url:"/api/product/proComment?dataType=json&offset="+offset+"&max=15&sort=createDate&order=desc&id="+id+"&type=1",
						async:true,
						timeout:10000,
						error:function(){
							$(".pinglun .dl .loading").text("加载失败，请检查网络！");
						},
						success:function(data){
							setTimeout(function(){
								if(data.commentList.length<15){
									$(".pinglun .more").text("已加载全部")
								}
								offset+=15;
								$(".pinglun .dl .loading").remove();
								$(".pinglun .dl").append(template("#tem",data.commentList))
								content_height();
								$(".pinglun .more").fadeIn(200);
							},3000);
						}
					});
				}
				if($(this).index()==3){
					//咨询
					$(".zixun .dl .loading").html('<img src="../img/loading.gif" />  loading……');
					$.ajax({
						type:"get",
						url:"/api/product/proConsult?dataType=json&offset="+offset2+"&max=15&sort=createDate&order=desc&id="+id,
						async:true,
						timeout:10000,
						error:function(){
							$(".zixun .dl .loading").text("加载失败，请检查网络！");
						},
						success:function(data){
							setTimeout(function(){
								if(data.consultList.length<15){
									$(".zixun .more").text("已加载全部")
								}
								offset2+=15;
								$(".zixun .dl .loading").remove();
								$(".zixun .dl").append(template("#question",data.consultList))
								content_height();
								$(".zixun .more").fadeIn(200);
							},3000);
						}
					});
				}
				$(this).addClass("active").siblings().removeClass("active");
				$(".comment .content").children().eq($(this).index()).fadeIn(200).siblings().fadeOut(200);
			})
			$(".pinglun .more").on("click",function(){
				if($(this).text()!="已加载全部"){
					$(this).html("<img src='../img/loading.gif' />  loading……");
					$.ajax({
						type:"get",
						url:"/api/product/proComment?dataType=json&offset="+offset+"&max=15&sort=createDate&order=desc&id="+id+"&type=1",
						async:true,
						timeout:10000,
						error:function(){
							$(".pinglun .dl .more").text("加载失败，点击刷新！");
						},
						success:function(data){
							setTimeout(function(){
								if(data.commentList.length<15){
									$(".pinglun .more").text("已加载全部")
								}else{
									$(".pinglun .more").text("点击加载更多")
								}
								offset+=15;
								$(".pinglun .dl .loading").remove();
								$(".pinglun .dl").append(template("#tem",data.commentList))
								content_height();
								$(".pinglun .more").fadeIn(200);
							},1000);
						}
					});
				}
			})
			$(".zixun .more").on("click",function(){
				if($(this).text()!="已加载全部"){
					$(this).html("<img src='../img/loading.gif' />  loading……");
					$.ajax({
						type:"get",
						url:"/api/product/proConsult?dataType=json&offset="+offset2+"&max=15&sort=createDate&order=desc&id="+id,
						async:true,
						timeout:10000,
						error:function(){
							$(".zixun .dl .more").text("加载失败，点击刷新！");
						},
						success:function(data){
							setTimeout(function(){
								if(data.consultList.length<15){
									$(".zixun .more").text("已加载全部")
								}
								else{
									$(".zixun .more").text("点击加载更多")
								}
								offset2+=15;
								$(".zixun .dl .loading").remove();
								$(".zixun .dl").append(template("#question",data.consultList))
								content_height();
								$(".zixun .more").fadeIn(200);
							},1000);
						}
					});
				}
			})
			//加载尾部
			$(".footer_con").load("../html/footer.html").css("margin-top",50);
		})
	})
})