/**
 * Ad.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

		timeId:{
			type:"integer",
			required:true
		},
  	
  	name:{
  		type: "string",
      required:true
  	},

  	heading:{
  		type:"string",
      required:true
  	},

//Figure out how to store images
  	image:{
  		type:"string",
      required:true
  	},

  	latitude:{
  		type:"float",
      required:true
  	},

  	longitude:{
  		type:"float",
      required:true
  	},

  	radius:{
  		type:"float",
      required:true
  	}

  }

};

