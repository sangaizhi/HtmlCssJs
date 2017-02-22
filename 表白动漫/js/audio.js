var aduioConfig = {
	enable:true,
	playUrl:'audio/happy.wav',
	cycleUrl:'audio/circulation.wav'
}


function html5Audio(url, isLoop){
	var audio = new Audio(url);
	audio.autoplay = true;
	audio.loop = isLoop || false;
	audio.play();
	return {
		end:function(callback){
			audio.addEventListener('ended',function(){
				callback();
			},false);
		}
	}
}
