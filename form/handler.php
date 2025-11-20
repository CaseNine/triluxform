<?php
// include libraries autoloaded by php composer
require __DIR__ . '/vendor/autoload.php'; 

//echo '<pre>';
$data = file_get_contents('php://input');
$post = json_decode($data);
//var_dump($post);
//echo '</pre>';
//$post = json_decode($_POST);
$json = json_encode($post);
echo $json;