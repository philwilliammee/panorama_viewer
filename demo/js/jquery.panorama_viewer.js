/* ===========================================================
* jquery-panorama_viewer.js v2
* ===========================================================
* Copyright 2014 Pete Rojwongsuriya.
* http://www.thepetedesign.com
* 
* forked by phil williammee for jquery 3
*
* Embed Panorama Photos on your website
* with Panorama Viewer
*
* original: https://github.com/peachananr/panorama_viewer
* 
* fork: https://github.com/philwilliammee/panorama_viewer.git 
*
* ========================================================== */

function Scroll( target ) {
'use strict'
var defaults = {
  repeat: false,
  direction: "horizontal",
  animationTime: 700,
  easing: "ease-out",
  overlay: false,
  minWidth: target.width,
  minHeight: target.height
};

//unused timer?
function Timer(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function () {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  this.resume = function () {
    start = new Date();
    timerId = window.setTimeout(callback, remaining);
  };

  this.resume();
}


function myTouchHandler(event) {
  var touches = event.changedTouches,
    first = touches[0],
    type = "";

  switch (event.type) {
    case "touchstart": type = "mousedown"; break;
    case "touchmove": type = "mousemove"; break;
    case "touchend": type = "mouseup"; break;
    default: return;
  }

  var simulatedEvent = document.createEvent("MouseEvent");

  var mult = 2;

  if (navigator.userAgent.match(/Android/i)) {
    mult = 10;
  }
  
  simulatedEvent.initMouseEvent(type, true, true, window, 1,
    first.screenX, first.screenY,
    (first.clientX * mult), (first.clientY * mult), false,
    false, false, false, 0, null);
  first.target.dispatchEvent(simulatedEvent);

  return false;
  
}

this.panorama_viewer = function (options) {
  return $.each(target, function (i, el) {
    if ($(this).hasClass('horizontal-panorama')) {
      var settings = $.extend({}, defaults, options), el = $(this);
      //this Added non-passive event listener to a scroll-blocking 
      this.addEventListener("touchstart", myTouchHandler, true);
      this.addEventListener("touchmove", myTouchHandler, true);
      this.addEventListener("touchend", myTouchHandler, true);
      this.addEventListener("touchcancel", myTouchHandler, true);
      el.find("img").addClass("pv-pano");
      el.addClass("pv-container").wrapInner("<div class='pv-inner pv-animating'></div>");
      if (settings.direction == "vertical") {
        el.addClass("pv-vertical")
      }
      el.find(".pv-animating").css({
        "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
        "transition": "all " + settings.animationTime + "ms " + settings.easing
      })
      var imgSrc = el.find(".pv-pano").attr("src");
      var width = el.find(".pv-pano").width();
      var height = el.find(".pv-pano").height();
      if (width < settings.minWidth){
        width = settings.minWidth;
        console.log('warning no img width found using fallback');
      }
      if (height < settings.minHeight){
        height = settings.minHeight;
        console.log('warning using fallback height');
      }
      var repeat = "no-repeat";
      if (settings.repeat == true) {
        repeat = "repeat";
      }

      el.find(".pv-inner").css({
        height: height,
        width: width,
        background: "url(" + imgSrc + ") " + repeat,
        "background-size": "cover"
      })

      if (settings.overlay == true) {
        $("<div class='pv-overlay'><i class='pvicon-overlay'></i></div>").appendTo(el.find(".pv-inner"))

        el.find(".pv-inner").bind("mouseenter", function () {
          $(this).find(".pv-overlay ").fadeOut("fast");
        }).bind("mouseleave", function () {
          $(this).find(".pv-overlay ").fadeIn("fast");
        })
      }

      var $bg = el.find(".pv-inner"),
        elbounds = {
          w: parseInt($bg.parent().width()),
          h: parseInt($bg.parent().height())
        },
        bounds = { w: width - elbounds.w, h: height - elbounds.h },
        origin = { x: 0, y: 0 },
        start = { x: 0, y: 0 },
        movecontinue = false;

      function move(e) {

        var inbounds = { x: false, y: false },
          offset = {
            x: start.x - (origin.x - e.clientX),
            y: start.y - (origin.y - e.clientY)
          };
        if (settings.direction == "horizontal") {
          if (settings.repeat == true) {
            inbounds.x = true;
          } else {
            inbounds.x = offset.x < 0 && (offset.x * -1) < bounds.w;
          }

          if (movecontinue && inbounds.x) {
            start.x = offset.x;
            start.y = 0;
          }
        } else {
          if (settings.repeat == true) {
            inbounds.y = true;
          } else {
            inbounds.y = offset.y < 0 && (offset.y * -1) < bounds.h;
          }

          if (movecontinue && inbounds.y) {
            start.y = offset.y;
            start.x = 0;
          }
        }

        $(this).css('background-position', start.x + 'px ' + start.y + 'px');

        origin.x = e.clientX;
        origin.y = e.clientY;

        e.stopPropagation();
        return false;
      }

      function handle(e) {
        movecontinue = false;
        $bg.unbind('mousemove', move);

        if (e.type == 'mousedown') {
          origin.x = e.clientX;
          origin.y = e.clientY;
          movecontinue = true;
          $bg.bind('mousemove', move);
        } else {
          $(document.body).focus();
        }

        e.stopPropagation();
        return false;
      };

      function reset() {
        start = { x: 0, y: 0 };
        $(this).css('backgroundPosition', '0 0');
      };

      $bg.bind('mousedown mouseup mouseleave', handle);
      $bg.bind('dblclick', reset);
      el.find(".pv-pano").hide();
    }
  });

}
}
    
    

    