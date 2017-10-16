<?php
    header('Access-Control-Allow-Origin:*');
	//header('Content-Type:text/html; charset=utf-8 ');
	header('Content-type: text/json');                          //返回json格式
	$con = mysql_connect('localhost:3306', 'ITS', '123321');
	if (!$con){
		die('Could not connect'.mysql_error());
	}
	mysql_select_db('its', $con);  
    
	$t=$_GET["t"];   
	$x1=$_GET["x1"];  //road_target
	$x2=$_GET["x2"];  //road_selection[]
	$x2 = explode(',',$x2); //按逗号分离字符串 
	
	$ids=[];	
	for($i=0;$i<count($x2);$i=$i+1){
		$ids[$i]=$x2[$i];
	}	
 	
// 	$start=strtotime($t);   //convert to timestamp
// 	$end = date('YmdHis',$start)+235000;  //one day
// 	echo date('YmdHis',$start).",".$end.".";
 	
 	$rel=mysql_query("SELECT related FROM allorder WHERE road='$x1'"); //find adjacent coefficinet first
	$row = mysql_fetch_array($rel);
    $res= $row['related'];
    $related = explode(',',$res);  	
//	for($i=0;$i<count($related)-1;$i=$i+1) 
//		echo count($related).":".$related[$i].".";                         //邻接关系
	
	$target=mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$t' and ID='$x1'"); 
	$row = mysql_fetch_array($target);
	$tspeed = explode(',',$row['speed']);
//	for($i=0;$i<count($tspeed)-1;$i=$i+1)              //速度序列末尾有，
//		echo $tspeed[$i]."|";                          //目标路段速度序列

	$r = [];
	$d = [];
	$num = 0;        //邻接路段数量

/**********若x2为多条路段，计算并返回每条路段对x1的影响系数**********/
	if(count($x2)>1){	
		for($i=0;$i<count($x2);$i=$i+1){
			$sql[$i]=mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$t' and ID='$x2[$i]'");
//			if(!$sql[$i]){
//  			echo "null";
//  			continue;
//			}
			$row = mysql_fetch_array($sql[$i]);
			$cspeed = explode(',',$row['speed']);
		
        	$marker=0;
        	for($j=0;$j<count($related)-1;$j=$j+1){	
        		if($x2[$i]==(int)$related[$j]){
        			$marker=1;
        			$num+=1;
        			break;
        		}		
        	} 
			if($marker!=1){              //路段不邻接
				//echo $marker.":".$row['ID']."|";
				$r[$i]=0;
				$d[$i]=0;
			}
			else{                        //路段邻接
				//echo $marker.":".$row['ID']."|";
				$temp = 0; 
				$r[$i] = 0;
				$d[$i] = 0;              
    			for($delay=0;$delay<=60;$delay=$delay+10){
        			if(abs(cor($delay,$tspeed,$cspeed)) > $temp){
            			$temp = abs(cor($delay,$tspeed,$cspeed));
            			$r[$i] = cor($delay,$tspeed,$cspeed);
            			$d[$i] = $delay/60;
					}
				}		
			} //end of else	
			//echo $ids[$i].":".$r[$i].",".$d[$i].";";
		}//end of for 
	
/**********若x2为多条路段，计算并返回该区域路段对x1的影响系数**********/
		$sum=[];
		for($q=0;$q<144;$q=$q+1){
       			$sum[$q]=0;
        }
		for($i=0;$i<count($x2);$i=$i+1){
			$sql[$i]=mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$t' and ID='$x2[$i]'");
			$row = mysql_fetch_array($sql[$i]);
			$sspeed = explode(',',$row['speed']);	
       		if($r[$i]==0)
       			$loc=0;                                     //是否邻接
       		else
       			$loc=1;
       		for($j=0;$j<144;$j=$j+1){
       			//$sum[$j]=$sum[$j]+$sspeed[$j]/count($x2);  
       			$sum[$j]=$sum[$j]+$loc*$sspeed[$j]/$num;     //用行标准化权重矩阵
       		}	
		}
		
		$temp = 0;
		$r[count($x2)] = 0;
		$d[count($x2)] = 0;           
    	for($delay=0;$delay<=60;$delay=$delay+10){
        	if(abs(cor($delay,$tspeed,$sum)) > $temp){
            	$temp = abs(cor($delay,$tspeed,$sum));
            	$r[count($x2)] = cor($delay,$tspeed,$sum);
            	$d[count($x2)] = $delay/60;
			}
		}
		$ids[count($x2)]="所有路段";
	
	} //end of if	


/**********若x2为单条路段，计算并返回1个月内该路段对x1的影响系数**********/
	else{	
 		$marker=0;
        for($j=0;$j<count($related)-1;$j=$j+1){	
        	if($x2[0]==(int)$related[$j]){
        		$marker=1;
        		break;
        	}		
       	 } 
		if($marker!=1){              //路段不邻接
			$r[0]=0;
		}
		else{
			$time = [];
			$time[0] = date('Y-m-d',strtotime("$t - 5 day"));
			for($p=0;$p<11;$p++){
				if($p!=0){
					$tempt = $time[$p-1];
					$time[$p] = date('Y-m-d',strtotime("$tempt + 1 day"));
				}	
				
				$s1 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$time[$p]' and ID='$x1'");
				$row = mysql_fetch_array($s1);
				$aspeed = explode(',',$row['speed']);
				$s2 = mysql_query("SELECT ID, date, speed FROM newspeed WHERE date='$time[$p]' and ID='$x2[0]'");
				$row = mysql_fetch_array($s2);
				$bspeed = explode(',',$row['speed']);
			
				$temp = 0; 
				$r[$p] = 0;
				$d[$p] = 0;         
    			for($delay=0;$delay<=60;$delay=$delay+10){
        			if(abs(cor($delay,$aspeed,$bspeed)) > $temp){
            			$temp = abs(cor($delay,$aspeed,$bspeed));
            			$r[$p] = cor($delay,$aspeed,$bspeed);
            			$d[$p] = $delay/60;
					}
				}
			}	
		}
	} //end of else


	function cor($de,$ts,$cs){   //cs对ts的影响
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

	if(count($x2)>1){
		$json = array ( 
    		"ids"  => $ids, 
    		"r" => $r, 
    		"d"   => $d,
		); 
	}	

	else{	
		$json = array ( 
    		"time" =>$time,
    		"r" => $r, 
    		"d"   => $d,
		); 
	}	
	
	echo json_encode($json);
	
//  $ids = [212, 181, 335, 49, 505, 2150];
//  $r = [0.5, 0.9847, -0.78, 0.13, -0.34, 0.21];
//  $d = [1/6, 1/3, 0, 1/3, 1/6, 2/3];	


	mysql_close($con); 	
?>
