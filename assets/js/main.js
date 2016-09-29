
// var schedule = require('node-schedule');

var timeInterval = 20000;

io.socket.on('connect',function socketConnected(){

	io.socket.put('/user/createUser',{name:"test"});
	// date.setSeconds(date.getSeconds()+20);

	// var x = schedule.scheduleJob(date,function(){
	// 	console.log('Scheduled Job after 20 sec');
	// })

var count = 0;

  var timer = setInterval(function(){	

		count++;
		console.log("Count is : "+count);
		getLocation(function call(position){

			console.log(position);
			io.socket.put('/user/ping',{
				latitude:position.coords.latitude,
				longitude:position.coords.longitude
			});	
		});
  },timeInterval);

io.socket.on('message',function(data){

	switch(data.identity){
		
		case "newAd":
			addNewAd(data.record);
			console.log('Came to new ad');
	}

});

});