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
	
//	$start=(int)$p;      //设置高峰时段的起始时间
//	if($start==0)
//		$end=$start+144;
//	else if($start==97)
//		$end=$start+18;
//	else 
//		$end=$start+12;
		
	$rel=mysql_query("SELECT related FROM firstorder WHERE road='$x1'"); //find adjacent coefficinet first
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
//		if($marker==1){              //路段邻接
//			for($delay=0;$delay<=60;$delay=$delay+10){
//				$ids[$num]=$x2[$i];
//				echo $ids[$num].",";
//				$num+=1;
//			
//				$time = [];              //计算31天的相关系数
//				$time[0] = date('Y-m-d',strtotime("$t - 15 day"));
//				for($p=0;$p<31;$p++){
//					if($p!=0){
//						$tempt = $time[$p-1];
//						$time[$p] = date('Y-m-d',strtotime("$tempt + 1 day"));
//					}	
//				
//					$s1 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$time[$p]' and ID='$x1'");
//					$row = mysql_fetch_array($s1);
//					$aspeed = explode(',',$row['speed']);
//					$s2 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$time[$p]' and ID='$x2[$i]'");
//					$row = mysql_fetch_array($s2);
//					$bspeed = explode(',',$row['speed']);
//     
//					$r[$p] = 0;
//          		$r[$p] = cor($delay,$aspeed,$bspeed);
//          		//echo $r[$p]." ";
//				} // end of for p
//				echo "|";
//				
//				$sumr=0;
//				$sumd=0;
//				for($x=0;$x<31;$x++){       //找中位数
//					for($y=$x+1;$y<31;$y++){
//						if($r[$y]<$r[$x]){
//							$temp=$r[$y];
//							$r[$y]=$r[$x];
//							$r[$x]=$temp;
//						}
//					}
//				}//end of for x
//				echo $r[15].",".$delay.";";			
//			} // end of for delay
//			echo ";";
//		} // end of if

		if($marker==1){              //路段邻接
			$ids[$num]=$x2[$i];
			echo $ids[$num].",";
			$num+=1;
			
			$time = [];              //计算31天的相关系数
			$time[0] = date('Y-m-d',strtotime("$t - 15 day"));
			for($p=0;$p<31;$p++){
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
        			if(abs(cor($delay,$aspeed,$bspeed)) > $temp){
            			$temp = abs(cor($delay,$aspeed,$bspeed));
            			$r[$p] = cor($delay,$aspeed,$bspeed);
            			$d[$p] = $delay;
					}
				}
			} // end of for p
				
			for($x=0;$x<31;$x++){       //找中位数
				for($y=$x+1;$y<31;$y++){
					if($r[$y]<$r[$x]){
						$tempr=$r[$y];
						$r[$y]=$r[$x];
						$r[$x]=$tempr;
						$tempd=$d[$y];
						$d[$y]=$d[$x];
						$d[$x]=$tempd;
					}
				}
			}//end of for x
			echo $r[15].",".$d[15].";";	
		} // end of if
		
		else
			continue;
	} //end of for i


	function cor($de,$ts,$cs){   //cs对ts的影响
    	$de=$de/10;
    	$sum_ts=0;
    	$sum_cs=0;
	  	//for($count=$start;$count<($end-$de);$count=$count+1){
	  	for($count=97;$count<115-$de;$count=$count+1){
    		$sum_ts=$sum_ts+$ts[$count+$de];
    		$sum_cs=$sum_cs+$cs[$count];
    	}
    	$avg_ts=$sum_ts/(18-$de);
    	$avg_cs=$sum_cs/(18-$de);
    	$num=0;
    	$den1=0;
    	$den2=0;
    	for($count=97;$count<115-$de;$count=$count+1){
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
?>