<?php
    header('Access-Control-Allow-Origin:*');
	header('Content-Type:text/html; charset=utf-8 ');
	$con = mysql_connect('localhost:3306', 'ITS', '123321');
	if (!$con){
		die('Could not connect'.mysql_error());
	}
	mysql_select_db('its', $con);  
    
	$t=$_GET["t"];   
	$x1=$_GET["r"];       //road
	$flag=$_GET["m"];  
	
	/****************单路段取速度**********************/
	if($flag==0){
		$target=mysql_query("SELECT speed FROM newspeed WHERE date='$t' and ID='$x1'"); 
		$row = mysql_fetch_array($target);
		$tspeed = explode(',',$row['speed']);               //目标路段当天速度序列
		for($j=66;$j<132;$j=$j+1){
			echo $tspeed[$j].",";
		}
		echo ";";
	}
	
	
	/****************多路段取速度**********************/
	else if($flag==1){            //目标路段及一阶邻接路段历史速度（不含当天）
		$time = [];
		$time[0] = date('Y-m-d',strtotime("$t - 11 day"));
		echo $x1.":";
		for($p=0;$p<11;$p++){
			if($p!=0){
				$tempt = $time[$p-1];
				$time[$p] = date('Y-m-d',strtotime("$tempt + 1 day"));
			}	
				
			$s1 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$time[$p]' and ID='$x1'");
			$row = mysql_fetch_array($s1);
			$tspeed = explode(',',$row['speed']);
			for($j=66;$j<132;$j=$j+1){
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
			$seq=mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$time[0]' and ID='$related[$i]'");
			$row = mysql_fetch_array($seq);
			if ($row == false)                             //查询不到该路段的速度值，跳过
				continue;		
			echo $related[$num].":";
			
			for($p=0;$p<11;$p++){
				if($p!=0){
					$tempt = $time[$p-1];
					$time[$p] = date('Y-m-d',strtotime("$tempt + 1 day"));
				}					
				$s2 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$time[$p]' and ID='$related[$num]'");
				$row = mysql_fetch_array($s2);
				$cspeed = explode(',',$row['speed']);
				for($j=66;$j<132;$j=$j+1){
					echo $cspeed[$j].",";
				}
			}
			echo "|";
			$num = $num + 1;
		}
	}		
	mysql_close($con); 	
?>