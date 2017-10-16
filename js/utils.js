//添加路段折线
function addRoadLine(){
	for(var i = 0; i < roadLonLat.length; i++){
		PlotLine(roadLonLat[i],roadSpeed[i]);	
		console.log(roadSpeed[i]);
	}		
}

function addRoadLine2(){
	PlotLine(roadLonLat,segmentSpeed);		
}

//绘制每条路段速度
function PlotLine(road_LonLat,velocity){
	var pointArr=[];
	var status=0;
	var lonlat=[];
	velocity=parseFloat(velocity);  //string to number
	lonlat = road_LonLat.split(",");
	for(var j = 0; j < lonlat.length-1; j = j + 2){
		bd_encrypt(lonlat[j],lonlat[j+1]);
		var arr=[bd_lon,bd_lat];
		pointArr.push(new BMap.Point(bd_lon, bd_lat));
	}
	console.log(pointArr);
	if(velocity>0 && velocity<=35)
		var H = 2*velocity;
	else if(velocity>35 && velocity<=50)
		var H = 70 + 6*(velocity-35);
	else 
		var H = 160 + 2*(velocity-50);
	var S = 0.9;
	var L = 0.5;
	transfer(H,S,L);  //将HSL转化成RGB
    //console.log(newRGB); //在控制台显示数组值（debug）
	var polyline = new BMap.Polyline(pointArr);//设置覆盖物路径	
		polyline.setStrokeColor("rgb("+newRGB+")");
		polyline.setStrokeWeight(3.5);
		polyline.setStrokeOpacity(0.8);
	map.addOverlay(polyline);
}


//高德(谷歌中国)地图转换成百度地图的加密算法
function bd_encrypt(gg_lon,gg_lat){  //gg_lon和gg_lat表示转换前的高德坐标的经度和纬度
    var x = gg_lon, y = gg_lat;  
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);  
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);  
    bd_lon = z * Math.cos(theta) + 0.0065;  //bd_lon表示转换后的百度坐标经度
    bd_lat = z * Math.sin(theta) + 0.006;   //bd_lon表示转换后的百度坐标纬度
}  

