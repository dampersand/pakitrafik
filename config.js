/*config.js*/

var config = {};
config.redis = {};
config.settings = {};
config.package = {};

//config.redis
config.redis.host="hostname";
config.redis.port=3000;

//config.settings
//how often (in seconds) to perform checksum testing on the in-memory map set.
//More often means map structures are updated more often but will increase backend load.
config.settings.mapSetUpdateInterval = 30;

//whether or not to trust the in-memory map set on fresh map requests
//true = new requests can be served from the in-memory map set without immediate checksum testing (maps may be out of date until checksum test is performed)
//false = new requests should always cause a checksum test (resulting in fully up-to-date map, increases backend load)
config.settings.trustMapSet = false;

//where to find/save maps
config.package.mapDirectory="./maps";

module.exports = config;