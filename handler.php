<?php

$response = array(
  'data'=>'couldnt find page',
  'status'=>'failed'
);

if(isset($_GET['url'])){


  $ch = curl_init($_GET['url']);
  curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1) ;
  $response['data'] = curl_exec($ch);
  curl_close($ch);

  $response['status']='success';

}

ob_start();
echo json_encode($response);
ob_end_flush();
?>
