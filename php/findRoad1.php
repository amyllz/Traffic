<?php
    header('Access-Control-Allow-Origin:*');
	header('Content-Type:text/html; charset=utf-8 ');
	$con = mysql_connect('localhost:3306', 'ITS', '123321');
	if (!$con){
		die('Could not connect'.mysql_error());
	}
	mysql_select_db('its', $con);  
    
	$t=$_GET["t"];   
	$o=$_GET["o"];   //road_target
	$k=$_GET["k"];   
	$b=$_GET["b"];  
	$m=$_GET["m"];  
//	echo $o."|";	
	$o = explode(',',$o); //按逗号分离字符串 
//	for($i=0;$i<count($o);$i=$i+1) 
//		echo $o[$i]." "; 	
//	echo $k." ";
//	echo $b.";";
	
 	$sql=mysql_query("SELECT road.code, road.coors FROM road, roadspeed
					WHERE road.code=roadspeed.lcode and roadspeed.roadtime='$t'");  
	
	//$marker=0;	
	while ($row = mysql_fetch_array($sql)){  //循环只能在这里面
        $res1= $row['code'];
        //$res1= $res1.","; 
        //echo $res1;    
		$res2= $row['coors'];
		$coor = explode(',',$res2); //按逗号分离字符串 
        $countnum=0;
        
        for($index=0;$index<count($coor);$index=$index+2){ 
			//echo $coor[$index]." "; 
			$a=$k*$coor[$index]+$b-$coor[$index+1];		
			if(($m*$res1)>0 and $a>=-0.0003 and $a<=0.0003 and $coor[$index]-$o[0]>-0.001 and $coor[$index]-$o[1]<0.001 and $coor[$index+1]-$o[2]>-0.001 and $coor[$index+1]-$o[3]<0.001 ){ 
				$countnum=$countnum+1; 
				//echo $res1.":".(count($coor)/2).",".$a."|".$countnum.":";
				//echo $coor[$index].",".$coor[$index+1]." ";
			}
			if($countnum>=4){ 
				//$marker=1;
				echo $res1;				
				break;
			}
		}
		if($countnum>=4)
			break;
	}  
	
//	if($marker==0)
//		echo "null";  

	mysql_close($con); 	
?>



 