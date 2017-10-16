<?php
    header('Access-Control-Allow-Origin:*');
	header('Content-Type:text/html; charset=utf-8 ');
	//header('Content-type: text/json');                          //返回json格式
	$con = mysql_connect('localhost:3306', 'ITS', '123321');
	if (!$con){
		die('Could not connect'.mysql_error());
	}
	mysql_select_db('its', $con);  
    
	$t=$_GET["t"];   
	$p=$_GET["p"]; 
	$x1=$_GET["x1"];  //road_target
	$x2=$_GET["x2"];  //road_selection[]
	$x2 = explode(',',$x2); //按逗号分离字符串 
//	for($i=0;$i<count($x2);$i=$i+1){
//		echo $x2[$i]."|";
//	}	
	
	$start=(int)$p-1;      //设置高峰时段的起始时间
	if($start==0)
		$end=$start+144;
	else if($start==96)
		$end=$start+18;
	else 
		$end=$start+12;
		
	$rel=mysql_query("SELECT related FROM allorder WHERE road='$x1'"); //find adjacent coefficinet first
	$row = mysql_fetch_array($rel);
    $res= $row['related'];
    $related = explode(',',$res); 
//	for($i=0;$i<count($related)-1;$i=$i+1) 
//		echo count($related).":".$related[$i].".";                         //邻接关系
	
	$ids = [];
	$r = [];
	$d = [];
	$num = 0;        //邻接路段数量
	
	
	for($i=0;$i<count($x2);$i=$i+1){
    	$marker=0;
    	for($j=0;$j<count($related)-1;$j=$j+1){	
        	if($x2[$i]==(int)$related[$j]){
        		$marker=1;
        		break;
        	}		
   		} 
		if($marker==1){              //路段邻接
			$ids[$num]=$x2[$i];
			echo $ids[$num].",";
			$num+=1;
			
			$time = [];              //计算21天的相关系数
			$time[0] = date('Y-m-d',strtotime("$t - 10 day"));
			for($p=0;$p<21;$p++){
				if($p!=0){
					$tempt = $time[$p-1];
					$time[$p] = date('Y-m-d',strtotime("$tempt + 1 day"));
				}	
				
				$s1 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$time[$p]' and ID='$x1'");
				$row = mysql_fetch_array($s1);
				$aspeed = explode(',',$row['speed']);
				$s2 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$time[$p]' and ID='$x2[$i]'");
				$row = mysql_fetch_array($s2);
				$bspeed = explode(',',$row['speed']);
			
				$temp = 0;        
				$r[$p] = 0;
				$d[$p] = 0;
    			for($delay=0;$delay<=60;$delay=$delay+10){
        			if(abs(cor($delay,$aspeed,$bspeed,$start,$end)) > $temp){
            			$temp = abs(cor($delay,$aspeed,$bspeed,$start,$end));
            			$r[$p] = cor($delay,$aspeed,$bspeed,$start,$end);
            			$d[$p] = $delay/60;
					}
				}
				echo $r[$p]." ";	
			} // end of for p
			echo ";";
		} // end of if
			
		else
			continue;
	} //end of for i


	function cor($de,$as,$bs,$start,$end){   //as对bs的影响 
    	$de=$de/10;
    	$sum_as=0;
    	$sum_bs=0;
	  	for($count=$start;$count<($end-$de);$count=$count+1){
	  	//for($count=0;$count<144-$de;$count=$count+1){
    		$sum_bs=$sum_bs+$bs[$count+$de];
    		$sum_as=$sum_as+$as[$count];
    	}
    	$avg_bs=$sum_bs/($end-$start-$de);
    	$avg_as=$sum_as/($end-$start-$de);
    	$num=0;
    	$den1=0;
    	$den2=0;
    	for($count=$start;$count<($end-$de);$count=$count+1){
    		$num = $num + ($bs[$count+$de]-$avg_bs)*($as[$count]-$avg_as);
    		$den1 = $den1 + pow(($bs[$count+$de]-$avg_bs),2);
    		$den2 = $den2 + pow(($as[$count]-$avg_as),2);
    	}
    	$den = sqrt($den1*$den2);
		if($den==0)
    		$r=0;
    	else 
    		$r = $num/$den;  		
    	return $r;
	}
	


	
//	$ids = [212, 181, -335, 49, 2150];
//	for($i=0;$i<count($ids);$i=$i+1){
//		echo $ids[$i].",";
//	}
	
//	$r=[[0.850, 0.740, 0.900, 0.70, 0.930, 0.850, 0.950, 0.980, 0.980, 0.880, 1.00, 0.980, 0.930, 0.650, 0.760, 0.810, 0.1000, 0.1000, 0.960, 0.960],
//		[0.960, 0.940, 0.960, 0.940, 0.880, 0.800, 0.850, 0.880, 0.900, 0.840, 0.830, 0.790, 0.810, 0.880, 0.880, 0.830, 0.800, 0.790, 0.760, 0.800],
//  	[0.890, 0.810, 0.810, 0.820, 0.800, 0.770, 0.760, 0.740, 0.750, 0.760, 0.910, 0.920, 0.890, 0.860, 0.880, 0.720, 0.840, 0.850, 0.850, 0.780],
//  	[0.880, 0.880, 0.880, 0.860, 0.720, 0.720, 0.620, 0.860, 0.970, 0.950, 0.880, 0.910, 0.850, 0.870, 0.840, 0.840, 0.850, 0.840, 0.840, 0.840],
//  	[0.890, 0.840, 0.780, 0.810, 0.760, 0.810, 0.790, 0.810, 0.820, 0.850, 0.870, 0.870, 0.810, 0.740, 0.810, 0.940, 0.950, 0.800, 0.810, 0.870]
//     ];
	
//	for($i=0;$i<count($r);$i=$i+1){
//		for($j=0;$j<count($r[$i]);$j=$j+1)
//			echo $r[$i][$j]." ";
//		echo ";";
//	}
	
	mysql_close($con); 	
?>