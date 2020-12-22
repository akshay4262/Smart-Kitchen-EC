var mqtt = require('mqtt');
var mongodb = require('mongodb');
var mongodbClient = mongodb.MongoClient;
var mongodbURI = 'mongodb://localhost:27017/pulses';
var deviceRoot = "BLEgateway";
var collection,client;

mongodbClient.connect(mongodbURI, setupCollection);
function setupCollection(err, db) {
   if(err) throw err;
   collection=db.collection("test_mqtt");
   client=mqtt.connect({ host: '13.233.94.96', port: 1883, username: 'vanilla', password: 'starboy'});
   client.subscribe(deviceRoot + "/#");
   console.log("Working till here");
   client.on('message', insertEvent);
   console.log("I am here");
}

function insertEvent(topic,message) {
message = message.toString();   
console.log("hello");
   var key=topic.replace(deviceRoot,'');
   console.log(topic);
   console.log(message);

   collection.update(
   { key:key }, 
   { $push: { events: { event: {  value:message, when:new Date() } } } }, 
   { upsert:true },

   function(err,docs) {  
   if(err) {
      console.log("Insert fail")// Improve error handling		
	 }
 }

 );

}
