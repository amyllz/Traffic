var multi;        //车流方向默认为+
var gg_lon=0;
var gg_lat=0;
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var Linepoints = [];
var Linepath = [];   //储存线段两端坐标
var LinepathOrdered = [];   //按大小储存线段两端坐标
var Line_k;          //线段斜率
var Line_b;          //线段截距

function direction_p(){
    $("#direction").text("车流方向：正方向 +");
    multi = 1;
}
function direction_n(){
    $("#direction").text("车流方向：负方向 -");
    multi = -1;
}


$(window).resize(function() {
    var myChart = echarts.getInstanceByDom(document.getElementById("mainchart"));
    myChart.resize();
    //左侧echarts计算和赋予高度
    var height1 = $("#height1").height();
    var left_section = $("#left_section").height();
    var echatr1_height = parseFloat(left_section) - parseFloat(height1) - parseFloat(20) - parseFloat(10);
    $("#echarts1").css("height", echatr1_height);

    //地图高度
    var map_height = parseFloat(left_section) - parseFloat(300);
    $("#Mapcontainer").css("height", map_height);
});

/*时间控件的JS程序*/
$(document).ready(function(){ 
    //多选控件
    $('.selectpicker').selectpicker({'selectedText': ''});

    //查询时间控件(左侧栏起始)
	$('#datetimepicker').datetimepicker({
	   	lang:'ch',
		autoclose: true,
		todayBtn: true,
		format: "yyyy-mm-dd",
		minView: "month"  //只选择到日期
	});
	$('#datetimepicker').datetimepicker('setStartDate', '2014-01-01');
	$('#datetimepicker').datetimepicker('setEndDate', '2014-01-31');
    //查询时间控件(左侧栏终止)
	$('#datetimepicker1').datetimepicker({
	   	lang:'ch',
		autoclose: true,
		todayBtn: true,
		format: "yyyy-mm-dd",
		minView: "month"  //只选择到日期
	});
	$('#datetimepicker1').datetimepicker('setStartDate', '2014-01-01');
	$('#datetimepicker1').datetimepicker('setEndDate', '2014-01-31');
    //查询时间控件(右侧栏)
    $('#datetimepicker2').datetimepicker({
        lang:'ch',
        autoclose: true,
        todayBtn: true,
        pickerPosition:'top-right',
        format: "yyyy-mm-dd",
        minView: "month"  //只选择到日期
    });
    $('#datetimepicker2').datetimepicker('setStartDate', '2014-01-01');
    $('#datetimepicker2').datetimepicker('setEndDate', '2014-01-31');

    //左侧echarts计算和赋予高度
    var height1 = $("#height1").height();
    var left_section = $("#left_section").height();
    var echatr1_height = parseFloat(left_section) - parseFloat(height1) - parseFloat(20) - parseFloat(10);
    $("#echarts1").css("height", echatr1_height);

    //地图高度
    var map_height = parseFloat(left_section) - parseFloat(300);
    $("#Mapcontainer").css("height", map_height);
	//创建和初始化地图函数：
    function initMap(){
        createMap();//创建地图
        setMapEvent();//设置地图事件
        addMapControl();//向地图添加控件
    }
    
    //创建地图函数：
    function createMap(){
        var map = new BMap.Map("Mapcontainer");//在百度地图容器中创建一个地图
        var point = new BMap.Point(120.155069, 30.274089);//定义一个中心点坐标
        map.centerAndZoom(point,12);//设定地图的中心点和坐标并将地图显示在地图容器中
        window.map = map;//将map变量存储在全局
    }
    
    //地图事件设置函数：
    function setMapEvent(){
        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard();//启用键盘上下左右键移动地图
    }
    
    //地图控件添加函数：
    function addMapControl(){
        //向地图中添加缩放控件
        var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
        map.addControl(ctrl_nav);
        //向地图中添加缩略图控件
        var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:0});
        map.addControl(ctrl_ove);
        //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
        map.addControl(ctrl_sca);
    }
      
    initMap();//创建和初始化地图 

    charts();
});


//横向图
    // 基于准备好的dom，初始化echarts实例
function charts() {
	var myChart = echarts.init(document.getElementById('mainchart'));
	var hours = ['11:00', '11:10', '11:20', '11:30', '11:40', '11:50', '12:00', '12:10', '12:20', '12:30', '12:40', '12:50', '13:00', '13:10', '13:20', '13:30', '13:40', '13:50', '14:00', '14:10', '14:20', '14:30', '14:40', '14:50', '15:00', '15:10', '15:20', '15:30', '15:40', '15:50', '16:00', '16:10', '16:20', '16:30', '16:40', '16:50', '17:00', '17:10', '17:20', '17:30', '17:40', '17:50', '18:00', '18:10', '18:20', '18:30', '18:40', '18:50', '19:00', '19:10', '19:20', '19:30', '19:40', '19:50', '20:00', '20:10', '20:20', '20:30', '20:40', '20:50', '21:00', '21:10', '21:20', '21:30', '21:40', '21:50', '22:00', '22:10', '22:20', '22:30', '22:40', '22:50', ];
	var id = ['Road x'];
	var data = [];

	option = {
		tooltip: {
			position: 'top'
		},
		title: [],
		singleAxis: [],
		series: [],
	};

	echarts.util.each(id, function(id, idx) {
		option.title.push({
			textBaseline: 'middle',
			top: 50 + '%', //位置
			text: id
		});
		option.singleAxis.push({
			left: 150,
			type: 'category',
			boundaryGap: false,
			data: hours,
			top: 50 + '%',
			height: (100 / 7 - 10) + '%',
			axisLabel: {
				interval: 5 //控制时间间隔
			}
		});
		option.series.push({
			singleAxisIndex: idx,
			coordinateSystem: 'singleAxis',
			type: 'scatter',
			data: [],
			itemStyle: {
				normal: {
					color: '#69c',
				}
			},
			symbolSize: function(dataItem) {
				return(30 - dataItem[1]) * 2; //控制圆的半径
			}
		});
	});

	echarts.util.each(data, function(dataItem) {
		option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
	});

	myChart.setOption(option); // 使用刚指定的配置项和数据显示图表   
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
                BMAP_DRAWING_POLYLINE,
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
		
	
//从用户绘制线段中获取输入数据  //road_target编号对应
    if (multi == null){
        direction_p(); //默认车流方向为正
    }
	document.getElementById("roadnum0").value ="";//清除input框内原有数据
	console.log(multi);
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
		document.getElementById("roadnum0").value = road_target;
	});	
} 


