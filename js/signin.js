require(["config.min"],function(){
	require(["jquery"],function($){
		require(["bootstrap"],function(){
			$(function(){
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
				//提示信息
				 $('[data-toggle="tooltip"]').tooltip();
				//正则判断
				$("input:eq(0)").on("blur",function(){
					if($(this).val().trim()!=""){
						if(/^1[0-9]{10}$/.test($("input:eq(0)").val())){
							$(".help-block:eq(0)")
							.html("<span class='glyphicon glyphicon-ok'></span> 输入正确")
							.css("visibility","visible").css("color","green");
							$(".sign button").removeAttr("disabled")
						}else{
							$(".help-block:eq(0)")
							.html("<span class='glyphicon glyphicon-remove'></span> 输入错误，请输入有效的11位手机号码")
							.css("visibility","visible").css("color","red");
						}
					}
				})
				$("input:eq(1)").on("blur",function(){
					if($(this).val().trim()!=""){
						if(/^[0-9]{6}$/.test($(this).val())){
							$(".help-block:eq(1)")
							.html("<span class='glyphicon glyphicon-ok'></span> 输入正确")
							.css("visibility","visible").css("color","green");
							$(".sign button").removeAttr("disabled")
						}else{
							$(".help-block:eq(1)")
							.html("<span class='glyphicon glyphicon-remove'></span> 输入错误，请输入正确的6位验证码")
							.css("visibility","visible").css("color","red");
						}
					}
				})
				$("input:eq(2)").on("blur",function(){
					if($(this).val().trim()!=""){
						if(/^.{6,18}$/.test($(this).val())){
							$(".help-block:eq(2)")
							.html("<span class='glyphicon glyphicon-ok'></span> 输入正确")
							.css("visibility","visible").css("color","green");
							$(".sign button").removeAttr("disabled")
						}else{
							$(".help-block:eq(2)")
							.html("<span class='glyphicon glyphicon-remove'></span> 输入错误，请输入6-18位密码")
							.css("visibility","visible").css("color","red");
						}
					}
				})
				var click=false;
				$(".btn-danger").on("click",function(){
					if($(".help-block").filter(function(){
						return $(this).attr("style")=="visibility: visible; color: green;"
					}).length==3&&!click){
						click=true;
						var username=$("input:eq(0)").val();
						var pass=$("input:eq(2)").val();
						$(this).text("注册中……");
						console.log(username,pass)
						$.ajax({
							type:"get",
							url:"/zhu/shopdata/userinfo.php?status=register&userID="+username+"&password="+pass,
							async:true,
							success:function(data){
								setTimeout(function(){
									click=false;
									$(".btn-danger").text("立即注册");
									console.log(data)
									if(data==1){
										var d=new Date();
										d.setDate(d.getDate()+7);
										cookie.set("userName",name,d);
										$(".success").html("<span class='glyphicon glyphicon-ok' style='color:green'></span> 注册成功，正在为您跳转……");
										$(".success").fadeIn(200);
										setTimeout(function(){
											location.href="../html/index.html";
										},2000)
									}
									if(data==0){
										$(".success").html("<span class='glyphicon glyphicon-remove' style='color:red'></span> 用户名已被注册，请重新输入");
										$(".success").fadeIn(200);
										setTimeout(function(){
											$(".success").fadeOut(200);
										},2000)
									}
								},1000)
							}
						});
					}
				})
				$(".sign button").on("click",function(){
					$(this).attr("disabled","disabled");
					var time=60;
					$(".sign button").text(time+"秒后重新获取")
					var t=setInterval(function(){
						time--;
						if(time>=0){
							$(".sign button").text(time+"秒后重新获取")
						}else{
							$(".sign button").text("获取验证码")
							$(".sign button").removeAttr("disabled")
							clearInterval(t);
						}
					},1000)
				})
			})
		})
	})
})	