var ww ;
var wh ;
var radius = 5;
var MARGIN_TOP=60;
var MARGIN_LEFT=350;
var endtime = new Date();
endtime.setTime( endtime.getTime()+ 3600 * 1000);
var  curShowTimeSeconds=0;

var balls = [];
const colors = ["#33B5e5","#09c","#a6c","#93c","#9c0","#690","#fb3","#f80","#f44","#c00"]

window.onload = function(){
	
	ww = document.body.clientWidth;//窗口的宽度
	wh = document.body.clientHeight;//窗口高度
	MARGIN_LEFT = Math.round(ww/10);
	radius = Math.round(ww*4/5/108)-1; //小球的半径
	MARGIN_TOP = Math.round(wh/5);
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	canvas.width=ww;
	canvas.height=wh;
	setInterval(
		function(){
			render(context);
			update();
		},100);  
}

function getCurrentShowTimeSeconds(){
	var curTime = new Date();
	//倒计时
    var ret  = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
	//时钟
	return  ret >= 0 ? ret : 0; 
}
function render(cxt){
	cxt.clearRect(0,0,ww,wh);
	var hour = parseInt(getCurrentShowTimeSeconds()/3600);
	var minutes = parseInt((getCurrentShowTimeSeconds()-hour*3600)/60);
	var seconds = parseInt(getCurrentShowTimeSeconds() - hour*3600-minutes*60);
	
	//时
	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hour/10),cxt);
	renderDigit(MARGIN_LEFT+15*(radius+1),MARGIN_TOP,parseInt(hour%10),cxt);
	renderDigit(MARGIN_LEFT+30*(radius+1),MARGIN_TOP,10,cxt);
	
	//分
	renderDigit(MARGIN_LEFT+39*(radius+1),MARGIN_TOP,parseInt(minutes/10),cxt);
	renderDigit(MARGIN_LEFT+54*(radius+1),MARGIN_TOP,parseInt(minutes%10),cxt);
	
	renderDigit(MARGIN_LEFT+69*(radius+1),MARGIN_TOP,10,cxt);
	
	//秒
	renderDigit(MARGIN_LEFT+78*(radius+1),MARGIN_TOP,parseInt(seconds/10),cxt);
	renderDigit(MARGIN_LEFT+93*(radius+1),MARGIN_TOP,parseInt(seconds%10),cxt);
	
	//绘制掉落的小球
	for(var i = 0;i<balls.length;i++){
		cxt.fillStyle=balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,radius,0,2*Math.PI,true);
		cxt.closePath();
		cxt.fill();
	}
}

function update(){
	var nextShowTimeSecond = getCurrentShowTimeSeconds();
	var nextHour = parseInt(nextShowTimeSecond/3600);
	var nextMinutes = parseInt((nextShowTimeSecond-nextHour*3600)/60);
	var nextSeconds = parseInt(nextShowTimeSecond - nextHour*3600-nextMinutes*60);
	
	var curHours = parseInt(curShowTimeSeconds / 3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60);
	var curSeconds = curShowTimeSeconds % 60;
	if(curSeconds != nextSeconds){
		
		if(parseInt(curHours /10) != parseInt(nextHour / 10)){
			addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
		}
		if(parseInt(curHours %10) != parseInt(nextHour % 10)){
			addBalls(MARGIN_LEFT+15*(radius+1),MARGIN_TOP,parseInt(curHours%10));
		}
		if(parseInt(curMinutes /10) != parseInt(nextMinutes / 10)){
			addBalls(MARGIN_LEFT+39*(radius+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		if(parseInt(curMinutes %10) != parseInt(nextMinutes % 10)){
			addBalls(MARGIN_LEFT+54*(radius+1),MARGIN_TOP,parseInt(curMinutes%10));
		}
		if(parseInt(curSeconds /10) != parseInt(nextSeconds / 10)){
			addBalls(MARGIN_LEFT+78*(radius+1),MARGIN_TOP,parseInt(curSeconds/10));
		}
		if(parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)){
			addBalls(MARGIN_LEFT+93*(radius+1),MARGIN_TOP,parseInt(curSeconds%10));
		}
		
		curShowTimeSeconds = nextShowTimeSecond;
		 
	}
	updateBalls();
}

function addBalls(x,y,num){
	for(var i=0;i<digit[num].length;i++){
		for(var j = 0;j<digit[num][i].length;j++){
			if(digit[num][i][j] == 1){
				var aBall = {
					x:x+j*2*(radius+1)+(radius+1),
					y:y+i*2*(radius+1)+(radius+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
				}
				balls.push(aBall);
			}
		}
	}
	
}


function updateBalls(){
	for(var i=0;i<balls.length;i++){
		balls[i].x +=balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;
		
		if(balls[i].y>=wh-radius){
			balls[i].y=wh-radius;
			balls[i].vy = -balls[i].vy*0.75;
		}
	}
	var cnt = 0;
	for(var i=0;i<balls.length;i++){
		if(balls[i].x + radius > 0 && balls[i].x-radius < ww){
			balls[cnt++] = balls[i];
		}
	}
	
	//性能优化，超过300个小球就删除一部分
	while(balls.length > Math.min(300,cnt)){
		balls.pop(); 
	}
}

/**
 * 绘制数字（0-9）和冒号
 * @param {Object} x 绘制的起点X坐标
 * @param {Object} y 绘制的起点y坐标
 * @param {Object} num 要绘制的数字
 * @param {Object} cxt 上下文
 */
function renderDigit(x,y,num,cxt){
	 cxt.fillStyle = "rgb(0,102,153)";
	 
	 for(var i =0;i<digit[num].length;i++)
	 	for(var j = 0;j<digit[num][i].length;j++)
	 	if(digit[num][i][j] == 1){
	 		cxt.beginPath();
	 		cxt.arc(x+j*2*(radius+1)+(radius+1),y+i*2*(radius+1)+(radius+1),radius,0,2*Math.PI,true);
	 		cxt.closePath();
	 		cxt.fill();
	 	}
}
