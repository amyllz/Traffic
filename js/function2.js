//定义全局变量
var road_R=[];
var road_D=[];
var time1=0;
var roadT=0;
var threshold=0;
var segment_ID=[];
var segment_r=[];
var segment_d=[];
var segment_coors=[];
var pointArr=[];

/***********功能1：查询并排序***************/

function SortbyAbs(a,b,c) {   //对相关系数进行绝对值升序排列
	for(var i = 0; i < a.length; i++)
		for(var j = i + 1; j < a.length; j++)
			if(Math.abs(b[i]) > Math.abs(b[j])) {
				var temp0 = a[i];
				a[i] = a[j];
				a[j] = temp0;
				var temp1 = b[i];
				b[i] = b[j];
				b[j] = temp1;
				var temp2 = c[i];
				c[i] = c[j];
				c[j] = temp2;
			}
}


function getDatafromInput(){   //查询
//获取用户选择的路段编号	
	var time=document.getElementById("datetimepicker").value;
	var road_target=0;
	var road_selection = [];
	road_target=document.getElementById("roadnum1").value;
	var temp=document.getElementById("roadnum2").value.split(" ");  //数组用,间隔
	for(var i = 0; i < temp.length; i++){
		road_selection[i] = temp[i];
	}
	if(road_selection[temp.length-1]=="")       //防止最后一个数为空
		road_selection.pop();
	alert(road_target);
	alert(road_selection);


/********查询数据库/计算相关系数/绘制图表***********/

	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('mainchart'));
	myChart.showLoading({color: '#69c',});  // loading动画

	// 指定图表的配置项和数据
	var labelRight = {
		normal: { position: 'right' } //控制label显示在图的哪个位置
	};

	if(road_selection.length>1){      //多组路段单日显示
		option = {
			title: {
				text: '相关性分析结果',
				textStyle: {
					fontSize: 16,
					fontWeight: 'bold',
					fontFamily: 'Microsoft YaHei',
					color: '#000',
				}
			},
			legend: { //图例
				data: ['相关系数', '时延/h']
			},
			tooltip: { //提示框组件
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			toolbox: { //工具栏
				feature: {
					magicType: { //动态类型切换
						type: ['bar', 'line']
					},
					dataView: {
						buttonColor: '#69c',
					},
					saveAsImage: {
						pixelRatio: 2
					}
				}
			},
			grid: {
				top: 55,
				bottom: 10,
			},
			xAxis: {
				name: 'R',
				type: 'value',
				position: 'top',
				axisLine: { //x轴样式设置
					show: true,
					lineStyle: {
						width: 2,
						color: '#000',
					},
				},
				axisTick: { //x轴刻度样式设置
					show: true,
					lineStyle: {
						width: 2,
						color: '#000',
					},
				},
				axisLable: { //x轴刻度标签样式设置
					show: true,
					textStyle: {
						width: 2,
						color: '#000',
					},
				},
				//max: 'auto',   //'dataMax'取数据在该轴上的最大值作为最大刻度
				splitLine: { lineStyle: { type: 'dashed' } }, //坐标轴在 grid 区域中的分隔线
			},
			yAxis: {
				type: 'category', //适用于离散的类目数据，为该类型时必须通过 data 设置类目数据
				axisLine: { show: false },
				axisLabel: { show: false },
				axisTick: { show: false },
				splitLine: { show: false },
				//data: road_selection,
				data: [] //需异步获取
			},
			series: [ //系列列表
			{//one
				name: '相关系数',
				type: 'bar',
				stack: '系数', //数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置
				itemStyle: {
					normal: {
						color: '#69c',
					}
				},
				label: {
					normal: {
						show: true,
						formatter: '{b}'
					}
				},
				data: []//需异步获取
			},
			{//two
				name: '时延/h',
				type: 'bar',
				stack: '时间',
				itemStyle: {
					normal: {
						color: '#3c6',
					}
					},
				label: {
					normal: {
						show: true,
						formatter: '{b}'
					}
				},
				data: []//需异步获取
			}
			] //end of the series
		}; //end of the option
	} //end of if 

	else{       //单组路段多日显示
		option = {
			title: {
				text: '相关性分析结果',
				textStyle: {
					fontSize: 16,
					fontWeight: 'bold',
					fontFamily: 'Microsoft YaHei',
					color: '#000',
				}
			},
			legend: { //图例
				data: ['相关系数', '时延/h']
			},
			tooltip: { //提示框组件
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			toolbox: { //工具栏
				feature: {
					magicType: { //动态类型切换
						type: ['bar', 'line']
					},
					dataView: {
						buttonColor: '#69c',
					},
					saveAsImage: {
						pixelRatio: 2
					}
				}
			},
			grid: {
				top: 55,
				bottom: 10,
			},
			yAxis: {
				name: 'R',
				type: 'value',
				position: 'top',
				axisLine: { 
					show: true,
					lineStyle: {
						width: 1,
						color: '#000',
					},
				},
				axisTick: { 
					show: true,
					lineStyle: {
						width: 1,
						color: '#000',
					},
				},
				axisLable: { 
					show: true,
					textStyle: {
						width: 1,
						color: '#000',
					},
				},
				splitLine: { lineStyle: { type: 'dashed' } }, //坐标轴在 grid 区域中的分隔线
			},
			xAxis: {
				type: 'category', 
				axisLine: { show: false },
				axisLabel: { show: false },
				axisTick: { show: false },
				splitLine: { show: false },
				data: [] //需异步获取
			},
			series: [ //系列列表
			{//one
				name: '相关系数',
				type: 'bar',
				stack: '系数', //数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置
				itemStyle: {
					normal: {
						color: '#69c',
					}
				},
				label: {
					normal: {
						show: false,       //不显示label
						formatter: '{b}'
					}
				},
				data: []//需异步获取
			},
			{//two
				name: '时延/h',
				type: 'bar',
				stack: '时间',
				itemStyle: {
					normal: {
						color: '#3c6',
					}
					},
				label: {
					normal: {
						show: false,
						formatter: '{b}'
					}
				},
				data: []//需异步获取
			}
			], //end of the series
			dataZoom: [
        	{   // 该dataZoom组件，默认控制x轴
            	type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            	start: 20,      // 左边在 20% 的位置
            	end: 80         // 右边在 80% 的位置
        	},
        	{   // 该dataZoom组件，也控制x轴
            	type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            	start: 20,      // 左边在 20% 的位置
            	end: 80         // 右边在 80% 的位置
        	}
    		], // end of dataZoom
		}; //end of the option
	}  // end of else

    //调试用
//  var userData='http://10.15.198.248:8080/hxy/php/R.php';
//	userData=userData+"?q="+'123';
//	userData=userData+"&t="+time;
//	userData=userData+"&x1="+road_target;
//	userData=userData+"&x2="+road_selection;
//	userData=userData+"&sid="+Math.random();
//	$.get(userData, function (data, textStatus){		//服务器成功响应后回调的函数
//		console.log(data);
//	});	
    
    
    $.ajax({    //通过Ajax从服务器异步获取数据
       	url:"http://10.15.198.248:8080/hxy/php/calculateR.php", 
       	type:"get",
       	data:"&t=" + time + "&x1=" + road_target + "&x2=" + road_selection, //发送到服务器的数据-string
       	dataType:"json",
       	success:function(data){   //返回json对象 		     		
       		console.log(data);
       		if(road_selection.length>1){
       			SortbyAbs(data.ids,data.r,data.d); //按相关系数排序
       			//alert("loading");
       			//拿到php返回的json串后进行转换赋值给图表对象呈现图表			
				option.yAxis.data=data.ids;
				option.series[0].data=data.r;
				option.series[1].data=data.d;
          		myChart.hideLoading();
          		myChart.setOption(option);  //使用指定的配置项和数据显示图表
            }
       		else{
    			option.xAxis.data=data.time;
				option.series[0].data=data.r;
				option.series[1].data=data.d;
	  			myChart.hideLoading();
	     		myChart.setOption(option);	
	     
    		}
      	}, //end of success
       error: function(errorMsg) {
			alert("Failed! Please try again!");
			myChart.hideLoading();
			myChart.setOption(option); 
		}
   	});
}  //end of getDatafromInput()




/***********功能2：阈值筛选***************/
function getDatatoFilter(){
	map.clearOverlays();
	var time1=document.getElementById("datetimepicker1").value;
	var roadT=document.getElementById("roadT").value;
	var threshold=document.getElementById("threshold").value;
	if(threshold<0 || threshold>1)      
		alert("Please enter the threshold between 0 and 1 !");
//	alert(time1);
//	alert(roadT);

	var userData='http://10.15.198.248:8080/hxy/php/filterR.php';
	userData=userData+"?q="+'123';
	userData=userData+"&t="+time1;
	userData=userData+"&r="+roadT;
	userData=userData+"&s="+threshold;
	userData=userData+"&sid="+Math.random();
	$.get(userData, function (data, textStatus){		//服务器成功响应后回调的函数
		console.log(data);
 		var segment = data.split("|");
 		console.log(segment);
		var segment_ID=[];
		var segment_r=[];
		var segment_d=[];
		var segment_coors=[];
		for(var i = 1; i < segment.length - 1; i++){
			segment_ID[i-1] = segment[i].split(";")[0].split(",")[0];
			segment_r[i-1] = segment[i].split(";")[0].split(",")[1];
			segment_d[i-1] = segment[i].split(";")[0].split(",")[2];
			segment_coors[i-1] = segment[i].split(";")[1];
		}
//		console.log(segment_coors);
		PlotLine1(roadT,segment[0]);            				 //目标路段
		PlotLine2(segment_coors,segment_ID,segment_r,segment_d); //筛选路段
	});	
}

function PlotLine1(r,s){	
		var pointArr = [];
		var s_lonlat = s.split(",");
		for(var j = 0; j < s_lonlat.length - 1; j = j + 2) {
			var arr = bd_encrypt(s_lonlat[j], s_lonlat[j + 1]);
			pointArr.push(new BMap.Point(arr[0], arr[1]));
		}
		console.log(pointArr);
		var polyline = new BMap.Polyline(pointArr); //设置覆盖物路径	
		polyline.setStrokeColor('#F36');
		polyline.setStrokeWeight(4);
		var startpoint = bd_encrypt(s_lonlat[0], s_lonlat[1]);   //在路段起点设置标记 
		point=new BMap.Point(startpoint[0], startpoint[1]);
		map.centerAndZoom(point, 14);               //设置缩放倍数
		map.clearOverlays();	
		map.addOverlay(polyline);
		
		var marker = new BMap.Marker(point);       // 创建标注
		map.addOverlay(marker);                    // 将标注添加到地图中
		marker.addEventListener("click",getAttr);
		function getAttr(){
			//alert("目标路段编号: " + r);  
			var label = new BMap.Label("目标路段编号: " + r,{offset:new BMap.Size(15,25)});
			label.setStyle({
			 	color : "#000",
             	border :"2", 
             	fontWeight :"bold",
			 	fontSize : "5px",
         	 	backgroundColor:"#CFC",
			 	fontFamily:"微软雅黑",
		 	});				
			marker.setLabel(label);
		}
}

function PlotLine2(coors,id,r,d){	
	var pointArr=[];
	for(var i = 0; i < coors.length; i++){
		pointArr[i]=[];                                          
		var segment_lonlat = coors[i].split(",");
		for(var j = 0; j < segment_lonlat.length-1; j = j + 2){
			var arr = bd_encrypt(segment_lonlat[j],segment_lonlat[j+1]);
			pointArr[i].push(new BMap.Point(arr[0], arr[1]));   //向数组的末尾添加元素
		}
		console.log(pointArr[i]);
		var polyline = new BMap.Polyline(pointArr[i]);//设置覆盖物路径	
			polyline.setStrokeColor('#00F');
			polyline.setStrokeWeight(4);
		map.addOverlay(polyline);
		
		var startpoint = bd_encrypt(segment_lonlat[0],segment_lonlat[1]);   //在路段起点设置标记 
		point=new BMap.Point(startpoint[0], startpoint[1]);		            //路段起点经纬度     
		var marker = new BMap.Marker(point);       // 创建标注
		map.addOverlay(marker);                    // 将标注添加到地图中
		marker.addEventListener("click",attribute);
	}
	
	function attribute(e){                         // 单击marker后的响应事件
		var p = e.target;
		console.log(coors.length);
		for(var k = 0; k < coors.length; k++){	
//			var temp = coors[k].split(",");
//			var x=temp.length/2;
//			console.log(x);
			console.log(p.getPosition().lng);
			console.log(p.getPosition().lat);
			console.log(pointArr[k]);
//			if(p.getPosition().lng==pointArr[k][x-1].lng && p.getPosition().lat==pointArr[k][x-1].lat){ //路段匹配
			if(p.getPosition().lng==pointArr[k][0].lng && p.getPosition().lat==pointArr[k][0].lat){ //路段匹配	
				var opts = {
//	  				position : new BMap.Point(p.getPosition().lng, p.getPosition().lat),  
	  				offset   : new BMap.Size(20, -10)    //设置文本偏移量
				}
				var label = new BMap.Label("路段编号: " + id[k] + "; 相关系数: "
							+ parseFloat(r[k]).toFixed(2)+ "; 时延:" 
							+ parseFloat(d[k]).toFixed(2) + "h", opts);
				label.setStyle({
			 		color : "#000",
             		border :"2", 
             		fontWeight :"bold",
			 		fontSize : "5px",
         	 		backgroundColor:"#C9F",
			 		fontFamily:"微软雅黑",
		 		});
				map.removeOverlay(marker.getLabel()); 
				//map.addOverlay(label);               //不会删除之前点击的label
				marker.setLabel(label);
			    //alert("路段编号: " + id[k] + "; 相关系数: " + parseFloat(r[k]).toFixed(2) + "; 时延:" + parseFloat(d[k]).toFixed(2) + "h");   
			}
		}// end of for
	}// end of function attribute(e)
}
	


//高德(谷歌中国)地图转换成百度地图的加密算法
function bd_encrypt(gg_lon,gg_lat){  //gg_lon和gg_lat表示转换前的高德坐标的经度和纬度
    var x = gg_lon, y = gg_lat;  
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);  
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);  
    bd_lon = z * Math.cos(theta) + 0.0065;  //bd_lon表示转换后的百度坐标经度
    bd_lat = z * Math.sin(theta) + 0.006;   //bd_lon表示转换后的百度坐标纬度
    return [bd_lon,bd_lat]
} 

//  //var jsonO = eval(jsonStr); //从数组类型的json字符串转化成json数组
// 	var jsonO = [              //json数组
//  	{"ids":"212", "r":"0.5", "d":"1/6"},
//  	{"ids":"181", "r":"0.9847", "d":"1/3"},
//  	{"ids":"335", "r":"-0.78", "d":"0"},
//  	{"ids":"49", "r":"0.13", "d":"1/3"},
//  	{"ids":"505", "r":"-0.34", "d":"1/6"},
//  	{"ids":"2150", "r":"0.21", "d":"2/3"},
//  ];
//  console.log(jsonO);
//  
//  for(var i=0;i<jsonO.length;i++){
//  	road_R[i]=jsonO[i].r;
//  	road_D[i]=jsonO[i].d;
//  }