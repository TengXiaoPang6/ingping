require(["config.min"],function(){
	require(['jquery','header','aside'],function($,cookie){
		//获取cookie
		var order=cookie.get("order");
		var order_length;
		if(order&&order!="[]"){
			$(".no_order").css("display","none");
			$(".table,.pay").css("display","block");
			order_length=JSON.parse(order).length; 
			$(".table tbody").append(template("#goods",JSON.parse(order)));
		}else{
			$(".no_order").css("display","block");
			$(".table,.pay").css("display","none");
			order_length=0;
		}
		$(".header .ul_aboutme li .count").text(order_length);
		$(".aside .shopping .cart span").text(order_length);
		$(".tab .tip p i").text(order_length);
		$(".tab .pay .fr span").text(order_length);
		function template(id,data){
			var str=$(id).text();
			str="print(`"+str+"`)";
			str=str.replace(/<%=(.+)%>/g,"`);print($1);print(`");
			str=str.replace(/<%(.+)%>/g,"`);$1print(`");
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
		//点击加减
		$(".input-group-addon").on("click",function(){
			var num=parseInt($(this).siblings("input").val());
			if($(this).text()=="+"){
				num+=1
			}else{
				num= num==1?1:num-1
			}
			$(this).siblings("input").val(num);
			$(this).parents(".count").next().text("¥"+num*($(this).parents(".count").prev().text().substring(1)));
			tot();
			//更新cookie
			var index=$(this).parents("tr").index()-1;
			var c=JSON.parse(cookie.get("order"));
			c[index][4]=num;
			cookie.set("order",JSON.stringify(c));
		})
		//计算总价
		function tot(){
			var sum=0;
			for(var i=0;i<$(".tab .totle").length;i++){
				sum+=parseInt($(".tab .totle").eq(i).text().substring(1));
			}
			$(".pay .fr i").text(sum);
		}
		tot();
		//收藏删除
		$(".remove .like").on("click",function(){
			$(this).toggleClass("active");
			if($(this).find('i').text()=="收藏"){
				$(this).find('i').text("已收藏")
			}else{
				$(this).find('i').text("收藏")
			}
		})
		$(".remove .delete").on("click",function(){
			var that=$(this);
			$(this).parents("tr").fadeOut(300,function(){
				that.parents("tr").remove();
				tot();
			})
			//修改cookie
			var index=$(this).parents("tr").index()-1;
			var c=JSON.parse(cookie.get("order"));
			c.splice(index,1);
			cookie.set("order",JSON.stringify(c));
			var n=parseInt($(".header .ul_aboutme li .count").text())-1;
			$(".header .ul_aboutme li .count").text(n);
			$(".aside .shopping .cart span").text(n);
			$(".tab .tip p i").text(n);
			$(".tab .pay .fr span").text(n);
			if(n==0){
				$(".table,.pay").fadeOut(200);
				$(".no_order").fadeIn(200);
			}
		})
		//清空购物车
		$(".pay .fl").on("click",function(){
			$(".tab .tr:not(:eq(0))").fadeOut(300,function(){
				$(".tab .tr:not(:eq(0))").remove();
				tot();
			})
			cookie.set("order","[]");
			$(".header .ul_aboutme li .count").text("0");
			$(".aside .shopping .cart span").text("0");
			$(".tab .tip p i").text("0");
			$(".tab .pay .fr span").text("0");
			$(".table,.pay").fadeOut(200);
			$(".no_order").fadeIn(200);
		})
		//加载尾部
		$(".footer_con").load("../html/footer.html");
	})
})	