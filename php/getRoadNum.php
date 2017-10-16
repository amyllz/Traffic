<?php
    header('Access-Control-Allow-Origin:*');
	header('Content-Type:text/html; charset=utf-8 ');
	$con = mysql_connect('localhost:3306', 'ITS', '123321');
	if (!$con){
		die('Could not connect'.mysql_error());
	}
	mysql_select_db('its', $con);
    
    $m=$_GET["m"];
	$t=$_GET["t"]; 
 	$sql=mysql_query("SELECT road.code, road.coors,roadspeed.speed,roadspeed.lcode,roadspeed.roadtime 
	FROM road, roadspeed WHERE road.code='$m' and roadspeed.lcode=road.code and roadspeed.roadtime='$t'");

	while ($row = mysql_fetch_array($sql)){
        $res1= $row['coors'];
		$res2= $row['speed'];
		echo $res1."|".$res2.";";
	}     
	mysql_close($con);
?>



 