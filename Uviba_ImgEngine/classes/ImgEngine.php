<?php 


class ImgEngine{


private $expire_hour = 1;
private $private_key;
private $secure;
private $secure_token;
private $key_file_path;
private $web_folder_url='';
private $connect_key=null;
private $ApiPath;
public $last_response=null;

public static $manipulate_param_error = "Manipulation param does not exist, if it is new param please update library to get it, if it didn't work , make sure param's name exists";
public static $instance;
	public function __construct($private_key,$new_expire_hour=12,$secure=true,$params=array()){
		//$Uviba_API_URL eslinde bos olmamali cunki
		//bu url ile script tag alinir ama bos olma sebebi evvelki method ile edenlerde de problem cixmasin
		$this->expire_hour=$new_expire_hour;
		$this->private_key=$private_key;
		if($secure===true){
			$this->secure=1;
		}else{
			$this->secure=0;
		}
		$this->key_file_path  = KEY_FILE_PATH;
		//asagidaki connect keyi yadda saxlamaq ucun cagrilib ve belelikle
		//connect key cagirmadan ishletmek mumkun olacaq
		$this->ApiPath = dirname(__DIR__);

		if(isset($params['web_folder_url'])){
			//oz serverindeki saytdan sekilleri ceksinler
			$this->web_folder_url = $params['web_folder_url'];
		}

		$this->get_connect_key();
	}

	public static function connect($private_key,$new_expire_hour=1,$secure=true,$params=array()){
		self::$instance = new ImgEngine($private_key,$new_expire_hour,$secure,$params);
	}


	

	/*
	public static function test(){
		// echo (__DIR__) .'<br/>' ;
		// echo (dirname(__DIR__)).'<br/>' ;
		//echo self::path2url(dirname(__DIR__));
		exit;
	}
public static function path2url($file_path, $Protocol='http://') {
		$file_path=str_replace('\\','/',$file_path);
		$file_path=str_replace($_SERVER['DOCUMENT_ROOT'],'',$file_path);
$file_path='http://'.$_SERVER['HTTP_HOST'].'/'.$file_path;
	    return $file_path;
	}
	*/ 

	//sonra url support da qoyarsan

	public function generate_new_key(){
		
		$curl_process = new Curl_process;
		$curl_process->send_data(Uviba_Data_Url,'POST',array(
			'expire_time'=>time()+60*60*$this->expire_hour,
			'private_key'=>$this->private_key,
			'secure'=>$this->secure,
			'web_folder_url'=>$this->web_folder_url,
			));
		$result_json_string = $curl_process->get_result();
		
		$this->write_file($this->key_file_path,$result_json_string);
		return $result_json_string;
		

	}
	public function isJson($string) {
	 json_decode($string);
	 return (json_last_error() == JSON_ERROR_NONE);
	}
	public function get_connect_key(){
		if(!is_null($this->connect_key)){
			//demeli cagrilib onda return edek
			return $this->connect_key;
		}
		$data = $this->read_file($this->key_file_path);
		if(!empty($data)){
			if($this->isJson($data)){
				$data_ar = json_decode($data,true);
				if(!isset($data_ar['expire_time'])){
					$data_ar['expire_time']=0;
				}
				if(!isset($data_ar['private_key'])){
					$data_ar['private_key']='';
				}
				if(!isset($data_ar['secure_token'])){
					$data_ar['secure_token']='';
					
				}
				if(!isset($data_ar['web_folder_url'])){
					$data_ar['web_folder_url']='';
					
				}
				$this->secure_token=$data_ar['secure_token'];
				if(!isset($data_ar['secure'])){
					$data_ar['secure']='';
				}
				if(time()+60*2>$data_ar['expire_time'] || $data_ar['private_key']!=$this->private_key  ){
					//it means key has been expired or private_key has been changed
				}else if($data_ar['secure']!=$this->secure){
					//demeli biri secure isteyir obiri yox yenisini generate etsin
				}else{
					
					if($data_ar['web_folder_url']!=$this->web_folder_url){
						//it means developer changed web_folder_url
					}else{
						//if json reached here it means before key is useful so lets use it
						$this->connect_key=$data_ar['new_key'];
						return $data_ar['new_key'];
					}

				}
			}
		}
		$data  = $this->generate_new_key();
		$data_ar = json_decode($data,true);
		if(!isset($data_ar['secure_token'])){
			$data_ar['secure_token']='';
			
		}
		if(!isset($data_ar['new_key'])){
			$data_ar['new_key']='';
			
		}
		$this->secure_token=$data_ar['secure_token'];
		$this->connect_key=$data_ar['new_key'];
		return $data_ar['new_key'];

	} 
	public function read_file($file_path,$mod='get_content',$params=array()){
		$offset_ready = isset($params['offset']);
			$limit_ready = isset($params['limit']);
		if($mod=='get_content' || $mod==''){
			//read one by one with limits

			if($offset_ready && $limit_ready){
				$result = file_get_contents($file_path, NULL, NULL, $params['offset'], $params['limit']);
			}else if($offset_ready){
				$result = file_get_contents($file_path, NULL, NULL, $params['offset']);
			}else{
				$result = file_get_contents($file_path, NULL, NULL);
			}
			
		}
		return $result;
	}
	public function write_file($file_path,$content=''){

		$fh = fopen($file_path, 'w');
		if(!$fh){
			//before it was die("Can't create file"); 
			return false;
		}
		fwrite($fh,$content);
		fclose($fh);
		return true;
	}

	public static $mp_func_ar_public=array(
				'height'=>'h',
				'h'=>'h',
				'width'=>'w',
				'w'=>'w',
				'fit'=>'fit',
				'orientation'=>'or',
				'or'=>'or',
				'dpr'=>'dpr',//Device pixel ratio
				'device pixel ratio'=>'dpr',
				'brightness'=>'bri',
				'bri'=>'bri',
				'contrast'=>'con',
				'con'=>'con',
				'gamma'=>'gam',
				'gam'=>'gam',
				'sharpen'=>'sharp',
				'sharp'=>'sharp',
				'pixel'=>'pixel',
				'pixelate'=>'pixel',
				'filt'=>'filt',
				'background'=>'bg',
				'bg'=>'bg',
				'border'=>'border',
				'quality'=>'q',
				'q'=>'q',
				'format'=>'fm',
				'fm'=>'fm',
				//asagidaki gelecekde olacaq ratio qorumadan resize edecek
				'ratio'=>'ratio',
				'crop'=>'crop',//w,h,x,y
				'zoom'=>'zoom',
				'opacity'=>'opacity',
				'blur'=>'blur',
				);
	public static $mp_multiple_func_ar_public=array('crop','border');
	public static function get_image_url($image_name,$manipulate_params='',$url_params=''){
		//for Resize Engine
		$send_image_with_get=false;
		if(urlencode($image_name)!=$image_name){
			$send_image_with_get=true;
		}
		if(is_array($manipulate_params)){
			//demeli arrayi cevirmeliyik
			$manipulate_params_ar = $manipulate_params;
			$manipulate_params='';
			$mp_func_ar = self::$mp_func_ar_public;
			foreach ($manipulate_params_ar as $mp => $val) {
				$mp=strtolower($mp);
				if(array_key_exists($mp, $mp_func_ar)){

					if(in_array($mp, self::$mp_multiple_func_ar_public) || 
						strpos($val,',')!==false){
						if(strpos($val, '(')===0){
							//demeli birinci ( budur onda hecne
						}else{
							//eger deyilse onda ekleyek
							$val='('.$val.')';
						}
					}
					if($manipulate_params!=''){
						$manipulate_params .= ',';
					}
					$manipulate_params.=$mp_func_ar[$mp].'_'.$val;
				}else{
					//not give error because if itt gave each ime we should update
					//throw new Exception(self::$manipulate_param_error, 1);
					if($manipulate_params!=''){
						$manipulate_params .= ',';
					}
					$manipulate_params.=$mp.'_'.$val;
				}
			}
		}
		$original_manipulate_params = $manipulate_params;
		if($manipulate_params!=''){
			$manipulate_params.='/';
		}
		if($url_params!=''){
			$url_params.='&';
		}
		//echo$image_name.$original_manipulate_params.$this->secure_token;
		$url_starting_point = Uviba_Images_Url.$manipulate_params;
		if($send_image_with_get===false){
			$url_starting_point.=$image_name.'?connect_key='.self::$instance->connect_key;
		}else{
			$url_starting_point.='?i='.$image_name.'&connect_key='.self::$instance->connect_key;
		}
		
		if(self::$instance->secure==1){
			//every image with manipulation params is unique and has unique sign
			return $url_starting_point.'&secure_token='.md5($image_name.$original_manipulate_params.self::$instance->secure_token).$url_params;
		}else{
			return $url_starting_point.$url_params;
		}
	}


	public static function get_uploader_scripts(){
		//mp_func_ar_public
		echo '<script type="text/javascript">
var mp_func_ar_public = '. json_encode(ImgEngine::$mp_func_ar_public).';
var manipulate_param_error = '. json_encode(ImgEngine::$manipulate_param_error).';
var uviba_UPLOAD_Url = \''.Uviba_UPLOAD_Url.'\';
var uviba_Images_Url = \''.Uviba_Images_Url.'\';
var uviba_API_CONNECT_KEY =\''.self::$instance->get_connect_key().'\';

</script><script type="text/javascript"  >'. file_get_contents(self::$instance->ApiPath.'/public/js/uploader_min.js').'
function uviba_oos_get_image(image_name,image_params){
if(image_params===undefined){
image_params="";
}
return uviba_Images_Url+"/"+image_params+"/"+image_name+"?connect_key="+uviba_API_CONNECT_KEY;
}
</script>';
	}



public static function is_auth(){
		if(self::$instance->connect_key===null){
			throw new Exception('please use ImgEngine::connect method to auth,then you will be able to use other methods', 1);
			exit;
		}
	}

//download file to own server

public static function download($file,$new_path,$filename=''){
		
		if(trim($filename)==''){
			$filename=uniqid(true).rand().uniqid(true).rand(9,9999).rand().rand(1,999999).time().'.jpg';
		}
	$res = self::upload($file,array('filename'=>$filename,'download_to_own'=>true,'own_path'=>$new_path));
	if($res!=false){
		return $filename;
	}
		return false;
	

}

public static function download_auto($upload_path,$filename){
		if(!isset($_POST['response_url_params'])){
			$_POST['response_url_params']='';
		}
		$file_path = $_FILES['file']['tmp_name'];
		$filename=self::download($file_path,$upload_path,$filename);
		$data  = array();
		$data['file_name']=$filename;
		$data['file_src']=self::get_image_url($filename,$_POST['response_url_params']);
		return $data;
//eyni ile upload etdiyin kimi return etmeli
//sonra bu function u setUploadUrl izahini yazarsan ve
//onun getdiyi url e bunu qoyanda ishleyer
//ya da en azinda file_url ve filename return etmeli
//eger basqa seye ehtiyaci olsa ozu echo etmemis arraya qoyar

//bununla da upload url deqiqlesir qalir qisalashdirmaq, video falan	

}

// Upload

public static function upload($file_path,$params=array()){
	self::is_auth();
  	$ch = curl_init();
  	$data=array();
  	$tempFileFlag=false;$tmpfname='';
  	$download_to_own=false;
  	if(isset($params['download_to_own'])){
  		if($params['download_to_own']===true){
  			$download_to_own=true;
  		}
  	}
  	//false yollasan bele orda serverde problem cixir
  	//$data['upload_filename']=false;
  	$filename = 'filename.png';
  	if(isset($params['filename'])){
  		$filename=$params['filename'];
  		//below will allow server to use this name when saving file to your OOS folder
  		$data['upload_filename']=true;
  	} 
  	if(!file_exists($file_path)){
  		$params['file_url']=$file_path;//try file like url
  	}
  	if(isset($params['file_url'])){
  		//$data['file_url']=$params['file_url'];
  		if (!filter_var($file_path, FILTER_VALIDATE_URL)) {
  			//url deyilse base64 olub olmadigina baxacaq
  			$img_code_string =base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $file_path) ) ;
			$image_dimensions = getimagesizefromstring($img_code_string);
			if(!$image_dimensions){
				//demeli hec biri deyil
				ImgEngine::give_error();
			}else{
				//demeli data uri dir
			}
  		}
$img = @file_get_contents($file_path);
if($img===false){
	
	ImgEngine::give_error();
}


//if it their server just put contents
if($download_to_own==false){
	$tmpfname = tempnam("/tmp", "UL_IMAGE");
}else{
	$tmpfname = $params['own_path'];
}
if(!is_writable($tmpfname)){
	ImgEngine::give_error(0,'upload folder is not writable');
}
$put_content_success = @file_put_contents($tmpfname.'/'.$filename, $img) or false;
$file_path=$tmpfname;
	$tempFileFlag=true;
  	}
  	//echo$tmpfname;
if($download_to_own!==false){
	//demeli pathdi ozunden ozune ya da $_FILES['filetoUpload']['tmpname'] di
	if(!is_writable($file_path)){
		ImgEngine::give_error(0,'upload folder is not writable');
	}
	$tmpfname = $params['own_path'];
	$img = @file_get_contents($file_path);
	if($img===false){
		
		ImgEngine::give_error();
	}
	$file_path=$tmpfname; 
	$put_content_success = @file_put_contents($tmpfname.'/'.$filename, $img) or false;
}

  	if($download_to_own===false){
  		//only will work if php version supports CurlFile!!!
		$data['file'] = new CurlFile($file_path, 'image/jpg',$filename );
	  	
	  	
		 
		curl_setopt($ch, CURLOPT_URL, Uviba_UPLOAD_Url.'?connect_key='.self::$instance->connect_key);
		curl_setopt($ch, CURLOPT_POST, 1);
		//CURLOPT_SAFE_UPLOAD defaulted to true in 5.6.0
		//So next line is required as of php >= 5.6.0
		curl_setopt($ch, CURLOPT_SAFE_UPLOAD, false);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$result = curl_exec($ch);
		//var_dump(curl_error($ch));
		self::$instance->last_response=$result;
		//echo($result);exit;
		if($tempFileFlag===true){
			if(file_exists($tmpfname)){
				unlink($tmpfname);
			}
		}
		//eger ozune yuklemirse
		//self::$instance->last_response=$result;
		if(self::$instance->isJson($result)){
					$data_ar = json_decode($result,true);
					//check errors in data_ar
			return $data_ar;
		}
  	}else{
		//download edirse ozune yukleyirse
		if($put_content_success!=false){
			return true;
		}
	}

	return false;
  }


  public static function give_error($error_code=2,$error_mes='it is not actual image'){
	$data['error']=true;
	$data['error_code']=$error_code;
	$data['error_mes']=$error_mes;
	return json_encode($data);
}

public static function getLastResponse(){
	return self::$instance->last_response;
}


public static function get_image_tag($image_name,$manipulate_params='',$url_params=''){
	$img_attr='';
	if(is_array($manipulate_params)){
		if(isset($manipulate_params['htmlHeight'])){
			$img_attr=$img_attr.' height='.$manipulate_params['htmlHeight'].' ';
		}else if(isset($manipulate_params['htmlWidth'])){
			$img_attr=$img_attr.' width='.$manipulate_params['htmlWidth'].' ';
		}
	}
	return '<img '.$img_attr.' src="'. ImgEngine::get_image_url($image_name,$manipulate_params,$url_params).'" >';
}


public static function create_upload_button($attr=array()){
	$upload_button = '<div>';
 	$upload_button_classes="uviba-oos-image-uploader";
	$upload_button.='<input type="file" name="file"  ';
	$multiple='true';
	$accept='image/*';
	foreach ($attr as $key => $value) {
		if($key=='class'){
			$upload_button_classes.=' '.$value;
		}else if($key=='multiple'){
			if($value===true){
				$multiple='true';
			}else if($value===false){
				$multiple='false';
			}else{
				$multiple=$value;
			}
		}else if($key=='accept'){
			$accept=$value;
		}else{
			$upload_button.=' '.$key.'='.$value;
		}
	}
	$upload_button.=' multiple='.$multiple;
	$upload_button.=' accept='.$accept;
	/*
' uviba-uploader-id="profile_uploader"  accept="image/*" 
	
	multiple="true"
	buttonStyle = ""
	image-upload-count-limit=""
	buttonAttr="newattr=true"
	buttonClass="classtest" 
	dragAreaStyle="dragstye"
	dragAreaAttr="attcdrag"
	dragAreaClass="dragcasstest" '
	*/ 
	 $upload_button.=' class="'.$upload_button_classes.'" >';
$upload_button .= '</div>';
return $upload_button;
}



}




function ImgEngine_getUrl($image_name,$manipulate_params='',$url_params=''){
	return ImgEngine::get_image_url($image_name,$manipulate_params,$url_params);
}

function ImgEngine_image_tag($image_name,$manipulate_params='',$url_params=''){
	return ImgEngine::get_image_tag($image_name,$manipulate_params,$url_params);
}




// ImgEngine::get_image_url('cat.jpg','w_200,h_200');
// ImgEngine::get_uploader_scripts();
