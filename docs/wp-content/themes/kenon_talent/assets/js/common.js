/* global変数
------------------------------------------------------*/
var header = $("#header");
var nav = $("#navigation");
var trig_sp = $("#sp_nav_trigger");
var sp_nav = $("#sp_navigation");


/* window幅からデバイスを判定
------------------------------------------------------*/
function getDeviceType(){
  var bp_smartphone = 768;
  var window_w = $(window).width();

  if(window_w <= bp_smartphone){
    return "smartphone";
  }
  return "pc";
}


/* ページトップ
------------------------------------------------------*/
$(function(){
  var move_sec = 500 * 1.6;
	$('a.js__smooth_scroll[href^="#"]').on("click", function () {
		var _this = $(this);
		$('body, html').animate({
			scrollTop: $(_this.attr("href")).offset().top
		}, move_sec);
		return false;
	});
});


/* SPナビ
------------------------------------------------------*/
// SP header
$(function(){
	var menu = $('#side'),
	menuBtn = $('#sp_side_nav_trigger'),
	body = $(document.body),
	layer = $('.layer'),
	menuWidth = menu.outerWidth();

	// メニューボタンをクリックした時の動き
	menuBtn.on('click', function(){
    body.toggleClass('is_opened');
    menuBtn.toggleClass('is_opened');
  //  menuBtn.css('background', 'transparent');
  //  menuBtn.css('left', 0 );
		if(body.hasClass('is_opened')){
			$(".layer").show();
			body.animate({'right' : menuWidth }, 315);
      menu.animate({'right' : 0 }, 315)
//      menuBtn.animate({'left': 255 }, 0)
      } else {
      $(".layer").hide();
      menu.animate({'right' : -menuWidth }, 315);
//      menuBtn.animate({'left': 315 }, 0);
//      menuBtn.css('background', '#fff');
		}
	});
	layer.on('click', function(){
    menuBtn.removeClass('is_opened');
		menu.animate({'right' : -menuWidth }, 315);
    //menuBtn.animate({'right': 315 }, 0).css('background', '#fff');
    body.animate({'right' : 0 }, 315).removeClass('is_opened');
		layer.hide();
	});
});




/* アコーディオンコンポーネント
------------------------------------------------------*/
$(function(){
  var btn = $(".list__accordion a");
  var content = $(".list__accordion .list__accordion_content");

  content.each(function(){
    $(this).hide();
  })

  btn.on("click", function(){
    var _this = $(this);
    var _this_content = _this.next(".list__accordion_content");
    _this_content.slideToggle(300);
    _this.parent().toggleClass("opened")
  });
});


/* セレクトボックスコンポーネント
------------------------------------------------------*/
$(function(){
  var trig_selectbox = $(".js__selectbox > select");

  trig_selectbox.each(function(){
    $(this).next(".output").text($(this).find("option:selected").text());
  });

  trig_selectbox.on("change", function(){
    $(this).next(".output").text($(this).find("option:selected").text());
  });
})



/* スクロール連動アニメーション
------------------------------------------------------*/
$(function(){
  var trigger = $(".js__motion_trig");
  var current_w;
  var window_offset_y;
  var timer = null;
  var motion_objs = [];
  var is_init = true;

  // アニメーションラベル取得
  trigger.each(function(index){
    var classes = $(this).attr("class");
    var class_vals = classes.split(" ");
    var motion_label = "on";
    for(var i = 0; i < class_vals.length; i++){
      var target_str = "js__motion_anm--";
      //console.log(class_vals[i].lastIndexOf(target_str));
      var str_start = class_vals[i].indexOf(target_str);
      if(str_start > -1){
        //console.log(class_vals[i].substring(target_str.length, class_vals[i].length));
        motion_label = "on_" + class_vals[i].substring(target_str.length, class_vals[i].length);
        break;
      }
    }
    motion_objs[index] = {
      "animation": motion_label
    }
    //console.log(motion_objs);
  });


  function settings(){

    window_offset_y = $(window).height() * 0.85; //表示位置


    if(current_w != $(window).width()){

      trigger.each(function(index){
        motion_objs[index]["target"] = $(this);
        motion_objs[index]["offset_pos"] = $(this).offset().top;
        /*motion_objs[index] = {
          "target": $(this),
          //"animation": motion_label,//$(this).data("animation"),
          //"activate": true,
          "offset_pos": $(this).offset().top
        }*/
        //if($(this).data("animation")){
        //  $(this).addClass("js__motion--" + $(this).data("animation"));
        //}
      });
    }
    current_w = $(window).width();
    //console.log(motion_objs);
  }

  function displaySwitching(){

		var window_scr_pos = $(window).scrollTop() + window_offset_y;
    //console.log(window_scr_pos);

    clearTimeout( timer );

    timer = setTimeout(function() {

      for (var i = motion_objs.length - 1 ; i >= 0; i--) {
        //var str_has_class = motion_objs[i].target.indexOf("js__motion_anm--on");
        if (window_scr_pos > motion_objs[i].offset_pos ) {
          motion_objs[i].target.addClass("js__motion_anm--" + motion_objs[i].animation);
          /*if(motion_objs[i].animation){
            motion_objs[i].target.addClass("js__motion_anm--on_" + motion_objs[i].animation);
          }else{
            motion_objs[i].target.addClass("js__motion_anm--on");
          }*/
        }
      }
    }, 0 );

  }


  $(window).on("scroll resize", settings).on("scroll", displaySwitching);

  settings();
  displaySwitching();


});


/* スクロール連動アニメーション
------------------------------------------------------*/
$(function(){

	//alert("aaa");
	var key_selector = $(".js__filepreview");
	var tag_preview = '<div class="form_ui__preview_wrap"><div class="form_ui__preview"></div></div>';
	var tag_del_btn = '<div class="form_ui__file_delete" style="display:inline-block; padding: 2px 10px; cursor:pointer; border-radius:3px; background:#aeaeae; color:#fff; border:1px solid #9a9a9a; font-size:12px; vertical-align:middle;">クリア</div>';
	var default_preview = $(".mw-wp-form_image");
	var default_del = $(".mwform-file-delete");
	//var input_file = $(".js__filebtn");
	var param_name = "image";	// hiddenに入るname
	var img_path;


	/* デバイスのUA取得
	---------------------------------*/
	function get_ua_type(){
		var ua = navigator.userAgent.toLowerCase();

		if(ua.indexOf("msie 9.") != -1){
			return "ie9";
		}else if(ua.indexOf("msie 10.") != -1){
			return "ie10";
		}
		return '';
	}

	function change_input_file(eve){
		var file = eve.target.files[0];
		var reader = new FileReader();
    var preview = $(this).parent().find(".form_ui__preview");
    var del_btn = $(this).parent().find(".form_ui__file_delete");
    //eve.target.parent()

		//console.log($(eve.target).parent());
    console.log(preview);

		if(file){
			//画像でない場合は処理終了
			if(file.type.indexOf("image") < 0){
				//alert("画像ファイルを指定してください。");
				return false;
			}

			reader.onload = (function(file){
				return function(eve){
					preview.empty();
					preview.append(jQuery("<img>").attr({
						"src":eve.target.result
					}));
				};
			})(file);
			reader.readAsDataURL(file);
			del_btn.show();
		}else{
			preview.empty();
			del_btn.hide();
		}
	}


	// デフォルトは非表示に
	default_del.hide();


  /*

	//デフォルトのプレビュー画面が存在する場合
	if(default_preview.length > 0){
		// mw wp formのデフォルトを非表示に
		default_preview.hide();

		// 入力（確認からの戻り）or 確認画面でプレビューを表示
		img_path = key_selector.find("input[type=hidden][name=" + param_name + "]").val();
		if(img_path){
			preview.append(jQuery("<img>").attr({
				"src":img_path
			}));
		}
	}*/

  key_selector.each(function(){
    var _this = $(this);

    // プレビューと削除ボタン表示
    _this.prepend(tag_preview);
    _this.find(".form_ui__preview_wrap").append(tag_del_btn);

    var btn_del = _this.find(".form_ui__file_delete");
    var preview = _this.find(".form_ui__preview");
    var input_file = _this.find(".js__filebtn");

    // 非表示
    btn_del.hide();

    // 削除
    btn_del.on("click", function(){

      _this.find(".form_ui__preview").empty();
      //console.log(preview.children().length);

      //フォームのパラメータ削除
      if(get_ua_type() == "ie10" || get_ua_type() == "ie9"){
        input_file.replaceWith(input_file.clone().on("change", change_input_file));
      }else{
        input_file.val("");
      }
      _this.find("input[type=hidden][name=" + param_name + "]").val("");

      //削除ボタン非表示
      $(this).hide();
    });


    // input[type=file]が存在かつプレビューに画像がある場合の削除ボタンの表示パターン
    if(input_file.length > 0 && preview.children().length > 0){
      btn_del.show();
    }else{
      btn_del.hide();
    }

    // input[type=file]のchangeイベント
    _this.find(".js__filebtn").on("change", change_input_file);
  });


});

$(document).ready(function() {
  $('.js__gallery_popup').magnificPopup({
    delegate : 'a',
    type : 'image',
    mainClass : 'mfp-img-mobile',
    gallery : {
        enabled : true, 
        navigateByImgClick : true, 
        preload : [ 0, 1 ] 
    },
    image : {
        verticalFit : true 
    }
});
});
