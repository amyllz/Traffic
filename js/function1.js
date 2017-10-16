//定义全局变量
var bd_lon=0;
var bd_lat=0;
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var location_user=0;
var time_user=0;
var location_array=new Array();
var pieceRoad = [];
var roadId = [];
var roadLonLat = [];
var roadSpeed=[];
var segmentSpeed;

//1.获取全局路况
function getFullRoad(){
	time_user=document.getElementById("datetimepicker1").value;
	map.clearOverlays();	
	add_overlay();      //添加矩形
	getRoadData();
	var point = new BMap.Point(120.155069, 30.274089);  // 创建点坐标  
	map.centerAndZoom(point, 12);                 //设置中心点坐标和地图级别 
}
//连接数据库，获取全局路况,并画图
function getRoadData(){
	//服务器外网地址
	//var roadHttp = 'http://183.157.160.100:8080/ITS/parkingLots/php/getRoadData.php' + '?q=' + '123' + '&sid=' + Math.random();
	//服务器内网地址
//	var userData='http://10.15.198.248:8080/lwx/Traffic2.0/php/getRoadData.php';
	var userData='http://10.15.198.248:8080/hxy/php/getRoadData.php';
	userData=userData+"?q="+'123';
	userData=userData+"&t="+time_user;
	userData=userData+"&sid="+Math.random();
	
	$.get(userData, function (data, textStatus){
		console.log(data);
 		pieceRoad = data.split(";");
 		console.log(pieceRoad);
 		roadLonLat=[];
 		roadSpeed=[];
		for(var i = 0; i < pieceRoad.length - 1; i++){
			roadLonLat[i] = pieceRoad[i].split("|")[0];
			roadSpeed[i] = pieceRoad[i].split("|")[1];
		}
		addRoadLine();
	});
	console.log(roadId);
	console.log(roadLonLat);
}

//2. 获取单条路况
function sure(){
	time_user=document.getElementById("datetimepicker2").value;
	location_user=document.getElementById("city-picker3").value;
	location_array=location_user.toString().split("/");
	map.clearOverlays();
	add_overlay();
	getUserData();
}
//连接数据库，获取用户指定的具体路段,并画图
function getUserData(){
//	var userData='http://10.15.198.248:8080/lwx/Traffic2.0/php/getUserData.php';
	var userData='http://10.15.198.248:8080/hxy/php/getUserData.php';
	userData=userData+"?q="+'123';
	userData=userData+"&m="+location_array[2];
	userData=userData+"&t="+time_user;
	userData=userData+"&sid="+Math.random();
	$.get(userData, function (data, textStatus){		//服务器成功响应后回调的函数
		console.log(data);
 		pieceRoad = data.split(";");
 		roadLonLat=[];
		console.log(pieceRoad);
		for(var i = 0; i < pieceRoad.length - 1; i++){	
			roadLonLat[i] = pieceRoad[i].split("|")[0];
			roadSpeed[i] = pieceRoad[i].split("|")[1];
		}
        addRoadLine();
        //取路段经纬度中间坐标，设置为显示中心
		bd_encrypt(roadLonLat[parseInt(roadLonLat.length/2)].split(",")[0],roadLonLat[parseInt(roadLonLat.length/2)].split(",")[1])
		point=new BMap.Point(bd_lon,bd_lat);
		map.centerAndZoom(point, 14);
	});		
}

//3. 查看编号对应的路段
function roadsure(){
	time_user=document.getElementById("datetimepicker3").value;
	location_user=document.getElementById("roadnum").value;
	map.clearOverlays();	
	add_overlay();  
	getRoadNum();
}
//连接数据库，获取编号对应的具体路段,并画图
function getRoadNum(){
//	var userData='http://10.15.198.248:8080/lwx/Traffic2.0/php/getUserRoadData.php';
	var userData='http://10.15.198.248:8080/hxy/php/getRoadNum.php';
	userData=userData+"?q="+'123';
	userData=userData+"&m="+location_user;
	userData=userData+"&t="+time_user;
	userData=userData+"&sid="+Math.random();
	$.get(userData, function (data, textStatus){		//服务器成功响应后回调的函数
		console.log(data);
		roadLonLat = data.split("|")[0];
		segmentSpeed = data.split("|")[1];
        addRoadLine2();
		bd_encrypt(roadLonLat.split(",")[0],roadLonLat.split(",")[1])
		point=new BMap.Point(bd_lon,bd_lat);
		map.centerAndZoom(point, 15);
		
		var icon = new BMap.Icon('img/map60.png', new BMap.Size(30, 30), {  //width, height. reduce the Size disables the icon
			anchor: new BMap.Size(15, 28), //定位点距离图片左上角的偏移量
			offset:new BMap.Size(0,0)  //left+, top+
		});
		var marker =new BMap.Marker(point, {
			icon: icon  
		});  
		
//		var marker = new BMap.Marker(point);  // 创建标注(百度地图api自带label样式)
	    map.addOverlay(marker);
		var label = new BMap.Label(location_user,{offset:new BMap.Size(0,0)});
		label.setStyle({
			 color : "rgb("+newRGB+")",
             border :"0", 
             fontWeight :"bold",
			 fontSize : "5px",
         	 backgroundColor:"0",
			 fontFamily:"微软雅黑"
		 });
	    marker.setLabel(label);
	
	});	
}

