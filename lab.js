function rgb2xyz(c)
{
  var R = red(c);
  var G = green(c);
  var B = blue(c);
  
  var var_R = ( R / 255. );       //R from 0 to 255
  var var_G = ( G / 255. );       //G from 0 to 255
  var var_B = ( B / 255. );       //B from 0 to 255
  
  if (var_R > 0.04045)   var_R = pow((var_R + 0.055) / 1.055, 2.4);
  else                   var_R = var_R / 12.92;
  if ( var_G > 0.04045 ) var_G = pow((var_G + 0.055 ) / 1.055, 2.4);
  else                   var_G = var_G / 12.92;
  if ( var_B > 0.04045 ) var_B = pow((var_B + 0.055 ) / 1.055, 2.4);
  else                   var_B = var_B / 12.92;
 
  var_R *= 100;
  var_G *= 100;
  var_B *= 100;
  
  //Observer. = 2°, Illuminant = D65
  var X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
  var Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
  var Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;
  var xyz = [X, Y, Z];
  return xyz;
}


function xyz2lab(xyz)
{
  var ref_X =  95.047;
  var ref_Y = 100.000;
  var ref_Z = 108.883;
  var var_X = xyz[0] / ref_X;          //ref_X =  95.047   Observer= 2°, Illuminant= D65
  var var_Y = xyz[1] / ref_Y;          //ref_Y = 100.000
  var var_Z = xyz[2] / ref_Z;          //ref_Z = 108.883
  
  if ( var_X > 0.008856 ) var_X = pow(var_X, ( 1./3 ));
  else                    var_X = ( 7.787 * var_X ) + ( 16. / 116 );
  if ( var_Y > 0.008856 ) var_Y = pow(var_Y, ( 1./3 ));
  else                    var_Y = ( 7.787 * var_Y ) + ( 16. / 116 );
  if ( var_Z > 0.008856 ) var_Z = pow(var_Z, ( 1./3 ));
  else                    var_Z = ( 7.787 * var_Z ) + ( 16. / 116 );
  
  var L = ( 116 * var_Y ) - 16;
  var a = 500 * ( var_X - var_Y );
  var b = 200 * ( var_Y - var_Z );
  var lab = [L, a, b];
  return lab;
}


function rgb2lab(c)
{
  var xyz = rgb2xyz(c);
  var lab = xyz2lab(xyz);
  return lab;
}