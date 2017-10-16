<?php
    header('Access-Control-Allow-Origin:*');
	header('Content-Type:text/html; charset=utf-8 ');
	$con = mysql_connect('localhost:3306', 'ITS', '123321');
	if (!$con){
		die('Could not connect'.mysql_error());
	}
	mysql_select_db('its', $con);  
    
	$tdate=$_GET["d"];   
	$x1=$_GET["r"];      
	$time=$_GET["t"];  
	
	//先取目标路段及一阶邻接路段[time-8h,time-1]历史速度（含当天）
	$date = [];
	$date[0] = date('Y-m-d',strtotime("$tdate - 10 day"));
	for($p=0;$p<11;$p++){
		if($p!=0){
			$tempt = $date[$p-1];
			$date[$p] = date('Y-m-d',strtotime("$tempt + 1 day"));
		}	
				
		$s1 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$date[$p]' and ID='$x1'");
		$row = mysql_fetch_array($s1);
		$tspeed = explode(',',$row['speed']);
		for($j=$time-48;$j<$time;$j=$j+1){
			echo $tspeed[$j].",";
		}		
	}
	echo "|";
		
	$rel=mysql_query("SELECT related FROM firstorder WHERE road='$x1'"); //find adjacent coefficinet first
	$row = mysql_fetch_array($rel);
    $res= $row['related'];
    $related = explode(',',$res);  	
    	
    $num = 0;                                           //将有速度的邻接路段输出
	for($i=0;$i<count($related)-1;$i=$i+1){
		$seq=mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$date[0]' and ID='$related[$i]'");
		$row = mysql_fetch_array($seq);
		if ($row == false)                             //查询不到该路段的速度值，跳过
			continue;		
			
		for($p=0;$p<11;$p++){
			if($p!=0){
				$tempt = $date[$p-1];
				$date[$p] = date('Y-m-d',strtotime("$tempt + 1 day"));
			}					
			$s2 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$date[$p]' and ID='$related[$num]'");
			$row = mysql_fetch_array($s2);
			$cspeed = explode(',',$row['speed']);
			for($j=$time-48;$j<$time;$j=$j+1){
				echo $cspeed[$j].",";
			}
		}
		echo "|";
		$num = $num + 1;
	}
	
	mysql_close($con); 	
?>