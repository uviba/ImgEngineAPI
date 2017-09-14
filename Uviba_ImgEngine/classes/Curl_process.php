<?php 
//below you can upload files which important thing to do
//http://stackoverflow.com/questions/4223977/send-file-via-curl-from-form-post-in-php
class Curl_process{

private $result='';


	public function send_data($url,$method="POST",$fields=array()){
		//$url = 'http://www.newtimebox.com/data/OOS/OOS_engine_key_data.php';

// $fields = array(
//         'expire_time'=>time()+60*60,
        
// );

$postvars='';
$sep='';
foreach($fields as $key=>$value)
{
        $postvars.= $sep.urlencode($key).'='.urlencode($value);
        $sep='&';
}
if($method=='GET'){
	$url=$url.$postvars;
}
$ch = curl_init();

curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_POST,count($fields));
if($method=='POST'){
	curl_setopt($ch,CURLOPT_POSTFIELDS,$postvars);
}
curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$result = curl_exec($ch);	 
$this->result = $result; 
curl_close($ch);
	}




	public function get_result(){
		return $this->result;
	}





}




