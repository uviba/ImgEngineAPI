 function uviba_OOS_uploader(){
 	


 	var othis  = this;
 	this.isset = function isset(variablex){
		if(typeof variablex != "undefined" && variablex !== null){
			return true;
		}else{
			return false;
		}
	}
 	this.upload_file = function(item,element,index,params){
 		if(typeof params === typeof undefined || params === false){
 			params={};
 		}
 		

 		 var uviba_uploader_id=element.find('.uviba-oos-image-uploader').attr('uviba-uploader-id');
 		 
 this.when_upload_begin_func(element,index,othis.uploaded_item_count[uviba_uploader_id]);
//var share_parent = $(element).closest('.share-all-content_js');
                //indilik html multiple image etsen append edersen
    var data = new FormData();
  data.append('file',item);

  if(this.isset(params['addition_url_params'])){
  	$.each(params['addition_url_params'],function(key,val){
  		data.append(key,val);
  		//file_url = 
  		//heleki ancaq yuxaridakidir
  	});
  }

  data.append('response_url_params',othis.response_url_params);
  var xhr_req = $.ajax({
  xhr: function() {
    var xhr = $.ajaxSettings.xhr();
    console.log(xhr);
    if(xhr.upload){
    	xhr.upload.addEventListener("progress", function(e) {
	      if (e.lengthComputable) {
	        var percentComplete = e.loaded / e.total;
	        percentComplete = parseInt(percentComplete * 100);
	       // console.log(percentComplete);
	        othis.when_upload_progress_func(e,percentComplete,element,index,othis.uploaded_item_count[uviba_uploader_id]);
	        if (percentComplete === 100) {

	        }

	      }
	    }, false);
    }
    

    return xhr;
  },
  url: uviba_UPLOAD_Url+"?connect_key="+uviba_API_CONNECT_KEY,
  type: "POST",
  data:data,
  processData: false,
  contentType: false,
   crossDomain: true,
  success: function(data) {
  	var parent_attr =  element.attr('upload-value');
  	var upload_input_elem = element.find('.uviba-oos-image-uploader');
  	var upload_input_attr =  upload_input_elem.attr('upload-value');
  	if(typeof parent_attr !== typeof undefined && parent_attr !== false){

		element.attr('upload-value','');

	}
	if(typeof upload_input_attr !== typeof undefined && upload_input_attr !== false){

		upload_input_elem.attr('upload-value','');

	}
	try{
		var json_data = JSON.parse(data);
		if(json_data.error!==true){
			if(json_data.file_name!==undefined || json_data.file_name!==null || json_data.file_name!==false){
				othis.uploaded_file_names[uviba_uploader_id].push(json_data.file_name);
				//console.log(othis.uploaded_file_names);
				//element.attr('upload-value',element.attr('upload-value')+','+json_data.file_name);
				//upload_input_elem.attr('upload-value',upload_input_elem.attr('upload-value')+','+json_data.file_name);
			}
			
		}
	}catch(e){

	}
    othis.when_upload_finish_func(data,element,index,othis.uploaded_item_count[uviba_uploader_id]);
  },
  error:function(){
  	othis.when_upload_fail_func(element,index,othis.uploaded_item_count[uviba_uploader_id]);
  }
});
 
othis.xhr_req_ar.push(xhr_req);

}	
	this.xhr_req_ar=[];
	this.uploaded_file_names = [];
	/*
this.upload_file_count_limit=false;
	this.uploaded_item_count=1;
	*/ 
	this.upload_file_count_limit=[];
	this.uploaded_item_count=[];

	othis.when_select_default = function(element,upload_count){
		//inside is just example you can customize it
		//alert('I selected');
		if(element.next().is('.uviba-response-container')){
			element.next().remove();
		}
		element.after('<div class="uviba-response-container" ></div>');
	};

//will fire before upload process begin for each image that user choosed
	othis.when_upload_begin_default = function(element,index,upload_count){
		console.log('upload begin');
		//alert('I begin');
		element.next('.uviba-response-container').append('<div upload-index="'+index+'" class="uviba-response-image" style="margin: 6px 5px;display: inline-block;border: 1px solid #1874CD;background: #e6e7e8;" >\
			<div  class="uviba-response-image-loader" style="width:200px;" >\
			<div  style="background:#1874CD;width:10%;min-width:10%;height:15px;min-height:15px;color: white;\
	    text-align: center;"  >0%</div>\
			</div>');
	};

//will fire each time upload progress finished so you can show how many percent of image uploaded
	othis.when_upload_progress_default = function(e,percentComplete,element,index){
		
		var image_loader = element.next('.uviba-response-container').find('.uviba-response-image[upload-index="'+index+'"] > .uviba-response-image-loader > div');
		image_loader.animate({width:percentComplete + "%" }, 100);
		image_loader.html(percentComplete + "%");
	};

	othis.when_upload_finish_default = function(data,element,index,max_index){
		//you need to check if data contains error index or not
		// if it contains you can get error message from error_mes index like below
		try{
			var data = JSON.parse(data);
		}catch(e){
			return false;
		}

		var image_process_container = element.next('.uviba-response-container').find('.uviba-response-image[upload-index="'+index+'"]');
		image_process_container.css({'border-color':'#243a4e'});
		console.log('upload finish');
		if(data.error===true){
			image_process_container.remove();
			return false;

		}
		//data.file_src is image that return and contains manipulation params that you defined
		image_process_container.html('<img src="'+data.file_src+'" />');

	};


	othis.when_upload_fail_default = function(element,index){
		//when upload response code is not 200
		console.log('upload failed');
		var image_process_container = element.next('.uviba-response-container').find('.uviba-response-image[upload-index="'+index+'"]');
			image_process_container.remove();
	};
	othis.when_select_func = function(element,upload_count){othis.when_select_default(element,upload_count);};
	this.when_upload_begin_func=function(element,index,upload_count){othis.when_upload_begin_default(element,index,upload_count);};
	this.when_upload_progress_func=function(e,percentComplete,element,index){othis.when_upload_progress_default(e,percentComplete,element,index);};
	this.when_upload_finish_func=function(data,element,index,max_index){othis.when_upload_finish_default(data,element,index,max_index);};
	this.when_upload_fail_func=function(element,index){othis.when_upload_fail_default(element,index);};
	
	
	

	this.before_drag_word = 'Drag Photos Here';
	this.after_drag_word = 'Drop Here';
	this.button_word = 'Choose Photos';
	this.response_url_params='';
 	this.select = function(selector){
 		return document.querySelectorAll(selector);
 	}
 	this.when_upload_finish = function(func){
 		othis.when_upload_finish_func=func;
 	}
 	this.when_upload_fail = function(func){
 		othis.when_upload_fail_func=func;
 	}
 	this.when_upload_begin = function(func){
 		othis.when_upload_begin_func=func;
 	}
 	this.when_upload_progress = function(when_upload_progress_func){
 		othis.when_upload_progress_func=when_upload_progress_func;
 	}
 	this.when_select = function(func){
 		othis.when_select_func=func;
 	}
 	this.func_queux=null;
 	this.set_response_url_params = function(response_url_params){
 		if( (typeof response_url_params === "object") && (response_url_params !== null) )
		{
			//mp_func_ar_public
			if(!window.jQuery){
				this.func_queux=setTimeout(function(){
					othis.set_response_url_params(response_url_params);
				},300);
			}else{
				clearTimeout(this.func_queux);
				response_url_params_string='';
				$.each(response_url_params,function(key,val){
						if(mp_func_ar_public.hasOwnProperty(key)){
							if(response_url_params_string!=''){
								response_url_params_string+=',';
							}
							response_url_params_string+=mp_func_ar_public[key]+'_'+val;
					    }else{
					    	//console.error(manipulate_param_error);
					    	if(response_url_params_string!=''){
								response_url_params_string+=',';
							}
							response_url_params_string+=key+'_'+val;
					    }
					});
				othis.response_url_params=response_url_params_string;
				//console.log(othis.response_url_params);
			}
			
		    
		}else{
			othis.response_url_params=response_url_params;
		}
 		
 	}
 	this.typeOf = function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}
	this.setUploadUrl = function(url){
		uviba_UPLOAD_Url=url;
	}
 	this.getbyclass = function(classname){
 		return document.getElementsByClassName(classname);
 	}
 	this.after  = function(el,htmlString){
 		el.insertAdjacentHTML('afterend', htmlString);
 	}
 	this.get_uploaded_file_names = function(uploader_id){
 		if(uploader_id!==undefined){
 			return othis.uploaded_file_names[uploader_id];
 		}else{
 			return othis.uploaded_file_names;
 		}
 	}
 	this.clear_uploaded_file_names = function(uploader_id){
 		othis.uploaded_file_names[uploader_id]=[];
 	}
	this.create_input = function(){
		/*
var element  = this.getbyclass('uviba-oos-image-uploader');
		//element.style.display = 'none';
		this.after(element,'<div class="uviba-oos-image-uploader-button" >\
	Choose Image\
</div>');
		if(element.length ===0){
			return false;
		}

		*/ 
		var element = $('.uviba-oos-image-uploader[manupulated-upload-button!=1]');
		//element.attr('accept','image/*');

		
		$.each(element,function(){
			//console.log('in_each');
			if($(this).attr('manupulated-upload-button')!=1){
				//console.log('manupulated');
				var uviba_uploader_id=$(this).attr('uviba-uploader-id');
				var multiple_attr = $(this).attr('multiple');
				console.log(multiple_attr);
				 
				if(typeof multiple_attr !== typeof undefined && multiple_attr !== false){
					 
					if(multiple_attr===false || multiple_attr=='false'){
						othis.upload_file_count_limit[uviba_uploader_id]=1;
					}else{
						othis.upload_file_count_limit[uviba_uploader_id]=false;
					}
				}else{
					 
					othis.upload_file_count_limit[uviba_uploader_id]=1;
				}
				 
				$(this).hide();
				$(this).attr('upload-value','');
				$(this).attr('manupulated-upload-button',1);
				var buttonStyle = element.attr('buttonStyle');;
				if (typeof buttonStyle === typeof undefined || buttonStyle === false) {
					buttonStyle='';
				}
				var buttonAttr = element.attr('buttonAttr');;
				if (typeof buttonAttr === typeof undefined || buttonAttr === false) {
					buttonAttr='';
				}
				var buttonClass = element.attr('buttonClass');;
				if (typeof buttonClass === typeof undefined || buttonClass === false) {
					buttonClass='';
				}

				var dragAreaStyle = element.attr('dragAreaStyle');;
				if (typeof dragAreaStyle === typeof undefined || dragAreaStyle === false) {
					dragAreaStyle='';
				}
				var dragAreaAttr = element.attr('dragAreaAttr');;
				if (typeof dragAreaAttr === typeof undefined || dragAreaAttr === false) {
					dragAreaAttr='';
				}
				var dragAreaClass = element.attr('dragAreaClass');;
				if (typeof dragAreaClass === typeof undefined || dragAreaClass === false) {
					dragAreaClass='';
				}
				var buttonText = element.attr('buttonText');;
				if (typeof dragAreaClass === typeof undefined || dragAreaClass === false) {
					othis.button_word=buttonText;
				}
				
				$(this).after('<div '+buttonAttr+' style="'+buttonStyle+'" class=" '+buttonClass+' uviba-oos-image-uploader-button" >\
				'+othis.button_word+'\
			</div>').after('<div style="'+dragAreaStyle+'" '+dragAreaAttr+'  class=" '+dragAreaClass+' uviba-oos-image-drop  " >'+othis.before_drag_word+' </div>');
				othis.uploaded_file_names[uviba_uploader_id]=[];
				othis.uploaded_item_count[uviba_uploader_id]=[];
			}
			

		});
		//element.hide();
		var upload_button = element.parent().find('.uviba-oos-image-uploader-button');
		var upload_drop_area = element.parent().find('.uviba-oos-image-drop');
		upload_button.on('click',function(){
			$(this).parent().find('.uviba-oos-image-uploader').click();
		});
		upload_drop_area.on('drop dragdrop',function(){
		  
			element.attr('upload-value','');
			
			 
			event.preventDefault();
			var uviba_uploader_id=$(this).parent().find('.uviba-oos-image-uploader').attr('uviba-uploader-id');
		    var items = event.dataTransfer.files;

		    
    
   // item = new File();
    //console.log(imgURL);
		    var uploaded=0;
		    //console.log(othis.upload_file_count_limit);
			var upload_limit = othis.upload_file_count_limit[uviba_uploader_id];
			//console.log(upload_limit);
			var parent_elem = $(this).parent();
			var items_len = items.length;
			if(upload_limit!==false){
				if(items_len>upload_limit){
					items_len=upload_limit;
				}
			}

			

			$.each(othis.xhr_req_ar,function(key,xhr_req){
				xhr_req.abort();
			});
			othis.uploaded_file_names[uviba_uploader_id]=[];
			 
			othis.uploaded_item_count[uviba_uploader_id] = items_len;
			othis.when_select_func(parent_elem,othis.uploaded_item_count[uviba_uploader_id]);
            $.each(items,function(key,item){
            	//console.log(uploaded);
            	//console.log(upload_limit);console.log(item);
             	if((uploaded<upload_limit && upload_limit!==false) || upload_limit===false){
             		if(item!==undefined){
             			//asagidaki +1 0 vermesin deyedir 4/5 1/5 eledi axi
					   othis.upload_file(item,parent_elem,uploaded+1);
					}
					 
             		uploaded++;
             	}
				
			});
			$(this).html(othis.before_drag_word);

			var droppedHTML = event.dataTransfer.getData("text/html");
			if(droppedHTML!=null && othis.isset(droppedHTML) && $.trim(droppedHTML)!=''){
		    	
		    	var dropContext = $('<div>').append(droppedHTML);
		    	var img_i = $(dropContext).find("img");
		    	if(img_i.length!==0){
					var imgURL = img_i.attr('src');
		    	}else{
		    		var a_item = $(dropContext).find("a");
		    		
		    		if(a_item.length!=0){
		    			var imgURL = a_item.attr('href');
		    			
		    		}else{
		    			//demeli image ola biler ya da basqa bir element
		    			//demeli sina ki linki goturersen belke raw link atib
		    			return;
		    		}
		    	}
		    	
		    	othis.upload_file(null,parent_elem,uploaded+1,{
		    		'addition_url_params':{
		    			'file_url':imgURL,
		    		}

		    	});
		    	//return;
		    }else{
		    	var imageUrl = event.dataTransfer.getData('URL');
		    	if(imageUrl!=null && othis.isset(imageUrl) && $.trim(imageUrl)!=''){
		    		othis.upload_file(null,parent_elem,uploaded+1,{
			    		'addition_url_params':{
			    			'file_url':imageUrl,
			    		}

			    	});
		    	}
		    
		    	return;
		    }


		});
		upload_drop_area.on('dragenter',function(event){
		    event.preventDefault();
		    
		});
		upload_drop_area.on('dragover',function(event){
		    event.preventDefault();
		    $(this).html(othis.after_drag_word);
		})
		upload_drop_area.on('dragleave',function(event){
		    event.preventDefault();
		    $(this).html(othis.before_drag_word);
		})
		 
			

		element.on('change',function(){
			 if($(this).val()=='') { 
                
                return false;
             }
             var uploaded = 0;
             var uviba_uploader_id=$(this).parent().find('.uviba-oos-image-uploader').attr('uviba-uploader-id');
             var upload_limit = othis.upload_file_count_limit[uviba_uploader_id];
             var parent_elem = $(this).parent();
             var items_len = this.files.length;
			if(upload_limit!==false){
				if(items_len>upload_limit){
					items_len=upload_limit;
				}
			}
			$.each(othis.xhr_req_ar,function(key,xhr_req){
				xhr_req.abort();
			});
			othis.uploaded_file_names[uviba_uploader_id]=[];
			element.attr('upload-value','');
			element.find('.uviba-oos-image-uploader').attr('upload-value','');
			othis.uploaded_item_count[uviba_uploader_id] = items_len;
			othis.when_select_func(parent_elem,othis.uploaded_item_count[uviba_uploader_id]);
             $.each(this.files,function(key,val){
             	if((uploaded<upload_limit && upload_limit!==false) || upload_limit===false){
             		othis.upload_file(val,parent_elem,uploaded+1);
             		uploaded++;
             	}
             	
             });
             $(this).val('');
             
		});

	} 


}
var uviba_OOS_uploader=new uviba_OOS_uploader();

var uviba_uploader_callback = function(){

$(function(){
  var dropTarget = $('.uviba-oos-image-drop'),
    html = $('html'),
    showDrag = false,
    timeout = -1;

  html.bind('dragenter', function () {dropTarget = $('.uviba-oos-image-drop');
  	$('.uviba-oos-image-uploader-button').hide();
      dropTarget.show();
      showDrag = true; 
  });
  html.bind('drop', function(e){
    e.preventDefault();
      showDrag = false; 
      clearTimeout( timeout );
      timeout = setTimeout( function(){dropTarget = $('.uviba-oos-image-drop');
          if( !showDrag ){ dropTarget.hide();$('.uviba-oos-image-uploader-button').show(); }
      }, 200 );
  });
  html.bind('dragover', function(){
      showDrag = true; 
  });
  html.bind('dragleave', function (e) {
      showDrag = false; 
      clearTimeout( timeout );
      timeout = setTimeout( function(){
          if( !showDrag ){ dropTarget.hide();$('.uviba-oos-image-uploader-button').show(); }
      }, 200 );
  });
  uviba_OOS_uploader.create_input();
});



$('head').prepend('<style>.uviba-oos-image-drop{display:none;border:2px dashed #4773dc;color:#5882ff;text-align:center;z-index:12;background:#f1f1f1;padding:14px;border-radius:2px;width:129px;margin: 10px auto;}.uviba-oos-image-uploader-button{text-align:center;padding:5px;border:1px solid #3086f5;background:#3086f5;color:#fff;width:123px;border-radius:2px;cursor:pointer;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;margin:10px auto;}.uviba-oos-image-uploader-button:active{box-shadow:inset 0 3px 5px rgba(0,0,0,.125)}.uviba-oos-image-uploader-button:hover{background:#5198f3;border-color:#5198f3}</style>');
}

if(!window.jQuery)
{
   var script = document.createElement('script');
   script.type = "text/javascript";
   script.src = "https://code.jquery.com/jquery-1.9.1.min.js";
   script.onload=uviba_uploader_callback;
   document.getElementsByTagName('head')[0].appendChild(script);
}else{
	uviba_uploader_callback();
}


