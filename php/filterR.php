<?php
    header('Access-Control-Allow-Origin:*');
	header('Content-Type:text/html; charset=utf-8 ');
	$con = mysql_connect('localhost:3306', 'ITS', '123321');
	if (!$con){
		die('Could not connect'.mysql_error());
	}
	mysql_select_db('its', $con);  
    
	$t=$_GET["t"];   
	$r=$_GET["r"];   //roadT
	$s=$_GET["s"];   //threshold
	
 	$rel=mysql_query("SELECT related FROM allorder WHERE road='$r'"); //find adjacent coefficinet first
	$row = mysql_fetch_array($rel);
    $res= $row['related'];
    $related = explode(',',$res);  						 //邻接关系
    
    $sear=mysql_query("SELECT coors FROM road WHERE code='$r'");   //返回目标路段经纬度
	$row = mysql_fetch_array($sear);
	echo $row['coors']."|";   
	
	$target=mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$t' and ID='$r'"); 
	$row = mysql_fetch_array($target);
	$tspeed = explode(',',$row['speed']);               //目标路段速度序列
	
	
	for($i=0;$i<count($related)-1;$i=$i+1){
		$sql[$i]=mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$t' and ID='$related[$i]'");
		$row = mysql_fetch_array($sql[$i]);
		if ($row == false)                              //查询不到该路段的速度值，跳过
			continue;
		$cspeed = explode(',',$row['speed']);           //邻接路段速度序列
   		$temp = 0;
   		$res_r = 0;   
   		$res_d = 0;
   		for($delay=0;$delay<=60;$delay=$delay+10){     	
       		if(abs(cor($delay,$tspeed,$cspeed)) > abs($temp)){
            	$temp = cor($delay,$tspeed,$cspeed);
            	$res_r = $temp;
            	$res_d = $delay/60;
			}
		}
		if(abs($res_r)>=$s){                            //若相关系数不小于阈值
			echo $related[$i].",".$res_r.",".$res_d.";";
			$sear=mysql_query("SELECT coors FROM road WHERE code='$related[$i]'");
			$row = mysql_fetch_array($sear);
			echo $row['coors']."|";
		}	
   
   	}
 	

	function cor($de,$ts,$cs){   //计算相关系数：cs对ts的影响
    	$de=$de/10;
    	$sum_ts=0;
    	$sum_cs=0;
    	for($count=0;$count<144-$de;$count=$count+1){
    		$sum_ts=$sum_ts+$ts[$count+$de];
    		$sum_cs=$sum_cs+$cs[$count];
    	}
    	$avg_ts=$sum_ts/(144-$de);
    	$avg_cs=$sum_cs/(144-$de);
    	$num=0;
    	$den1=0;
    	$den2=0;
    	for($count=0;$count<144-$de;$count=$count+1){
    		$num = $num + ($ts[$count+$de]-$avg_ts)*($cs[$count]-$avg_cs);
    		$den1 = $den1 + pow(($ts[$count+$de]-$avg_ts),2);
    		$den2 = $den2 + pow(($cs[$count]-$avg_cs),2);
    	}
    	$den = sqrt($den1*$den2);
		if($den==0)
    		$r=0;
    	else 
    		$r = $num/$den; 
    	return $r;
	}
	
	mysql_close($con); 	


// 返回数据格式:
// ...,目标路段经纬度,... | ID,r,d;......,筛选路段经纬度,...|

?>



 