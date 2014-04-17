(function($) {

  var dragInput = new Object();

  $.fn.iDraggable = function() {
  	return this.each(function() {
      var offset = null;
      var origOffset = $(this).offset();
      var isActive = true;
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
      	isActive = !$(this).hasClass('incorrect') && !$(this).hasClass('correct');
      	if (isActive && dragInput[$(this).attr('id').toString()]) {
        	$('#' + dragInput[$(this).attr('id').toString()]).removeClass('iD-dropped');
  		  	delete dragInput[$(this).attr('id').toString()];
      	}
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
      	if (isActive) {
        	$(this).css({ 
        		'transform': 'translate(' + newOffset.x + 'px, ' + newOffset.y + 'px) translatez(1px)'
        	});
      	}
      };
      var dropMe = function(e) {
        var orig = (e.type === "mouseup") ? e.originalEvent : e.originalEvent.changedTouches[0];
        var finger = {
          x: orig.pageX,
          y: orig.pageY
        };
      	var $drag = $(this);
      	var offset = $drag.offset();
      	var dropped = false;
    		$('.droppable').each(function() {
    			var box = $(this).data();
    			var dropActive = !$(this).hasClass('iD-dropped');
    			if (dropActive && (box.left <= finger.x) && (finger.x <= box.right) && (box.top <= finger.y) && (finger.y <= box.bottom)) {
    				var offset = {
    					x: box.left - origPos.left,
    					y: box.top - origPos.top
    				};
    				$drag.css({ 
    					'transform': 'translate(' + offset.x + 'px, ' + offset.y + 'px) translatez(0)' 
    				}).addClass('iD-dropped');
    				$(this).addClass('iD-dropped');
    				dragInput[$drag.attr('id').toString()] = $(this).attr('id');
    				dropped = true;
    			}
    		});
    		if (!dropped && isActive) {
    			$(this).css({ 
    				'transform': 'translate(0px, 0px) translatez(0)'
    			}).removeClass('iD-dropped');
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
    return this;
  };

  $.fn.iDroppable = function() {
    return this.each(function() {
    	var offset = $(this).offset();
    	var coords = {
    		left: offset.left,
    		top: offset.top,
    		right: offset.left + $(this).width(),
    		bottom: offset.top + $(this).height()
    	};
    	for (var key in coords) {
      	$(this).data(key, coords[key]);
      }
      var _this = this;
      $(window).bind("resize", function() { $(_this).iDroppable(); });
  	});
  };
}(jQuery));