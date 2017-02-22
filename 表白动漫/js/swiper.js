//页面滑动的js
function Swipe(container){
	//获取第一个子节点
	var element = container.find(":first");
	
	//滑动的对象
	var swipe = {};
	
	//滑动的li
	var slides = element.find(">");
	
	//获取容器尺寸
	var width = container.width();
	var height = container.height();
	
	//设置li页面的总宽度
	element.css({
		width:(slides.length * width) + 'px',
		height : height + 'px'
	});
	
	//设置每一个页面li的宽度
	$.each(slides, function(index) {
		var slide = slides.eq(index);
		slide.css({
			width : width + 'px',
			height: height + 'px'
		});
	});
	
	swipe.scrollTo = function(x, speed){
		element.css({
			'transition-timiing-function' : 'linear',
			'transition-duration' : speed + 'ms',
			'transform' : 'translate3d(-' + x + 'px, 0px, 0px)'
		});
		return this;
	}
	return swipe;
}
