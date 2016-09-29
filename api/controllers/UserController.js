/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var counter = 0;
var geolib = require('geolib');

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}


module.exports = {	

	createUser: function(req,res){

		var socketId = sails.sockets.getId(req);
		var timeId = new Date().getTime();
		console.log(timeId);
		
		User.create({
			name:req.body.name,
			socketId:socketId,
			timeId:timeId
		}).exec(function(err,record){
			if(err){ return res.serverError(err);}

			console.log("User created with name : "+record.name+" and id: "+record.id);

		})
	},


	ping : function(req,res){

		var socketId = sails.sockets.getId(req);
		var temp = [];
		Ad.find({}).exec(function(err,records){
			console.log(records);
			records.forEach(function(record){
				var flag = 0;
				User.findOne({socketId:socketId}).exec(function(err,user){
					var arr1 = user.ads?user.ads : [];
					loop1: 
					for(var i=0; i<arr1.length;i++){
						var ads = arr1[i];
						for(var j = 0;j<ads.length;j++){
							if(ads[j]==record.timeId){
								flag = 1;
								break loop1;
							}
						}
					}
					if(flag==0){

						var dist = distance(record.latitude,record.longitude,req.body.latitude,req.body.longitude,'M');
						console.log("distance is "+dist);

						if(dist <= record.radius){
							temp.push(record.timeId);
							User.findOne({socketId:socketId}).exec(function(err,rec){

								var num = rec.number+1;
								var arr = rec.ads ? rec.ads : [];
								arr.push(temp);
								User.update({socketId:socketId},{number:num,ads:arr}).exec(function(err,updated){
								console.log("User has now recieved "+num+"ads");
							
								console.log("sending message to socket to display Ad");
								sails.sockets.broadcast(socketId,{identity:"newAd",record:record});
								});
							
							});

						}
					}
				});

			});

		});

		console.log("position is "+req.body.latitude);
		console.log("position is "+req.body.longitude+"\n\n\n");
		console.log("counter is "+counter);
	}
};


