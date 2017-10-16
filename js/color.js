//将HSL转化成RGB

//定义全局变量
var newRGB =[];

function transfer(H,S,L){
	H = H/360;		
	if ( S == 0 ){                            //HSL from 0 to 1
   		var R = L * 255;                      //RGB results from 0 to 255
   		var G = L * 255;
   		var B = L * 255;
	}
	else{
   		if ( L < 0.5 ) var var_2 = L * ( 1 + S );
   		else           var_2 = ( L + S ) - ( S * L );

   		var var_1 = 2 * L - var_2;

   		R = 255 * Hue_2_RGB( var_1, var_2, H + ( 1 / 3 ) ); 
   		G = 255 * Hue_2_RGB( var_1, var_2, H );
   		B = 255 * Hue_2_RGB( var_1, var_2, H - ( 1 / 3 ) );
	}
	newRGB[0] = R;
	newRGB[1] = G;
	newRGB[2] = B;
	for(var i=0 ; i<3 ; i++){
		newRGB[i] = Math.round(newRGB[i]);
	} 
}
		
function Hue_2_RGB( v1, v2, vH ){       
   	if ( vH < 0 ) vH += 1;
   	if ( vH > 1 ) vH -= 1;
   	if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH );
   	if ( ( 2 * vH ) < 1 ) return ( v2 );
   	if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );
  	return (v1);
}
		