(function($) {


  $.fn.iDraggable = function(options) {
    
    var options = $.extend({
      droppedClass: 'iD-dropped',
      revert: true
    }, options);

  	return this.each(function() {
      $(this).addClass('iDraggable');
      var offset = null;
      var origOffset = $(this).offset();
      var matrix = new WebKitCSSMatrix($(this).css('transform'));
      var transform = {				// transform incase drags are initialized while dropped
      	left: matrix.m41,
      	top: matrix.m42
      };
      var origPos = {
      	left: origOffset.left - transform.left,
      	top: origOffset.top - transform.top
      };							// this is the offset used to position drags
      var start = function(e) {
        e.preventDefault();
      	e.stopPropagation();
      	var orig = (e.type === "mousedown") ? e.originalEvent : e.originalEvent.changedTouches[0];
     		var startOffset = $(this).offset();
        offset = {
          x: orig.pageX - startOffset.left,
          y: orig.pageY - startOffset.top
        };
        $(this).bind("touchmove mousemove", moveMe);
        $(this).bind("touchend mouseup", dropMe);
      };
      var moveMe = function(e) {
      	e.preventDefault();
      	e.stopPropagation();
        var orig = (e.type === "mousemove") ? e.originalEvent : e.originalEvent.changedTouches[0];
        var newOffset = {
          x: orig.pageX - offset.x - origPos.left,
          y: orig.pageY - offset.y - origPos.top
        };
      	$(this).css({ 
      		'transform': 'translate(' + newOffset.x + 'px, ' + newOffset.y + 'px) translatez(1px)'
      	});
      };
      var dropMe = function(e) {
        var orig = (e.type === "mouseup") ? e.originalEvent : e.originalEvent.changedTouches[0];
        var finger = {
          x: orig.pageX,
          y: orig.pageY
        };
      	var $drag = $(this);
      	var offset = $drag.offset();
      	var droppedInto = null;
    		$('.iDroppable').each(function() {
    			var box = $(this).data().box;
    			var dropActive = !$(this).hasClass(options.droppedClass);
    			if (dropActive && (box.left <= finger.x) && (finger.x <= box.right) && (box.top <= finger.y) && (finger.y <= box.bottom)) {
            droppedInto = this;
    				var offset = {
    					x: box.left - origPos.left,
    					y: box.top - origPos.top
    				};
            $(droppedInto).addClass(options.droppedClass);
    				$drag.css({ 
    					'transform': 'translate(' + offset.x + 'px, ' + offset.y + 'px) translatez(0)' 
    				})
            .addClass(options.droppedClass)
            .one("touchstart mousedown", function(e) {
              $(droppedInto).removeClass(options.droppedClass);
            });
    			}
    		});
    		if (!droppedInto && options.revert) {
    			$(this).css({ 
    				'transform': 'translate(0px, 0px) translatez(0)'
    			}).removeClass(options.droppedClass);
    		} else if (!droppedInto) {
          var matrix = new WebKitCSSMatrix($(this).css('transform'));
          var transform = {       // transform incase drags are initialized while dropped
            left: matrix.m41,
            top: matrix.m42
          };
          $(this).css({
            'transform': 'translate(' + transform.left + 'px, ' + transform.top + 'px) translatez(0)'
          }).removeClass(options.droppedClass);
        }
        if (options.drop) {
          options.drop({ draggable: this, droppable: droppedInto });
        }
        $(this).unbind("touchmove mousemove", moveMe);
        $(this).unbind("touchend mouseup", dropMe);
        var _this = this;
        $(window).bind("resize", function() { 
          resize(_this);
        });
      };
      var resize = function(drag) {
        if (dragInput[$(drag).attr('id').toString()]) {
          var box = $("#" + dragInput[$(drag).attr('id').toString()]).data();
          var offset = {
            x: box.left - origPos.left,
            y: box.top - origPos.top
          };
          $(drag).css({ 
            'transform': 'translate(' + offset.x + 'px, ' + offset.y + 'px) translatez(0)' 
          });
        }
      };
      $(this).bind("touchstart mousedown", start);
    });
  };

  $.fn.iDroppable = function() {
    return this.each(function() {
    	var offset = $(this).offset();
    	var box = {
    		left: offset.left,
    		top: offset.top,
    		right: offset.left + $(this).width(),
    		bottom: offset.top + $(this).height()
    	};
    	$(this).data('box', box).addClass('iDroppable');
      var _this = this;
      $(window).bind("resize", function() { $(_this).iDroppable(); });
  	});
  };
}(jQuery));