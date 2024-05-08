/*--------------------------------------------------
Template Name: Raavin;
Description: Raavin - Responsive E-Commerce HTML Template;
Template URI:;
Author Name:HasTech;
Author URI:;
Version: 1.0.3;
Note: main.js, All Default Scripting Languages For This Theme Included In This File.
-----------------------------------------------------
    CSS INDEX
    ================
    1. Newsletter Popup
    02. Counter Js
    03. Meanmenu
    04. WOW
    05. Full Screen Menu Active
    06. Main Slider
    07. Banner Slider
    08. New Product Slider
    09. Testimonials Slider
    10. Featured Product Slider
    11. Blog Slider
    12. Featured Product-2 (Home style 2)
    13. New Product-2 (Home style 2)
    14. New Product 3 (Home Style 3)
    15. Scroll Up
    16. Isotop
    17. New Product 3 (Home Style 3)
    18. Select Plugin
    19. Zoom Product Venobox
    20. Product Details
    21. Star Rating Js
    22. Product Details
    23. FAQ Accordion
    24. Toggle Function Active
    25. Modal Menu Active
    26. Price Slider Active

-----------------------------------------------------------------------------------*/
(function ($) {
	"use Strict";
/*--------------------------
1. Newsletter Popup
---------------------------*/
setTimeout(function () {
    $('.popup_wrapper').css({
        "opacity": "1",
        "visibility": "visible"
    });
    $('.popup_off').on('click', function () {
        $(".popup_wrapper").fadeOut(500);
    })
}, 2500);
/*----------------------------------------*/
/* 02. Counter Js
/*----------------------------------------*/
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });
/*----------------------------------------*/
/* 03. Meanmenu
/*----------------------------------------*/
    jQuery('.mobile-menu nav').meanmenu({
        meanScreenWidth: "991"
    });
/*----------------------------------------*/
/* 04. WOW
/*----------------------------------------*/
    new WOW().init();
/*----------------------------------------*/
/* 05. Full Screen Menu Active
/*----------------------------------------*/
    function fullScreenmenu() {
        var menuTrigger = $('.menu-icon button'),
            endTriggermenu = $('button.menu-close'),
            container = $('.full-screen-menu-area');
        
        menuTrigger.on('click', function() {
            container.addClass('inside');
        });
        
        endTriggermenu.on('click', function() {
            container.removeClass('inside');
        });
        
    };
    fullScreenmenu();

/*----------------------------------------*/
/* 15. Scroll Up
/*----------------------------------------*/
   $.scrollUp({
    scrollText: '<i class="fa fa-arrow-up"></i>',
    easingType: 'linear',
    scrollSpeed: 900,
   });
/*----------------------------------------*/
/* 18. Select Plugin
/*----------------------------------------*/
$(document).ready(function() {
    $('.nice-select').niceSelect();
});
/*----------------------------------------*/
/* 21. Star Rating Js
/*----------------------------------------*/
    $(function() {
          $('.star-rating').barrating({
            theme: 'fontawesome-stars'
          });
       });
/*----------------------------------------*/
/* 23. FAQ Accordion
/*----------------------------------------*/
  $('.card-header a').on('click', function() {
    $('.card').removeClass('actives');
    $(this).parents('.card').addClass('actives');
  });
/*----------------------------------------*/
/* 24. Toggle Function Active
/*----------------------------------------*/ 
// showlogin toggle
  $('#showlogin').on('click', function() {
      $('#checkout-login').slideToggle(900);
  });
// showlogin toggle
  $('#showcoupon').on('click', function() {
      $('#checkout_coupon').slideToggle(900);
  });
// showlogin toggle
  $('#cbox').on('click', function() {
      $('#cbox-info').slideToggle(900);
  });

// showlogin toggle
  $('#ship-box').on('click', function() {
      $('#ship-box-info').slideToggle(1000);
  });
$('.modal').on('shown.bs.modal', function (e) {
  $('.single-slide-menu').resize();
})
  
$('.single-slide-menu a').on('click',function(e){
e.preventDefault();

var $href = $(this).attr('href');

$('.single-slide-menu a').removeClass('active');
$(this).addClass('active');

$('.product-details-large .tab-pane').removeClass('active show');
$('.product-details-large '+ $href ).addClass('active show');

})
/*----------------------------------------*/
/* 28. Sticky Menu Activation
/*----------------------------------------*/
$(window).on('scroll',function() {
    if ($(this).scrollTop() > 300) {
        $('.header-sticky').addClass("sticky");
    } else {
        $('.header-sticky').removeClass("sticky");
    }
});
})(jQuery);