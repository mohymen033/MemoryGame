<?php 

//$post_url = "http://labs.funspot.tv/worktest_color_memory/colours.conf";

$post_url = $_GET['url'];
$curl_handle = curl_init();
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
//curl_setopt($curl_handle, CURLOPT_POST, 1);
curl_setopt($curl_handle, CURLOPT_URL, $post_url);
curl_setopt($curl_handle, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($curl_handle, CURLOPT_SSL_VERIFYHOST, 2);
$buffer = curl_exec($curl_handle);
curl_close($curl_handle);

$color_code = array();

$buffer_temp = explode("\n", $buffer);
for($i=0; $i<sizeof($buffer_temp); $i++)
{
  preg_match( '/(#[0-9a-f]{6}|#[0-9a-f]{3})/', $buffer_temp[$i], $matches);

  if(!empty($matches))
  {
	array_push($color_code, $matches[0]);  
  }
}
echo json_encode($color_code);

//print_r(json_encode($color_code));


?>