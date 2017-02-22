var animationEnd = (function() {
	var explorer = navigator.userAgent;
	if (~explorer.indexOf('WebKit')) {
		return 'webkitAnimationEnd';
	}
	return 'animationend';
})();

var lamp = {
	elem: $('.b_background'),
	bright: function() {
		this.elem.addClass('lamp-bright');
	},
	dark: function() {
		this.elem.removeClass('lamp-bright');
	}
};

var container = $("#content");
var swipe = Swipe(container);
visualWidth = container.width();
visualHeight = container.height();

// 页面滚动到指定的位置
function scrollTo(time, proportionX) {
	var distX = visualWidth * proportionX;
	swipe.scrollTo(distX, time);
}

// 获取数据
var getValue = function(className) {
	var $elem = $('' + className + '');
	// 走路的路线坐标
	return {
		height: $elem.height(),
		top: $elem.position().top
	};
};

// 桥的Y轴
var bridgeY = function() {
	var data = getValue('.c_background_middle');
	return data.top;
}();

////////
//小女孩 //
////////
var girl = {
	elem: $('.girl'),
	getHeight: function() {
		return this.elem.height();
	},
	// 转身动作
	rotate: function() {
		this.elem.addClass('girl-rotate');
	},
	setPosition: function() {
		this.elem.css({
			left: visualWidth / 2,
			top: bridgeY - this.getHeight()
		});
	},
	getPosition: function() {
		return this.elem.position();
	},
	getWidth: function() {
		return this.elem.width()
	}
};

var snowFlakeURI = [
	'img/snowflake/snowflake1.png',
	'img/snowflake/snowflake2.png',
	'img/snowflake/snowflake3.png',
	'img/snowflake/snowflake4.png',
	'img/snowflake/snowflake5.png',
	'img/snowflake/snowflake6.png'
];

function snowFlake(){
	var $flakeContainer = $('#snowflake');
	function getImagesName(){
		return snowFlakeURI[[Math.floor(Math.random() * 6)]];
	}
	//创建一个雪花元素
	function createSnowBox(){
		var url = getImagesName();
		return $('<div class="snowbox"/>').css({
			'width':41,
			'height':41,
			'position':'absolute',
			'backfroundSize':'cover',
			'z-index':100000,
			'top':'-41px',
			'background-image':'url('+url+')'
		}).addClass('snowRoll');
	}
	setInterval(function(){
		 // 运动的轨迹
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity    = 1,
                endPositionTop  = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration        = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个雪花
            var $flake = createSnowBox();

            // 设计起点位置
            $flake.css({
                left: startPositionLeft,
                opacity : randomStart
            });

            // 加入到容器
            $flakeContainer.append($flake);

            // 开始执行动画
            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function() {
                $(this).remove() //结束后删除
            });
            
	},200);
}



// 修正小女孩位置
girl.setPosition();


function doorAction(left, right, time) {
	var $door = $(".door");
	var doorLeft = $(".door-left");
	var doorRight = $(".door-right");
	var defer = $.Deferred();
	var count = 2;
	//等待开门完成
	var complete = function() {
		if (count == 1) {
			defer.resolve();
			return;
		}
		count--;
	};
	doorLeft.transition({
		'left': left
	}, time, complete);
	doorRight.transition({
		'left': right
	}, time, complete);
	return defer;
}

function openDoor() {
	return doorAction('-50%', '100%', 2000);
}

function closeDoor() {
	return doorAction('0%', '50%', 2000);
}

var instanceX;

function boyWalk() {
	var container = $("#content");
	var visualWidth = container.width();
	var visualHeight = container.height();
	var getValue = function(className) {
		var $elem = $('' + className + '');
		return {
			height: $elem.height(),
			top: $elem.position().top
		};
	}

	var pathY = function() {
		var data = getValue('.a_background_middle');
		return data.top + data.height / 2;

	}();

	var $boy = $("#boy");
	var boyWidth = $boy.width();
	var boyHeight = $boy.height();

	$boy.css({
		top: pathY - boyHeight + 25
	});

	//暂停走路
	function pauseWalk() {
		$boy.addClass('pauseWalk');
	}

	//恢复走路

	function restoreWalk() {
		$boy.removeClass("pauseWalk");
	}

	//css3动作变化
	function slowWalk() {
		$boy.addClass("slowWalk");
	}

	//用tranisition做运动
	function startRun(options, runTime) {
		var dfdPlay = $.Deferred();
		//恢复走路
		restoreWalk();
		//运动的属性
		$boy.transition(
			options,
			runTime,
			'linear',
			function() {
				dfdPlay.resolve();
			});
		return dfdPlay;
	}

	//开始走路
	function walkRun(time, dist, disY) {
		time = time || 3000;
		slowWalk();
		var d1 = startRun({
			'left': dist + 'px',
			'top': disY ? disY : undefined
		}, time);
		return d1;
	}

	//走进商店
	function walkToShop() {
		var defer = $.Deferred();
		var doorObj = $(".door");
		var offsetDoor = doorObj.offset();
		var doorOffsetLeft = offsetDoor.left;
		var offsetBoy = $boy.offset();
		var boyOffsetLeft = offsetBoy.left;

		instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffsetLeft + $boy.width() / 2);

		//开始走路
		var walkPlay = startRun({
			transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
			opacity: 0.1
		}, 2000);
		walkPlay.done(function() {
			$boy.css({
				opacaity: 0
			})
			defer.resolve();
		});
		return defer;
	}

	//走出店
	function walkOutShop(runTime) {
		var defer = $.Deferred();
		restoreWalk();
		var walkPlay = startRun({
			transform: 'translateX(' + instanceX + 'px),scale(1,1)',
			opacity: 1
		}, runTime);
		walkPlay.done(function() {
			defer.resolve();
		});
		return defer;
	}

	// 取花
	function takeFlower() {
		// 增加延时等待效果
		console.log("takeFlower");

		var defer = $.Deferred();
		setTimeout(function() {
			// 取花
			$boy.addClass('slowFlolerWalk');
			defer.resolve();
		}, 1000);
		return defer;
	}

	//计算移动距离
	function calculateDist(direction, proportion) {
		return (direction == 'x' ? visualWidth : visualHeight) * proportion;
	}

	return {
		//开始走路
		walkTo: function(time, proportionX, proportionY) {
			var distX = calculateDist('x', proportionX);
			var distY = calculateDist('y', proportionY);
			return walkRun(time, distX, distY);
		},
		toShop: function() {
			return walkToShop.apply(null, arguments);
		},
		outShop: function() {
			return walkOutShop.apply(null, arguments);
		},
		//停止走路
		stopWalk: function() {
			pauseWalk();
		},
		setColor: function(value) {
			$boy.css('background-color', value);
		},
		getWidth: function() {
			return $boy.width();
		},
		// 复位初始状态
		resetOriginal: function() {
			this.stopWalk();
			// 恢复图片
			$boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
		},
		// 转身动作
		rotate: function(callback) {
			restoreWalk();
			$boy.addClass('boy-rotate');
			// 监听转身完毕
			if (callback) {
				$boy.on(animationEnd, function() {
					callback();
					$(this).off();
				});
			}
		},
		takeFlower: function() {
			return takeFlower();
		}
	}
}