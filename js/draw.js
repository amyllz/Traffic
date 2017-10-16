var time=0;
var road_target=0;
var road_selection = [];
var multi=1;
var gg_lon=0;
var gg_lat=0;
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var Linepoints = [];
var Linepath = [];   //储存线段两端坐标
var LinepathOrdered = [];   //按大小储存线段两端坐标
var Line_k;          //线段斜率
var Line_b;          //线段截距
var Rectpoints = [];
var Rectpath = [];   //储存矩形顶点坐标
var RectpathOrdered = [];  //储存矩形顶点坐标的一维数组

function selectOnchang(oSelect) { //获取车流方向并显示
    alert(oSelect.value);
}

//百度地图地图转换成高德(谷歌中国)的加密算法
function bd_decrypt(bd_lon, bd_lat){
    var x = bd_lon - 0.0065, y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    gg_lon = z * Math.cos(theta);
 	gg_lat = z * Math.sin(theta);
}

//地图上线条绘制
//初始化作图工具
function initDrawTools1() {
        //矩形线条等设置
    var polylineOptions = {
        strokeWeight: 3, 
        strokeOpacity: 0.8,       //边线透明度
        strokeStyle: 'solid',   
	};
            
    myDrawingManagerObject = new BMapLib.DrawingManager(map, {
        isOpen: false,
        drawingType: BMAP_DRAWING_RECTANGLE,
        enableDrawingTool: false,
        enableCalculate: false,
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: new BMap.Size(5, 5),
            drawingTypes: [
                //BMAP_DRAWING_MARKER,
                //BMAP_DRAWING_CIRCLE,
                BMAP_DRAWING_POLYLINE,
                //BMAP_DRAWING_POLYGON
                //BMAP_DRAWING_RECTANGLE
            ]
        },
        polylineOptions: polylineOptions
    });

    myDrawingManagerObject.setDrawingMode(BMAP_DRAWING_POLYLINE) //改为画线
    myDrawingManagerObject.addEventListener("overlaycomplete", LineOverlayComplete); //接听线段完成事件 
}

//开始作图
function DrawLine() {
	map.clearOverlays();	
    map.disableDragging();
    initDrawTools1();
    myDrawingManagerObject.open();
}

//完成作图
function DrawLineOver() {
    myDrawingManagerObject.close();
}

//绘制线段完成后，派发的事件接口
function LineOverlayComplete(e) {
	DrawLineOver();
	alert(e.drawingMode+".  Please wait for about 10s. :-)  ");//polyline
    //alert(e.overlay);      //object.polyline
    //alert(e.calculate);    //null
    //alert(e.label);        //null
    var Linepoints = [];          //返回线段的2个顶点
    Linepoints.push(e.overlay);
    var Linepath = e.overlay.getPath();    
    for(var i=0;i<Linepath.length;i++){ 
    	console.log("lng:"+Linepath[i].lng+" lat:"+Linepath[i].lat);	
    }
    //坐标转换,存入x 
    bd_decrypt(Linepath[0].lng, Linepath[0].lat);
    var x1 = gg_lon;
    var y1 = gg_lat;
    bd_decrypt(Linepath[1].lng, Linepath[1].lat);
    var x2 = gg_lon;
    var y2 = gg_lat;
    console.log("lng:"+x1+" lat:"+y1);
    console.log("lng:"+x2+" lat:"+y2);
    
    var Line_k=(y2-y1)/(x2-x1);
    var Line_b=y2-Line_k*x2;
    var LinepathOrdered = [];
    if (y2 < y1){
    	LinepathOrdered[2] = y2;
    	LinepathOrdered[3] = y1;
    }   	   
    else{
    	LinepathOrdered[2] = y1;
    	LinepathOrdered[3] = y2;
    }
    if (x2 < x1){
    	LinepathOrdered[0] = x2;  
    	LinepathOrdered[1] = x1;
    }
    else{
    	LinepathOrdered[0] = x1;
    	LinepathOrdered[1] = x2;
    }
    console.log(LinepathOrdered);
    console.log(Line_k);console.log(Line_b);
	
	var sel = document.getElementById("direction");  //获取车流方向
	var multi = sel.options[sel.selectedIndex].value;	
	
//从用户绘制线段中获取输入数据  //road_target编号对应
	document.getElementById("roadnum1").value ="";//清除input框内原有数据
	var time=document.getElementById("datetimepicker").value;
	var userData='http://10.15.198.248:8080/hxy/php/findRoad1.php';
	userData=userData+"?q="+'123';
	userData=userData+"&t="+time+" 17:00:00";
	userData=userData+"&o="+LinepathOrdered;
	userData=userData+"&k="+Line_k;
	userData=userData+"&b="+Line_b;
	userData=userData+"&m="+multi;                      //区分查询正编号还是负编号路段
	userData=userData+"&sid="+Math.random();
	var road_target=0;
	$.get(userData, function (data, textStatus){		//服务器成功响应后回调的函数
		road_target = data;
		console.log(road_target);
		document.getElementById("roadnum1").value = road_target;
	});	
	 
} 



//地图上矩形绘制
function initDrawTools2() {
        //矩形线条等设置
    var rectangleOptions = {
        strokeWeight: 2, 
        strokeOpacity: 0.8,       //边线透明度
		fillOpacity: 0.7,         //填充的透明度
        strokeStyle: 'solid',   
	};
            
    myDrawingManagerObject = new BMapLib.DrawingManager(map, {
        isOpen: false,
        drawingType: BMAP_DRAWING_RECTANGLE,
        enableDrawingTool: false,
        enableCalculate: false,
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: new BMap.Size(5, 5),
            drawingTypes: [
                //BMAP_DRAWING_MARKER,
                //BMAP_DRAWING_CIRCLE,
                //BMAP_DRAWING_POLYLINE,
                //BMAP_DRAWING_POLYGON
                BMAP_DRAWING_RECTANGLE
            ]
        },
        rectangleOptions: rectangleOptions
    });

    myDrawingManagerObject.setDrawingMode(BMAP_DRAWING_RECTANGLE) //改为矩形画图
    myDrawingManagerObject.addEventListener("overlaycomplete", RectOverlayComplete); //接听多边形完成事件 
}

//开始作图
function DrawRect() {
	map.clearOverlays();	
    map.disableDragging();
    initDrawTools2();
    myDrawingManagerObject.open();
}

//完成作图
function DrawRectOver() {
    myDrawingManagerObject.close();
}

//绘制多边形完成后，派发的事件接口
function RectOverlayComplete(e) {
	DrawRectOver();
    alert(e.drawingMode+".  Please wait for about 10s. :-)  ");
    //alert(e.overlay);
    //alert(e.calculate);
    //alert(e.label);
    var Rectpoints = [];          //返回矩形的4个顶点数组
    Rectpoints.push(e.overlay);
    var Rectpath = e.overlay.getPath();    
    for(var i=0;i<Rectpath.length;i++){
        console.log("lng:"+Rectpath[i].lng+" lat:"+Rectpath[i].lat);      
    }
    bd_decrypt(Rectpath[0].lng, Rectpath[0].lat);
    RectpathOrdered[0]=gg_lon;
    RectpathOrdered[1]=gg_lat; 
    bd_decrypt(Rectpath[2].lng, Rectpath[2].lat);
    RectpathOrdered[3]=gg_lon;
    RectpathOrdered[2]=gg_lat; 
    console.log(RectpathOrdered);
	
	var sel = document.getElementById("direction");  //获取车流方向
	var multi = sel.options[sel.selectedIndex].value;		

//从用户绘制矩形中获取输入数据//road_selection[]编号对应
	document.getElementById("roadnum2").value ="";	
	var time=document.getElementById("datetimepicker").value;
	var userData='http://10.15.198.248:8080/hxy/php/findRoad2.php';
	userData=userData+"?q="+'123';
	userData=userData+"&t="+time;
	userData=userData+"&p="+RectpathOrdered;
	userData=userData+"&m="+multi;
	userData=userData+"&sid="+Math.random();
	var road_selection = [];
	$.get(userData, function (data, textStatus){		//服务器成功响应后回调的函数
		console.log(data);
		var road_selection = data.split(",");
//		for(var i = 0; i < road_selection.length-1; i++){
//			console.log(road_selection[i]);
//		}	
		var road_selection_tostring = road_selection.join(" "); 
		//alert(road_selection_tostring);
		document.getElementById("roadnum2").value = road_selection_tostring;
	});	
		
}
