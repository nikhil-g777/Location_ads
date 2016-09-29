/**
 * AdController
 *
 * @description :: Server-side logic for managing Ads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');

module.exports = {
	
	createAd : function(req,res){

		var socketId = sails.sockets.getId(req);
		var imageAddress = '';
		ImageMapping.findOne({number:1}).exec(function(err,record){
			console.log('found record:'+JSON.stringify(record));
			for(var key in record){
				if(record.hasOwnProperty(key)){
					if(key==req.body.timeId){
						imageAddress = record[key];
						console.log("\n\nEqual: "+record[key]+"\n\n");

						Ad.create({

							timeId:req.body.timeId,
							name:req.body.name,
							heading:req.body.heading,
							image:record[key],
							latitude:req.body.latitude,
							longitude:req.body.longitude,
							radius:req.body.radius

						}).exec(function(err,record){
							if(err){
								return res.serverError(err);
							}
							console.log("Ad created with name : "+record);
							console.log(imageAddress);
							var path = imageAddress;
							sails.sockets.broadcast(socketId,{identity:"updateImage",timeId:req.body.timeId,path:path});

						});
					}
				}
			}
		});
	},

	removeAd : function(req,res){
		
		var timeId = req.body.timeId;

		Ad.findOne({timeId:timeId}).exec(function(err,record){
			var path = "./assets"+record.image;
			fs.unlinkSync(path);
			console.log("removed file");
	

			Ad.destroy({timeId:req.body.timeId},function(err){
				if(err){res.serverError(err);}
				else{
					console.log("Ad with timeId : "+req.body.timeId+" has been destroyed !");
				}
			});
		});

		var obj = {};
		obj[timeId]="";
		ImageMapping.native(function(err,collection){
			collection.update({number:1},{$unset:obj});
		});
	},

upload: function  (req, res) {

  if(req.method === 'GET')
   return res.json({'status':'GET not allowed'});      

   var timeId = req.param('timeId');

   sails.log.debug('We have entered the uploading process ');
  
   req.file('userPhoto_'+req.param('timeId')).upload({
   dirname:'../../assets/images/'},function(err,files){
   sails.log.debug('file is :: ', +files);
   if (err) return res.serverError(err);      
   console.log(files);  
   console.log(files[0].fd);

   var index = files[0].fd.indexOf('images');
   index-=1;
   var path = files[0].fd.substring(index);


   ImageMapping.findOne({number:1}).exec(function(err,record){
	   	var obj = {};
		obj[timeId] = path;
	   if(record==undefined){
		   obj["number"] = 1;
		   ImageMapping.create(obj).exec(function(err,rec){
			   if(err){res.serverError(err);}
			   console.log("new entry created!");
		   });
	   }
	   else{
		   ImageMapping.update({number:1},obj).exec(function(err,updated){
			   if(err){return res.serverError(err);}
		   });
	   }
   })

//    res.ok();
      res.json({status:200,file:files,path:path});

   });
 },

};

