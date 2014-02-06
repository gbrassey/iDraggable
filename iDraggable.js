var dragInput = new Object();

$.fn.iDraggable = function() {
  console.log('init');
	$(this).each(function() {
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
      	$('#' + dragInput[$(this).attr('id').toString()]).removeClass('iD-disabled');
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
      		'transform': 'translate(' + newOffset.x + 'px, ' + newOffset.y + 'px) translatez(0)',
          'z-index': '2'
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
  			var dropActive = !$(this).hasClass('iD-disabled');
  			if (dropActive && (box.left <= finger.x) && (finger.x <= box.right) && (box.top <= finger.y) && (finger.y <= box.bottom)) {
  				var offset = {
  					x: box.left - origPos.left,
  					y: box.top - origPos.top
  				};
  				$drag.css({ 
  					'transform': 'translate(' + (box.left - origPos.left) + 'px, ' + (box.top - origPos.top) + 'px) translatez(0)' 
  				});
  				$(this).addClass('iD-disabled');
  				dragInput[$drag.attr('id').toString()] = $(this).attr('id');
  				dropped = true;
  			}
  		});
  		if (!dropped && isActive) {
  			$(this).css({ 
  				'transform': 'translate(0px, 0px) translatez(0)'
  			});
  		}
      $(this).unbind("touchmove mousemove", moveMe);
      $(this).unbind("touchend mouseup", dropMe);
    };
    $(this).bind("touchstart mousedown", start);
    $(window).bind("resize", function() { console.log('resized'); });
  });
};

$.fn.iDroppable = function() {
  $(this).each(function() {
  	var offset = $(this).offset();
  	var coords = {
  		left: offset.left,
  		top: offset.top,
  		right: offset.left + $(this).width(),
  		bottom: offset.top + $(this).height()
  	}
  	for (var key in coords) {
    	$(this).data(key, coords[key]);
    }
	});
};
