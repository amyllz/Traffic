var time=0;
var road=0;

$(document).ready(function(){ 
	$(".filter-option").text("Multiple Choice : No., correlation coefficent");
})

function search(){   //查询路段的相关性并排序
	//清楚选框中内容
	$("#id_select").empty();
	$(".inner").empty();
	$(".filter-option").text("Please wait");
//获取用户选择的路段编号	
	var road=document.getElementById("roadnum0").value;
	var time=document.getElementById("datetimepicker2").value;
	console.log(road);
	console.log(time);
	
	var userData='http://10.15.198.248:8080/hxy/php/fetchSpeed.php';   //把速度取回来在前端计算
	userData=userData+"?q="+'123';
	userData=userData+"&r="+road;
	userData=userData+"&t="+time;
	userData=userData+"&m="+1;                                        //多路段取速度标志
	userData=userData+"&sid="+Math.random();
	$.get(userData, function (data, textStatus){		
//		console.log(data);
		var segment = data.split("|");
		var segment_ID = [];
		var segment_r = [];
		segment_r[0] = 0;         //自相关系数，先不管
		var single = [];
//		console.log(segment);
		for(var i = 0; i < segment.length - 1; i++){
			segment_ID[i] = segment[i].split(":")[0];
			single[i] = (segment[i].split(":")[1]).split(",");
		}
//		console.log(segment_ID);
		console.log(single);		
		for(var i = 1;i < segment.length - 1;i++){  //对每一条邻接路段计算相关系数
			var maxi = [];                          //储存每天最大的相关系数
			for(var t = 0;t < 11;t++){
				var sumd = [];
				maxi[t] = 0;
				for(var delay = 1;delay <= 6;delay++){
					sumd[delay-1] = cor(delay,single[0].slice(t*66,(t+1)*66),single[i].slice(t*66,(t+1)*66)); //返回一个新的数组，包含 start~end-1的 arrayObject中的元素
					if(Math.abs(sumd[delay-1])>Math.abs(maxi[t]))                 
						maxi[t] = sumd[delay-1];
				}
			}
			console.log(maxi);
			//对maxi排序并找出中位数储存在segment_r中
			maxi = bubble(maxi);
			segment_r[i] = maxi[Math.ceil(maxi.length/2)-1];	
		}		
		Sort(segment_ID,segment_r);//不用赋值也会改变
		console.log(segment_ID);
		console.log(segment_r);

		var length = segment_ID.length;
		if(length == "0"){
			alert("该路段无相关路段，请重新选择！");
		}
		else{
			$(".filter-option").text("Multiple Choice : No., correlation coefficent");
			for(i = 0; i < length; i++){
				$("#id_select").append("<option value='" + segment_ID[i] + "'>" + segment_ID[i] + "</option>");
				$(".inner").append(
					"<li rel='" + i +"' class><a tabindex='0' class style><span class='text'>"+ segment_ID[i] + " , " + segment_r[i] + "</span><i class='glyphicon glyphicon-ok icon-ok check-mark'></i></a></li>"
				);
			}
		}
	});
		
}


/***************功能2：创建拥堵时间轴*****************************/
function createevent(){     
	var road=document.getElementById("roadnum1").value;
	var time=document.getElementById("datetimepicker2").value;
	
	var userData='http://10.15.198.248:8080/hxy/php/fetchSpeed.php';
	userData=userData+"?q="+'123';
	userData=userData+"&r="+road;
	userData=userData+"&t="+time;
	userData=userData+"&m="+0;                          //单路段取速度标志
	userData=userData+"&sid="+Math.random();
	//取历史速度(包括当天)并计算
	$.get(userData, function (data, textStatus){		//寻找拥堵事件
		
		var tspeed = [];
		tspeed = data.split(",");
		var event = [];                        
		var i = 0;
		while(i < 66){                                 //储存拥堵事件的起止时间
			if(tspeed[i] <= 25){
				var count = 1;
				for(var j = i + 1; j<tspeed.length-1 ; j = j + 1){
					if(tspeed[j] <= 25)
						count = count + 1;
					else{
						if(count > 2)
							event.push([i,j-1]);
						break;
					}										
				}
				i = i + count;
			}
			else
				i = i + 1;
		}
		console.log(event);
		
		//按照用户输入信息重新配置echarts
		var edata = [];
		for(var i = 0; i<event.length; i++){
			for(var j = event[i][0]; j<event[i][1]; j++){
				edata.push([0,j,tspeed[j]]);
			}
		}		
		var myChart = echarts.init(document.getElementById('mainchart'));
        var hours = ['11:00', '11:10', '11:20', '11:30', '11:40', '11:50','12:00', '12:10', '12:20', '12:30', '12:40', '12:50','13:00', '13:10', '13:20', '13:30', '13:40', '13:50','14:00', '14:10', '14:20', '14:30', '14:40', '14:50','15:00', '15:10', '15:20', '15:30', '15:40', '15:50','16:00', '16:10', '16:20', '16:30', '16:40', '16:50','17:00', '17:10', '17:20', '17:30', '17:40', '17:50','18:00', '18:10', '18:20', '18:30', '18:40', '18:50','19:00', '19:10', '19:20', '19:30', '19:40', '19:50','20:00', '20:10', '20:20', '20:30', '20:40', '20:50','21:00', '21:10', '21:20', '21:30', '21:40', '21:50','22:00', '22:10', '22:20', '22:30', '22:40', '22:50',];
		var id = ['Road '+ road];
		
		option = {
    		tooltip: {
        		position: 'top'
    		},
    		title: [],
    		singleAxis: [],
    		series: [],
		};

		echarts.util.each(id, function (id, idx) {
    		option.title.push({
        		textBaseline: 'middle',
        		//top: (idx + 0.5) * 100 / 7 + '%', //位置
        		top: 50 + '%', 
        		text: id
    		});
    		option.singleAxis.push({
        		left: 150,
        		type: 'category',
        		boundaryGap: false,
        		data: hours,
        		//top: (idx * 100 / 7 + 5) + '%',
        		top: 50 + '%', 
        		height: (100 / 7 - 10) + '%',
        		axisLabel: {
            		interval: 5            //控制时间间隔
        		}
    		});
    		option.series.push({
        		singleAxisIndex: idx,
        		coordinateSystem: 'singleAxis',
        		type: 'scatter',
        		data: [],
        		itemStyle: {
            		normal:{
            			color:'#69c',
            		}
            	},
        		symbolSize: function (dataItem) {
            		return (30 - dataItem[1]) * 2;  //控制圆的半径
        		}
    		});
		});
		
		echarts.util.each(edata, function (dataItem) {
    		option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
		});

        myChart.setOption(option); // 使用刚指定的配置项和数据显示图表
        
        myChart.on('click', function (params) {           //chart的点击事件
    		var index = params.data[0];                   //获取点击的时间
    		console.log(index);
    		//获取该拥堵事件的起始时间
    		for(var i = 0; i<event.length; i++){
				if(index>=event[i][0] && index<=event[i][1]){
					var congid = i;                       //记录选中的是哪一个事件
					var pretime = event[i][0] + 66;       //真实的拥堵开始时间
				}
			}	
			console.log(pretime);
    		
    		//连接数据库，取回历史速度并预测
			var road=document.getElementById("roadnum1").value;
			var tdate=document.getElementById("datetimepicker2").value;
			var userData='http://10.15.198.248:8080/hxy/php/histspeed.php';   //把速度取回来在前端计算
			userData=userData+"?q="+'123';
			userData=userData+"&r="+road;
			userData=userData+"&d="+tdate;
			userData=userData+"&t="+pretime;           
			userData=userData+"&sid="+Math.random();
			$.get(userData, function (data, textStatus){		
				var group = [];
				var group = data.split("|");
				for(var i = 0; i < group.length - 1; i++){
					group[i] = group[i].split(",");
				}
//				console.log(group);		    //i*(0~48*11)
				
				var ahead = [0,0];          //最多可以提前多久准确预测[多路段，单路段]
				var theta = 0.1;            //拥堵阈值
				var n = 4*6;                //n--历史速度序列长度
				for(var horizon=12;horizon>0;horizon--){   //多路段预测
					var c = [];
					var c1 = selfcor(group,horizon,n);
					var c2 = mutcor(group,horizon,n);
					for(var d=0;d<6;d++)   //矩阵相加
						 c[d] = c1[d] + c2[d];
					var corr = Math.max.apply(null,c);
//					console.log(corr);
					if(corr >= theta){      //预测为拥堵
						ahead[0] = horizon*10;
						break;
					}
				}
				for(var horizon=12;horizon>0;horizon--){    //单路段预测
//					console.log(selfcor(group,pretime,horizon,n));
					var corr = Math.max.apply(null,selfcor(group,horizon,n));
					if(corr >= theta){      //预测为拥堵
						ahead[1] = horizon*10;
						break;
					}
				}
				console.log(ahead);
				setEcharts(road,tspeed,event,congid,ahead,'#77c');			
			});  //end of get(predict)
    	}); //end of mychart.on
        
	});//end of get()
	
}


function setEcharts(road,tspeed,event,congid,ahead,color){   //重新配置echarts
	
	var myChart = echarts.init(document.getElementById('mainchart'));
	var hours = ['11:00', '11:10', '11:20', '11:30', '11:40', '11:50','12:00', '12:10', '12:20', '12:30', '12:40', '12:50','13:00', '13:10', '13:20', '13:30', '13:40', '13:50','14:00', '14:10', '14:20', '14:30', '14:40', '14:50','15:00', '15:10', '15:20', '15:30', '15:40', '15:50','16:00', '16:10', '16:20', '16:30', '16:40', '16:50','17:00', '17:10', '17:20', '17:30', '17:40', '17:50','18:00', '18:10', '18:20', '18:30', '18:40', '18:50','19:00', '19:10', '19:20', '19:30', '19:40', '19:50','20:00', '20:10', '20:20', '20:30', '20:40', '20:50','21:00', '21:10', '21:20', '21:30', '21:40', '21:50','22:00', '22:10', '22:20', '22:30', '22:40', '22:50',];
	var id = ['Road '+ road];
	
	var data = [];
    for(var i = 0; i<event.length; i++){
		if(congid == i)
			for(var j = event[i][0]; j<event[i][1]; j++)
				data.push([0,j,tspeed[j]]);
	}
    if(ahead[0]!=0)                                     //等于0说明无法正确预测
    	data.push([0,event[congid][0]-ahead[0]/10,21]); //多路段
    if(ahead[1]!=0)
    	data.push([0,event[congid][0]-ahead[1]/10,19]); //单路段
		
	option = {
    	tooltip: {
        	position: 'top'
    	},
    	title: [],
    	singleAxis: [],
    	series: [],
	};

	echarts.util.each(id, function (id, idx) {
    	option.title.push({
        	textBaseline: 'middle',
        	//top: (idx + 0.5) * 100 / 7 + '%', //位置
        	top: 50 + '%', 
        	text: id
    	});
    	option.singleAxis.push({
        	left: 150,
        	type: 'category',
        	boundaryGap: false,
        	data: hours,
        	//top: (idx * 100 / 7 + 5) + '%',
        	top: 50 + '%', 
        	height: (100 / 7 - 10) + '%',
        	axisLabel: {
            	interval: 5            //控制时间间隔
        	}
    	});
    	option.series.push({
        	singleAxisIndex: idx,
        	coordinateSystem: 'singleAxis',
        	type: 'scatter',
        	data: [],
        	itemStyle: {
            	normal:{
            		color:color,
            	}
            },
        	symbolSize: function (dataItem) {
            	return (30 - dataItem[1]) * 2;  //控制圆的半径
        	}
    	});
	});

	echarts.util.each(data, function (dataItem) {
      	option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
	});
        
    myChart.setOption(option); // 使用刚指定的配置项和数据显示图表  		
}



function bubble(m){     //冒泡排序算法
	for(var j = 0; j <m.length; j++){
		for(var k = j+1; k <m.length; k++){
			if(m[j]>m[k]){
				var temp = m[j];
				m[j] = m[k];
				m[k] = temp;
			}
		}
	}
	return m;
}

function Sort(a,b) {   //对相关系数进行绝对值降序排列
	for(var i = 0; i < a.length; i++)
		for(var j = i + 1; j < a.length; j++)
			if(Math.abs(b[i]) < Math.abs(b[j])) {
				var temp0 = a[i];
				a[i] = a[j];
				a[j] = temp0;
				var temp1 = b[i];
				b[i] = b[j];
				b[j] = temp1;
			}
	return [a,b];
}

function cor(de,ts,cs){   //计算相关系数：cs对ts的影响 	   
    var n = ts.length;    //速度序列长度
    var sum_ts=0; 
    var sum_cs=0;
    for(var count=0;count<n-de;count=count+1){
    	sum_ts=sum_ts+parseFloat(ts[count+de]);
    	sum_cs=sum_cs+parseFloat(cs[count]);
    }
    var avg_ts=sum_ts/(n-de);
    var avg_cs=sum_cs/(n-de);
    var num=0;
    var den1=0;
    var den2=0;
    for(count=0;count<n-de;count=count+1){
    	num = num + (parseFloat(ts[count+de])-avg_ts)*(parseFloat(cs[count])-avg_cs);
    	den1 = den1 + Math.pow((parseFloat(ts[count+de])-avg_ts),2);
    	den2 = den2 + Math.pow((parseFloat(cs[count])-avg_cs),2);
    }
    den = Math.sqrt(den1*den2);
	if(den==0)
    	r=0;
    else 
    	r = num/den; 
    return r;  
}

function selfcor(data,horizon,n){
	var sums = [];                  //储存不同时延下的自相关系数加和值
	for(var delay=1;delay<=6;delay++){
		sums[delay-1] = 0;
		for(var i=0;i<10;i++){      //10days
			temp = cor(delay,data[0].slice(528-horizon-n+1,528-horizon+1),data[0].slice((i+1)*48-horizon-n+1,(i+1)*48-horizon+1));
			if(data[0][(i+1)*48-horizon] <= 25)
				var status = 1;
			else
				var status = 0;
			sums[delay-1]  = sums[delay-1]  + temp * status;		
		}
		sums[delay-1] = sums[delay-1]/10;
	}
	return sums;
}

function mutcor(data,horizon,n){	            //考虑多路段影响
	var summ = [];                              //储存不同时延下的互相关系数加和值	
	for(var delay=1;delay<=6;delay++){
		summ[delay-1] = 0;
		for(var i=1;i<data.length-1;i++){       //对每条邻接路段
			var x = 0;			
			for(var j=0;j<11;j++){               //11days
				var stemp = data[0].slice((j+1)*48-horizon-n+1,(j+1)*48-horizon+1);
				var ctemp = data[i].slice((j+1)*48-horizon-n+1,(j+1)*48-horizon+1);
				if (data[i][(j+1)*48-horizon] <= 25)  //邻接路段每天[time-horizon]的拥堵状态
					var status = 1;
				else
					var status = 0;
				x = x + status * cor(delay,stemp,ctemp)/11;  //每条邻接路段的相关系数取平均
			}   
			summ[delay-1]  = summ[delay-1]  + x;
		}
		summ[delay-1] = summ[delay-1]/(data.length-2);
	}
//	console.log(summ);
	return summ;
}
