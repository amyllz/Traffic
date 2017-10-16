<?php
    header('Access-Control-Allow-Origin:*');
	header('Content-Type:text/html; charset=utf-8 ');
	$con = mysql_connect('localhost:3306', 'ITS', '123321');
	if (!$con){
		die('Could not connect'.mysql_error());
	}
	mysql_select_db('its', $con);  
    
	$t=$_GET["t"];   
	$p=$_GET["p"];   //road_selection[]
	$m=$_GET["m"]; 
	//echo $t."|";
	$p = explode(',',$p); //按逗号分离字符串 
//	for($i=0;$i<count($p);$i=$i+1) 
//		echo $p[$i]." "; 
	
 	$sql=mysql_query("SELECT road.code, road.coors FROM road, roadspeed
					WHERE road.code=roadspeed.lcode and roadspeed.roadtime='$t'");

	while ($row = mysql_fetch_assoc($sql)){  //循环只能在这里面
        $res1= $row['code'];
        //$res1= $res1.","; 
        //echo $res1;    
		$res2= $row['coors'];
		$coor = explode(',',$res2); //按逗号分离字符串 
        //$countnum=0;	
        for($index=0;$index<count($coor);$index=$index+2){ 
			$marker=0;
			if(($m*$res1)>0 && $coor[$index]>=$p[0] && $coor[$index]<=$p[3] && $coor[$index+1]>=$p[2] && $coor[$index+1]<=$p[1] ){			
				continue;
			}
			else{
				$marker=1;
				break;
			} 
		}
		if($marker==0){
			//$countnum=$countnum+1;
			//$road_collection=$res1;
			echo $res1.",";  //输出字符串
		}
	}    
	

	mysql_close($con); 	
?>



 