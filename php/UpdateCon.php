<?php
    header('Access-Control-Allow-Origin:*');
	header('Content-Type:text/html; charset=utf-8 ');
	$con = mysql_connect('localhost:3306', 'ITS', '123321');
	if (!$con){
		die('Could not connect'.mysql_error());
	}
	mysql_select_db('its', $con);  
    
    
	$x1=$_GET["x1"];  //road_target
	$x2=$_GET["x2"];  //selected[]
	$x2 = explode(',',$x2); //按逗号分离字符串                 
	
	$rel=mysql_query("SELECT related FROM firstorder WHERE road='$x1'"); //find adjacent coefficinet first
	$row = mysql_fetch_array($rel);
    $res= $row['related'];
    $related = explode(',',$res);  	
	
	//输出拥堵起始路段经纬度
	$sql=mysql_query("SELECT coors FROM road WHERE code='$x1'");
	$row = mysql_fetch_array($sql);
	echo $x1.":".$row['coors']."|";
	
	//输出一阶相邻路段的经纬度
	for($i=0;$i<count($x2);$i=$i+1){
		for($j=0;$j<count($related)-1;$j=$j+1){	
        	if($x2[$i]==(int)$related[$j]){
				$sql=mysql_query("SELECT coors FROM road WHERE code='$x2[$i]'");
				$row = mysql_fetch_array($sql);
				echo $x2[$i].":".$row['coors']."|";
			}
		}
	}     
	
	mysql_close($con); 	
?>