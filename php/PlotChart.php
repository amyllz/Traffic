<?php
    header('Access-Control-Allow-Origin:*');
	header('Content-Type:text/html; charset=utf-8 ');
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
	
	$start=(int)$p;      //设置高峰时段的起始时间		
	$end=$start+23;
	
	$target=mysql_query("SELECT speed FROM newspeed WHERE date='$t' and ID='$x1'"); 
	$row = mysql_fetch_array($target);
	$tspeed = explode(',',$row['speed']);               //目标路段速度序列
	for($j=$start-1;$j<$end;$j=$j+1){
		echo $tspeed[$j].",";
	}
	echo ";";
	
	//返回输入路段在指定时间内的速度序列
	for($i=0;$i<count($x2);$i=$i+1){
		$sql[$i]= mysql_query("SELECT speed FROM newspeed WHERE date='$t' and ID='$x2[$i]'"); 
		$row = mysql_fetch_array($sql[$i]);
		$speed = explode(',',$row['speed']);
		for($j=$start-1;$j<$end;$j=$j+1){
			echo $speed[$j].",";
		}
		echo ";";
	}
	
	mysql_close($con); 	
?>