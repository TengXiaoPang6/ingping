require(["config.min"],function(){
	require(["jquery"],function($){
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
		var click=false;
		$(".btn-danger").on("click",function(){
			var name=$("input:eq(0)").val();
			var pass=$("input:eq(1)").val();
			if(name.trim()!=""&&pass.trim()!==""&&!click){
				click=true;
				$(".btn-danger").text("登录中……");
				$.ajax({
					type:"get",
					url:"/zhu/shopdata/userinfo.php?status=login&userID="+name+"&password="+pass,
					async:true,
					success:function(data){
						setTimeout(function(){
							console.log(data);
							click=false;
							$(".btn-danger").text("登录");
							if(data==0){
								$(".success").html("<span class='glyphicon glyphicon-remove' style='color:red'></span> 用户名不存在");
								$(".success").fadeIn(200);
								setTimeout(function(){
									$(".success").fadeOut(200);
								},2000)
							}else if(data==2){
								$(".success").html("<span class='glyphicon glyphicon-remove' style='color:red'></span> 用户名与密码不符");
								$(".success").fadeIn(200);
								setTimeout(function(){
									$(".success").fadeOut(200);
								},2000)
							}else{
								var d=new Date();
								d.setDate(d.getDate()+7);
								cookie.set("userName",name,d);
								$(".success").html("<span class='glyphicon glyphicon-ok' style='color:green'></span> 登录成功，正在为您跳转……");
								$(".success").fadeIn(200);
								setTimeout(function(){
									location.href="../html/index.html";
								},2000)
							}
						},1000)
					}
				});
			}
		})
		
	})
})	