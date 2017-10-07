var assert = require('assert');
var mongoose = require('mongoose');



//this is a local test database, i think this has to be changed to a mongolab database if you want it to work in travis etc.
//const dbUrl = "mongodb://localhost/NemoFinderTestDB";
//mongolab database, not good to have password shown in source code change to get it from env variable in heroku
const dbUrl = "mongodb://testuser:testuser@ds159274.mlab.com:59274/nemofindertestdb";



// doing this to plug in the global promise library to stop mongoose form console logging a depreciation warning.
//Not entirely sure what this does
mongoose.Promise = global.Promise


// users, fishdata and map schemas
// BRING IN YOUR SCHEMAS & MODELS
require('../models/schemas/fishData');
require('../models/schemas/user');
require('../models/schemas/map');

//model controllers
fishdataCtrl = require('../models/Db_controllers/fishdataCtrl');
userCtrl = require('../models/Db_controllers/userCtrl');
mapCtrl = require('../models/Db_controllers/mapCtrl');

//testing that database manipulation works
describe('Model controllers', function() {

	//this method is run before the tests in this function are run
  	before(function(done){
  		mongoose.connect(dbUrl,{useMongoClient: true}).then(()=>{
  			done();
  		});
  	});
  	// this method is run after all the test in this method are run
  	after(function(){
  		//dropping all collections after tests are done
  		mongoose.connection.collections['fishdatas'].drop(()=>{});
  		mongoose.connection.collections['usermodels'].drop(()=>{});
  		mongoose.connection.collections['maps'].drop(()=>{});


  		mongoose.connection.close();
  	});

  	describe('Connection', function() {
	    it('mongoDB connection', function() {
	      assert.equal(true,mongoose.connection.readyState);
	    });
  	});

  	// Testing the user model controllers
  	describe('User Testing', function(){
  		//this method is run before the tests in this function are run
  		before(function(done){

  			//creating a user
  			userCtrl.createUser("Pekka","Pekka.Puupaa@supermail.com","pekkaOnParas").then((data)=>{
  				//saving the id of the created user "Pekka" so that we can add it to the fishdata creation
  				let pekkaID = data._id;

  				//creating fishdata for the user
  				fishdataCtrl.createFishdataAddOwner([0,0],10,pekkaID,false).then((data)=>{
  					//saving the newly created fishdata Id so that we can add it to pekka
  					let newFishdataID = data._id

  					//adding the fishdata to pekka
  					userCtrl.userAddFishData(pekkaID,newFishdataID).then(()=>{
  						done();
  					});
  				}).catch((err)=>{console.log(err);done();});
  			});
  		});


  		it('Creating a user', function(done){
  			//checking that the database has a single user
  			userCtrl.getAllUsers().then((users)=>{
  				assert.equal(1,users.length);
  				done();
  			}).catch((err)=>{console.log(err);done();assert.equal(1,0);});
  		});

  		it('searching for a user based on id ', function(done){
  			let user1, user2;


  			//checking that user found by "getAllUsers" method and "findUser" method return the same user object
  			userCtrl.getAllUsers().then((users)=>{
  				user1 = users[0];
  				userCtrl.findUser(user1._id).then((user)=>{
  					user2 = user;

  					assert.equal(true,JSON.stringify(user1) === JSON.stringify(user2));
  					done();
  				});
  			}).catch((err)=>{console.log(err);done();});
  		});

  		it('Adding fishdata to a user', function(done){
  			//checking that the users fishdata array has one ID saved in it
  			userCtrl.getAllUsers().then((users)=>{
  				assert.equal(1,users[0].fishdata.length);
  				done();
  			}).catch((err)=>{console.log(err);assert.equal(1,0);done();});
  		});

  		it('findUserFishdata method', function(done){
  			let usersFishdataID, returnedFishdataID;
  			//checking that the id of the fishdata returned match the id inside the users array
  			userCtrl.getAllUsers().then((users)=>{
  				usersFishdataID = users[0].fishdata[0];

  				userCtrl.findUserFishdata(users[0]._id).then((data)=>{
  					returnedFishdataID = data[0]._id;

	  				assert.equal(true,JSON.stringify(usersFishdataID) == JSON.stringify(returnedFishdataID));
	  				done();
  				});
  			}).catch((err)=>{console.log(err);done();});
  		});

  		it('Deleting fishdata from the users array', function(done){
  			//Checking that users fishdata array is empty after we delete it
  			userCtrl.getAllUsers().then((users)=>{
  				userCtrl.userDeleteFishData(users[0]._id,users[0].fishdata[0]).then(()=>{
  					userCtrl.getAllUsers().then((users)=>{

  						assert.equal(0,users[0].fishdata.length);
  						done();	
  					});
  				});
  			}).catch((err)=>{console.log(err);done();});
  		});
  	});


  	 //testing the fishdata controllers
  	describe('fishdata Testing', function(done){
  		//this method is run before the tests in this function are run
  		before(function(done){
  			//creating a new fishdata object at different coords
  			fishdataCtrl.createFishdata([50,50],10,false).then((data)=>{
  				done();
  			}).catch((err)=>{console.log(err);done();});
  		});


  		it('Searching based on location works',function(done){
  			//method should only return one as the location is too far away for search parameters
  			fishdataCtrl.getFishdata(10000,10,0, 0).then((data)=>{

          /*
          if(data.length == 0){
            console.log(data);
            fishdataCtrl.getFishdata(10000,10,49.998595, 49.975885).then((data)=>{console.log(data);});
          }*/

  				assert.equal(1,data.length);

  				//method should return 2 locations as the max search distance is larger than the distance
	  			fishdataCtrl.getFishdata(10000000,10,49.998595, 49.975885).then((data)=>{
	  				assert.equal(2,data.length);
	  				
	  				//method should return 0 locations as the max search distance is 10 m
	  				fishdataCtrl.getFishdata(10,10,49.998595, 49.975885).then((data)=>{
	  					assert.equal(0,data.length);
	  					done();
	  				});
	  			});
  			}).catch((err)=>{console.log(err);done();});	
  		});

  		it('Editing a fishdatas fields values',function(done){

  			//changing the value of a fishdata objects private field to true
  			fishdataCtrl.getFishdata(1000,10,0,0).then((data)=>{
  				fishdataCtrl.editFishdata(data[0].obj._id,data[0].obj.coords,data[0].obj.depth,data[0].obj.owner,true).then((data)=>{
  					assert.equal(true,data.private);
              done();
  				});
  			}).catch((err)=>{console.log(err);done();});
  		});

  		it('Deleting a fishdata object from the database',function(done){

  			//deleting one of the fishdatavalues and then checking that the amount of values in the collection has gone down by one
  			fishdataCtrl.getFishdata(10000000,10,49.998595, 49.975885).then((data)=>{
  				assert.equal(2,data.length);

  				fishdataCtrl.deleteFishdata(data[0].obj._id).then(()=>{
  					fishdataCtrl.getFishdata(10000000,10,49.998595, 49.975885).then((data)=>{
  						assert.equal(1,data.length);
  						done();
  					});
  				});
  			}).catch((err)=>{console.log(err);done();});
  		});
  	});
  	 //testing the map controllers
  	describe('Maps Testing', function(){
  		//this method is run before the tests in this function are run
  		before(function(done){
  			let fishdataArray = [];

  			//creating some more fishdata objects for the maps and adding their id's into an array
  			fishdataCtrl.createFishdata([25,25],8,false).then((data)=>{
  				fishdataArray.push(data._id);

  				fishdataCtrl.createFishdata([26,26],4,false).then((data)=>{
  					fishdataArray.push(data._id);

  					fishdataCtrl.createFishdata([27,27],2,false).then((data)=>{
  						fishdataArray.push(data._id);

  						//getting the id of the only user inside the collection an creating a map for that user
  						userCtrl.getAllUsers().then((users)=>{
  							mapCtrl.createNewMap("testMap",fishdataArray,users[0]._id,false).then(()=>{
  								done();
  							});
  						});
  					});
  				});
  			}).catch((err)=>{console.log(err);done();});
  		}); 

  		it('Searching for a certain users map',function(done){
  			//checking that searching for pekka's maps returns an array with one map obj in it
  			userCtrl.getAllUsers().then((users)=>{
  				mapCtrl.getUserMaps(users[0]._id).then((maps)=>{
  					assert.equal(1,maps.length);
  					done();
  				});
  			}).catch((err)=>{console.log(err);done();});
  		});

  		it('Finding a single map based on id',function(done){
  			//searching with pekka's map's id and checking the returned object is the same
  			//checking that searching for pekka's maps returns an array with one map obj in it
  			userCtrl.getAllUsers().then((users)=>{
  				mapCtrl.getUserMaps(users[0]._id).then((maps)=>{
  					mapCtrl.getMap(maps[0]._id).then((singleMap)=>{
  						assert.equal(true,JSON.stringify(maps[0]) == JSON.stringify(singleMap));
  						done();
  					});
  				});
  			}).catch((err)=>{console.log(err);done();});
  		});

  		it('List of a map\'s fishdata',function(done){
  			//pekka's map should return an array of 3 fishdata objects
  			userCtrl.getAllUsers().then((users)=>{
  				mapCtrl.getUserMaps(users[0]._id).then((maps)=>{
  					mapCtrl.getMapFishdata(maps[0]._id).then((mapFishdata)=>{
  						assert.equal(3,mapFishdata.length);
  						done();
  					})
  				});
  			}).catch((err)=>{console.log(err);done();});
  		});
  	});

});