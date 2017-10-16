var time=0;
var road_target=0;
var road_selection=[];
var index = [];
var r = [];
var period = 1;
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;


var btn1 = document.getElementById("morning");
btn1.addEventListener("click", function() { 
    period = btn1.value;            //43
}); 

var btn2 = document.getElementById("noon");
btn2.addEventListener("click", function() { 
    period = btn2.value;            //67
}); 

var btn3 = document.getElementById("evening");
btn3.addEventListener("click", function() { 
    period = btn3.value;            //97
}); 



function plotBoxplot(){
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
//	alert(period);
	alert(road_target);
	alert(road_selection);
	
	var myChart = echarts.init(document.getElementById('mainchart'));
	myChart.showLoading({color: '#069',});      // loading动画
	
    var userData='http://10.15.198.248:8080/hxy/php/statisticR.php';
//    var userData='http://10.15.198.248:8080/hxy/php/R.php';
	userData=userData+"?q="+'123';
	userData=userData+"&t="+time;
	userData=userData+"&p="+period;
	userData=userData+"&x1="+road_target;
	userData=userData+"&x2="+road_selection;
	userData=userData+"&sid="+Math.random();
	$.get(userData, function (data, textStatus){		//服务器成功响应后回调的函数
		console.log(data);
		var segment =[];
		var index = [];
		var r = [];
		segment = data.split(";");
		//console.log(segment.length-1);
		for(var i = 0; i < segment.length-1; i++){
			index[i] = segment[i].split(",")[0];
			r[i] = segment[i].split(",")[1];
			r[i] = r[i].split(" ");    //string to array
			r[i].pop();                //去掉最后一个空元素
		}
		console.log(index);	
		console.log(r);
		
		var bpdata = echarts.dataTool.prepareBoxplotData(r); 
		console.log(bpdata);
		option = {            // 配置箱线图样式
    		title: [
        		{
            		text: '高峰时段相关系数箱线图',
            			textStyle: {
							fontSize: 16,
							fontWeight: 'bold',
							fontFamily: 'Microsoft YaHei',
							color: '#000',
						},
            		left: 'center',
        		},
        		{
            		text: 'upper: Q3 + 1.5 * IRQ   lower: Q1 - 1.5 * IRQ',
            		borderColor: '#999',
            		borderWidth: 1,
            		textStyle: {
                		fontSize: 12
            		},
            		left: '22%',
            		top: '86%'
        		}
    		],
    		tooltip: {
        		trigger: 'item',
        		axisPointer: {
            		type: 'shadow'
        		}
    		},
    		grid: {               //调整图表位置
        		left: '10%',
        		right: '5%',
        		top: '14%',
        		bottom: '22%'
    		},
    		xAxis: {
        		type: 'category',
        		data: index,        
        		boundaryGap: true,
        		nameGap: 30,
        		splitArea: {
            		show: false
        		},
        		axisLine: { show: false },
				axisTick: { show: false },
				splitLine: { show: false },
        		axisLabel: {  // x轴标签
            		formatter: 'ID {value}'
        		},
   	 		},
    		yAxis: {
        		type: 'value',
        		name: 'R between -1&1',
        		splitArea: {
            		show: true
        		}
    		},
    		series: [
        		{
            		name: 'boxplot',
            		type: 'boxplot',
            		itemStyle: {
						normal: {
							borderColor: '#069',
						}
					},
					label: {
						normal: {
							show: true,
							formatter: '{b}'
						}
					},
            		data: bpdata.boxData,
            		tooltip: {
                		formatter: function (param) {
                    		return [
                        		'Road ' + param.name + ' : ',
                        		'upper: ' + param.data[4].toFixed(4),
                        		'Q3: ' + param.data[3].toFixed(4),
                        		'median: ' + param.data[2].toFixed(4),
                        		'Q1: ' + param.data[1].toFixed(4),
                        		'lower: ' + param.data[0].toFixed(4),
                    		].join('<br/>')
                		}
            		}
        		},
        		{
            		name: 'outlier',
            		itemStyle: {
						normal: {
							color: '#069',
							borderColor: '#069',
						}
					},
            		type: 'scatter',
            		data: bpdata.outliers
        		}
    		]
		};   // end of option
			
        myChart.hideLoading();
        myChart.setOption(option);  //使用指定的配置项和数据显示图表
		
	});	//end of get 

} //end of function

function plotCongestion(){
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
//	alert(period);
	alert(road_target);
	alert(road_selection);
    
    var myChart = echarts.init(document.getElementById('chart'));
	myChart.showLoading({color: '#069',});      // loading动画
	
    var userData='http://10.15.198.248:8080/hxy/php/PlotChart.php';
    userData=userData+"?q="+'123';
	userData=userData+"&t="+time;
	userData=userData+"&p="+period;
	userData=userData+"&x1="+road_target;
	userData=userData+"&x2="+road_selection;
	userData=userData+"&sid="+Math.random();
	$.get(userData, function (data, textStatus){		//服务器成功响应后回调的函数
		console.log(data);	
		var hours = [];	
		var cong = [];
		var piece = [];
		var speed = [];
		var id = [];
		id = road_selection;
		id.unshift(road_target);          //在数组第一个元素前插入目标路段
		piece = data.split(";");
		for(var i = 0; i < (piece.length-1)*24; i++){
			cong[i] = [0,0,0];
		}		
		for(var i = 0; i < piece.length-1; i++){
			speed[i] = piece[i].split(",");
			speed[i].pop();                //去掉最后一个空元素	
			for(var j=0; j<24; j++){
				cong[i*24+j][0]=i;
				cong[i*24+j][1]=j;
				cong[i*24+j][2]=speed[i][j];
			}
		}
		console.log(cong);
		
		//按顺序储存一下拥堵路段的起始和终止时间
		var event=[];
		for(var i = 0; i < (piece.length-1)*8; i++){  //24个数据点，每条路最多8段拥堵
			event[i]=[0,0,0];
		}
		
		var count = 0;  //记录拥堵事件数量
		for(var i = 0; i < piece.length-1; i++){	            			
			if(speed[i][0]<25){                     //设置拥堵速度阈值为<25                        
				event[count][0]=id[i];
				event[count][1]=parseInt(period);
			}
			for(var j=1; j<24; j++){
				if(speed[i][j]>=25){       //该时隙不拥堵
					if(speed[i][j-1]<25){  //上一个时隙不拥堵&
						if(j-1+parseInt(period) > event[count][1]){ //至少2个时隙，则完成该拥堵事件
							event[count][2]=j-1+parseInt(period);
							count++;
						}
						else       //否则清0
							event[count]=[0,0,0];           
					}
	            }
				else{                       //该时隙拥堵
					if(speed[i][j-1]>=25){  //上一个时隙不拥堵，创建一个新时隙
						event[count][0]=id[i];
						event[count][1]=j+parseInt(period);
					}
					else if(j==23){              //上一时隙拥堵，可能拥堵到最后一个时隙
						event[count][2]=j+parseInt(period);
						count++;
					}
				}
			}
		}
		for(var i = 0; i < (piece.length-1)*8; i++){   //删除空余的数组项
			if(event[i][2]==0){
				console.log(i);
				event.splice(i,(piece.length-1)*8-i); //从第i个开始，删除(piece.length-1)*8-i个
				break;
			}	
		}
		console.log(event);
		
		if(period==43)
			var hours = ['7:00','7:10','7:20','7:30','7:40','7:50','8:00','8:10','8:20','8:30','8:40','8:50','9:00','9:10','9:20','9:30','9:40','9:50','10:00','10:10','10:20','10:30','10:40','10:50'];
        else if(period==67)
        	var hours = ['11:00','11:10','11:20','11:30','11:40','11:50','12:00','12:10','12:20','12:30','12:40','12:50','13:00','13:10','13:20','13:30','13:40','13:50','14:00','14:10','14:20','14:30','14:40','14:50'];
        else if(period==97)
        	var hours = ['16:00','16:10','16:20','16:30','16:40','16:50','17:00','17:10','17:20','17:30','17:40','17:50','18:00','18:10','18:20','18:30','18:40','18:50','19:00','19:10','19:20','19:30','19:40','19:50'];
        else
        	var hours = ['0:00','0:10','0:20','0:30','0:40','0:50','1:00','1:10','1:20','1:30','1:40','1:50','2:00','2:10','2:20','2:30','2:40','2:50','3:00','3:10','3:20','3:30','3:40','3:50'];
	
		cong = cong.map(function (item) {
    		return [item[1], item[0], item[2] || '-'];
    	})

		option = {
    		tooltip: {
        		position: 'top'  //提示框浮层的位置
    		},	
    		animation: false,
    		grid: {
        		height: '88%',
        		width:'85%',
        		y: '1%',
    			x: '6%',
    		},
    		xAxis: {
        		type: 'category',
        		data: hours,
        		splitArea: {
            		show: true
        		},
        		axisLable: { //x轴刻度标签样式设置
		    		show: true,
				},
				axisLine: { //x轴刻度标签样式设置
		    		show: false,
				},
				axisTick: { //x轴刻度样式设置
		    		show: false,
				},
    		},
    		yAxis: {
        		type: 'category',
        		data: id,
        		splitArea: {
            		show: true
        		},
        		axisLable: { 
		    		show: true,
				},
				axisLine: { 
		    		show: false,
				},
				axisTick: { 
		    		show: false,
				},
    		},
    		visualMap: {
        		min: 10,
        		max: 50,
        		calculable: true,    //色条
	      		orient: 'vertical',
	      		left: 'right',
	      		top: '5%',
        		color: ['lightskyblue','lightgreen','yellow','orangered'],
    		},
    		series: [{
        		name: 'Speed',
        		type: 'heatmap',
        		data: cong,
        		label: {
            		normal: {
                		show: false
           			}
        		},
        		itemStyle: {
            		emphasis: {
               			shadowBlur: 10,
                		shadowColor: 'rgba(0, 0, 0, 0.5)' //alpha 通道表示不透明度
            		}
        		}
    		}]
		};
		
		myChart.hideLoading();
		myChart.setOption(option);
	
		myChart.on('click', function (params) {           //chart的点击事件
    		var index = id[params.data[1]];
    		console.log(index);
    		var color = params.color;
    		var timeslot = params.data[0]+parseInt(period);
    		var flag = 0;
    		for(var i = 0; i < event.length; i++){
    			if(index==event[i][0]){
    				if(timeslot >= event[i][1] && timeslot <= event[i][2]){
    					flag = 1;                          //选中了拥堵区间
    					var e1 = event[i][1];
    					var e2 = event[i][2];
    					break;
    				}
    			}
    		}// end of for i
    
    		if(flag==1){
    			console.log(e1);
    			console.log(e2);
    			var selected = [];                         //找到由该路段引发拥堵的其他用户输入路段
    			var number = 0;                            //记录路段数量 
    			for(var i = 0; i < event.length; i++){
    				if(event[i][1] >= e1 && event[i][1] <= e2)  //拥堵发生在该选中的拥堵事件时隙内
    					selected[number++] = event[i][0];
    			}
    		}
    		if(flag==0){
    			var selected = 0 ;   
   			}
   			console.log(selected);
			//返回符合条件的邻接路段经纬度
			var userData = 'http://10.15.198.248:8080/hxy/php/UpdateCon.php';
			userData = userData + "?q=" + '123';
			userData = userData + "&x1=" + index;
			userData = userData + "&x2=" + selected;
			userData = userData + "&sid=" + Math.random();
			$.get(userData, function(data, textStatus) { 
        		console.log(data);
        		var road = data.split("|");
				var road_coors=[];					
				for(var i = 0; i < road.length - 1; i++)
					road_coors[i] = road[i].split(":")[1];
				plotDiffusion(road_coors,color);       			
			}); //end of get  		
		});//end of mychart.on
		
	}); //end of get
}// end of function

function createCoords(road_lonlat){
	var pointArr = [];
	for(var j = 0; j < road_lonlat.length-1; j = j + 2){
		var arr = bd_encrypt(road_lonlat[j],road_lonlat[j+1]);
		pointArr[j/2] = [arr[0],arr[1]];          // [lon,lat],[lon,lat]...
	}
	return {
        coords: pointArr                          //返回每条路段的经纬度数组[[],[],[].....]
	};	
}

function plotDiffusion(coors,col){
	var roadarr = [];                          //三维数组
	for(var i = 0; i < coors.length; i++){
		var road_lonlat = coors[i].split(",");
		roadarr[i] = [];
		roadarr[i] = createCoords(road_lonlat);
	}
	console.log(roadarr);

	var road_lonlat = coors[0].split(",");    //以用户选中路段的起点作为地图中心点
	var centerpoint = bd_encrypt(road_lonlat[0],road_lonlat[1]);	
	
	var myChart = echarts.init(document.getElementById('dituContent'));
	myChart.showLoading({color: '#069',});   
	var option = {
        bmap: {
            center: centerpoint,
            zoom: 15,
            roam: true,
            mapStyle: {
                styleJson: [{
                    'featureType': 'water',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'land',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#f3f3f3'
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#fdfdfd'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'poi',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'green',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'subway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'manmade',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'local',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'boundary',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#fefefe'
                    }
                }, {
                    'featureType': 'building',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#d1d1d1'
                    }
                }, {
                    'featureType': 'label',
                    'elementType': 'labels.text.fill',
                    'stylers': {
                        'color': '#000'
                    }
                }]
             }
        },
        series: [
        {
            type: 'lines',
            coordinateSystem: 'bmap',
            zlevel: 1,
            effect: {       //设置拖尾效果
                show: true,
                period: 6,
                trailLength: 0.8,
                color: col,
                symbolSize: 6
            },
            lineStyle: {
                normal: {
                    color:col,
                    width: 0,
                    curveness: 0.2
                }
            },
            data: roadarr, 
            polyline: true,
        },
        {                    //设置线段效果
            type: 'lines',
            coordinateSystem: 'bmap',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke'
            },
            effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbol: 'arrow',
                symbolSize: 10
            },
            data: [
            	roadarr[0],           
            ],
            polyline: true,
            lineStyle: {
            normal: {
				color: col,
                width: 3,
                opacity: 0.6,
                curveness: 0.2  //有polyline时curveness不可用
            }
            },
        },
        ]
    };
    
    myChart.hideLoading();
	myChart.setOption(option);   
	
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
	
