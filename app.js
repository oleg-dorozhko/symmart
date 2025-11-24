//var opbeat = require('opbeat').start()

//import { createRequire } from 'module'
//const require = createRequire(import.meta.url);

var glob_debug_flag=false;
var mod_rio = require('./lib/mod_rio');
// var mod_mint_nft_solana_mainnet  = require('./lib/mod_mint_nft_solana_mainnet');
// var mod_upload_to_arweave  = require('./lib/mod_upload_to_arweave');
// var mod_mint_nft_solana = require('./lib/mod_mint_nft_solana');
// var mod_mint_nft_solana_create_metadata = require('./lib/mod_mint_nft_solana_create_metadata');
// var mod_mint_nft_solana_get_metadata = require('./lib/mod_mint_nft_solana_get_metadata');
// var mod_mint_nft_solana = require('./lib/mod_mint_nft_solana_v2_0');
var mod_up = require('./lib/mod_up');
var mod_plus =  require('./lib/mod_plus');
var mod_plus_nm =  require('./lib/mod_plus_nm');
var mod_minus =  require('./lib/mod_minus');
var mod_smooth =  require('./lib/mod_smooth');
var mod_get_cluster =  require('./lib/mod_get_cluster_worker');
var mod_mirror = require('./lib/mod_mirror');
// var mod_get_solana_balance = require('./lib/mod_get_solana_balance'); 
// var mod_half = require('./lib/mod_half');
// var mod_axes = require('./lib/mod_axes');
// var mod_genrndseed = require('./lib/mod_generate_random_seed');
var mod_execute_pattern_worker = require('./lib/mod_execute_pattern_worker');
var mod_generate_random_seed = require('./lib/mod_generate_random_seed');
var mod_inverse = require('./lib/mod_inverse');
var mod_random = require('./lib/mod_random');
var mod_median = require('./lib/mod_median');
var mod_border = require('./lib/mod_border');
var mod_magik_rotate = require('./lib/mod_magik_rotate');
var mod_step_colors = require('./lib/mod_step_colors');
var mod_destroy_colors = require('./lib/mod_destroy_colors');
var mod_odin_dva_colors = require('./lib/mod_odin_dva_colors');
var mod_cryptography = require('./lib/mod_cryptography');
var mod_digfrompng = require('./lib/mod_digfrompng');
var mod_bluestiks = require('./lib/mod_bluestiks');
var mod_join_colors = require('./lib/mod_join_colors');
var mod_colors = require('./lib/mod_colors');
var mod_rotate_ff = require('./lib/mod_rotate_ff');
var mod_glue = require('./lib/mod_glue');
var mod_gcombo = require('./lib/mod_gcombo');
var mod_acombo = require('./lib/mod_acombo');
var mod_fill = require('./lib/mod_fill');
// var mod_fillx = require('./lib/mod_fillx');
var mod_inner_combo = require('./lib/mod_inner_combo');
var mod_brain = require('./lib/mod_brain');
var mod_min_colors = require('./lib/mod_min_colors');
var mod_razn_colors = require('./lib/mod_razn_colors');
var mod_axes = require('./lib/mod_axes');
var mod_black_white = require('./lib/mod_black_white');

var mod_nineth = require('./lib/mod_nineth');
var mod_maximus = require('./lib/mod_maximus');
var mod_super_paint_over = require('./lib/mod_super_paint_over');
var mod_paint_over = require('./lib/mod_paint_over');
var mod_rotate_any = require('./lib/mod_rotate_any');
var mod_md5 = require('./lib/mod_md5');

var PNG = require('pngjs').PNG;
var md5 = require('js-md5');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();  
var fs = require('fs');

// run with node --experimental-worker index.js on Node.js 10.x
const { Worker } = require('worker_threads')

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./lib/mod_serviceTestWorker.js', { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}

async function run() {
  const result = await runService('world')
  console.log(result);
}

run().catch(err => console.error(err))
//console.log("+-+-");
function runSmoothService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./lib/mod_serviceSmoothWorker.js', {workerData} );
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}

async function smooth(req,res) {
	
	mod_smooth.smooth( req, function ( png ) {
		sendImage(png,res,"\nSmoothed");
	});
 
	
}

//runSmooth;//().catch(err => console.error(err))

/******
What you would do in this case is to convert all new Buffer() or Buffer() calls to use Buffer.alloc() or Buffer.from(), in the following way:

For new Buffer(number), replace it with Buffer.alloc(number).
For new Buffer(string) (or new Buffer(string, encoding)), replace it with Buffer.from(string) (or Buffer.from(string, encoding)).
For all other combinations of arguments (these are much rarer), also replace new Buffer(...arguments) with Buffer.from(...arguments).
Note that Buffer.alloc() is also faster on the current Node.js versions than new Buffer(size).fill(0), which is what you would otherwise need to ensure zero-filling.
*********/

var stream = require('stream');
var util = require('util');

const Writable = require('stream').Writable;
const Readable = require('stream').Readable;
const Transform = require('stream').Transform;
const pipeline = require('stream').pipeline;
// use Node.js Writable, otherwise load polyfill

//var Writable = stream.Writable || require('readable-stream').Writable;
var Duplex = stream.Duplex;
var memStore = { };

/* Writable memory stream */
function WMStrm(key, options) {
  // allow use without new operator
  if (!(this instanceof WMStrm)) {
    return new WMStrm(key, options);
  }
  Writable.call(this, options); // init super
  this.key = key; // save key
  //memStore[key] = Buffer.from('','base64'); // empty
  memStore[key] = Buffer.from(''); // empty
}
util.inherits(WMStrm, Writable);

WMStrm.prototype._write = function (chunk, enc, cb) {
  // our memory store stores things in buffers
  ////////////////////////
  var enc = 'binary';
  //////////////////////
  var buffer = (Buffer.isBuffer(chunk)) ?   chunk :      Buffer.from(chunk, enc);  

	//	var buffer = chunk;
  // concat to the buffer already there
  memStore[this.key] = Buffer.concat([memStore[this.key], buffer]);
  cb();
};


// /* Writable memory stream */
// function RMStrm(key, options) {
  // // allow use without new operator
  // if (!(this instanceof RMStrm)) {
    // return new RMStrm(key, options);
  // }
  // Readable.call(this, options); // init super
  // this.key = key; // save key
  // this._index = 0;
  // this._max = memStore[key].length;
  // //memStore[key] = Buffer.from('','base64'); // empty
  // //memStore[key] = Buffer.from(''); // empty
// }
// util.inherits(RMStrm, Readable);

// RMStrm.prototype._read = function () {
   // if (this._index >= this._max) {
      // this.push(null);
    // } else {
		
		// ////////////////////////////////////////////////////////////////////////////////////////////////
      // //const buf = Buffer.from(String.fromCharCode(memStore[this.key].readUInt8(this._index)), 'utf8');
// //////////////////////////////////////////////
	// this.push(Buffer.from(memStore[this.key].readUInt8(this._index)));
    // //  this.push(buf);
	  // this._index += 1;

    // }
// };

//////////////////////////////// DUPLEX /////////////////////////////////

 
 

class StorageStream extends Transform {
  constructor() {
    super({
      objectMode: true
    })

    this.values = new Map();
  }

  _transform(data, encoding, next) {
    const { key, value } = data;

    this.values.set(key, value);
    console.log("Setting Map key="+key+" := "+value+"")

    next(null, data);
  }
}

(async ()=>{
  await new Promise( resolve => {
    pipeline(
      new Readable({
        objectMode: true,
        read(){
          this.push( { key: 'foo', value: 'bar' } );
          this.push( null );
        }
      }),
      new StorageStream(),
      new Writable({
        objectMode: true,
        write( chunk, encoding, next ){
          console.log("propagated:", chunk);
          next();
        }
      }),
      (error) => {
        if( error ){
          reject( error );
        }
        else {
          resolve();
        }
      }
    );
  });
})()
.catch( console.error );
 

 
 
 
/* Writable memory stream */
function DMStrm(key, options) {
  // allow use without new operator
  if (!(this instanceof DMStrm)) {
    return new DMStrm(key, options);
  }
  Duplex.call(this, options); // init super
  this.key = key; // save key
  this._index = 0;
  this._max = 0;
  //memStore[key] = Buffer.from('','base64'); // empty
  memStore[key] = Buffer.from(''); // empty
};
util.inherits(DMStrm, Duplex); 
 
DMStrm.prototype._write = function (chunk, enc, cb) {
  // our memory store stores things in buffers
  ////////////////////////
  //enc = 'base64';
  //////////////////////
  var buffer = (Buffer.isBuffer(chunk)) ?
    chunk :  // already is Buffer use it
    Buffer.from(chunk, enc);  // string, convert

  // concat to the buffer already there
  memStore[this.key] = Buffer.concat([memStore[this.key], buffer]);
  this._max =  memStore[this.key] .length;
  cb();
}
 
DMStrm.prototype._read = function () {
    
    if (this._index >= this._max) {
      this.push(null);
    } else {
		
      const buf = Buffer.from(String.fromCharCode(memStore[this.key].readUInt8(this._index)), 'utf8');

      this.push(buf);
	  this._index += 1;

    }
	
  };
  /////////////////////////////////////////////////////////////////////
//var dstream = new DMStrm('hey');
//dstream.write('hello ');
//dstream.pipe(console);
//console.log(dstream.read().toString('utf-8'));
//console.log(dstream.read().toString('utf-8'));
//dstream.end();
////////////////////////////////////////end of duplex

//var bodyParser = require('body-parser');
//var Readable = require('stream').Readable;
var qs = require('querystring');
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.bodyParser());
//app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/***
app.post('/api/users', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    res.send(user_id + ' ' + token + ' ' + geo);
});
***/

//We can test this using POSTman and send information as application/x-www-form-urlencoded:
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('port', ( process.env.PORT || 5000 ));
console.log("PORT=5000");

app.use(express.static(__dirname + '/public'));
//app.use(opbeat.middleware.express())

////////////////////////////////////////// ERROR  PROCSSING ///////////////////////////////////

//===========================================
/*
 * Функция создаёт TCP соединение по указанному IPv4 адресу.  Аргументы:
 *
 *    ip4addr        строка адреса формата IPv4;
 *
 *    tcpPort        натуральное число, TCP порт;
 *
 *    timeout        натуральное число, время в миллисекундах, в течение которого
 *                   необходимо ждать ответа от удалённого сервера;
 *
 *    callback       функция вызываемая после завершения операции,
 *                   если операция завершилась успешно, происходит 
 *                   вызов вида callback(null, socket), где socket это
 *                   объект класса net.Socket, если возникла ошибка,
 *                   выполняется вызов вида callback(err).
 *
 * В функции могут возникнуть ошибки следующих типов:
 *
 *    SystemError    Для "connection refused", "host unreachable" и других
 *                   ошибок, возвращаемых системным вызовом connect(2). Для
 *                   данного типа ошибок поле errno объекта err будет содержать
 *                   соответствующее ошибке символьное представление.
 *
 *    TimeoutError   Данный тип ошибок возникает при истечении 
 *                   времени ожидания timeout.
 *
 * Все возвращаемые объекты ошибок имеют поля "remoteIp" и "remotePort".
 * После возникновении ошибки, сокеты, которые были открыты функцией, будут закрыты.
 */
function connect(ip4addr, tcpPort, timeout, callback)
{
  assert.equal(typeof (ip4addr), 'string',
      "аргумент 'ip4addr' должен быть строкового типа");
  assert.ok(net.isIPv4(ip4addr),
      "аргумент 'ip4addr' должен содержать IPv4 адрес");
  assert.equal(typeof (tcpPort), 'number',
      "аргумент 'tcpPort' должен быть числового типа");
  assert.ok(!isNaN(tcpPort) && tcpPort > 0 && tcpPort < 65536,
      "аргумент 'tcpPort' должен быть натуральным числом в диапазоне от 1 до 65535");
  assert.equal(typeof (timeout), 'number',
      "аргумент 'timeout' должен быть числового типа");
  assert.ok(!isNaN(timeout) && timeout > 0,
      "аргумент 'timeout' должен быть натуральным числом");
  assert.equal(typeof (callback), 'function');

  /* код функции */
}

//==========================================================================


app.use(function(err, req, res, next) {
  // log the error, treat it like a 500 internal server error
  // maybe also log the request so you have more debug information
  //log.error(err, req);
 
  // during development you may want to print the errors to your console
  console.log(err.stack);
 
  // send back a 500 with a generic message
  res.status(500);
  res.send('error');
});

//////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

var global_room_list = [];
var global_intervalMS = 5000;
var MAX_FRAMES_FOR_ROOM = 2;

/////////////////////////////// database /////////////////////////////
 /****** works *****
 var mysql = require('mysql');
 var pool = mysql.createPool({
		connectionLimit: 5,
	   host: "localhost",
	   user: "y95444k9_swm",
	    password: "4&yV9MjA",
	    database: 'y95444k9_swm'
 });
*****/
 // connection.connect((err) => {
     // if(err) throw err;
     // console.log('Connected to MySQL Server');
	// // console.log(connection.state+ " to mysql server. Connection tested OK. Connection NOT failed");
  // });


//function getcon( result ) {
//
//	con.connect(function(err) {
//		if (err) throw err;
//		result(con);
//	});
//}

// app.get('/installDB', function(request, response) {


		
		// //	var sql = "CREATE TABLE `frames` ( `md5` varchar(100) NOT NULL PRIMARY KEY, `room` varchar(40),  `ind` int(11) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
		// //	con.query( sql, function (err, result) {
				
		// //		if (err) throw err;
		// //		console.log("Table created");
				
		// //	});

// });

// app.get('/seleDBtest', seleDBtest );
	
// function seleDBtest(req,res) {
	
	  
	  // connection.query("SELECT count(*) as 'Number of scripts' FROM scriptes", function (err, result, fields) {
				
			// if (err) throw err;
		
			// console.log(result);
			// var buf="<div>";
			// for(var i =0;i<result.length;i++) {
				// var s = "<p>"+JSON.stringify(result[0])+"</p>";
				// buf += s;
			// }
			// buf+="</div>";
			
			// res.writeHead( 200, { 'Content-Type':'text/html' } );
				// res.end(""+buf);
				 
				// req.connection.destroy();
				// return;
				
		// });
	
/****
		connection.query("SELECT * FROM frames", function (err, result, fields) {
				
			if (err) throw err;
		
			console.log(result);
			var buf="<div>";
			for(var i =0;i<result.length;i++) {
				var s = "<p>"+JSON.stringify(result[0])+"</p>";
				buf += s;
			}
			buf+="</div>";
			
			res.writeHead( 200, { 'Content-Type':'text/html' } );
				res.end(""+buf);
				 
				req.connection.destroy();
				return;
				
		});
	
****/
//}

//////////////////////////////////////////////////////////////////////////////////////

app.get('/printscreen2', function(request, response) {
  var roomID = request.query.roomID;
  console.log("in get: /printscreen2");
  console.log("roomID="+roomID);
  if(roomID==undefined) roomID='';
  var intervalMS = global_intervalMS;
  response.render('./pages/printscreen2',{roomID: roomID,intervalMS:intervalMS,});
  request.connection.destroy();
  return;
});

//////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////
// this function called from html page POST js XMLHTTPRequest and searches for zero image of room 
// then sending image to response
// we need to get filename from database, and load image from disk and then sending this image to response
//

/*************** works **********
app.post('/printscreenNNB',function (req,res) {
	
		console.log("");
		console.log("In printscreenNNB:");
		console.log("---------------------");
	
		var body = '';
		var st = "";
		req.on('data', function (data) {
			
			//console.log("chunk!");
			st+="chunk!";
			body += data;

			if (body.length > 1000)
			{
				res.writeHead( 200, { 'Content-Type':'text/plain' } );
				res.end("printscreenNNB: error: data too big");
				console.log("printscreenNNB: error: data too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
		
			try 
			{
				
				console.log("body="+body);
				st+=body;
				var post = qs.parse(body);
				
				//console.log("roomID="+post['roomID']);
				
				var roomID = post["roomID"];
				console.log("roomID="+roomID);
				
				
				
				if(roomID==undefined){
					res.writeHead( 200, {  'Content-Type': 'text/html'   } ); 
					res.end('printscreenNNB: error: Param "roomID" undefined');
					req.connection.destroy();
							return;
				}
		
				roomID = validateRoomID(roomID);
				if(roomID==null) {
					res.writeHead( 200, {  'Content-Type': 'text/html'   } ); 
					res.end('printscreenNNB: error: Param "roomID" invalid');
					req.connection.destroy();
						return;
				}
				
				
				connection.query("SELECT * from `rsettings` WHERE `room_id`='"+roomID+"'", (err, rows) => {
		
					if(err) throw err;
					//console.log('The data from users table are: \n', rows);
					
					//console.log(rows);
					console.log("rows.length="+rows.length);
		
					if(rows.length==0)
					{
						//roomdId not found
						res.writeHead( 200, {  'Content-Type': 'text/html'   } ); 
						res.end('printscreenNNB: error: Room '+roomID+' not found');
						req.connection.destroy();
						return;
					}
					else if (rows.length==1) {
							
							console.log("In printscreenNNB - in query select from frames: ");
							//console.log(rows);
							//console.log(iRoom.room_id);
							//console.log(iRoom.room_id);
							var start = rows[0].start;
							var sql = "SELECT * from `frames` WHERE `room_id`='"+roomID+"' AND ind='"+start+"'";
							console.log(sql);
							connection.query(sql, (err, rows) => {
								if(rows.length==1) {
									//md5 here, get file from memory folder and pipe it
									//console.log(rows);
									var md5 = rows[0].md5;	
									console.log("memStore["+md5+"]=");
									console.log(memStore[md5]);

									//test != undefined
									if(memStore[md5] === undefined) {
									
										//roomdId not found
										res.writeHead( 200, {  'Content-Type': 'text/html'   } ); 
										res.end('printscreenNNB: error: For room frame with md5 '+md5+' not found. We need to clean database, sorry');
										req.connection.destroy();
										return;	
																		
									}
									
									res.write(memStore[md5],'binary');
									res.end(null, 'binary');
									
									//var stream1 = new RMStrm(md5);
									//console.log(memStore[md5]);
									// if(stream1 === undefined) {
									
									
										// res.writeHead( 200, {  'Content-Type': 'text/html'   } ); 
										// res.end('md5 '+md5+' not found in memory');
										// req.connection.destroy();
										// return;
									
									
									// }
									 
									// res.writeHead( 200, {  'Content-Type': 'blob' } ); 
									// stream1.pipe(res);
											
									// stream1.on('end', function()	{
										// console.log('blob was sent');
									// });
									
										// var ind = isDataPNGObjectByMD5(md5);	
										// if(ind == null) {
									
											// res.writeHead( 200, {  'Content-Type': 'text/html'   } ); 
											// res.end('md5 '+md5+' not found in global_memory array');
											// req.connection.destroy();
											// return;	
										
										
										// }
										
										// var _png =  new PNG({
											
											// width: global_memory[ind].width,
											// height: global_memory[ind].height,
											// filterType: 4
											
											
										// });
								
										// var arr = memStore[md5];//Uint32Array.from().buffer;
										// //var arr = memStore[md5];
		
										// for(var j=0;j<_png.height;j++)
										// {
											// for(var i=0;i<_png.width;i++)
											// {
												// var idx = (_png.width * j + i) << 2;	
											
												// _png.data[idx]=arr[idx];
												// _png.data[idx+1]=arr[idx+1];
												// _png.data[idx+2]=arr[idx+2];
												// _png.data[idx+3]=arr[idx+3];
											// }
										// }
		 							
									
										// sendImage(_png,res,'sended blob from file ok');
										
									
									
									
									// fs.createReadStream("./memory/"+md5+".png").pipe(new PNG())
									  // .on('parsed', function() {

										// for (var y = 0; y < this.height; y++) {
											// for (var x = 0; x < this.width; x++) {
												// var idx = (this.width * y + x) << 2;

												// // invert color
												// this.data[idx] = 255 - this.data[idx]; // R
												// this.data[idx+1] = 255 - this.data[idx+1]; // G
												// this.data[idx+2] = 255 - this.data[idx+2]; // B

												// // and reduce opacity
												// this.data[idx+3] = this.data[idx+3] >> 1;
											// }
										// }
										
										// sendImage(this,res,'sended blob from file ok');
										// //res.writeHead( 200, {  'Content-Type': 'blob' } ); 
										// //this.pack().pipe(res);
										// //res.end();
										// //req.connection.destroy();
										// //return;

									// });
									

									
								}
							});
					} 
					else 
					{
								//error too more rooms with same id
								res.writeHead( 200, {  'Content-Type': 'text/html'   } ); 
								res.end('printscreenNNB: error: too more rooms with same id');
								req.connection.destroy();
								return;
					}
								
				});
							
				

					
					// console.log("found ind="+ind+" for roomID="+roomID);
					// console.log(global_room_list[ind]);
					// console.log("global_room_list[ind].frms[0]="+global_room_list[ind].frms[0]);
					// var md5 = global_room_list[ind].frms[0];
					// if(md5 == undefined) {
						// res.writeHead( 500, {  'Content-Type': 'text/html'   } ); 
						// res.end('First frame in array not found (for '+roomID+')');
						// req.connection.destroy();
						// return;
					// }
					
					// //returns index or null
					// var ind = isDataPNGObjectByMD5(md5);
					// if(ind==null) {
						// res.writeHead( 500, {  'Content-Type': 'text/html'   } ); 
						// res.end('md5 not found');
						// req.connection.destroy();
						// return;
					// }
					
					// global_memory[ind].png.pack();

					// res.writeHead( 200, {  'Content-Type': 'blob' });
					// global_memory[ind].png.pipe(res);
					// global_memory[ind].png.on('end', function(){
						// req.connection.destroy();
						// return;
					// });
		
		}
		catch(ex) {
			
			console.log(""+ex.stack);
			res.writeHead( 200, {  'Content-Type': 'text/html'  } ); 
			res.end("printscreenNNB: error: Error: "+ex.stack);
			req.connection.destroy();
			return;
		}		
			
	
		});
	
	
});





//////////////////////////// end of printscreenNNB ///////////////////////////////////
*******/

/**************
///////////////////// checkRoomID //////////////////////////////////

app.post('/checkRoomID', function(req, res) {
	
		console.log("#app in checkRoomID:");
		var st="";
		var body = '';

		req.on('data', function (data) {
			
			console.log("chunk!");
			
			body += data;

			if (body.length > 1000)
			{
				res.writeHead( 200, { 'Content-Type':'text/plain' } );
				res.end("checkRoomID: error: data too big");
				console.log("#app checkRoomID: error: data too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			console.log("body="+body);
			
			var post = qs.parse(body);
			console.log("roomID="+post["roomID"]);
			
			var roomID = post["roomID"]; 
			
			if(roomID==undefined){
				res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
				res.end('checkRoomID: error: Param "roomID" undefined');
				console.log("#app  checkRoomID:  param roomID undefined");
				req.connection.destroy();
				return;
			}
			else {
		
				roomID = validateRoomID(roomID);
				if(roomID==null) {
					res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
					res.end('checkRoomID: error: param roomID invalid');
					console.log("#app  checkRoomID: param roomID invalid");
					req.connection.destroy();
					return;
				}
				else
				{
					
					// //returns index or null
					isRoomExist(roomID, function(ind) {
						
					
					if(ind==null) {
						res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
						res.end('checkRoomID: error: room not found');
						console.log("#app checkRoomID: roomID "+roomID+" not found");
						req.connection.destroy();
						return;
					}
					else {
						res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
						res.end("room " + roomID+ " found");
						console.log("#app checkRoomID: roomID "+ind+" found");
						req.connection.destroy();
						return;
					}					
						
						
						
					});
					
					
					// //fs.createReadStream("./memory/roomsList.lst");
				}
			}
			
		});
});


function getRoom(roomID, callback ) {
	
		
		connection.query("SELECT * FROM `rsettings` WHERE `room_id`='"+roomID+"'", function (err, result, fields) {
				
			if (err) throw err;
			if(result.length==0) callback(null);
			else if(result.length>1) throw new Error("Quantity rooms more than one");
			else callback(result[0]);		
			
		});		
}


function isRoomExist(roomID, callback ) {
	
		
		connection.query("SELECT * FROM `rsettings` WHERE `room_id`='"+roomID+"'", function (err, result, fields) {
				
			if (err) throw err;
		
			//console.log(result);
		    //var json = JSON.parse(result);
			var returnResult = null;
			console.log(result[0]);
			var rows = JSON.stringify(result[0]);
			console.log("rows="+result[0]);
			if(rows == undefined) returnResult = null;
			else returnResult = JSON.parse(JSON.stringify(result[0])).room_id;
			// here you can access rows
			
			//console.log(json);
			//console.log(fields);
			//connection.end();
			callback(returnResult);		
			
		});		
		
	// for(var i=0;i<global_room_list.length;i++)
	// {
		// if(global_room_list[i].roomID===roomID)
		// {
			
			// return i;
		// }
	  
	// }
	// return null;
}

function validateRoomID(param) {
	if(param.trim()==="") return null;
	return param;
}

				
////////////////////////// end of checkRoomID /////////////////////////////
//////////////////////////// removingFrames /////////////////////////////////

const path = require('path');
const directory = 'test';

app.get('/removeFrame', function(req,res){
		
		console.log("#app: In removeFrame:");
		var st="";
		var body = '';

		req.on('data', function (data) {
			
			console.log("chunk!");
			
			body += data;

			if (body.length > 1000)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("error: data too big");
				console.log("#app removeFrame: error: data too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			console.log("body="+body);
			var post = qs.parse(body);
			console.log("roomID="+post["roomID"]);
		
		//////////////////works /////////////////////////
		// fs.readdir(directory, (err, files) => {
		  // if (err) throw err;

		  // for (const file of files) {
			// fs.unlink(path.join(directory, file), err => {
			  // if (err) throw err;
			// });
		  // }
		// });
		////////////////////////////////////////////////////
		
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("error: not implemented");
			 	req.connection.destroy();
				return;	
		
		});

		
		
}); 
//////////////////////////////////////////////////////////////////////////////////

app.post('/removeRoom', function(req,res){
		
		console.log("#app: In removeRoom:");
		var st="";
		var body = '';

		req.on('data', function (data) {
			
			console.log("chunk!");
			
			body += data;

			if (body.length > 1000)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("error: data too big");
				console.log("#app removeRoom: error: data too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			console.log("body="+body);
			var post = qs.parse(body);
			console.log("roomID="+post["roomID"]);
			
			
			var roomID = post["roomID"]; 
			
			if(roomID==undefined){
				res.writeHead( 500, {  'Content-Type': 'text/html' } ); 
				res.end('Param "roomID" undefined');
				console.log("#app  removeRoom:  param roomID undefined");
				req.connection.destroy();
				return;
			}
			else {
		
				roomID = validateRoomID(roomID);
				if(roomID==null) {
					res.writeHead( 500, {  'Content-Type': 'text/html' } ); 
					res.end('param roomID invalid');
					console.log("#app  removeRoom: param roomID invalid");
					req.connection.destroy();
					return;
				}
				else
				{
					
					// //returns index or null
					var ind = isRoomExist(roomID);
					if(ind==null) {
						res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
						res.end('msg:not found');
						console.log("#app removeRoom: roomID "+roomID+" not found");
						req.connection.destroy();
						return;
					}
					else {
						global_room_list.splice(ind,1);
						res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
						res.end('msg:removed');
						console.log("#app removeRoom: roomID "+roomID+" removed");
						req.connection.destroy();
						return;
					}
					
					// //fs.createReadStream("./memory/roomsList.lst");
				}
			}
			
			
	
			
		});

}); 

///////////////////////////////// end of removeRoom /////////////////////////////////////////////////
app.post('/addNewRoom', function(req,res){
		
		console.log("#app: In addNewRoom:");
		var st="";
		var body = '';

		req.on('data', function (data) {
			
			console.log("chunk!");
			
			body += data;

			if (body.length > 1000)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("error: data too big");
				console.log("#app addNewRoom: error: data too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			console.log("body="+body);
			var post = qs.parse(body);
			console.log("roomID="+post["roomID"]);
			console.log("max="+post["max"]);			
			var obj = {};
			obj.roomID = post["roomID"];
			obj.frms = [];
			global_room_list.push(obj);
			console.log(global_room_list);
			
			connection.query("INSERT INTO `rsettings` (`room_id`,`max`,`start`) VALUES ('"+post["roomID"]+"','"+post["max"]+"','1')", function (err, result, fields) {
				
				if (err) throw err;
		
				console.log(result);
				
				res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
				res.end('room ' +post["roomID"]+ ' added');
				req.connection.destroy();
				return;
				
			});
			
			
			
			
		});

});


/////////////////////////////////////// newnicet ///////////////////////////////////////////
app.post('/newnicet', function(req, res) {
	
	console.log("#app In newnicet");
	 var st="";
	
		var body = '';

		req.on('data', function (data) {
			
			console.log("chunk!");
			
			body += data;

			if (body.length > 1000)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("newnicet: error: data too big");
				console.log("#app newnicet: error: data too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			console.log("body="+body);
			
			var post = qs.parse(body);
			
			console.log("md5="+post['md5']);
			console.log("roomID="+post['roomID']);
			var md5 = post["md5"]; 
	 
	
			if(md5==undefined){
				res.writeHead( 500, {  'Content-Type': 'text/html' } ); 
				res.end('Param "md5" undefined');
				console.log("param md5 undefined");
				req.connection.destroy();
				return;
			}
			else {
			
					md5 = validateMD5(md5);
					if(md5==null) {
						res.writeHead( 500, {  'Content-Type': 'text/html' } ); 
						res.end('param md5 invalid');
						console.log("param md5 invalid");
						req.connection.destroy();
						return;
					}
					else
					{
						
						roomID = post["roomID"];
						if(roomID==undefined) {
							res.writeHead( 500, {  'Content-Type': 'text/html' } ); 
							res.end('param roomID undefined');
							console.log("param roomID undefined");
							req.connection.destroy();
							return;
						}
						
						roomID = validateRoomID(roomID);
						if(roomID==null) {
							res.writeHead( 500, {  'Content-Type': 'text/html' } ); 
							res.end('param roomID invalid');
							console.log("param roomID invalid");
							req.connection.destroy();
							return;
						}
						
						getRoom(roomID, function( iRoom ){
			
							console.log(iRoom);
							
							if(iRoom == null) {
								res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
								res.end('msg:room not found');
								console.log("roomID "+roomID+" not found");
								req.connection.destroy();
								return;
							}
							
							//queryToFramesGetTableOfMD5ForRoomAndCountThisMD5
							queryToFrames1(md5, iRoom, function() {
							
							
								
								//returns index or null
								var ind = isDataPNGObjectByMD5(md5);
								if(ind==null) {
									res.writeHead( 500, {  'Content-Type': 'text/html' } ); 
									res.end('this md5 not found');
									console.log("this md5 not found");
									req.connection.destroy();
									return;
								}
							
						
								var obj =  {};
										
								var width2 = parseInt(post["width"],10);
								var height2 = parseInt(post["height"],10);
								
								console.log("width2="+width2);
								console.log("height2="+height2);
								
								
									obj = {};
									obj.id = md5;
									obj.roomID = roomID;
									obj.png = global_memory[ind].png; //this;
									
									obj.width = width2;
									obj.height = height2;
											
									// addFrameInRoom(iRoom, md5);
											
									global_memory[ind] = obj;	

									res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
									res.end('setted ok');
									req.connection.destroy();
									return;
								
							
							
							});
							
							
							
						});
									
					}
				}
	 		
		});
	
});

						
function get_minimal_ind(iRoom, callback ) {
	
	console.log("In get_minimal_ind");
	console.log(iRoom);
	
	connection.query("SELECT * from `frames` WHERE `ind`>='"+iRoom.start+"' AND `room_id`='"+iRoom.room_id+"' ORDER BY `ind` ", (err, rows) => {
		
        if(err) throw err;
        console.log('The data from users table are: \n', rows);
		
		var returnResult = null;
		
		console.log(rows);
		console.log("rows.length="+rows.length);
		
		var newstart = 1;
		if(rows.length==0)
		{
					callback(newstart);
					
		}
		else 
		{ 
			
				var max = 0;
				var min = rows[0].ind;
				
				for(var i=0;i<rows.length;i++) {
					var num = Number(rows[i].ind);
					console.log("num=" + num);
					if(max < num) max=num;
					if(min > num) {
				
						min=num;
					}
				}
				console.log("max="+max);
				console.log("min="+min);
				
				callback(min);	
		}
	});		

}

function queryToFrames1(md5, iRoom, callback ) {
	
	console.log("In queryToFrames1");
	console.log(iRoom);
	
	connection.query("SELECT * from `frames` WHERE `ind`>='"+iRoom.start+"' AND `room_id`='"+iRoom.room_id+"' ORDER BY `ind` ", (err, rows) => {
		
        if(err) throw err;
        console.log('The data from users table are: \n', rows);
		
		var returnResult = null;
		
		console.log(rows);
		console.log("rows.length="+rows.length);
		
		if(rows.length==0)
		{
		
				console.log("In queryToFrames1 - in query select: ");
				console.log(iRoom);
				console.log(iRoom.room_id);
				connection.query("INSERT INTO `frames` (`id`, `md5`,`room_id`,`ind`) VALUES ( NULL, '"+md5+"','"+iRoom.room_id+"','1')", function (err, rows, fields) {
				
					if(err) throw err;
					
					callback();
					
					
				});
				
		
		}
		else 
		{ 
			
				var max = 0;
				var min = rows[0].ind;
				var oldmin = rows[0].ind;
				for(var i=0;i<rows.length;i++) {
					var num = Number(rows[i].ind);
					console.log("num=" + num);
					if(max < num) max=num;
					if(min > num) {
						oldmin=min;
						min=num;
					}
				}
				console.log("max="+max);
				console.log("min="+min);
				
				var roomMax = Number(iRoom.max);
				
				if( rows.length >= roomMax ) {
					//delete min ind row
					connection.query("DELETE FROM `frames` WHERE room_id='"+iRoom.room_id+"' AND ind='"+min+"'", function (err, rows, fields) {
				
						if(err) throw err;
						
						get_minimal_ind(iRoom, function(newstart) {
						 
					
					//update rsetting set start
					connection.query("UPDATE rsettings SET start='"+newstart+"' WHERE `rsettings`.`room_id`='"+iRoom.room_id+"'",  function (err, rows, fields) {
				
						if(err) throw err;
					
					
						connection.query("INSERT INTO `frames` (`id`, `md5`,`room_id`,`ind`) VALUES ( NULL, '"+md5+"','"+iRoom.room_id+"','"+(max+1)+"')", function (err, rows, fields) {
				
						if(err) throw err;
					
						callback();
					
					
					});
					
					
					});
					
						});
					
					
					});
					
					
				}
				else {
					
					connection.query("INSERT INTO `frames` (`id`, `md5`,`room_id`,`ind`) VALUES ( NULL, '"+md5+"','"+iRoom.room_id+"','"+(max+1)+"')", function (err, rows, fields) {
				
						if(err) throw err;
					
						callback();
					
					
					});
				}
				
				// var returnResult = JSON.parse(JSON.stringify(rows[0]));
				// console.log("returnResult.length = "+returnResult.length);		
				// callback();
		}
			// here you can access rows
	
	});
}

function addFrameInRoom(iRoom, md5) {

	console.log("In addFrameInRoom :before:");
	console.log(global_room_list[iRoom]);

	obj2 = global_room_list[iRoom];
	if(obj2.frms.length<MAX_FRAMES_FOR_ROOM) {
		obj2.frms.push(md5);
	}
	else {
		var ind = isDataPNGObjectByMD5(obj2.frms[0]);
		if(ind!=null) {
			global_memory.splice(ind,1);	
		}
		obj2.frms.splice(0,1);
		obj2.frms.push(md5);
	}

	console.log("In addFrameInRoom :after:");
	console.log(global_room_list[iRoom]);
}

/////////////////////////////////// end of newnicet ///////////////////////////////////////////////


app.post('/nice', function(req, res) {
	 
	 console.log("#app In nice");
	 
	 // req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
			// var md5 = generate_md5_id();
			// console.log("In nice, after generating md5="+md5);
	
			// var obj = {};
			// obj.id = md5;
			// obj.png = this;
			// global_memory.push(obj);
		
			// //instead writing to fs, to ssd
			// ///this.pack().pipe(fs.createWriteStream("./memory/"+md5+".png"));
			
			// // we trying to put our stream in memory
			// var wstream = new WMStrm(md5);
			// wstream.on('finish', () => {
			  // //console.log('finished writing');
			  // console.log('loaded in memory: ', memStore[md5]);
			// });
			// //this.pack().pipe(wstream);
			
			// req.pipe(wstream);
			
			// console.log('\nIn nice(...)\nin memory we store PNGJS object\nid this of obj='+md5);
			// res.writeHead( 200, { 'Content-Type':'text/html' } );
			// res.end(""+md5);
			// req.connection.destroy();
			// return;	
			
		// });
		
			var md5 = generate_md5_id();
			console.log("In nice, after generating md5="+md5);
			
			var wstream = new WMStrm(md5);
			wstream.on('finish', () => {
			
				console.log('loaded in memory: ', memStore[md5]);
			  
				var obj = {};
				obj.id = md5;
				obj.png = this;
				global_memory.push(obj);
				
			  	console.log('\nIn nice(...)\nin memory we store PNGJS object\nid this of obj='+md5);
				res.writeHead( 200, { 'Content-Type':'text/html' } );
				res.end(""+md5);
				req.connection.destroy();
				return;	
			  
			});

			
			req.pipe(wstream);
			//.on('parsed', function() { });
		
	
		

});	

***************/


function validateMD5(param){
	f = param.match(/[a-e]*[0-9]*/);
	if(f) return param;
	return null;
}

function validate(param){
	f = param.match(/([a-e]{1}[0-9]{1})+/);
	if(f) return param;
	return null;
}

/* 
function printscreen(req,res) {
	var param = req.query.room;
	console.log("req.query="+req.query);
	if(param==undefined){
		res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
		res.end('Param "room" undefined');
	}
	else {
		param = validate(param);
		if(param==null) {
			res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
			res.end('Param "room" invalid');
		}
		res.writeHead( 200, {  'Content-Type': 'text/html' } ); 
		res.end('Welcome, user!');
	}
	//result_png.pipe(res);
			
	//result_png.on('end', function()	{
	//	logger_console_log(msg);
	//});
	
}
 */


/////////////////////////////////////////////////////////////////////////////////////
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/palette', function(request, response) {
  response.render('pages/palette');
});


app.get('/labirint', function(request, response) {
  response.render('pages/labirint');
});

app.get('/images/labirint.png', function(request, response) {
  //response.render('pages/labirint');
 fs.createReadStream('images/labirint.png').pipe( new PNG() ).on('parsed', function() {

	//inversing - for example
	/*****
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            // invert color
            this.data[idx] = 255 - this.data[idx];
            this.data[idx+1] = 255 - this.data[idx+1];
            this.data[idx+2] = 255 - this.data[idx+2];

            // and reduce opacity
            this.data[idx+3] = this.data[idx+3] >> 1;
        }
    }
	*******/
	
		sendImage( this.pack(), response, "\nImage labirint.png loaded\n" );
    
	});
});

function logger_console_log(s)
{
	if(glob_debug_flag) console.log(s);
}



function getSeedListFromFS()
{
	var s = '';
	var img_tmpl = '';
	var arr = fs.readdirSync( __dirname + '/public/sims');
	for(var i=0;i<arr.length;i++)
	{
		img_tmpl = '<img src="[img-path]" width="20" height="20" seed-clicked="true"> ';
		img_tmpl = img_tmpl.replace("[img-path]", '/sims/'+arr[i]);
		s += img_tmpl;
	}
	return JSON.stringify(arr);
}


app.post('/load_div_first', function(request, response) {
  

	fs.readFile( __dirname + '/views/pages/index.html', 'utf8', function (err,data) {
	  
	  if (err) {  
	  
		logger_console_log(err);
		response.writeHead(500, {  'Content-Type': 'text/html' } );
		response.end("/load_div_first: error: "+err);

	  }
	  else
	  {

		  var strData = data.toString();
		  strData = strData.replace("[seed-list]",getSeedListFromFS());
		  strData = strData.replace("[init-path]","/initial-image.png");
		  data = Buffer.from(strData); 
		  
		  response.writeHead(200, {  'Content-Type': 'text/html' } );
		  response.end(data);
	  
	  }
	  
	});
  
  
});



function sendImage(result_png, res, msg)
{
	if(result_png==undefined) {
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("sendImage: error:  result_png is undefined");
			return;
	}
	else {
		result_png.pack();
		res.writeHead( 200, {  'Content-Type': 'blob' } ); 
		result_png.pipe(res);
			
	}
	
	result_png.on('end', function()	{
		console.log(msg);
	});
}

function sendText(result_text, response, msg)
{
	console.log(msg);
	response.writeHead(200, {  'Content-Type': 'text/html' } );
	response.end(result_text); 
}

function multiply(req, res)
{
	
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		
		if(this.width * 2 > 1200 || this.height * 2 > 1200 )
		{
			
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("multi: error: too big size (need result width * 2 or height * 2 <= 1200)");
			return;
			
		}
		
		var newpng = new PNG ( {
			
				width: this.width*2,
				height: this.height*2,
				filterType: 4
		} );
		
		

			for (var y = 0; y < this.height; y++) {
				
				for (var x = 0; x < this.width; x++) {
					
					var idx = (this.width * y + x) << 2;
					
					var new_idx1 = newpng.width * (y) + (x) << 2;
					
					var new_idx2 = (newpng.width * (y) + (x)+this.width << 2);
					
					var new_idx3 = newpng.width * (y+this.height) + (x) << 2;
					
					var new_idx4 = newpng.width * (y+this.height) + (x)+this.width << 2;
					
					newpng.data[new_idx1+0] = this.data[idx];
					newpng.data[new_idx1+1] = this.data[idx+1];
					newpng.data[new_idx1+2] = this.data[idx+2];
					newpng.data[new_idx1+3] = this.data[idx+3];
					
					newpng.data[new_idx2+0] = this.data[idx];
					newpng.data[new_idx2+1] = this.data[idx+1];
					newpng.data[new_idx2+2] = this.data[idx+2];
					newpng.data[new_idx2+3] = this.data[idx+3];
					
					newpng.data[new_idx3+0] = this.data[idx];
					newpng.data[new_idx3+1] = this.data[idx+1];
					newpng.data[new_idx3+2] = this.data[idx+2];
					newpng.data[new_idx3+3] = this.data[idx+3];
					
					newpng.data[new_idx4+0] = this.data[idx];
					newpng.data[new_idx4+1] = this.data[idx+1];
					newpng.data[new_idx4+2] = this.data[idx+2];
					newpng.data[new_idx4+3] = this.data[idx+3];
					
				}
				
			}
			
			sendImage(newpng, res, "\nImage multiplied\n" );
			
			
		});
}


function __rotateff( oldpng, newpng )
{

	/*****
	
	var r = context.getImageData(0,0,1,1).data[0];
	var g = context.getImageData(0,0,1,1).data[1];
	var b = context.getImageData(0,0,1,1).data[2];
	contextRes.fillStyle = "rgba("+r+","+g+","+b+",255)";
	contextRes.fillRect(0,0,2,2);
	
	*****/
	
	
	var arr_points = [];
	
	var n=0;
	
	for(n=2;n<oldpng.height+2;n++)
	{
		//logger_console_log("---- "+n+" ----");
		var y=n-2;
		for(var x=0;x<n-1;x++)
		{
			//logger_console_log("[x,y]=["+x+","+y+"]");
			
			var idx = (oldpng.width * y + x) << 2;
					
			var new_idx1 = newpng.width * (y*2) + (x*2) << 2;
			
			newpng.data[new_idx1+0] = 0;// oldpng.data[idx+0];
			newpng.data[new_idx1+1] = 0;//oldpng.data[idx+1];
			newpng.data[new_idx1+2] = 0;//oldpng.data[idx+2];
			newpng.data[new_idx1+3] = 255;//oldpng.data[idx+3];
			
			var new_idx1 = newpng.width * (y*2) + (x*2+1) << 2;
			
			newpng.data[new_idx1+0] = 0;// oldpng.data[idx+0];
			newpng.data[new_idx1+1] = 0;//oldpng.data[idx+1];
			newpng.data[new_idx1+2] = 0;//oldpng.data[idx+2];
			newpng.data[new_idx1+3] = 255;//oldpng.data[idx+3];
			
			var new_idx1 = newpng.width * (y*2+1) + (x*2) << 2;
			
			newpng.data[new_idx1+0] = 0;// oldpng.data[idx+0];
			newpng.data[new_idx1+1] = 0;//oldpng.data[idx+1];
			newpng.data[new_idx1+2] = 0;//oldpng.data[idx+2];
			newpng.data[new_idx1+3] = 255;//oldpng.data[idx+3];
			
			var new_idx1 = newpng.width * (y*2+1) + (x*2+1) << 2;
			
			newpng.data[new_idx1+0] = 0;// oldpng.data[idx+0];
			newpng.data[new_idx1+1] = 0;//oldpng.data[idx+1];
			newpng.data[new_idx1+2] = 0;//oldpng.data[idx+2];
			newpng.data[new_idx1+3] = 255;//oldpng.data[idx+3];
				
			/*****	
			var imgData = context.getImageData(x,y,1,1);
			var r = imgData.data[0];
			var g = imgData.data[1];
			var b = imgData.data[2];
			
			contextRes.fillStyle = "black";//"rgba("+r+","+g+","+b+",255)";
			contextRes.fillRect(x*2,y*2,2,2);
			
			//logger_console_log([x,y]);
			*****/
			
			arr_points.push([x,y]);
			
			
			y--;
		}
		
		//if(n>=4) break;
		
	}
	
	//return;
	
	
	
	
	
	
	var half_value = arr_points.length;
	

	var w = oldpng.width;
	var h = oldpng.height;
	
	var lim2 = 1;
	var lim4 = 1;
	
	while(true)
	{
	
	y=h-lim4;
	x=lim2;
	while(true)
	{
	
	
		
			/*****
			var imgData = context.getImageData(x,y,1,1);
			var r = imgData.data[0];
			var g = imgData.data[1];
			var b = imgData.data[2];
			contextRes.fillStyle = "black";//"rgba("+r+","+g+","+b+",255)";
			contextRes.fillRect(x*2,y*2,2,2);
			*****/
			
			var idx = (oldpng.width * y + x) << 2;
					
			var new_idx1 = newpng.width * (y*2) + (x*2) << 2;
			
			newpng.data[new_idx1+0] = 0;// oldpng.data[idx+0];
			newpng.data[new_idx1+1] = 0;//oldpng.data[idx+1];
			newpng.data[new_idx1+2] = 0;//oldpng.data[idx+2];
			newpng.data[new_idx1+3] = 255;//oldpng.data[idx+3];
				
			var new_idx1 = newpng.width * (y*2) + (x*2+1) << 2;
			
			newpng.data[new_idx1+0] = 0;// oldpng.data[idx+0];
			newpng.data[new_idx1+1] = 0;//oldpng.data[idx+1];
			newpng.data[new_idx1+2] = 0;//oldpng.data[idx+2];
			newpng.data[new_idx1+3] = 255;//oldpng.data[idx+3];
			
			var new_idx1 = newpng.width * (y*2+1) + (x*2) << 2;
			
			newpng.data[new_idx1+0] = 0;// oldpng.data[idx+0];
			newpng.data[new_idx1+1] = 0;//oldpng.data[idx+1];
			newpng.data[new_idx1+2] = 0;//oldpng.data[idx+2];
			newpng.data[new_idx1+3] = 255;//oldpng.data[idx+3];
			
			var new_idx1 = newpng.width * (y*2+1) + (x*2+1) << 2;
			
			newpng.data[new_idx1+0] = 0;// oldpng.data[idx+0];
			newpng.data[new_idx1+1] = 0;//oldpng.data[idx+1];
			newpng.data[new_idx1+2] = 0;//oldpng.data[idx+2];
			newpng.data[new_idx1+3] = 255;//oldpng.data[idx+3];
	
	
			
			
			arr_points.push([x,y]);
		
		
		x++;
		y--;
		
		if(x>=oldpng.width) break;
	}
	
	lim2++;
			
	if(y>=oldpng.height)	break;	

		if(lim2 > oldpng.width)
		{
			break;
		}
	
	}	
		
	
	logger_console_log("Data of rotated image inputed");
	
	/******************************************************************************/
	/******************************************************************************/
	/******************************************************************************/
	
	
	
	
	
	
	
	
	
	var w = newpng.width;
	
	
	//**  this only one duxel outputting
	var n=0;
	
	
	var x = arr_points[0][0];
	var y = arr_points[0][1];

	var idx = (oldpng.width * x + y) << 2;
		
    var x1 = w/2-1;			
	var y1=0;
	
	var new_idx1 = newpng.width * (y1) + (x1) << 2;
			
	newpng.data[new_idx1+0] = oldpng.data[idx+0];
	newpng.data[new_idx1+1] = oldpng.data[idx+1];
	newpng.data[new_idx1+2] = oldpng.data[idx+2];
	newpng.data[new_idx1+3] = oldpng.data[idx+3];
	
	newpng.data[new_idx1+4] = oldpng.data[idx+0];
	newpng.data[new_idx1+5] = oldpng.data[idx+1];
	newpng.data[new_idx1+6] = oldpng.data[idx+2];
	newpng.data[new_idx1+7] = oldpng.data[idx+3];

	
	n++;
	
	//**** now we take two duxel
	
	y1++;
	x1--;
	
	//
	
	var x = arr_points[n][0];
	var y = arr_points[n][1];
	
	var idx = (oldpng.width * x + y) << 2;
		
    var new_idx1 = newpng.width * (y1) + (x1) << 2;
			
	newpng.data[new_idx1+0] = oldpng.data[idx+0];
	newpng.data[new_idx1+1] = oldpng.data[idx+1];
	newpng.data[new_idx1+2] = oldpng.data[idx+2];
	newpng.data[new_idx1+3] = oldpng.data[idx+3];
	
	newpng.data[new_idx1+4] = oldpng.data[idx+0];
	newpng.data[new_idx1+5] = oldpng.data[idx+1];
	newpng.data[new_idx1+6] = oldpng.data[idx+2];
	newpng.data[new_idx1+7] = oldpng.data[idx+3];
	
	
	n++;
	
	var x = arr_points[n][0];
	var y = arr_points[n][1];
	
	var idx = (oldpng.width * x + y) << 2;
	
	var new_idx1 = newpng.width * (y1) + (x1+2) << 2;
	
	newpng.data[new_idx1+0] = oldpng.data[idx+0];
	newpng.data[new_idx1+1] = oldpng.data[idx+1];
	newpng.data[new_idx1+2] = oldpng.data[idx+2];
	newpng.data[new_idx1+3] = oldpng.data[idx+3];
	
	newpng.data[new_idx1+4] = oldpng.data[idx+0];
	newpng.data[new_idx1+5] = oldpng.data[idx+1];
	newpng.data[new_idx1+6] = oldpng.data[idx+2];
	newpng.data[new_idx1+7] = oldpng.data[idx+3];

	
		
	//contextRes.fillStyle = "red";//"rgba("+r+","+g+","+b+",255)";
	//contextRes.fillRect(x1+6,y1,2,1);
	

	
	
	
	y1++;
	x1--;
	
	for(j=0;j<3;j++)
	{
		
		
		n++;
	
		var x = arr_points[n][0];
		var y = arr_points[n][1];
		
		var idx = (oldpng.width * x + y) << 2;
		
		var new_idx1 = newpng.width * (y1) + (x1+(j*2)) << 2;
		
		newpng.data[new_idx1+0] = oldpng.data[idx+0];
		newpng.data[new_idx1+1] = oldpng.data[idx+1];
		newpng.data[new_idx1+2] = oldpng.data[idx+2];
		newpng.data[new_idx1+3] = oldpng.data[idx+3];
		
		newpng.data[new_idx1+4] = oldpng.data[idx+0];
		newpng.data[new_idx1+5] = oldpng.data[idx+1];
		newpng.data[new_idx1+6] = oldpng.data[idx+2];
		newpng.data[new_idx1+7] = oldpng.data[idx+3];
		
			
		
		
	}
	

	
	var counter=4;
	var exit_cycle=false;
	
	while(true)
	{
		
		y1++;
		x1--;
		
		for(j=0;j<counter;j++)
		{
			
			
			
			
			n++;
			
		//	logger_console_log(n);
		//	logger_console_log(arr_points.length);
		//	if(n >= arr_points.length / 2 ) { exit_cycle=true; break; }
	
			var x = arr_points[n][0];
			var y = arr_points[n][1];
			
			var idx = (oldpng.width * x + y) << 2;




			var new_idx1 = newpng.width * (y1) + (x1+(j*2)) << 2;
			
			newpng.data[new_idx1+0] = oldpng.data[idx+0];
			newpng.data[new_idx1+1] = oldpng.data[idx+1];
			newpng.data[new_idx1+2] = oldpng.data[idx+2];
			newpng.data[new_idx1+3] = oldpng.data[idx+3];
			
			newpng.data[new_idx1+4] = oldpng.data[idx+0];
			newpng.data[new_idx1+5] = oldpng.data[idx+1];
			newpng.data[new_idx1+6] = oldpng.data[idx+2];
			newpng.data[new_idx1+7] = oldpng.data[idx+3];
		
		

	
				
		
			
		}
		
		counter++;
		//logger_console_log("counter="+counter);
		if(counter>=newpng.height/2+1) break;
		
	/******
	
		if(exit_cycle==true) break;
		
		logger_console_log("n="+n);
		
		
		
		//if(n >= arr_points.length/2 ) break;
		
	******/	
		
	 
	}
	
	
				
	
	//logger_console_log("n="+n);
	
	//logger_console_log("counter="+counter);
	
	//logger_console_log("x1="+x1);
	//logger_console_log("y1="+y1);
	
	//logger_console_log(arr_points[n]);
	
	

	
	
	
		
	
	//n--;
	
	//var counter=4; counter==half_value
	var exit_cycle=false;
	var lim2=1;
	//y1--;
	var nn=1;
	var lim4=newpng.width-2;
	while(true)
	{
		
		y1++;
		
		
		for(x1=lim2;x1<lim4;x1+=2)
		{
			
			
			
			n++;
			
			
			//logger_console_log(n);
			//logger_console_log(arr_points.length);
			
			 
	
			var x = arr_points[n][0];
			var y = arr_points[n][1];
			
			
			var idx = (oldpng.width * x + y) << 2;




			var new_idx1 = newpng.width * (y1) + (x1) << 2;
			
			newpng.data[new_idx1+0] = oldpng.data[idx+0];
			newpng.data[new_idx1+1] = oldpng.data[idx+1];
			newpng.data[new_idx1+2] = oldpng.data[idx+2];
			newpng.data[new_idx1+3] = oldpng.data[idx+3];
			
			newpng.data[new_idx1+4] = oldpng.data[idx+0];
			newpng.data[new_idx1+5] = oldpng.data[idx+1];
			newpng.data[new_idx1+6] = oldpng.data[idx+2];
			newpng.data[new_idx1+7] = oldpng.data[idx+3];
		
			
			
			
			
			
			/****
			
			var imgData = context.getImageData(x,y,1,1);
			var r = imgData.data[0];
			var g = imgData.data[1];
			var b = imgData.data[2];
				
			contextRes.fillStyle = "rgba("+r+","+g+","+b+",255)";
			contextRes.fillRect(x1,y1,2,1);
			
			*****/
			
			//	 { exit_cycle=true; break; }
			
			
			
			
			
			
			
	
	
		
			
		}
		
	
	
	
		lim2++;
		lim4--;
		
		if(exit_cycle==true) break;
		
		//counter--;
		
		//x1 = nn++;
		
		//if(counter>=canvasRes.height/2) break;
		
		if(lim2>oldpng.height) { exit_cycle=true; break; }
		
		//if(nn>canvas.height-1) { exit_cycle=true; break; }
		
		if(lim4 < 0) break;

		//if(n>=arr_points.length-1) break;
		
	}
	
		
	return newpng;
	
	/********
 
	
	
	
		
	canvas.width = canvasRes.width;
	canvas.height = canvasRes.height;
	canvas.getContext("2d").putImageData(canvasRes.getContext("2d").getImageData(0,0,canvasRes.width,canvasRes.height),0,0);
	
	
	
	*****/
	
	
	
	
}

function rotateff(req, res)
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		if(this.width * 2 > 1200 || this.height * 2 > 1200 )
		{
			
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("rotateff: error: too big size (need result width * 2 or height * 2 <= 1200)");
			return;
			
		}
		
		var newpng = new PNG ( {
			
				width: this.width*2,
				height: this.height*2,
				filterType: 4
		} );
		
		
		
		sendImage( __rotateff( this, newpng ), res, "\nImage rotated 45 degree\n" );
		
		
		
		
		
		/*********

			for (var y = 0; y < this.height; y++) {
				
				for (var x = 0; x < this.width; x++) {
					
					var idx = (this.width * y + x) << 2;
					
					var new_idx1 = newpng.width * (y) + (x) << 2;
					
					var new_idx2 = (newpng.width * (y) + (x)+this.width << 2);
					
					var new_idx3 = newpng.width * (y+this.height) + (x) << 2;
					
					var new_idx4 = newpng.width * (y+this.height) + (x)+this.width << 2;
					
					newpng.data[new_idx1+0] = this.data[idx];
					newpng.data[new_idx1+1] = this.data[idx+1];
					newpng.data[new_idx1+2] = this.data[idx+2];
					newpng.data[new_idx1+3] = this.data[idx+3];
					
					newpng.data[new_idx2+0] = this.data[idx];
					newpng.data[new_idx2+1] = this.data[idx+1];
					newpng.data[new_idx2+2] = this.data[idx+2];
					newpng.data[new_idx2+3] = this.data[idx+3];
					
					newpng.data[new_idx3+0] = this.data[idx];
					newpng.data[new_idx3+1] = this.data[idx+1];
					newpng.data[new_idx3+2] = this.data[idx+2];
					newpng.data[new_idx3+3] = this.data[idx+3];
					
					newpng.data[new_idx4+0] = this.data[idx];
					newpng.data[new_idx4+1] = this.data[idx+1];
					newpng.data[new_idx4+2] = this.data[idx+2];
					newpng.data[new_idx4+3] = this.data[idx+3];
					
				}
				
			}
			
			sendImage(newpng, res, "\nImage multiplied\n" );
			
			
			*********/
			
			
		});
}


function __getCountOfColors(im0)
{
	
	var w = im0.width;
	var h = im0.height;
	
		
			var obj = {};
			//var colors = [];

			for (var y = 0; y < h; y++) {
		

				for (var x = 0; x < w; x++) {
				
					
					var idx = (w * y + x) << 2;
					
					var key = ""+im0.data[idx]+"-"+im0.data[idx+1]+"-"+im0.data[idx+2]+"-"+im0.data[idx+3];
					if (obj[key]==undefined)obj[key]=0;
					obj[key]++;
					// if (obj[key]==undefined) { 
					
						
						// var col = [im0.data[idx], im0.data[idx+1],im0.data[idx+2],im0.data[idx+3]]; 
						// colors.push(col); 
						// obj[key]= {cnt:1,arr:col};
					
					// }
					// else
					// {
						// var obj4 = {cnt:obj[key].cnt+1,arr:obj[key].arr};
						// obj[key] = obj4;
					// }
					
					
					
					
					
				}
			}
			var n=0;
			for(var p in obj){n++;
			//console.log (p +" ="+obj[p]);
			}
			
			return n;
}

function borderplus(req, res)
{
	
		req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		if(this.width + 2 > 1200 || this.height + 2 > 1200 )
		{
			
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			logger_console_log("borderplus: error: too big size (need result width * height <= 1200)");
			res.end("borderplus: error: too big size (need result width * height <= 1200)");
			//req.connection.destroy();
			return;
			
		}
		
			var newpng = new PNG ( {
				
					width: this.width+2,
					height: this.height+2,
					filterType: 4
			} );
		
			for (var y = 0; y < newpng.height; y++) {
				
				for (var x = 0; x < newpng.width; x++) {
					
					
					
					var new_idx1 = newpng.width * (y) + (x) << 2;
					
					newpng.data[new_idx1+0] = 255;
					newpng.data[new_idx1+1] = 255;
					newpng.data[new_idx1+2] = 255;
					newpng.data[new_idx1+3] = 255;
					
				}
				
			}
		

			for (var y = 0; y < this.height; y++) {
				
				for (var x = 0; x < this.width; x++) {
					
					var idx = this.width * y + x << 2;
					
					var new_idx1 = newpng.width * (y+1) + (x+1) << 2;
					
					newpng.data[new_idx1+0] = this.data[idx];
					newpng.data[new_idx1+1] = this.data[idx+1];
					newpng.data[new_idx1+2] = this.data[idx+2];
					newpng.data[new_idx1+3] = this.data[idx+3];
					
				}
				
			}
			
			sendImage(newpng, res, "\nImage border minused\n" );
			
			
		});
}

function borderminus(req, res)
{
	mod_border.borderMinus(req, function( png ){
		
		if(png === -1) {
			console.log("check_size: error: too small size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too small size");
			return;
		}

		sendImage(png,res,"\nImage processed (border)");
		
		
	});
	



		// req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		
		
			// var newpng = new PNG ( {
				
					// width: this.width-2,
					// height: this.height-2,
					// filterType: 4
			// } );
		
		

			// for (var y = 1; y < this.height-1; y++) {
				
				// for (var x = 1; x < this.width-1; x++) {
					
					// var idx = this.width * y + x << 2;
					
					// var new_idx1 = newpng.width * (y-1) + (x-1) << 2;
					
					// newpng.data[new_idx1+0] = this.data[idx];
					// newpng.data[new_idx1+1] = this.data[idx+1];
					// newpng.data[new_idx1+2] = this.data[idx+2];
					// newpng.data[new_idx1+3] = this.data[idx+3];
					
				// }
				
			// }
			
			// sendImage(newpng, res, "\nImage border minused\n" );
			
			
		// });
}

function minus( req, res )
{
	mod_minus.minus(req, function( png ){
		
		if(png === -1) {
			console.log("check_size: error: too small size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too small size");
			return;
		}

		sendImage(png,res,"\nMinused");
		
		
	});
}

function old_minus( req, res )
{

	req.pipe( new PNG ( {filterType: 4} ) ).on('parsed', function() {
		
		if((this.width < 2) || (this.height < 2)) {
			console.log("minus: error: too small size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("minus: error: too small size");
			return;
		}
		
		//here we create new png (same as result bufferedImage (in java))
		var newpng = new PNG ( {
			
				width: this.width/2|0,
				height: this.height/2|0,
				filterType: 4
		} );
		

		for (var y = 0; y < this.height; y+=2) {
			for (var x = 0; x < this.width; x+=2) {
				
				var idx = (this.width * y + x) << 2;
				
				var new_idx = newpng.width * (y/2) + (x/2) << 2;
				//var new_idx2 = newpng.width * (y*2+1) + (x*2) << 2;
				
				newpng.data[new_idx] = this.data[idx];
				newpng.data[new_idx+1] = this.data[idx+1];
				newpng.data[new_idx+2] = this.data[idx+2];
				newpng.data[new_idx+3] = this.data[idx+3];

				
				
			}
		}
		
		sendImage(newpng, res, "\nImage minused\n" );
	
			
	});
}

function __plus(img)
{
	
			//here we create new png (same as result bufferedImage (in java))
		var newpng = new PNG ( {
			
				width: img.width*2,
				height: img.height*2,
				filterType: 4
		} );
		

			for (var y = 0; y < img.height; y++) {
				for (var x = 0; x < img.width; x++) {
					
					var idx = (img.width * y + x) << 2;
					
					var new_idx = newpng.width * (y*2) + (x*2) << 2;
					var new_idx2 = newpng.width * (y*2+1) + (x*2) << 2;
					
					newpng.data[new_idx] = img.data[idx];
					newpng.data[new_idx+1] = img.data[idx+1];
					newpng.data[new_idx+2] = img.data[idx+2];
					newpng.data[new_idx+3] = img.data[idx+3];
					
					newpng.data[new_idx+4] = img.data[idx];
					newpng.data[new_idx+5] = img.data[idx+1];
					newpng.data[new_idx+6] = img.data[idx+2];
					newpng.data[new_idx+7] = img.data[idx+3];
					
					newpng.data[new_idx2] = img.data[idx];
					newpng.data[new_idx2+1] = img.data[idx+1];
					newpng.data[new_idx2+2] = img.data[idx+2];
					newpng.data[new_idx2+3] = img.data[idx+3];
					
					newpng.data[new_idx2+4] = img.data[idx];
					newpng.data[new_idx2+5] = img.data[idx+1];
					newpng.data[new_idx2+6] = img.data[idx+2];
					newpng.data[new_idx2+7] = img.data[idx+3];
					
					
				}
			}
	
	return newpng;
}

function check_size(png, res) {
	
		if(png.width > 1200 || png.height  > 1200 )
		{
			console.log("check_size: error: too big size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too big size");
			return;
			
		}
		
		if((png.width < 2) || (png.height < 2)) {
			console.log("check_size: error: too small size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too small size");
			return;
		}
		
		return true;
}

function plus ( req, res ) {

	mod_plus.plus(req, function( png ){
		
		if(png === -1) {
			console.log("check_size: error: too big size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too big size");
			return;
		}

		sendImage(png,res,"\nPlused");
		
		/////////////////////////////////////////////////////////
		// png.pack(); // abo //
		// res.writeHead( 200, {  'Content-Type': 'blob' } ); 
	    // png.pipe(res);
	    // res.end(_png);
	 	// png.on('end', function()	{
		//		console.log("plused");
		// });
		////////////////////////////////////////////////////
		
	});
}	

function old_plus( req, res)
{

			
		req.pipe( new PNG({filterType: 4}) ).on('parsed', function() {
			
		if(this.width * 2 > 1200 || this.height * 2 > 1200 )
		{
			console.log("plus: error: too big size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("plus: error: too big size (need result width * 2 <= 1200 or height * 2 <= 1200 )");
			return;
			
		}
			
			//here we create new png (same as result bufferedImage (in java))
		var newpng = __plus(this);

			newpng.pack(); //pack result, write head to response, pipe result to response, when 'end' bla-bla-bla to log 
			res.writeHead( 200, {  'Content-Type': 'blob' } ); 
			newpng.pipe(res);
			newpng.on('end', function() {
				
				logger_console_log("Image plused");
				
			});
			
	
			
			//dummy(res);
			
		});
}






function cryptography( req, res )
{
			
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
			
		sendImage( mod_cryptography.dark_lord(this), res, '' );
					
	});
		
}


function blackwhite( req, res )
{
	
		
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
			
		sendImage( mod_black_white.black_white(this), res, 'black white' );
		
			
			
	});
		
}












// function inverse( req, res )
// {
	
		
	// req.pipe(new PNG({filterType: 4})).on('parsed', function() {
			
			// var result_png = new PNG ( {
						
							// width: this.width,
							// height: this.height,
							// filterType: 4
					// } );

			// for (var y = 0; y < this.height; y++) {
				// for (var x = 0; x < this.width; x++) {
					// var idx = (this.width * y + x) << 2;

					// // invert color
					// result_png.data[idx] = 255 - this.data[idx];
					// result_png.data[idx+1] = 255 - this.data[idx+1];
					// result_png.data[idx+2] = 255 - this.data[idx+2];

					// // and reduce opacity
					// //this.data[idx+3] = this.data[idx+3] >> 1;
					
					// result_png.data[idx+3] = this.data[idx+3];
				// }
			// }
			
			
			// result_png.pack();
			
			// res.writeHead( 200, {  'Content-Type': 'blob' } );
			
			// result_png.pipe(res);
			
			// result_png.on('end', function(){
				
				// logger_console_log("Image inverted");
				
			// });
			
	// });
		
// }

function get_coordinates(w,h)
{

	
	if(w != h) {  logger_console_log('error: width of image != height of image'); return null; }
	
	
	if(w == 11) return [3,3,11,11];
	if(w == 10) return [2,2,10,10];
	if(w == 9) return [2,2,5,5];
	if(w == 8) return [2,2,4,4];
	if(w==7) return [2,2,3,3];
	if(w==6) return [1,1,4,4];
	if(w==5) return [1,1,3,3];
	if(w==4) return [1,1,2,2];
	if(w==3) return [1,1,1,1];
	
	
	if(w % 2 == 0) //when even
	{
		var tmp = w/2;
		
		if(tmp % 2 == 0)  return [ tmp/2, tmp/2, tmp, tmp];
		
		
		var t1 = Math.abs(w-(tmp+1)*2); 
		var t2 = Math.abs(w-(tmp-1)*2); 
		
		if(t1==t2) return [ tmp/2|0, tmp/2|0,tmp+1,tmp+1];
		
		logger_console_log("\n\nmedian().get_coordinates(...).error: Not implemented for: "+w);
		logger_console_log("width of full image="+w);
		logger_console_log("t1="+t1);
		logger_console_log("t2="+t2);
		logger_console_log("\n\n");
		
		return [0,0,w,h];
		
		
	}
	else //when odd
	{
		
		var tmpOdd = w/2|0;
		if(tmpOdd % 2 == 1)  return [ (tmpOdd/2|0)+1, (tmpOdd/2|0)+1, tmpOdd, tmpOdd];
		
		return [ tmpOdd/2, tmpOdd/2, tmpOdd+1,tmpOdd+1];
		
		/***********
		var t1 = Math.mod(w-(tmpOdd+1)*2); //mod(17-(8+1)*2) = 1
		var t2 = Math.mod(w-(tmpOdd-1)*2); //mod(17-(8-1)*2) = 3
		
		//0 1 2 3 4 5 6 7 (8) 9 10 11 12 13 14 15 16
		if(t1=<t2)
		
		return [ tmpOdd/2|0, tmpOdd/2|0,tmpOdd-1,tmpOdd-1];
		*********/
		
	}
}	

function old_median( req, res )
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		
		var arr = get_coordinates(this.width, this.height);
		if(arr == null) return; 
		
		var newpng = new PNG ( {
			
				width: arr[2],
				height: arr[3],
				filterType: 4
		} );
		
		var limy = arr[1]+arr[3];
		var limx = arr[0]+arr[2];
		var n=0;
		var m=0;

			for (var y = arr[1]; y < limy; y++) {
				n=0;
				for (var x = arr[0]; x < limx; x++) {
					var idx = (this.width * y + x) << 2;
					var idx2 = (newpng.width * m + n) << 2;
					
					// invert color
					newpng.data[idx2] = this.data[idx];
					newpng.data[idx2+1] = this.data[idx+1];
					newpng.data[idx2+2] = this.data[idx+2];
					
					newpng.data[idx2+3] = this.data[idx+3];
					n++;
				}
				m++;
			}
			
			sendImage(newpng,res,"\nImage was medianed\n");
						
		});
}

// function smooth(req, res)
// {
	// req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		// sendImage(mod_smooth.smooth(this),res,"\nsmooth");
		
	// });
		
// }

function create_png_from_global(ind)
{

		var old_png =  new PNG({
			
			width: global_memory[ind].img.width,
			height: global_memory[ind].img.height,
			filterType: 4
			
			
			});
		
		
		
		
		var arr = global_memory[ind].img.data;
		
		
		//	var arr=[];
						for(var j=0;j<old_png.height;j++)
						{
							for(var i=0;i<old_png.width;i++)
							{
								var idx = (old_png.width * j + i) << 2;	
							
							//	logger_console_log('\n'+idx+'\n');
								old_png.data[idx]=arr[idx];
								old_png.data[idx+1]=arr[idx+1];
								old_png.data[idx+2]=arr[idx+2];
								old_png.data[idx+3]=arr[idx+3];
							}
						}
		return old_png;
}


function getPatternByNumberFromFile(num) {

	let rawdata = fs.readFileSync( __dirname + '/public/patterns.json');
	let patterns = JSON.parse(rawdata);
	for(var i=0;i<patterns.length;i++){
		if(patterns[i].number===num){
			return patterns[i].script;
		}
	}
	return null;
}

// app.get('/test_json_77b1_reading', function(req,res){ 
	
	// console.log('This is before the read call');
	// console.log(getPatternByNumberFromFile("2"));

	// fs.readFile( __dirname + '/public/patterns.json', (err, data) => {
		// if (err) throw err;
		// let patterns = JSON.parse(data);
		// console.log('This is IN the read call');
		// console.log(patterns);
		// res.writeHead(200, {  'Content-Type': 'text/html' } );
		// res.end(patterns.join());
	// });
	// console.log('This is after the read call');
	
// } );

app.post('/get_num_of_patterns', function(req,res){ 
	
	console.log("In get_num_of_patterns:");
	// //here we need query to database
	// //5insametimequeries will be cool
	
	   pool.query("SELECT count(*) as 'Number of scripts' FROM scriptes", function (err, result, fields) {
			//console.log("In#1"); 	
			if (err) throw err;
			
			/// console.log(result);
			// //var buf="<div>";
			var buf="";
			for(var i =0;i<result.length;i++) {
				var s = JSON.stringify(result[0]);//+"</p>";
				buf += s;
			}
			
			// //buf+="</div>";
			
			console.log(buf);
			//res.writeHead( 200, { 'Content-Type':'text/html' } );
			res.send(buf);
			res.end();
			
			//	req.connection.destroy();
			//			return; 
				// req.connection.destroy();
				// return;
				
		});
	
 
	
} );

function test_execute_pattern_wv(req, res) {
	console.log('in test_execute_pattern_wv:');
	//console.log(req); 
	console.log((req.body));
	//console.log(JSON.parse(req.body));
	var s = '';
	for(var key in req.body)	{ 
		//s +='\nreq.body['+key+']: '+req.body[key];
		s += req.body[key]+",";
	}
	console.log(s); 
	
	console.log("pattern_number="+req.body["pattern_number"]);
	let pattern_number = req.body["pattern_number"];
	if(pattern_number == undefined) {
		console.log("#7777: ");
	}
	else {
		
			var arr = req.body['commands'].split(",");
			var number = pattern_number; //""+arr[0];
			var sum = req.body['sum'];
			//arr.splice(0,1);
			var md5_lst = arr;
			
			var commands = "generate random seed 5 3";
			console.log("number=["+number+"]");
			console.log("md5_lst=["+arr.join(",\n")+"]");
			commands = getPatternByNumberFromFile(number);
			if(commands===null) {
				console.log('execute_pattern:error: pattern '+number+' not found');
				res.writeHead( 200, { 'Content-Type':'text/plain' } );
				res.end('execute_pattern:error: pattern '+number+' not found');
				//req.connection.destroy();
				return;
			}
			//console.log("Now:\n"+commands);
			// var re = /(\[name\:.+?\])/ ;
			// var n=0;
			// var obj = {};
			// var arr4 = [];
			// //commands = commands.split(",");
			// console.log( commands);
			// var commands2 = [];
			// for(var i=0;i<commands.length;i++) {
				// commands2[i] = ''+commands[i];
			// }
			
			// for(var i=0;i<commands2.length;i++) {
					
				// var arr2 = re.exec(commands2[i]);
				// if(arr2 == null) continue;
				// //console.log(arr2);
				// //for(var i2=0;i2<1;i2++) {
					// commands2[i] = commands2[i].replace(arr2[1],'');
					// if(obj[arr2[1]]==true) {
					// }
					// else {
						// obj[arr2[1]]=true;
						// arr4.push(arr2[1]);
					// }
					
					// i=0;
				// //}
			// }
			// obj=null;
			// console.log(arr4);
			
			for(var i=0;i<commands.length;i++) {
				let obj = commands[i];
				if(obj.from!="none") {
					
					let arr = obj.from.split(",");
					let sf = '';
					for(let ii=0;ii<arr.length;ii++) {
						arr[ii] = ""+sum+":"+arr[ii];
						sf += arr[ii]+","; 
					}
					obj.from = sf;
					
				}
				if(obj.to!="none") {
					obj.to = ""+sum+":"+obj.to;
				}
				
				//for(var j=0;j<arr4.length;j++) {
				//	commands[i] = commands[i].replace(arr4[j],sum+":"+arr4[j]);
				//}
			}
			
			console.log(commands);
				
	}
	
}

function getCommandsByMD5(md5) {
	for(var i=0;i<global_memory.length;i++)
	{
		//logger_console_log('test '+arr[i]);
		if(global_memory[i].md5===md5)
		{
			
			return i;
		}
	  
	}
	return null;
}

global.global_thread_memory = [];
global.global_thread_results = [];

function hello_md5( req, res ) {
	
	//console.log("In hello_md5:");
	////console.log(req.body);
	//console.log("sum="+req.body["sum"]);
	//console.log("commands=");
	let commands = JSON.parse(req.body["commands"]);
	//console.log(commands);
	let md5 = req.body["sum"];
	let obj = {};
	obj.md5 = req.body["sum"];
	obj.commands = (commands);
	obj.status1 = 'before';
	global.global_thread_memory[md5] = (obj);
	//console.log(global.global_thread_memory);
	//console.log(global.global_thread_memory[md5]);
	res.writeHead( 200, { 'Content-Type':'text/plain' } );
	res.end(req.body["sum"]);
	
}

function prepare_cluster_worker( req, res ) {
	
	console.log("in prepare_cluster_worker");
	console.log(req.body);
	
	let md5 = req.body["md5"];
	let width = req.body["width"];
	let height = req.body["height"];
	let x = req.body["x"];
	let y = req.body["y"];
	let dx = req.body["dx"];
	let dy = req.body["dy"];
	
	let obj = {};
	obj.md5 = md5;
	obj.width = width;
	obj.height = height;
	obj.x = x;
	obj.y = y;
	obj.dx = dx;
	obj.dy = dy;
	
	global.global_thread_memory[md5] = (obj);
	
	res.writeHead( 200, { 'Content-Type':'text/plain' } );
	res.end(md5);
	
}
	
function ident_image_for_cluster( req, res ) {
	console.log("###000");
	var png = new PNG({filterType: 4}); 
	console.log("###000111");
	req.pipe(png).on( 'parsed', function()  {
		
		console.log("###111");
		let md5 = get_md5_hex(png.data);	
		console.log("###222");
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end(md5);
		
	});
	
	
}	


function getArrayFromPNG( dataArray ) {
	
	var arr = [];
	
		for(var i=0;i<dataArray.length;i++)
		{
						 
			arr[i] = dataArray[i];
			
								
		}
	
	
	return arr;
} 

function get_cluster_worker( req, res ) {
	console.log("in get cluster worker");
	req.pipe( new PNG({filterType: 4}) ).on( 'parsed', function()  {
		
		let md5 = get_md5_hex(this.data);		
		let obj = global.global_thread_memory[md5];
		
		console.log(obj);
		let data = getArrayFromPNG(this.data);
		obj.data = data;
		mod_get_cluster.executeGetClusterWorker( obj, function(result_context) {	
		
			let json_result_context = JSON.stringify(result_context);
		
			res.writeHead( 200, { 'Content-Type':'text/plain' } );
			res.end(json_result_context);
		 
		 		
		});	

	});	
}





function getPNGFromArray( dataArray, width, height ) {
	
		var png = new PNG({
			
			width:  width,
			height:  height,
			filterType: 4
			
		});
				
		 
			for(var j=0;j< png.height;j++)
			{
				for(var i=0;i< png.width;i++)
				{
					var idx = ( png.width * j + i) << 2;	
				
				 
					 png.data[idx]= dataArray[idx];
					 png.data[idx+1]= dataArray[idx+1];
					 png.data[idx+2]= dataArray[idx+2];
					 png.data[idx+3]= dataArray[idx+3];
				}
			}
				
	
	return png;
}


function get_result_execute_pattern_worker(req,res) {
	
	let md5 = req.body["sum"];
	let commands_index = global.global_thread_results[md5+":result"];
	if(commands_index != undefined) {
		//console.log("Result is:");
		//console.log(global.global_thread_results);
		let dataArray = global.global_thread_results[md5+":result"].data;
		let w = global.global_thread_results[md5+":result"].width;
		let h = global.global_thread_results[md5+":result"].height;
		delete(global.global_thread_results[md5+":result"]);
		let png = getPNGFromArray( dataArray, w, h );
		sendImage(png,res,"\nResult was sent\n"); 
		
	} else {
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end('error: not found '+md5);
	}
}





function test_execute_pattern_worker(req, res) {
	
	//console.log("In test_execute_pattern_worker:");
	////console.log(req.body);
	//console.log("sum="+req.body["sum"]);
	let md5 = req.body["sum"];
	let commands_index = global.global_thread_memory[md5];//getCommandsByMD5(md5);
	//console.log(global.global_thread_memory);
	//console.log(global.global_thread_results);
	//console.log(commands_index);
	if(commands_index != undefined) {
			console.log("Context is:");
			console.log(global.global_thread_memory[md5]);
			let context = global.global_thread_memory[md5];
			if(context.status1 == 'in process') {
			
				//console.log("IN PROCESS stage");
			
			}
			
			else {
				if(global.global_thread_memory[md5].commands.length == 0 ) {
				
					let result_obj = {};
					result_obj.status1 = 'finished';
					result_obj.cmds = [];
					result_obj.md5 = md5;
					console.log("ALL RIGHT   FINISHED!!!111");
					res.writeHead( 200, { 'Content-Type':'text/plain' } );
					res.end(JSON.stringify(result_obj));
				
				}
				else if (context.commands[0].cmd.indexOf("move")==0) {
					console.log("move");
					let from = context.commands[0].from;
					//console.log(context);
					//console.log(context.md5+":"+from);
					let t_obj = cloneResult(global.global_thread_results[context.md5+":"+from]);
					delete(global.global_thread_results[context.md5+":"+from]);
					let to = context.commands[0].to;
					global.global_thread_results[context.md5+":"+to] = t_obj;
					
							let cloned = JSON.parse(JSON.stringify(global.global_thread_memory[md5].commands));
							cloned.shift();
							//console.log("AFTER executing CMD:");
							let obj = {};
							obj.md5 = context.md5;
							obj.commands = cloned;
							obj.status1 = "before";
							global.global_thread_memory[context.md5] = (obj);
						
							//console.log(global.global_thread_memory );
							//console.log(global.global_thread_memory[md5] );
							
							let result_obj = {};
							result_obj.status1 = 'in process';
							result_obj.md5 = context.md5;
							
							//console.log(global.global_thread_results);
							res.writeHead( 200, { 'Content-Type':'text/plain' } );
							res.end(JSON.stringify(result_obj));
				
				}
				else if (context.commands[0].cmd.indexOf("delete")==0) {
					let from = context.commands[0].from;
					let to = context.commands[0].to;
					delete(global.global_thread_results[context.md5+":"+from]);
					
							let cloned = JSON.parse(JSON.stringify(global.global_thread_memory[md5].commands));
							cloned.shift();
							//console.log("AFTER executing CMD:");
							let obj = {};
							obj.md5 = context.md5;
							obj.commands = cloned;
							obj.status1 = "before";
							global.global_thread_memory[context.md5] = (obj);
						
							//console.log(global.global_thread_memory );
							//console.log(global.global_thread_memory[md5] );
							
							let result_obj = {};
							result_obj.status1 = 'in process';
							result_obj.md5 = context.md5;
							
							//console.log(global.global_thread_results);
							res.writeHead( 200, { 'Content-Type':'text/plain' } );
							res.end(JSON.stringify(result_obj));
				}
				else {
					
					let list_of_images = [];
					let t_list = context.commands[0].from.split(",");
					for(let i=0;i<t_list.length;i++) {
						list_of_images.push( global.global_thread_results[ context.md5 + ":" + t_list[i] ] );
					}
					//console.log(img);
					mod_execute_pattern_worker.executePatternWorker( context, list_of_images, function(result_context) {
						
						//console.log("#17777 AND NOW WE HERE:");
						//console.log(result_context);
						//console.log(global.global_thread_results);
						if(result_context.status1 == 'after') {
							
							global.global_thread_results[result_context.md5+":"+result_context.addr] = result_context.img;
							
							let cloned = JSON.parse(JSON.stringify(global.global_thread_memory[md5].commands));
							cloned.shift();
							//console.log("AFTER executing CMD:");
							let obj = {};
							obj.md5 = result_context.md5;
							obj.commands = cloned;
							obj.status1 = "before";
							global.global_thread_memory[md5] = (obj);
						
							//console.log(global.global_thread_memory );
							//console.log(global.global_thread_memory[md5] );
							
							let result_obj = {};
							result_obj.status1 = 'in process';
							result_obj.md5 = result_context.md5;
							
							//console.log(global.global_thread_results);
							res.writeHead( 200, { 'Content-Type':'text/plain' } );
							res.end(JSON.stringify(result_obj));
							
						}
						else if(result_context.status1 == 'in process') {
						
							let result_obj = {};
							result_obj.status1 = 'in process';
							res.writeHead( 200, { 'Content-Type':'text/plain' } );
							res.end(JSON.stringify(result_obj));
						
						}
							
							
						
							// let obj = {};
							// obj.md5 = result_context.md5;
							// obj.commands = t_commands;
							// obj.status1 = result_context.status1;
							// global_thread_memory.push(obj);
							
						// let t_obj = JSON.parse(obj.cmds)
						
						// global_thread_memory[commands_index].commands =  (t_obj.commands);
						// //console.log(global_thread_memory[commands_index]);
						// let result_obj = {};
						// result_obj.status1 = 'in process';
						// result_obj.md5 = md5;
						// res.writeHead( 200, { 'Content-Type':'text/plain' } );
						// res.end(JSON.stringify(result_obj));
						
						//let obj2 = {};
						//obj2.id = obj.id;
						//obj2.img = obj.img;
						//global_results.push(obj2);
						
						
						
						return;
						
					});
				
				}
			}
	}
	else {
		
		let result_obj = {};
		result_obj.status1 = 'error';
		result_obj.message = 'Commands equals NULL';		
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end(JSON.stringify(result_obj));
	
	}

	
}

function cloneResult(obj) {
	//console.log('\nin clone result:\n');
	//console.log(obj);
	return JSON.parse(JSON.stringify(obj));
}


function execute_pattern(req, res)
{
	console.log('in execute_pattern:');
	var s = '';
	for(var key in req.body)	{ 
		s +='\nreq.body['+key+']: '+req.body[key];
	}
	console.log(s); 
	var arr = req.body['commands'].split(",");
	var number = ""+arr[0];
	arr.splice(0,1);
	var md5_lst = arr;
	
	var commands = "generate random seed 5 3";
	console.log("number=["+number+"]");
	console.log("md5_lst=["+arr.join(",\n")+"]");
	commands = getPatternByNumberFromFile(number);
	if(commands===null) {
		console.log('execute_pattern:error: pattern '+number+' not found');
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end('execute_pattern:error: pattern '+number+' not found');
		//req.connection.destroy();
		return;
	}
	//console.log("Now:\n"+commands);
	var re = /(\[name\:.+?\])/ ;
	var n=0;
	var obj = {};
	var arr4 = [];
	//commands = commands.split(",");
	console.log( commands);
	var commands2 = [];
	for(var i=0;i<commands.length;i++) {
		commands2[i] = ''+commands[i];
	}
	
	for(var i=0;i<commands2.length;i++) {
			
		var arr2 = re.exec(commands2[i]);
		if(arr2 == null) continue;
		//console.log(arr2);
		//for(var i2=0;i2<1;i2++) {
			commands2[i] = commands2[i].replace(arr2[1],'');
			if(obj[arr2[1]]==true) {
			}
			else {
				obj[arr2[1]]=true;
				arr4.push(arr2[1]);
			}
			
			i=0;
		//}
	}
	obj=null;
	console.log(arr4);
	
	for(var i=0;i<commands.length;i++) {
		for(var j=0;j<arr4.length;j++) {
			commands[i] = commands[i].replace(arr4[j],md5_lst[j]);
		}
	}
	
	
	
	//var re = /([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+)/;
	//var str = 'Джон Смит';
	//var newstr = str.replace(re, '$2, $1');
	//console.log(newstr); // Смит, Джон
	
	
	var res_png = execute_number_pattern (commands) ;
	if(res_png !=null) {
		
		sendImage( res_png, res, 'pattern ready' );
	}
	else {
		console.log('execute_pattern:error: something wrong');
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end('execute_pattern:error: something wrong');
		//req.connection.destroy();
		//return;
					
	}
}	

function getPatternByNumberFromDB(number, callback) { 
	
	console.log("In getPatternByNumberFromDB:");
	// //here we need query to database connection pool
	// //5insametimequeries will be cool
	
	   pool.query("SELECT * FROM scriptes WHERE number="+number, function (err, result, fields) {
			console.log("In#1"); 	
			if (err) throw err;
			console.log("In#2"); 	
			console.log(result);
			
			if(result != null) {
				console.log("In#3"); 	
				if(result.length>0) {
					console.log("In#4"); 	
					if(result[0].script != undefined) { 
					
					var arr =  JSON.parse(result[0].script);
					
					//console.log(obj);
					// //var buf="<div>";
					// var buf="";
					// for(var i =0;i<result.length;i++) {
						// var s = JSON.stringify(result[0]);//+"</p>";
						// buf += s;
					// }
					
					// //buf+="</div>";
					
					//console.log(buf);
					
					callback(arr);//.join(","));
					
					}
					else callback(null);
				}
				else callback(null);
			
			}
			else callback(null);
			 
		});
		
}

function execute_pattern_database(req, res)
{
	console.log('in execute_pattern_database:');
	var s = '';
	for(var key in req.body)	{ 
		s +='\nreq.body['+key+']: '+req.body[key];
	}
	console.log(s); 
	var arr = req.body['commands'].split(",");
	var number = ""+arr[0];
	arr.splice(0,1);
	var md5_lst = arr;
	
	var commands = "generate random seed 5 3";
	console.log("number=["+number+"]");
	console.log("md5_lst=["+arr.join(",\n")+"]");
	
	getPatternByNumberFromDB(number,function(commands){
		
		if(commands===null) {
			console.log('execute_pattern_database:error: pattern '+number+' not found');
			res.writeHead( 200, { 'Content-Type':'text/plain' } );
			res.end('execute_pattern_database:error: pattern '+number+' not found');
			//req.connection.destroy();
			return;
		}
		
		//console.log("Now:\n"+commands);
		var re = /(\[name\:.+?\])/ ;
		var n=0;
		var obj = {};
		var arr4 = [];
		//commands = commands.split(",");
		console.log( commands);
		var commands2 = [];
		for(var i=0;i<commands.length;i++) {
			commands2[i] = ''+commands[i];
		}
		
		for(var i=0;i<commands2.length;i++) {
				
			var arr2 = re.exec(commands2[i]);
			if(arr2 == null) continue;
			//console.log(arr2);
			//for(var i2=0;i2<1;i2++) {
				commands2[i] = commands2[i].replace(arr2[1],'');
				if(obj[arr2[1]]==true) {
				}
				else {
					obj[arr2[1]]=true;
					arr4.push(arr2[1]);
				}
				
				i=0;
			//}
		}
		
		obj=null;
		console.log(arr4);
		
		for(var i=0;i<commands.length;i++) {
			for(var j=0;j<arr4.length;j++) {
				commands[i] = commands[i].replace(arr4[j],md5_lst[j]);
			}
		}
		
		
		
		//var re = /([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+)/;
		//var str = 'Джон Смит';
		//var newstr = str.replace(re, '$2, $1');
		//console.log(newstr); // Смит, Джон
		
		
		var res_png = execute_number_pattern (commands) ;
		if(res_png !=null) {
			
			sendImage( res_png, res, 'pattern ready' );
		}
		else {
			console.log('execute_pattern_database:error: something wrong');
			res.writeHead( 200, { 'Content-Type':'text/plain' } );
			res.end('execute_pattern_database:error: something wrong');
			//req.connection.destroy();
			//return;
						
		}	
		
		
	});
	
}	

function execute_number_pattern (commands) {
	
	console.log('in execute_number_pattern:');
	var arr = commands;//.split(",");
	
	for(var i=0;i<arr.length;i++)
	{
		arr[i]=arr[i].trim();
		console.log("executing ["+arr[i]+"]"); 
		
		if(arr[i].indexOf("generate random seed")===0)
		{
			var t = arr[i].replace("generate random seed",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				params=t.split(" ");
				if(params.length>0)
				{
					for(var ii=0;ii<params.length;ii++) params[ii]=Number(params[ii]);
					
				}
				else
				{
					params =[15,3];
				}
			}
			else
			{
				params =[15,3];
			}
			res_png = mod_generate_random_seed.generate_random_seed(params);
			
			
		}
		else if(arr[i]=="razn colors")
		{
			res_png = mod_razn_colors.raznColors(res_png);
		}
		else if(arr[i]=="median")
		{
			
			res_png = mod_median.__median(res_png);
			
		}
		else if(arr[i]=="border minus")
		{
			
			res_png = mod_border.border_minus(res_png);
			
		}
		else if(arr[i]=="cryptographic method two")
		{
			res_png = mod_cryptography.dark_lord(res_png);
		}
		/////////////// added 31 10 2021 01 22 /////////////////
		else if(arr[i].indexOf("combo")===0)
		{
			var t = arr[i].replace("combo",'');
			t=t.trim();
			var params=t.split(" ");
			if(params.length==2)
			{
				console.log("combo processing");
				md51=params[0].trim();
				md52=params[1].trim();
				//console.log("---0");
				console.log("md1="+md51+";");
				console.log("md2="+md52+";");
				//console.log("---01");
				var nm1 = isDataPNGObjectByMD5(md51);
				if(nm1==null)
				{
					console.log("Not found index nm1 for DataPNGObject with md5: "+md51);
					return null;
					
					
				}
				
				var nm2 = isDataPNGObjectByMD5(md52);
				if(nm2==null)
				{
					console.log("Not found index nm2 for DataPNGObject with md5: "+md52);
					return null;
							
				}
				
				res_png = mod_inner_combo.inner_combo(global_memory,nm1,nm2);
				
				
				if(res_png==null) {
				 
					console.log("error: mod_inner_combo.inner_combo returned NULL");
				    return null;
				}
				
			}
			
			
			
		}
		else if(arr[i].indexOf("fill")===0)
		{
			var t = arr[i].replace("fill",'');
			t=t.trim();
			var params=t.split(" ");
			if(params.length==2)
			{
				console.log("fill processing");
				md51=params[0].trim();
				md52=params[1].trim();
				
				var nm1 = isDataPNGObjectByMD5(md51);
				if(nm1==null)
				{
					console.log("error:Not found index nm1 for DataPNGObject with md5: "+md51); 
					return null;
					
					
				}
				var nm2 = isDataPNGObjectByMD5(md52);
				if(nm2==null)
				{
					console.log("error:Not found index nm2 for DataPNGObject with md5: "+md52); 
					return null;
							
				}
	
				
				
				res_png = mod_fill.fill(global_memory,nm1,nm2);
				//global_memory.splice(nm1,1);
				//global_memory.splice(nm2,1);
				if(res_png==null) {
				 
					console.log("error: mod_fill.fill returned NULL");
				    return null;
				}
				
				
				 	
			}
			
			
			
		}
		else if(arr[i].indexOf("fillx")===0)
		{
			var t = arr[i].replace("fillx",'');
			t=t.trim();
			var params=t.split(" ");
			if(params.length==2)
			{
				console.log("fillx processing");
				md51=params[0].trim();
				md52=params[1].trim();
				
				var nm1 = isDataPNGObjectByMD5(md51);
				if(nm1==null)
				{
					console.log("error:Not found index nm1 for DataPNGObject with md5: "+md51); 
					return null;
					
					
				}
				var nm2 = isDataPNGObjectByMD5(md52);
				if(nm2==null)
				{
					console.log("error:Not found index nm2 for DataPNGObject with md5: "+md52); 
					return null;
							
				}
	
				
				
				res_png = mod_fillx.fillx(global_memory,nm1,nm2);
				//global_memory.splice(nm1,1);
				//global_memory.splice(nm2,1);
				if(res_png==null) {
				 
					console.log("error: mod_fillx.fillx returned NULL");
				    return null;
				}
				
				
				 	
			}
			
			
			
		}
		else if(arr[i].indexOf("save as")===0)
		{
			var t = arr[i].replace("save as",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				md5=(t);
				saveImageAsDataArray(res_png,md5);	
			}
			
			
			
		}
		else if(arr[i].indexOf("delete")===0)
		{
			var t = arr[i].replace("delete",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				md5=(t);
				ind = isDataPNGObjectByMD5(md5);
				if(ind==null)
				{
					console.log("error:Not found index ind for DataPNGObject with md5: "+md5); 
					return null;
				}
				
				global_memory.splice(ind,1);	
				 
			}
			
			
			
		}
		else if(arr[i].indexOf("load")===0)
		{
			var t = arr[i].replace("load",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				md5=(t);
				ind = isDataPNGObjectByMD5(md5);
				if(ind==null)
				{
					console.log("error:Not found index ind for DataPNGObject with md5: "+md5); 
					return 0;
				}
				
				res_png =  create_png_from_global(ind);
				//global_memory.splice(ind,1);	
				 
			}
			
			
			
		}
		////////////////////////////////////////////
		else if(arr[i].indexOf("magik rotate")===0)
		{
			var t = arr[i].replace("magik rotate",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				params=Number(t);
				
			}
			else
			{
				params =1;
			}
			res_png = mod_magik_rotate.magik_rotate(res_png,params);
			
		}
		else if(arr[i]=="up")
		{
			res_png = mod_up.upForImageData(res_png);
		}
		else if(arr[i]=="smooth")
		{
			
			res_png = mod_smooth.smooth(res_png);
			
		}
		else if(arr[i]=="rotate plus 45")
		{
			res_png = mod_rotate_ff.rotate_ff(res_png);
		}
		else if(arr[i]=="paint over")
		{
		
			res_png = mod_paint_over.paint_over(res_png);
		
		}
		else if(arr[i]=="nineth")
		{
		
			res_png = mod_nineth.nineth(res_png);
		
		}
		else if(arr[i]=="nonineth")
		{
		
			res_png = mod_nineth.nonineth(res_png);
		
		}
		else if(arr[i]=="maximus")
		{
		
			res_png = mod_maximus.maximus(res_png);
		
		}
		else if(arr[i]=="plus")
		{
			if(res_png.width * 2 > 1200 || res_png.height * 2 > 1200 )
			{
				
				console.log("error: res_png.width * 2 > 1200 || res_png.height * 2 > 1200 ");  
				return null;
				
			}
			
			res_png = __plus(res_png);
			
			
		}
		
		else if(arr[i]=="mirror right")
		{
			if(res_png.width * 2 > 1200  )
			{
				
				console.log("error: res_png.width * 2 > 1200  ");  
				return null;
				
			}
			
			res_png = mod_mirror.mirror_right(res_png);
			
			
			
		}
		else if(arr[i]=="mirror down")
		{
			
			if( res_png.height * 2 > 1200 )
			{
				
				console.log("error:  res_png.height * 2 > 1200  ");   
				return null;
				
			}
			
			res_png = mod_mirror.mirror_down(res_png);
			
			
		}
		
		else if(arr[i]=="axes minus")
		{
		
		
		
			res_png = mod_axes.bothAxesMinus(res_png);
		
		
		
		}
		
		
	}
	
	return res_png; 
	
}


function execute_script(req, res)
{
	logger_console_log('execute_script:');
	var s = '';
	for(var key in req.body)	{ 
		s +='\nreq.body['+key+']: '+req.body[key];
		
	}
	logger_console_log(s); 
	
	var arr = req.body['commands'].split(",");
	var res_png=null;
	var ind=null;
	var md5=req.body['md5'];
	logger_console_log(md5); 
	if(md5 != null)
	{
		ind = isDataPNGObjectByMD5(md5);
		if(ind==null)
		{
			logger_console_log('execute_script: not found obj with this md5:'+md5);
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end('execute_script: not found obj with this md5:'+md5);
				req.connection.destroy();
				return;
		}
		else 
		{
			res_png =  create_png_from_global(ind);
			
			
		}
	
	
	
	}
	
	
	for(var i=0;i<arr.length;i++)
	{
		arr[i]=arr[i].trim();
		logger_console_log("executing ["+arr[i]+"]"); 
		
		if(arr[i].indexOf("generate random seed")===0)
		{
			var t = arr[i].replace("generate random seed",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				params=t.split(" ");
				if(params.length>0)
				{
					for(var ii=0;ii<params.length;ii++) params[ii]=Number(params[ii]);
					
				}
				else
				{
					params =[15,3];
				}
			}
			else
			{
				params =[15,3];
			}
			res_png = mod_generate_random_seed.generate_random_seed(params);
			
			
		}
		else if(arr[i]=="median")
		{
			
			res_png = mod_median.__median(res_png);
			
		}
		else if(arr[i]=="bluestiks")
		{
			
			res_png = mod_bluestiks.bluestiks(res_png);
			
		}
		else if(arr[i]=="digfrompng")
		{
			
			res_png = mod_digfrompng.digfrompng(res_png);
			
		}
		else if(arr[i]=="cryptographic method two")
		{
			res_png = mod_cryptography.dark_lord(res_png);
		}
		/////////////// added 31 10 2021 01 22 /////////////////
		else if(arr[i].indexOf("combo")===0)
		{
			var t = arr[i].replace("combo",'');
			t=t.trim();
			var params=t.split(" ");
			if(params.length==2)
			{
				console.log("combo processing");
				md51=params[0].trim();
				md52=params[1].trim();
				
				var nm1 = isDataPNGObjectByMD5(md51);
				if(nm1==null)
				{
					console.log('execute_script:error: not found obj with this md51:'+md51);
					res.writeHead( 500, { 'Content-Type':'text/plain' } );
						res.end('execute_script:error: not found obj with this md51:'+md51);
						req.connection.destroy();
						return;
					
					
				}
				var nm2 = isDataPNGObjectByMD5(md52);
				if(nm2==null)
				{
					console.log('execute_script:error: not found obj with this md52:'+md52);
					res.writeHead( 500, { 'Content-Type':'text/plain' } );
						res.end('execute_script:error: not found obj with this md52:'+md52);
						req.connection.destroy();
						return;
							
				}
	
				
				
				res_png = mod_inner_combo.inner_combo(global_memory,nm1,nm2);
				if(res_png==null) {
				 
				    console.log('execute_script:error: odd first image but even second. need both odd or even');
					res.writeHead( 500, { 'Content-Type':'text/plain' } );
						res.end('execute_script:error: odd first image but even second. need both odd or even');
						req.connection.destroy();
						return;
				}
				
				global_memory.splice(nm1,1);
				global_memory.splice(nm2,1);
				 	
			}
			
			
			
		}
		else if(arr[i].indexOf("save as")===0)
		{
			var t = arr[i].replace("save as",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				md5=(t);
				saveImageAsDataArray(res_png,md5);	
			}
			
			
			
		}
		else if(arr[i].indexOf("load")===0)
		{
			var t = arr[i].replace("load",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				md5=(t);
				ind = isDataPNGObjectByMD5(md5);
				if(ind==null)
				{
					logger_console_log('execute_script: not found obj with this md5:'+md5);
					res.writeHead( 500, { 'Content-Type':'text/plain' } );
						res.end('execute_script: not found obj with this md5:'+md5);
						req.connection.destroy();
						return;
				}
				
				res_png =  create_png_from_global(ind);
				global_memory.splice(ind,1);	
				 
			}
			
			
			
		}
		////////////////////////////////////////////
		else if(arr[i].indexOf("magik rotate")===0)
		{
			var t = arr[i].replace("magik rotate",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				params=Number(t);
				
			}
			else
			{
				params =1;
			}
			res_png = mod_magik_rotate.magik_rotate(res_png,params);
			
		}
		else if(arr[i]=="up")
		{
			res_png = mod_up.upForImageData(res_png);
		}
		else if(arr[i]=="smooth")
		{
			
			res_png = mod_smooth.smooth(res_png);
			
		}
		else if(arr[i]=="rotate plus 45")
		{
			res_png = mod_rotate_ff.rotate_ff(res_png);
		}
		else if(arr[i]=="paint over")
		{
		
			res_png = mod_paint_over.paint_over(res_png);
		
		}
		else if(arr[i]=="nineth")
		{
		
			res_png = mod_nineth.nineth(res_png);
		
		}
		else if(arr[i]=="nonineth")
		{
		
			res_png = mod_nineth.nonineth(res_png);
		
		}
		else if(arr[i]=="maximus")
		{
		
			res_png = mod_maximus.maximus(res_png);
		
		}
		else if(arr[i]=="plus")
		{
			if(res_png.width * 2 > 1200 || res_png.height * 2 > 1200 )
			{
				
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("plus: error: too big size (need result width * 2 <= 1200 or height * 2 <= 1200 )");
				return;
				
			}
			
			res_png = __plus(res_png);
			
			
		}
		
		else if(arr[i]=="mirror right")
		{
			if(res_png.width * 2 > 1200  )
			{
				
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("mright: error: too big size (need result width * 2 <= 1200 )");
				return;
				
			}
			
			res_png = mod_mirror.mirror_right(res_png);
			
			
			
		}
		else if(arr[i]=="mirror down")
		{
			
			if( res_png.height * 2 > 1200 )
			{
				
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("mdown: error: too big size (need result height * 2 <= 1200)");
				return;
				
			}
			
			res_png = mod_mirror.mirror_down(res_png);
			
			
		}
		
		else if(arr[i]=="axes minus")
		{
		
		
		
			res_png = mod_axes.bothAxesMinus(res_png);
		
		
		
		}
		
		
	}
	
	if(ind !=null) global_memory.splice(ind,1);
	
	sendImage( res_png, res, 'script executed' );
	
}

function saveImageAsDataArray(png,md5) {

	var obj2 ={};
	obj2.width=png.width;
	obj2.height=png.height;
		
						var arr=[];
						for(var j=0;j<png.height;j++)
						{
							for(var i=0;i<png.width;i++)
							{
								var idx = (png.width * j + i) << 2;	
							
								
								arr.push(png.data[idx]);
								arr.push(png.data[idx+1]);
								arr.push(png.data[idx+2]);
								arr.push(png.data[idx+3]);
							}
						}
		
		
		obj2.data=arr;
		
		var obj = {};
		obj.id = md5;
		obj.img= obj2;
		global_memory.push(obj);
		
}

function maximus(req, res)
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		sendImage(mod_maximus.maximus(this),res,"maximus");
		
	});
		
}


function plus_nm( req, res ) {
	
	console.log('\nIn plus_nm(...)\n');
		 
	// for(var key in req.body)	console.log('req.body['+key+']: '+req.body[key]);
	
	var md51 = (''+req.body['md51']).trim();
	var n = Number((''+req.body['n']).trim());
	var m = Number((''+req.body['m']).trim());
	
	var nm1 = isDataPNGObjectByMD5(md51);
	if(nm1==null)
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("plus_nm: error: call /ident before");
		req.connection.destroy();
		return;
		
		
	}
	
	if((n < 0) || (n>21))
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("plus_nm: error: wrong seed size n");
		req.connection.destroy();
		return;
	 	
	}
	
	if((m < 0) ||(m > 21))
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("plus_nm: error: wrong seed size m");
		req.connection.destroy();
		return;
	 	
	}
	 
	
	let result_png = mod_plus_nm.plus_nm(global_memory, nm1, n, m);
	sendImage( result_png, res, '\nImage plused nm\n');
		
}

function super_paint_over( req, res ) {
	
	console.log('\nIn super_paint_over(...)\n');
		 
	// for(var key in req.body)	console.log('req.body['+key+']: '+req.body[key]);
	
	var md51 = (''+req.body['md51']).trim();
	var n = Number((''+req.body['n']).trim());
	 
	
	var nm1 = isDataPNGObjectByMD5(md51);
	if(nm1==null)
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("super_paint_over: error: call /ident before");
		req.connection.destroy();
		return;
		
		
	}
	
	if((n < 0) || (n>3))
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("super_paint_over: error: wrong lim [min 0..3 max]");
		req.connection.destroy();
		return;
	 	
	}
	 
	
	let result_png = mod_super_paint_over.super_paint_over(global_memory, nm1, n);
	sendImage( result_png, res, '\nImage super paint overed nm\n');
		
}

function nonineth(req, res)
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		sendImage(mod_nineth.nonineth(this),res,"\nnonineth");
		
	});
		
}

function nineth(req, res)
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		sendImage(mod_nineth.nineth(this),res,"\nnineth");
		
	});
		
}

function paint_over(req, res)
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		sendImage(mod_paint_over.paint_over(this),res,"\npaint over");
		
	});
		
}


function getDataTxtObjectByMD5(md5)
{
	var arr = fs.readdirSync('./memory');
	for(var i=0;i<arr.length;i++)
	{
		if(arr[i]==(''+md5+'.id'))
		{
			var s = fs.readFileSync( './memory/'+arr[i]);
			return JSON.parse(s);
		}
	  
	}
	return null;
	
}

function isDataPNGObjectByMD5(md5)
{
	//var arr = fs.readdirSync('./memory');
	for(var i=0;i<global_memory.length;i++)
	{
		//logger_console_log('test '+arr[i]);
		if(global_memory[i].id===md5)
		{
			
			return i;
		}
	  
	}
	return null;
	
}



function pre_rotate_any(req, res)
{
	
	logger_console_log('pre_rotate_any:');
	for(var key in req.body)	logger_console_log('req.body['+key+']: '+req.body[key]);
	
	var s = (''+req.body['md5']).trim();
	
	
	var ind = isDataPNGObjectByMD5(s);
		if(ind==null)
		{
			logger_console_log('pre_rotate_any:error: not found obj with this md5:'+s);
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end('pre_rotate_any:error:  not found obj with this md5:'+s);
				req.connection.destroy();
				return;
		}
	
	var obj = global_memory[ind];
	obj.hash = s;
	obj.degree = req.body['degree'];
	// fs.writeFile("./memory/"+s+'.id', JSON.stringify(obj), function(err) {
		// if(err) {
			// return logger_console_log(err);
		// }

		// logger_console_log("The file was saved!");
	//}); 
	
	
	res.writeHead(200, {  'Content-Type': 'text/html' } );
	res.end('ok');
	
}
function rotate_any(req, res)
{
	
	logger_console_log('rotate_any:');
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		var s = get_md5_hex(this.data);
		var ind = isDataPNGObjectByMD5(s);
		if(ind==null)
		{
			logger_console_log('rotate_any: not found obj with this md5:'+s);
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end('rotate_any: not found obj with this md5:'+s);
				req.connection.destroy();
				return;
		}
		else 
		{
			var respng = mod_rotate_any.rotate_any(this,global_memory[ind]);
			global_memory.splice(ind,1);
			sendImage(respng,res,"\nrotate_any");
		}
		
	});
	
}

function rotate_ff(req, res)
{
	
	
	mod_rotate_ff.rotate_ff(req, function( png ){
		
		if(png === -1) {
			console.log("check_size: error: too big size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too big size");
			return;
		}

		sendImage(png,res,"\nImage processed (rotate ff)");
		
		
	});
	
	//req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
	//	sendImage(mod_rotate_ff.rotate_ff(this),res,"\nImage was ff rotated\n");
		
	//});
}

function median(req, res)
{
	mod_median.median(req, function( png ){
		
		if(png === -1) {
			console.log("check_size: error: too small size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too small size");
			return;
		}

		sendImage(png,res,"\nImage processed (median)");
		
		
	});
	
	//req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
	//	sendImage(mod_median.__median(this),res,"\nImage was medianed\n");
		
	//});
		
}


function gcombo(req, res)
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		sendImage(mod_gcombo.__gcombo(this),res,"\nImage was gcombed\n");
		
	});
		
}

function brain(req, res)
{
	logger_console_log('In brain:');
	logger_console_log('req:'+req);
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		sendImage(mod_brain.__brain(this),res,"\nImage was brained\n");
		
	});
		
}


function __half(im)
{
	
	//var arr = get_coordinates(this.width, this.height);
		//if(arr == null) return; 
		
		var n=0;
		var m=0;
		if( im.width%2 == 0  ) n = im.width/2;
		else if( im.width%2 == 1  ) n = (im.width/2|0)+1;
		
		
		if(im.height%2 == 0) {  m = im.height/2;  }
		else if(im.height%2 == 1) { m = (im.height/2|0)+1; }
		// else 
		// {
			// var err = "width %2 != 0 or height %2 != 0 ";
			// logger_console_log(err);
			// res.writeHead(500, {  'Content-Type': 'text/html' } );
			// res.end("/half: error: "+err);
			// return;
			
		// }	


		
		
		var newpng = new PNG ( {
			
				width: n,
				height: m,
				filterType: 4
		} );
		
		

			for (var y = 0; y < m; y++) {
				
				for (var x = 0; x < n; x++) {
					
					var idx = (im.width * y + x) << 2;
					var idx2 = (newpng.width * y + x) << 2;
					
					newpng.data[idx2] = im.data[idx];
					newpng.data[idx2+1] = im.data[idx+1];
					newpng.data[idx2+2] = im.data[idx+2];
					newpng.data[idx2+3] = im.data[idx+3];
					
				}
			}
			
	
	return newpng;
}

function half( req, res )
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		
			var newpng = __half(this);
			sendImage(newpng,res,"\nImage was halfed\n");
						
		});
}



function rotate( req, res )
{
	
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		
		
		var newpng = new PNG ( {
			
				width: this.height,
				height: this.width,
				filterType: 4
		} );
		
				
		for (var y = 0; y < this.height; y++) {
		
		
			for (var x = 0; x < this.width; x++) {
			
			
				var idx = (this.width * y + x) << 2;
				
				var n = newpng.width - y;
				var m = x;
				var new_idx1 = (newpng.width * m + n) << 2;
						
				
				newpng.data[new_idx1+0] = this.data[idx+0];
				newpng.data[new_idx1+1] = this.data[idx+1];
				newpng.data[new_idx1+2] = this.data[idx+2];
				newpng.data[new_idx1+3] = this.data[idx+3];	
			}
		}
		
		sendImage(newpng, res, '\nImage rotated\n');	
		
	});
		
		
		
}


function __vortex(im)
{
	
	
		
		var newpng = new PNG ( {
			
				width: im.width*2,
				height: im.height,
				filterType: 4
		} );
		
		

			for (var y = 0; y < newpng.height; y++) {
				
				n=0;
				for (var x = 0; x < newpng.width; x++) {
					
					var idx = 0;
					var new_idx1 = newpng.width * y + x << 2;
					if(x < im.width)
					{
					
						idx = (im.width * y + x) << 2;
						
						newpng.data[new_idx1+0] = im.data[idx+0];
						newpng.data[new_idx1+1] = im.data[idx+1];
						newpng.data[new_idx1+2] = im.data[idx+2];
						newpng.data[new_idx1+3] = im.data[idx+3];
						n++;
					}
					else
					{
						idx = (im.width * y + (n-1)) << 2;
						
						newpng.data[new_idx1+0] = im.data[idx+0];
						newpng.data[new_idx1+1] = im.data[idx+1];
						newpng.data[new_idx1+2] = im.data[idx+2];
						newpng.data[new_idx1+3] = im.data[idx+3];
						
						n--;

					}
					
					
					
				}
				
			}
			
		
		
		
		
		
		
		var newpng2 = new PNG ( {
			
				width: newpng.width,
				height: newpng.height*2,
				filterType: 4
		} );
		
		var m=0;
		
		for (var x = 0; x < newpng2.width; x++) {
			
			m=0;
			
			for (var y = 0; y < newpng2.height; y++) {
				
				
				
					
					var idx = 0;
					
					var new_idx1 = newpng2.width * y + x << 2;
					
					if(y < newpng.height)
					{
					
						idx = (newpng.width * y + x) << 2;
						
						newpng2.data[new_idx1+0] = newpng.data[idx+0];
						newpng2.data[new_idx1+1] = newpng.data[idx+1];
						newpng2.data[new_idx1+2] = newpng.data[idx+2];
						newpng2.data[new_idx1+3] = newpng.data[idx+3];
						m++;
					}
					else
					{
						idx = (newpng.width * (m-1) + x) << 2;
						
						newpng2.data[new_idx1+0] = newpng.data[idx+0];
						newpng2.data[new_idx1+1] = newpng.data[idx+1];
						newpng2.data[new_idx1+2] = newpng.data[idx+2];
						newpng2.data[new_idx1+3] = newpng.data[idx+3];
						
						m--;

					}
					
					
					
				}
				
			}
			
			//sendImage(newpng,res,'\nImage mirror downed\n');
			
			
			return newpng2;
	
	
	
}


function vortex( req, res )
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		
		if(this.width * 2 > 3000 || this.height * 2 > 3000 )
		{
			
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("vortex: error: too big size (need result width * 2 or height * 2 <= 1200)");
			return;
			
		}
		
		
		
			
		
			sendImage(__vortex(this),res,'\nImage vortexed\n');
			
			
			
			
			
			
	});
}



















function mdown( req, res )
{
	
	
	
	mod_mirror.mirror_down(req, function( png ){
		
		if(png === -1) {
			console.log("check_size: error: too big size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too big size");
			return;
		}

		sendImage(png,res,"\nImage processed (mirror_down)");
		
		
	});
	

	
	
}

/***

function half( req, res )
{
	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		
		if( this.width * 2 > 1200 )
		{
			
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("mright: error: too big size (need result width * 2 <= 1200)");
			return;
			
		}

		
		sendImage(mod_half.half(this), res, 'half');	
			
	});
}

***/

function mright( req, res )
{
	
	
	
	mod_mirror.mirror_right(req, function( png ){
		
		if(png === -1) {
			console.log("check_size: error: too big size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too big size");
			return;
		}

		sendImage(png,res,"\nImage processed (mirror_right)");
		
		
	});
	

	
	
	// req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		
		// if( this.width * 2 > 1200 )
		// {
			
			// res.writeHead( 500, { 'Content-Type':'text/plain' } );
			// res.end("mright: error: too big size (need result width * 2 <= 1200)");
			// return;
			
		// }

		
		// sendImage(mod_mirror.mirror_right(this), res, 'mirror right');	
			
	// });
}


	function getColDec( cccol, cccol1 )
	{
		var cccol2=0;
		if(cccol+cccol1>255) cccol2=    ((cccol+cccol1)-255)+10;
		else cccol2=cccol+cccol1;
		return cccol2;
	}
	

	function getRandomInt(min, max) 
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	
function old_random( req, res )
{

	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		
		var newpng = new PNG ( {
			
				width: this.width,
				height: this.height,
				filterType: 4
		} );
		
		var p = [];
		p[0] = 	getRandomInt(0, 255);
		p[1] = 	getRandomInt(0, 255);
		p[2] = 	getRandomInt(0, 255);


			for (var y = 0; y < this.height; y++) {
				for (var x = 0; x < this.width; x++) {
					var idx = (this.width * y + x) << 2;

					
					// invert color
					newpng.data[idx] = getColDec(p[0],this.data[idx]);
					newpng.data[idx+1] = getColDec(p[1],this.data[idx+1]);
					newpng.data[idx+2] = getColDec(p[2],this.data[idx+2]);
					
					newpng.data[idx+3] = this.data[idx+3];
				}
			}
			
			sendImage(newpng,res,'\nImage was randomized\n');
			
	});
}




function old__axes( req, res )
{

	req.pipe(new PNG({filterType: 4})).on('parsed', function() {
		
		

		
		var newpng = new PNG ( {
			
				width: this.width-1,
				height: this.height-1,
				filterType: 4
		} );
		
		var dx = this.width/2|0; 
		var dy = this.height/2|0;
		
		//7/2 = 3 //012[3]456
		//8/2 = 4 //012[3][4]567
		
			for (var y = 0; y < this.height; y++) {
				
				if(y == dy) continue;
				
				for (var x = 0; x < this.width; x++) {
					
					if(x == dx) continue;
					
					var idx = (this.width * y + x) << 2;
					
					var new_idx1 = 0;
					
					if(x < dx && y < dy)
					{			
						new_idx1 = newpng.width * y + x << 2;
					}	
					else if(x > dx && y < dy)
					{
						new_idx1 = newpng.width * y + (x-1) << 2;
					}
					else if(x > dx && y > dy)
					{
						new_idx1 = newpng.width * (y-1) + (x-1) << 2;
					}
					else if(x < dx && y > dy)
					{
						new_idx1 = newpng.width * (y-1) + x << 2;
					}
					
						newpng.data[new_idx1+0] = this.data[idx+0];
						newpng.data[new_idx1+1] = this.data[idx+1];
						newpng.data[new_idx1+2] = this.data[idx+2];
						newpng.data[new_idx1+3] = this.data[idx+3];
						
					
					
					
				}
				
			}
			
		
			
			sendImage(newpng,res,'\nImage was axed\n');
			
	});
}













	
	
	function newcroplt(ish_png,  res,crop_settings)
	{
		
			var xw = crop_settings.x;
			var yh = crop_settings.y;
			var w = crop_settings.w;
		    var h = crop_settings.h;
			
			var newpng = new PNG ( {
													
				width: w-xw,
				height: h-yh,
				filterType: 4
				
			} );

			
			var m=0;
			for (var y = 0; y < ish_png.height; y++) {
				
				var n=0;
				for (var x = 0; x < ish_png.width; x++) {
					
					/***
					logger_console_log("x="+x);
					logger_console_log("y="+y);
					logger_console_log("n="+n);
					logger_console_log("m="+m);
					***/
					if( x>=xw  && y>=yh )
					{
						var idx = (ish_png.width * y + x) << 2;
						
						var newidx = (newpng.width * m + n) << 2;

						newpng.data[newidx+0] = ish_png.data[idx+0];
						newpng.data[newidx+1] = ish_png.data[idx+1];
						newpng.data[newidx+2] = ish_png.data[idx+2];
						newpng.data[newidx+3] = ish_png.data[idx+3];
						
						n++;
					}
				}
				
				if(y>=yh) m++;
			}


			
			return newpng;
			


											
	}
	
	function newcroprb(ish_png, res,crop_settings)
	{
		
			
			var xw = crop_settings.x;
			var yh = crop_settings.y;
			
			var newpng = new PNG ( {
													
				width: xw+1,
				height: yh+1,
				filterType: 4
				
			} );

			for (var y = 0; y < newpng.height; y++) {
				
				for (var x = 0; x < newpng.width; x++) {
					
					var idx = (ish_png.width * y + x) << 2;
					var newidx = (newpng.width * y + x) << 2;

					newpng.data[newidx+0] = ish_png.data[idx+0];
					newpng.data[newidx+1] = ish_png.data[idx+1];
					newpng.data[newidx+2] = ish_png.data[idx+2];
					newpng.data[newidx+3] = ish_png.data[idx+3];
				}
			}

			return newpng;
			

		
											
	}
	
	
	
	function crop( req, res )
	{
		 console.log('\nIn crop(...)\n');
		
		
		req.pipe(new PNG({filterType: 4})).on('parsed', function() {
			
			
			var s = get_md5_hex(this.data);
			var ind =	isDataPNGObjectByMD5(s);
			if(ind==null)
			{
				
				 console.log('crop: not found crop_settings with this md5:'+s);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('crop: not found crop_settings with this md5:'+s);
					req.connection.destroy();
					return;
				
				
				
			}
			
			
			
			var crop_settings=global_memory[ind].crop_settings;
			
			
					
			
			
			var flag = crop_settings.flag;
			
			console.log("crop_settings=");
			console.log(crop_settings);
			console.log("x="+crop_settings.x);
			console.log("y="+crop_settings.y);
			console.log("w="+crop_settings.w);
			console.log("h="+crop_settings.h);
			console.log("flag="+flag);
			console.log("md5="+crop_settings.md5);
			//ggggg
			if(flag==1)
			{
				
			
				var newpng = newcroplt(this,res,crop_settings);
				global_memory.splice(ind,1);
				sendImage(newpng,res,'\nImage was LT croped \n');
				
			}
			
			else if(flag==2)
			{
				
				
				var newpng = newcroprb(this,res,crop_settings);
				global_memory.splice(ind,1);
				sendImage(newpng,res,'\nImage was RB croped \n');
				
			}
			
		
		});
		
		
	}
	

function precrop( req, res)
{
	
									
		logger_console_log("\nentering precrop");
		
		
		var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 1e6*50)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("precrop(): error: data too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			
			
			var post = qs.parse(body);
			
			crop_settings = {};
			crop_settings.x =  +post['x'];
			crop_settings.y =  +post['y'];
			crop_settings.w =  +post['w'];
			crop_settings.h =  +post['h'];
			crop_settings.flag =  +post['flag'];
			
			logger_console_log("md5="+post['md5']);
			
			crop_settings.md5= post['md5'];
			
			// fs.writeFile("./memory/"+post['md5']+'.id', JSON.stringify(crop_settings), function(err) {
				// if(err) {
					// return logger_console_log(err);
				// }
			var ind =	isDataPNGObjectByMD5(crop_settings.md5);
			if(ind==null)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("precrop: error: in call /precrop ind==null");
				req.connection.destroy();
				return;
			}
			else
			{
				var obj = global_memory[ind];
				obj.crop_settings=crop_settings;
				global_memory[ind]=obj;
				
				res.writeHead( 200, { 'Content-Type':'text/plain' } );
				res.end("ok");
			
				
			}
			
			
		});
		
			
					
							
					
}

var combo_settings = null;

function prepare_combo(req, res)
{
	logger_console_log('\nIn prepare_combo(...)\n');
	
	var second_image = new PNG({filterType: 4});
	
	req.pipe(second_image).on( 'parsed', function()  {
				
		
		var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");

		var md5 = get_md5_hex(this.data);
		
		require("fs").writeFile("./memory/"+md5+".png", base64Data, 'base64', function(err) {
		  
		  
		  logger_console_log(err);
		  
		  
		  
		  
		});
		
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end(md5);
		
		
					
	});				
					
}
 


function error( req, res, msg )
{
	res.writeHead( 500, { 'Content-Type':'text/plain' } );
	res.end( msg );
	//req.connection.destroy();
	return;	
}

function right_glue( req, res ) {
	
	console.log('\nIn right_glue(...)\n');
		 
	// for(var key in req.body)	console.log('req.body['+key+']: '+req.body[key]);
	
	var md51 = (''+req.body['md51']).trim();
	var md52 = (''+req.body['md52']).trim();
	
	var nm1 = isDataPNGObjectByMD5(md51);
	if(nm1==null)
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("right_glue: error: call /ident before");
		req.connection.destroy();
		return;
		
		
	}
	
	var nm2 = isDataPNGObjectByMD5(md52);
	if(nm2==null)
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("right_glue: error: call /ident before");
		req.connection.destroy();
		return;
	}
	
	let result_png = mod_glue.right_glue(global_memory, nm1, nm2);
	sendImage(result_png,res,'\nImages gluced\n');
		
}


function down_glue( req, res ) {
	
	console.log('\nIn down_glue(...)\n');
		 
	// for(var key in req.body)	console.log('req.body['+key+']: '+req.body[key]);
	
	var md51 = (''+req.body['md51']).trim();
	var md52 = (''+req.body['md52']).trim();
	
	var nm1 = isDataPNGObjectByMD5(md51);
	if(nm1==null)
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("down_glue: error: call /ident before");
		req.connection.destroy();
		return;
		
		
	}
	
	var nm2 = isDataPNGObjectByMD5(md52);
	if(nm2==null)
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("down_glue: error: call /ident before");
		req.connection.destroy();
		return;
	}
	
	let result_png = mod_glue.down_glue(global_memory, nm1, nm2);
	sendImage(result_png,res,'\nImages gluced\n');
		
}



function acombo( req, res )
{
	
	console.log('\nIn acombo(...)\n');
	 
	// if(acombo_settings == null)
	// {
		
		// res.writeHead( 500, { 'Content-Type':'text/plain' } );
		// res.end("combo: error: call /prepare_acombo before");
		// req.connection.destroy();
		// return;

	// }
 
	for(var key in req.body)	console.log('req.body['+key+']: '+req.body[key]);
	
	var md51 = (''+req.body['md51']).trim();
	var md52 = (''+req.body['md52']).trim();
	
	var nm1 = isDataPNGObjectByMD5(md51);
	if(nm1==null)
	{
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("acombo: error: call /prepare_acombo before");
		req.connection.destroy();
		return;
		
		
	}
	var nm2 = isDataPNGObjectByMD5(md52);
	if(nm2==null)
	{
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("acombo: error: call /prepare_acombo before");
		req.connection.destroy();
		return;
		
		
	}
	
	let result_png = mod_acombo.acombo(global_memory, nm1, nm2);
	sendImage(result_png,res,'\nImages acombined\n');
		
}

function slozhenie_cvetov(a,b)
{
	var c = 0;
	
	if((a+b) > 255) c = (a+b) - 255;
	else c = (a+b);
	
	c /= 2;
	
	return c;
}	

function combo( req, res )
{
	
	logger_console_log('\nIn combo(...)\n');
	/***	
	if(combo_settings == null)
	{
		
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("combo: error: call /prepare_combo before");
		req.connection.destroy();
		return;

	}
	**/
	for(var key in req.body)	logger_console_log('req.body['+key+']: '+req.body[key]);
	
	var md51 = (''+req.body['md51']).trim();
	var md52 = (''+req.body['md52']).trim();
	
	var nm1 = isDataPNGObjectByMD5(md51);
	if(nm1==null)
	{
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("combo: error: call /prepare_combo before");
		req.connection.destroy();
		return;
		
		
	}
	var nm2 = isDataPNGObjectByMD5(md52);
	if(nm2==null)
	{
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("combo: error: call /prepare_combo before");
		req.connection.destroy();
		return;
		
		
	}
	
	//global_memory[nm1].img.pipe(  ).on('parsed', function() {

		var old_png =  new PNG({
			
			width: global_memory[nm1].img.width,
			height: global_memory[nm1].img.height,
			filterType: 4
			
			
			});
		
		
		
		
		var arr = global_memory[nm1].img.data;
		
		
		//	var arr=[];
						for(var j=0;j<old_png.height;j++)
						{
							for(var i=0;i<old_png.width;i++)
							{
								var idx = (old_png.width * j + i) << 2;	
							
							//	logger_console_log('\n'+idx+'\n');
								old_png.data[idx]=arr[idx];
								old_png.data[idx+1]=arr[idx+1];
								old_png.data[idx+2]=arr[idx+2];
								old_png.data[idx+3]=arr[idx+3];
							}
						}
		
		
		
		
		
		var big_image =  new PNG({
			
			width: global_memory[nm2].img.width,
			height: global_memory[nm2].img.height,
			filterType: 4
			
			
			});
		
		
		
		arr = global_memory[nm2].img.data;
		
						for(var j=0;j<big_image.height;j++)
						{
							for(var i=0;i<big_image.width;i++)
							{
								var idx = (big_image.width * j + i) << 2;	
							
						//		logger_console_log('\n'+idx+'\n');
								big_image.data[idx]=arr[idx];
								big_image.data[idx+1]=arr[idx+1];
								big_image.data[idx+2]=arr[idx+2];
								big_image.data[idx+3]=arr[idx+3];
							}
						}
		
		
		
		
		
		
		
		
		
		//logger_console_log('\n777777.)\n');
		
		
		
		
		// old_png.data =JSON.parse(old_png.data);
		//global_memory[nm2].img.pipe( new PNG({filterType: 4}) ).on('parsed', function() {

		
			// var big_image =  global_memory[nm1].img;//JSON.parse();//new PNG({filterType: 4});
			// big_image.data =JSON.parse(big_image.data);
	
		//	req.pipe(big_image).on('parsed', function() {
				
				
					
					
								
				// if(old_png.width != old_png.height) 
				// {
					// error( req, res, "combo: error: old_png.width != old_png.height");
					// return;
					
				// }
				
				// if(this.width != this.height) {
					// error( req, res, "combo: error: this.width != this.height");
					
					// return;  
				// }
					
				if((old_png.width % 2 == 0) && (big_image.width % 2 ==  0))
				{
					//even
					if(old_png.width > big_image.width)
					{
						
						
						
						var result_png = new PNG ( {
							
								width: old_png.width,
								height: old_png.height,
								filterType: 4
						} );
						

						var t4 = (old_png.width-big_image.width)/2;
						var k4 = (old_png.height-big_image.height)/2;
						
						
						
						for(var j=0;j<old_png.height;j++)
						{
							for(var i=0;i<old_png.width;i++)
							{
								if( (i>=t4) && (i<(t4+big_image.width)) && (j>=k4) && (j<(k4+big_image.height))	)
								{
									
									
									
									var idx = (old_png.width * j + i) << 2;
									
									var n=i-t4;
									var m=j-k4;
									
									var new_idx1 = big_image.width * m + n << 2;
							
									result_png.data[idx+0] = slozhenie_cvetov( big_image.data[new_idx1+0], old_png.data[idx+0] );
									result_png.data[idx+1] = slozhenie_cvetov( big_image.data[new_idx1+1], old_png.data[idx+1] );
									result_png.data[idx+2] = slozhenie_cvetov( big_image.data[new_idx1+2], old_png.data[idx+2] );
									result_png.data[idx+3] = 255;
									
									
									
								}
								else
								{
									
									
									var idx = (old_png.width * j + i) << 2;
									
									result_png.data[idx+0] = old_png.data[idx+0];
									result_png.data[idx+1] = old_png.data[idx+1];
									result_png.data[idx+2] = old_png.data[idx+2];
									result_png.data[idx+3] = 255;
									
								}
							}
						}
						
						
						
						
						

					}
					else
					{
						
						var result_png = new PNG ( {
							
								width: big_image.width,
								height: big_image.height,
								filterType: 4
						} );
						
						
						
						
						
						var t4 = (big_image.width-old_png.width)/2;
						var k4 = (big_image.height-old_png.height)/2;
						
						
						
						for(var j=0;j<big_image.height;j++)
						{
							for(var i=0;i<big_image.width;i++)
							{
								if( (i>=t4) && (i<(t4+old_png.width)) && (j>=k4) && (j<(k4+old_png.height))	)
								{
									
									
									
									var idx = (big_image.width * j + i) << 2;
									
									var n=i-t4;
									var m=j-k4;
									
									var new_idx1 = old_png.width * m + n << 2;
							
									result_png.data[idx+0] = slozhenie_cvetov( big_image.data[idx+0], old_png.data[new_idx1+0] );
									result_png.data[idx+1] = slozhenie_cvetov( big_image.data[idx+1], old_png.data[new_idx1+1] );
									result_png.data[idx+2] = slozhenie_cvetov( big_image.data[idx+2], old_png.data[new_idx1+2] );
									result_png.data[idx+3] = 255;
									
									
									
								}
								else
								{
									
									
									var idx = (big_image.width * j + i) << 2;
									
									result_png.data[idx+0] = big_image.data[idx+0];
									result_png.data[idx+1] = big_image.data[idx+1];
									result_png.data[idx+2] = big_image.data[idx+2];
									result_png.data[idx+3] = 255;
									
								}
							}
						}
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
					}
					
					global_memory.splice(nm1,1);		
					global_memory.splice(nm2,1);
					
					sendImage(result_png,res,'\nImages combined\n');
					
					
					
				}
				else if ((old_png.width % 2 == 1) && (big_image.width % 2 ==  1))
				{
					//odd
					if(old_png.width > big_image.width)
					{
						
						
						var result_png = new PNG ( {
							
								width: old_png.width,
								height: old_png.height,
								filterType: 4
						} );
						
						var middle_of_bigger_w = old_png.width / 2 | 0; // for 7  3    0 _1 2 [3] 4 5 6      3-2 = 1
						var middle_of_smaller_w = big_image.width / 2 | 0;   //for 5   2      0 1 [2] 3 4
						
						var begin_w = middle_of_bigger_w - middle_of_smaller_w;
						var end_w = begin_w + big_image.width; //and (not include) end
						
						var middle_of_bigger_h = old_png.height / 2 | 0; // for 7  3    0 _1 2 [3] 4 5 6      3-2 = 1
						var middle_of_smaller_h = big_image.height / 2 | 0; 
						
						var begin_h = middle_of_bigger_h - middle_of_smaller_h;
						var end_h = begin_h + big_image.height; 	
						
						
						for(var j=0;j<old_png.height;j++)
						{
							for(var i=0;i<old_png.width;i++)
							{
								var idx = (old_png.width * j + i) << 2;	
								
								if((i>= begin_w) && (i<end_w) && (j>=begin_h) && (j<end_h))
								{
								
									var n =	i - begin_w;
									var m = j - begin_h;
									
									var idx2 = big_image.width * m + n << 2;
									
									result_png.data[idx+0] = slozhenie_cvetov( big_image.data[idx2+0], old_png.data[idx+0] );
									result_png.data[idx+1] = slozhenie_cvetov( big_image.data[idx2+1], old_png.data[idx+1] );
									result_png.data[idx+2] = slozhenie_cvetov( big_image.data[idx2+2], old_png.data[idx+2] );
									result_png.data[idx+3] = 255;
									
									
								}
								else
								{
								
									result_png.data[idx+0] = old_png.data[idx+0];
									result_png.data[idx+1] = old_png.data[idx+1];
									result_png.data[idx+2] = old_png.data[idx+2];
									result_png.data[idx+3] = 255;
								}
							}
						}
						
						
						
						
					}
					else
					{
						
						var result_png = new PNG ( {
							
								width: big_image.width,
								height: big_image.height,
								filterType: 4
						} );
						
						var middle_of_bigger_w = big_image.width / 2 | 0; // for 7  3    0 _1 2 [3] 4 5 6      3-2 = 1
						var middle_of_smaller_w = old_png.width / 2 | 0;   //for 5   2      0 1 [2] 3 4
						
						var middle_of_bigger_h = big_image.height / 2 | 0; // for 7  3    0 _1 2 [3] 4 5 6      3-2 = 1
						var middle_of_smaller_h = old_png.height / 2 | 0; 
						
						var begin_w = middle_of_bigger_w - middle_of_smaller_w;
						var end_w = begin_w + old_png.width; //and (not include) end
						
						var begin_h = middle_of_bigger_h - middle_of_smaller_h;
						var end_h = begin_h + old_png.height; 	
					
						for(var j=0;j<big_image.height;j++)
						{
							for(var i=0;i<big_image.width;i++)
							{
								var idx = (big_image.width * j + i) << 2;	
								
								if((i>= begin_w) && (i<end_w) && (j>=begin_h) && (j<end_h))
								{
									
									var n =	i - begin_w;
									var m = j - begin_h;
									
									var idx2 = old_png.width * m + n << 2;
									
									result_png.data[idx+0] = slozhenie_cvetov( old_png.data[idx2+0], big_image.data[idx+0] );
									result_png.data[idx+1] = slozhenie_cvetov( old_png.data[idx2+1], big_image.data[idx+1] );
									result_png.data[idx+2] = slozhenie_cvetov( old_png.data[idx2+2], big_image.data[idx+2] );
									result_png.data[idx+3] = 255;
									
									
								}
								else
								{
									
									
									result_png.data[idx+0] = old_png.data[idx+0];
									result_png.data[idx+1] = old_png.data[idx+1];
									result_png.data[idx+2] = old_png.data[idx+2];
									result_png.data[idx+3] = 255;
								}
							}
						}
					}
					
					
					
					global_memory.splice(nm1,1);
					global_memory.splice(nm2,1);
					
					sendImage(result_png,res,'\nImages combined\n');
					
					
					
					
					
					
				}
				else  
				{
					
					error( req, res, "combo: error: odd first image but even second image. need both odd or even");
					
					return; //need error processing
				}
				
		
		
//	});
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
		
		
				
					
					
		
	
}
	

	
	
	
	
	/*********** XCOMBO **********/
	
	
	
var xcombo_settings = null;

function prepare_xcombo(req, res)
{
	logger_console_log('\nIn prepare_xcombo(...)\n');
	
	var second_image = new PNG({filterType: 4});
	
	req.pipe(second_image).on( 'parsed', function()  {
				
		
		xcombo_settings = {};
		xcombo_settings.second_image = this;
		
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end("ok");
					
	});				
					
}


function otnimanie_cvetov (a,b)
{
	
	if((b[0] == 0) && (b[1] == 0) && (b[2] == 0)) return [0,0,0,255];
	
	//var c = 0;
	
	//if((a+b) > 255) c = (a+b) - 255;
	//else c = (a+b);
	
	//c /= 2;
	
	return a;
}	
	
	
	
function slozhenie_cvetov_nql(a,b)
{
	
	if(a == b) return a;
	
	var c = 0;
	
	if((a+b) > 255) c = (a+b) - 255;
	else c = (a+b);
	
	c /= 2;
	
	return c;
}	
	
	
	
function xcombo( req, res )
{
	
	logger_console_log('\nIn xcombo(...)\n');
		
		for(var key in req.body)	logger_console_log('req.body['+key+']: '+req.body[key]);
	
	var md51 = (''+req.body['md51']).trim();
	var md52 = (''+req.body['md52']).trim();
	
	var nm1 = isDataPNGObjectByMD5(md51);
	if(nm1==null)
	{
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("xcombo: error: call /ident before");
		req.connection.destroy();
		return;
		
		
	}
	var nm2 = isDataPNGObjectByMD5(md52);
	if(nm2==null)
	{
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("xcombo: error: call /ident before");
		req.connection.destroy();
		return;
		
		
	}
	
	//global_memory[nm1].img.pipe(  ).on('parsed', function() {

		var old_png =  new PNG({
			
			width: global_memory[nm1].img.width,
			height: global_memory[nm1].img.height,
			filterType: 4
			
			
			});
		
		
		console.log("old_png.width="+old_png.width);
		
		var arr = global_memory[nm1].img.data;
		
		
		//	var arr=[];
						for(var j=0;j<old_png.height;j++)
						{
							for(var i=0;i<old_png.width;i++)
							{
								var idx = (old_png.width * j + i) << 2;	
							
							//	logger_console_log('\n'+idx+'\n');
								old_png.data[idx]=arr[idx];
								old_png.data[idx+1]=arr[idx+1];
								old_png.data[idx+2]=arr[idx+2];
								old_png.data[idx+3]=arr[idx+3];
							}
						}
		
		
		
		
		
		var big_image =  new PNG({
			
			width: global_memory[nm2].img.width,
			height: global_memory[nm2].img.height,
			filterType: 4
			
			
			});
		
		
		
		arr = global_memory[nm2].img.data;
		
						for(var j=0;j<big_image.height;j++)
						{
							for(var i=0;i<big_image.width;i++)
							{
								var idx = (big_image.width * j + i) << 2;	
							
						//		logger_console_log('\n'+idx+'\n');
								big_image.data[idx]=arr[idx];
								big_image.data[idx+1]=arr[idx+1];
								big_image.data[idx+2]=arr[idx+2];
								big_image.data[idx+3]=arr[idx+3];
							}
						}
		
		
		
		
		
		
				
					
					logger_console_log("old_png.width= " +old_png.width);	
			logger_console_log("big_image.width= " +big_image.width);	
					
			if(old_png.width != old_png.height) 
			{
				error( req, res, "xcombo: error: old_png.width != old_png.height");
				return;
				
			}
			
			if(big_image.width != big_image.height) {
				error( req, res, "xcombo: error: this.width != this.height");
				
				return;  
			}
			
	//if((big_image.width == old_png.width)&&(big_image.height == old_png.height))
	{
		
		
		var result_png = new PNG ( {
						
							width: old_png.width,
							height: old_png.height,
							filterType: 4
					} );
					
					
					  var t4 = (old_png.width-big_image.width)/2;
					 var k4 = (old_png.height-big_image.height)/2;	
						
						
						for(var j=0;j<old_png.height;j++)
						{
							for(var i=0;i<old_png.width;i++)
							{
								 
							  var n=i-t4;
							  var m=j-k4;
								
							  var  idx1 = big_image.width * m + n << 2;
									
									var idx = (old_png.width * j + i) << 2;
									
								 var clr1 = [old_png.data[idx+0],old_png.data[idx+1],old_png.data[idx+2],255];
								 var clr2 = [big_image.data[idx1+0],big_image.data[idx1+1],big_image.data[idx1+2],255];
								 let clr4 = otnimanie_cvetov( clr1, clr2 );
							
									result_png.data[idx+0] =  clr4[0];
									result_png.data[idx+1] = clr4[1]; //otnimanie_cvetov( big_image.data[new_idx1+1], old_png.data[idx+1] );
									result_png.data[idx+2] = clr4[2]; //otnimanie_cvetov( big_image.data[new_idx1+2], old_png.data[idx+2] );
									result_png.data[idx+3] = 255;
									
									
									
								 
							}
						}
						
					

					// var t4 = (old_png.width-big_image.width)/2;
					// var k4 = (old_png.height-big_image.height)/2;
					
				
					
					// for(var j=0;j<old_png.height;j++)
					// {
						// for(var i=0;i<old_png.width;i++)
						// {
								
								
								
								// var idx = (old_png.width * j + i) << 2;
								
								// var n=i-t4;
								// var m=j-k4;
								
								// var new_idx1 = big_image.width * m + n << 2;
						
						
						// if(
								// (big_image.data[new_idx1]==old_png.data[idx])&&
								// (big_image.data[new_idx1+1]==old_png.data[idx+1])&&
								// (big_image.data[new_idx1+2]==old_png.data[idx+2])
						// )
						// {
												
								// // result_png.data[idx] = 0;
								// // result_png.data[idx+1] = 0;
								// // result_png.data[idx+2] = 255;
								// // result_png.data[idx+3] = 255;
								
								// result_png.data[idx] = old_png.data[idx];
								// result_png.data[idx+1] = old_png.data[idx+1];
								// result_png.data[idx+2] = old_png.data[idx+2];
								// result_png.data[idx+3] = 255;
								
								
								
								
						// }
						// else{
								// result_png.data[idx] = 255;
								// result_png.data[idx+1] = 10;
								// result_png.data[idx+2] = 10;
								// result_png.data[idx+3] = 255;
							
						// }							
								
							// }
					// }
		
		
			
				
				sendImage(result_png,res,'\nImages xcombined\n');
				
				return;
		
		
		
		
		
	}


			
			
			
			if((old_png.width % 2 == 0) && (big_image.width % 2 ==  0))
			{
				
				//even
				if(old_png.width > big_image.width)
				{
					
					
					
					var result_png = new PNG ( {
						
							width: old_png.width,
							height: old_png.height,
							filterType: 4
					} );
					

					var t4 = (old_png.width-big_image.width)/2;
					var k4 = (old_png.height-big_image.height)/2;
					
				
					
					for(var j=0;j<old_png.height;j++)
					{
						for(var i=0;i<old_png.width;i++)
						{
							if( (i>=t4) && (i<(t4+big_image.width)) && (j>=k4) && (j<(k4+big_image.height))	)
							{
								
								
								
								var idx = (old_png.width * j + i) << 2;
								
								var n=i-t4;
								var m=j-k4;
								
								var new_idx1 = big_image.width * m + n << 2;
						
						
						if(
								(big_image.data[new_idx1]==old_png.data[idx])&&
								(big_image.data[new_idx1+1]==old_png.data[idx+1])&&
								(big_image.data[new_idx1+2]==old_png.data[idx+2])
						)
						{
												
								result_png.data[idx] = big_image.data[new_idx1];
								result_png.data[idx+1] = big_image.data[new_idx1+1];
								result_png.data[idx+2] = big_image.data[new_idx1+2];
								result_png.data[idx+3] = 255;
						}
						else{
								result_png.data[idx] = big_image.data[new_idx1];
								result_png.data[idx+1] = big_image.data[new_idx1+1];
								result_png.data[idx+2] = big_image.data[new_idx1+2];
								result_png.data[idx+3] = 255;
							
						}							
								
								
							}
							else
							{
								
								
								var idx = (old_png.width * j + i) << 2;
								
								result_png.data[idx+0] = old_png.data[idx+0];
								result_png.data[idx+1] = old_png.data[idx+1];
								result_png.data[idx+2] = old_png.data[idx+2];
								result_png.data[idx+3] = 255;
								
							}
						}
					}
					
					
					
					
					

				}
				else
				{
					
					var result_png = new PNG ( {
						
							width: big_image.width,
							height: big_image.height,
							filterType: 4
					} );
					
					
					
					
					
					var t4 = (big_image.width-old_png.width)/2;
					var k4 = (big_image.height-old_png.height)/2;
					
					
					
					for(var j=0;j<big_image.height;j++)
					{
						for(var i=0;i<big_image.width;i++)
						{
							if( (i>=t4) && (i<(t4+old_png.width)) && (j>=k4) && (j<(k4+old_png.height))	)
							{
								
								
								
								var idx = (big_image.width * j + i) << 2;
								
								var n=i-t4;
								var m=j-k4;
								
								var idx2 = (old_png.width * n + m) << 2;
						
									if(
								(big_image.data[new_idx1]==old_png.data[idx2])&&
								(big_image.data[new_idx1+1]==old_png.data[idx2+1])&&
								(big_image.data[new_idx1+2]==old_png.data[idx2+2])
						)
						{
												
								result_png.data[idx] = big_image.data[idx];
								result_png.data[idx+1] = big_image.data[idx+1];
								result_png.data[idx+2] = big_image.data[idx+2];
								result_png.data[idx+3] = 255;
						}
						else{
								result_png.data[idx] = old_png.data[idx2];
								result_png.data[idx+1] = old_png.data[idx2+1];
								result_png.data[idx+2] = old_png.data[idx2+2];
								result_png.data[idx+3] = 255;
							
						}		
								
								
							}
							else
							{
								
								
								var idx = (big_image.width * j + i) << 2;
								
								result_png.data[idx+0] = big_image.data[idx+0];
								result_png.data[idx+1] = big_image.data[idx+1];
								result_png.data[idx+2] = big_image.data[idx+2];
								result_png.data[idx+3] = 255;
								
							}
						}
					}
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
				}
				
						
				
				
				sendImage(result_png,res,'\nImages xcombined\n');
				
				
				
			}
			else if ((old_png.width % 2 == 1) && (big_image.width % 2 ==  1))
			{
				//odd
				if(old_png.width > big_image.width)
				{
					
					
					var result_png = new PNG ( {
						
							width: old_png.width,
							height: old_png.height,
							filterType: 4
					} );
					
					var middle_of_bigger_w = old_png.width / 2 | 0; // for 7  3    0 _1 2 [3] 4 5 6      3-2 = 1
					var middle_of_smaller_w = big_image.width / 2 | 0;   //for 5   2      0 1 [2] 3 4
					
					var begin_w = middle_of_bigger_w - middle_of_smaller_w;
					var end_w = begin_w + big_image.width; //and (not include) end
					
					var middle_of_bigger_h = old_png.height / 2 | 0; // for 7  3    0 _1 2 [3] 4 5 6      3-2 = 1
					var middle_of_smaller_h = big_image.height / 2 | 0; 
					
					var begin_h = middle_of_bigger_h - middle_of_smaller_h;
					var end_h = begin_h + big_image.height; 	
					
					
					for(var j=0;j<old_png.height;j++)
					{
						for(var i=0;i<old_png.width;i++)
						{
							var idx = (old_png.width * j + i) << 2;	
							
							if((i>= begin_w) && (i<end_w) && (j>=begin_h) && (j<end_h))
							{
							
								var n =	i - begin_w;
								var m = j - begin_h;
								
								var idx2 = big_image.width * m + n << 2;
								
								result_png.data[idx+0] = big_image.data[idx2+0];
								result_png.data[idx+1] = big_image.data[idx2+1];
								result_png.data[idx+2] = big_image.data[idx2+2];
								result_png.data[idx+3] = 255;
								
								
							}
							else
							{
							
								result_png.data[idx+0] = old_png.data[idx+0];
								result_png.data[idx+1] = old_png.data[idx+1];
								result_png.data[idx+2] = old_png.data[idx+2];
								result_png.data[idx+3] = 255;
							}
						}
					}
					
					
					
					
				}
				else
				{
					
					var result_png = new PNG ( {
						
							width: big_image.width,
							height: big_image.height,
							filterType: 4
					} );
					
					var middle_of_bigger_w = big_image.width / 2 | 0; // for 7  3    0 _1 2 [3] 4 5 6      3-2 = 1
					var middle_of_smaller_w = old_png.width / 2 | 0;   //for 5   2      0 1 [2] 3 4
					
					var middle_of_bigger_h = big_image.height / 2 | 0; // for 7  3    0 _1 2 [3] 4 5 6      3-2 = 1
					var middle_of_smaller_h = old_png.height / 2 | 0; 
					
					var begin_w = middle_of_bigger_w - middle_of_smaller_w;
					var end_w = begin_w + old_png.width; //and (not include) end
					
					var begin_h = middle_of_bigger_h - middle_of_smaller_h;
					var end_h = begin_h + old_png.height; 	
				
					for(var j=0;j<big_image.height;j++)
					{
						for(var i=0;i<big_image.width;i++)
						{
							var idx = (big_image.width * j + i) << 2;	
							
							if((i>= begin_w) && (i<end_w) && (j>=begin_h) && (j<end_h))
							{
								
								var n =	i - begin_w;
								var m = j - begin_h;
								
								var idx2 = old_png.width * m + n << 2;
								
								result_png.data[idx+0] = old_png.data[idx2+0];
								result_png.data[idx+1] = old_png.data[idx2+1];
								result_png.data[idx+2] = old_png.data[idx2+2];
								result_png.data[idx+3] = 255;
								
								
							}
							else
							{
								
								
								result_png.data[idx+0] = big_image.data[idx+0];
								result_png.data[idx+1] = big_image.data[idx+1];
								result_png.data[idx+2] = big_image.data[idx+2];
								result_png.data[idx+3] = 255;
							}
						}
					}
				}
				
				
				
				
				
				sendImage(result_png,res,'\nImages xcombined\n');
				
				
				
				
				
				
			}
			else  
			{
				
				error( req, res, "xcombo: error: odd first image but even second image. need both odd or even");
				
				return; //need error processing
			}
			
		
		

	
}
	

	
	
	
	
	/********** END OF XCOMBO ***************/
	
	
function rio(req, res)
{
	//logger_console_log('\nIn rio(...)\n');
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_rio.rioForImageData(this), res, 'rio' );
					
	});				
					
}

function get_solana_balance	(req,res) {
	
	
	var body = [];
  req.on('error', function (err) {
    console.error(err);
  });
  
  
  req.on('data',  function (chunk){
    body.push(chunk);
  });
  
  
   req.on('end', function() {
	   
		body = Buffer.concat(body).toString();
		var obj = JSON.parse(body);
		let publicKey = obj.publicKey;
		console.log(body);
		console.log(''+JSON.parse(body));
		console.log(''+JSON.parse(body).publicKey);
		mod_get_solana_balance.getBallanceFromMyWallet(publicKey, function(dt){
			//console.log(dt);
			sendText( ""+dt, res, "from getBallanceFromMyWallet: "+dt );	
		});
		
	
   });
	

}

function mint_nft_solana(req, res)
{
	//logger_console_log('\nIn rio(...)\n');
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_mint_nft_solana.mint_nft_solana(this), res, 'mint_nft_solana' );
					
	});				
					
}

////////////////////////////////
// UPLOAD IMAGE TO ARWEAVE
////////////////////////////////
// here we need return to user user_session_file_id (with ARWEAVE_URI in it received from arweave server after successfull upload) 
// and then, on client side, we can to store it at localStorage of browser
///////////////////////////////
function upload_image_to_arweave( req, res ) {
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
		 
		mod_upload_to_arweave.upload_image_to_arweave( this, function(fname){
			sendText( ""+fname, res, " upload_image_to_arweave: user_session_id_file["+fname+"]");	
		});
					
	});
	
}

////////////////////////////////
// UPLOAD JSON TO ARWEAVE
////////////////////////////////
//here we need to receive from user <user_session_id_file> and then, read this file and get from it ARWEAVE_URI ( that early we upload image to arweave ) 
////////////////////////////////
function upload_json_to_arweave( req, res ) {
	
	var body = [];
	
	req.on('error', function (err) {
		console.error(err);
	});
  
  
	req.on('data',  function (chunk){
		body.push(chunk);
	});
  
  
	req.on('end', function() {
	    // after upload json to arweave we should to see ARWEAVE_JSON_URI on this JSON in file <user_session_id_file>
		// we need to test work creating and editing this file  <user_session_id_file>
		body = Buffer.concat(body).toString();
		var obj = JSON.parse(body);
		let sfn = obj.data; 
		//let publicKey = obj.publicKey;
		console.log("uploaded json in upload_json_to_arweave:"+sfn);
		//console.log(body);
		//console.log(JSON.parse(body));
		//console.log(''+JSON.parse(body).publicKey);
		
		  mod_upload_to_arweave.upload_json_to_arweave(sfn, function(dt){
			let data = {};
			data.message = 'sended ok';
			data.result = JSON.parse(dt);
			let json = JSON.stringify(data);
			sendText( json, res, "upload_json_to_arweave: user_session_id_file["+dt+"]" );
		});
	//req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
	
////////////////// works! ////////////////////////////////////////// test test test /////////////////////////////////////////////	
	// how to write json data
// // // var jsonData = '{"persons":[{"name":"John","city":"New York"},{"name":"Phil","city":"Ohio"}]}';
 
// // // // parse json
// // // var jsonObj = JSON.parse(jsonData);
// // // console.log(jsonObj);
 
// // // // stringify JSON Object
// // // var jsonContent = JSON.stringify(jsonObj);
// // // console.log(jsonContent);
 
// // // fs.writeFile("outjhbgjhgfjhgcfjhgfv77put.json", jsonContent, 'utf8', function (err) {
    // // // if (err) {
        // // // console.log("An error occured while writing JSON Object to File.");
        // // // return console.log(err);
    // // // }
 
    // // // console.log("JSON file has been saved.");
// // // });

//////////////////////////////////////////////////////
	
	
	
		// //sendImage( , res, 'upload_image_to_arweave' );
		// let data = {};
		// data.message = 'sended ok';
		// data.result = result;
		// let json = JSON.stringify(data);
		// sendText( json, res, " upload_json_to_arweave: user_session_id_file["+result+"]");
					
	});
	
}

////////////////////////////////
// GET JSON FOR NFT & ARWEAVE
////////////////////////////////
//here we need to receive from user <user_session_id_file> and then, read this file and return it 
////////////////////////////////
function get_json_for_nft( req, res ) {
	
	var body = [];
	
	req.on('error', function (err) {
		console.error(err);
	});
  
  
	req.on('data',  function (chunk){
		body.push(chunk);
	});
  
  
	req.on('end', function() {
	    //here we look for <user_session_id_file>
		body = Buffer.concat(body).toString();
		console.log("body str:");
		console.log(body);
		var obj = JSON.parse(body);
		//let publicKey = obj.publicKey;
		console.log("get_json_for_nft:");
		console.log(obj);
		
		let sfn = obj.data; //131e103d7946bfadd5f44ded14b31afe_1660862011673
		
		//console.log(JSON.parse(body));
		//console.log(''+JSON.parse(body).publicKey);
		
		let result = mod_upload_to_arweave.get_json_prepared_for_arweave(sfn);
	
	//req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
	
////////////////// works! ////////////////////////////////////////// test test test /////////////////////////////////////////////	
	// how to write json data
// // // var jsonData = '{"persons":[{"name":"John","city":"New York"},{"name":"Phil","city":"Ohio"}]}';
 
// // // // parse json
// // // var jsonObj = JSON.parse(jsonData);
// // // console.log(jsonObj);
 
// // // // stringify JSON Object
// // // var jsonContent = JSON.stringify(jsonObj);
// // // console.log(jsonContent);
 
// // // fs.writeFile("outjhbgjhgfjhgcfjhgfv77put.json", jsonContent, 'utf8', function (err) {
    // // // if (err) {
        // // // console.log("An error occured while writing JSON Object to File.");
        // // // return console.log(err);
    // // // }
 
    // // // console.log("JSON file has been saved.");
// // // });

//////////////////////////////////////////////////////
	
		//let result = "result: test ok";
	
		//sendImage( , res, 'upload_image_to_arweave' );
		let data = {};
		data.message = 'sended ok';
		data.result = JSON.parse(result);
		let json = JSON.stringify(data);
		sendText( json, res, " get_json_for_nft: user_session_id_file["+result+"]");
					
	});
	
}

function mint_nft_solana_mainnet (req, res)
{
	//logger_console_log('\nIn rio(...)\n');
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_mint_nft_solana_mainnet.mint_nft_solana_mainnet(this), res, 'mint_nft_solana_mainnet' );
					
	});				
					
}

function mint_nft_solana_create_metadata(req, res)
{
	 
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_mint_nft_solana_create_metadata.mint_nft_solana_create_metadata(this), res, 'mint_nft_solana_create_metadata' );
					
	});				
					
}

function mint_nft_solana_get_metadata(req, res)
{
	 
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_mint_nft_solana_get_metadata.mint_nft_solana_get_metadata(this), res, 'mint_nft_solana_get_metadata' );
					
	});				
					
}

var num_colors=null;
function set_num_colors(request, res)
{
	var body = [];
  request.on('error', function (err) {
    console.error(err);
  });
  
  
  request.on('data',  function (chunk){
    body.push(chunk);
  });
  
  
   request.on('end', function() {
    body = Buffer.concat(body).toString();
	
	 var obj = JSON.parse(body);
	   num_colors=obj.num_colors;
	   logger_console_log(body);
	   logger_console_log(''+body);
	    logger_console_log(''+JSON.parse(body));
		 logger_console_log(''+JSON.parse(body).num_colors);
	   sendText(""+num_colors, res, 'set num colors '+num_colors );
	
   });

  
   
}

async function razn_colors(req, res)
{
	 
		
		mod_razn_colors.razn_colors( req, function ( png ) {	
		
			if(png == -1)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("razn_colors(): error: > 500 colors found");
				req.connection.destroy();
				return;
				
			}	
					
			sendImage(png,res,"\nrazn colors ok");
		
		}) 
					
	 
}

function old_razn_colors(req, res)
{
	
	
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
		var n = __getCountOfColors(this);	
		if(n>500)
		{
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("razn_colors(): error: > 500 colors found");
				req.connection.destroy();
				return;
			
			
		}	
		sendImage( mod_razn_colors.raznColors(this), res, 'razn colors' );
					
	});				
					
}


function min_colors(req, res)
{
	
	if(num_colors == null)
	{
		
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("min_colors(): error: call /set_num_colors before");
		req.connection.destroy();
		return;

	}
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage(mod_min_colors.minColors(num_colors,this), res, 'min colors '+num_colors );
					
	});				
					
}

// function axes(req, res)
// {
	// req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		// sendImage( module.bothAxesMinus(this), res, 'axes' );
					
	// });	

// }

function colors(req, res)
{
	//logger_console_log('\nIn rio(...)\n');
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendText(""+mod_colors.getCountOfColors(this), res, 'colors' );
					
	});				
					
}

function step_colors(req, res)
{
	//logger_console_log('\nIn rio(...)\n');
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_step_colors.stepColorsForImageData(this), res, 'step colors' );
					
	});				
					
}


function destroy_colors(req, res)
{
	//logger_console_log('\nIn rio(...)\n');
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
				var im = this;
				//for(var i=0;i<20; i++)
				{
					im = mod_destroy_colors.destroyColorsForImageData(im);
					
				}
					sendImage( im, res, 'destroy colors' );
	});				
					
}
		
function odin_dva_colors(req, res)
{
	//logger_console_log('\nIn rio(...)\n');
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_odin_dva_colors.odinDvaColorsForImageData(this), res, 'odin dva colors' );
					
	});				
					
}

function get_md5_hex(data)
{
		var s =md5(data);
		//logger_console_log('In get_md5_hex:'+s);
		return s;
		
		
	
		
}

function unident(req, res)
{
	
   var filepath = './server/upload/my.csv';
   fs.stat(filepath, function (err, stats) {
   
			logger_console_log(stats);//here we got all information of file in stats variable

		   if (err) {
			   return console.error(err);
		   }

		   fs.unlink(filepath,function(err){
				if(err) return logger_console_log(err);
				logger_console_log('file deleted successfully');
		   });  
	});
}

var global_memory=[];


function ident(req, res)
{
	var png = new PNG({filterType: 4});
	req.pipe(png).on( 'parsed', function()  {
		
		var d = new Date();
		var ms = d.getTime();
		var md5 = get_md5_hex(this.data);
		var obj2 ={};
		obj2.width=this.width;
		obj2.height=this.height;
		
			var arr=[];
						for(var j=0;j<this.height;j++)
						{
							for(var i=0;i<this.width;i++)
							{
								var idx = (this.width * j + i) << 2;	
							
								
								arr.push(this.data[idx]);
								arr.push(this.data[idx+1]);
								arr.push(this.data[idx+2]);
								arr.push(this.data[idx+3]);
							}
						}
		
		
		
		
		
		obj2.data=arr;
		var obj = {};
		obj.id = md5;
		obj.img= obj2;
		global_memory.push(obj);
		
		//png.pack().pipe(fs.createWriteStream("memory/"+md5+".png"));
		
		
		
		
		
		logger_console_log('\nIn ident(...)\nmd5='+md5);
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end(""+md5);
		
					
	});				
					
}
function join_colors(req, res)
{
	//logger_console_log('\nIn rio(...)\n');
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_join_colors.joinColorsForImageData(this), res, 'join colors' );
					
	});				
					
}
	
function up(req, res)
{
	//logger_console_log('\nIn rio(...)\n');
	
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_up.upForImageData(this), res, 'up' );
					
	});				
					
}	
	
function axes_minus(req, res)
{
	mod_axes.bothAxesMinus(req, function( png ) {
		if(png == -1) {
			
			console.log("check_size: error: too small size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too small size");
			return;

			 
		}
		sendImage( png, res, 'both axes minus' );
	});
	
}
	
/****	
function axes_minus(req, res)
{
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		//var newpng = __half(this);	
		var prom = 	mod_axes.bothAxesMinus(this);
		
		sendImage( prom, res, 'both axes minus' );
					
	});	
}	
****/
function axes_plus(req, res)
{
	mod_axes.bothAxesPlus(req, function( png ) {
	
		if(png == -1) {
			
			console.log("check_size: error: too big size");
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end("check_size: error: too big size");
			return;

			 
		}
		
		sendImage( png, res, 'Image processed (both axes plus)' );
		
	});
	
}

function inverse(req, res)
{
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_inverse.inverse(this), res, 'inverse' );
					
	});	
}

function random(req, res)
{
	req.pipe(new PNG({filterType: 4})).on( 'parsed', function()  {
				
		sendImage( mod_random.random(this), res, 'random' );
					
	});	
}

function generate_random_seed(req, res)
{
	logger_console_log('in generate_random_seed'+req.body);
	var body = [];
  req.on('error', function (err) {
    console.error(err);
  });
  
  
  req.on('data',  function (chunk){
    body.push(chunk);
  });
  
  
   req.on('end', function() {
    body = Buffer.concat(body).toString();
	
	 var obj = JSON.parse(body); //params
	var params = [obj.size,obj.num_colors];
	  
	   logger_console_log(''+body);
	     logger_console_log(''+params);
		
		 sendImage( mod_generate_random_seed.generate_random_seed(params), res, 'generate random seed' );
		 
	   //sendText(""+num_colors, res, 'set num colors '+num_colors );
	
   });
	
	
	
}


var fill_settings = null;

function get_seed(req, res)
{
	logger_console_log('\nIn get_seed(...)\n');
	
	var small_image = new PNG({filterType: 4});
	
	req.pipe(small_image).on( 'parsed', function()  {
				
		
		fill_settings = {};
		fill_settings.seed = this;
		
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end("ok");
					
	});				
					
}
	

function fill( req, res )
{
	
	logger_console_log('\nIn fill(...)\n');
		
	if(fill_settings == null)
	{
		
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("fill: error: call /send_seed before");
		req.connection.destroy();
		return;

	}
	
	
	
	var small_image = fill_settings.seed; 
	
	var big_image = new PNG({filterType: 4});
	
	req.pipe(big_image).on('parsed', function() {
		
		if(big_image.width * small_image.width > 1600 || big_image.height *  small_image.height > 1600 )
		{
			
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			logger_console_log("fill: error: too big size (need result width * height <= 1200)");
			res.end("fill: error: too big size (need result width * height <= 1200)");
			//req.connection.destroy();
			return;
			
		}
					var newpng = new PNG ( {
						
							width: big_image.width * small_image.width,
							height: big_image.height * small_image.height,
							filterType: 4
					} );
					
					
	
		
		//16%3 = 012
		
		//logger_console_log("big_image.width="+big_image.width);
		//logger_console_log("small_image.width="+small_image.width);
		//logger_console_log("newpng.width="+newpng.width);
		
		//var testError = new Error('for test only');
		//testError.status = 500;
		//throw testError;
		
			for (var y = 0; y < big_image.height; y++) {
				
				for (var x = 0; x < big_image.width; x++) {
					
					
					var idxBig = ( big_image.width * y + x ) << 2;
					
					
					for (var m = 0; m < small_image.height; m++) {
						
						for (var n = 0; n < small_image.width; n++) {
							
								var idxSim = ( small_image.width * m + n ) << 2;
								
								k=x*small_image.width+n;
								p=y*small_image.height+m;
								var idxRes = newpng.width*p + k << 2;
								
								newpng.data[idxRes+0] = getColDec( big_image.data[idxBig+0] , small_image.data[idxSim+0]);
					
								newpng.data[idxRes+1] = getColDec( big_image.data[idxBig+1] , small_image.data[idxSim+1]);
								
								newpng.data[idxRes+2] = getColDec( big_image.data[idxBig+2] , small_image.data[idxSim+2]);
								
								newpng.data[idxRes+3] = 255;
								
						}
					}
					
					
				}
			}

			fill_settings = null;			
			
			sendImage(newpng,res,'\nImage seeded\n');
		
		
	});
	
}

function getWDH( x,  y,  w,  h) {
		 
		let arr = [];
		for(let i=0;i<9;i++) arr.push([]);
		let counter=0;
		
		if(x>0 && x<w) { 
			arr[0][0] = x-1;
		//	counter++;
		}
		else arr[0][0] = -1;
		
		if(y>0 && y<h) { 
			arr[0][1] = y-1; 
		//	counter++; 
		}
		else arr[0][1] = -1;
		
		if(x>0 && x<w) { 
			arr[1][0] = x-1; 
		//	counter++;
		}
		else arr[1][0] = -1;
		
		if(y>0 && y<h) { 
			arr[1][1] = y; 
		//	counter++;
		}
		else arr[1][1] = -1;
		
		if(x>0 && x<w) { 
			arr[2][0] = x-1;
		//	counter++;
		}
		else arr[2][0] = -1;
		
		if(y>0 && y<h-1) { 
			arr[2][1] = y+1;
		//	counter++;
		}
		else arr[2][1] = -1;
		
		if(x>0 && x<w) { 
			arr[3][0] = x;
		//	counter++;
		}
		else arr[3][0] = -1;
		
		if(y>0 && y<h) { 
			arr[3][1] = y-1;
		//	counter++;
		}
		else arr[3][1] = -1;
		
		if(x>0 && x<w) { 
			arr[4][0] = x;
		//	counter++;
		}
		else arr[4][0] = -1;
		
		if(y>0 && y<h-1) { 
			arr[4][1] = y+1;
		//	counter++;
		}
		else arr[4][1] = -1;
		
		if(x>0 && x<w-1) { 
			arr[5][0] = x+1;
		//	counter++;
		}
		else arr[5][0] = -1;
		
		if(y>0 && y<h) { 
			arr[5][1] = y-1;
		//	counter++;
		}
		else arr[5][1] = -1;
		
		if(x>0 && x<w-1) { 
			arr[6][0] = x+1;
		//	counter++;
		}
		else arr[6][0] = -1;
		
		if(y>0 && y<h) { 
			arr[6][1] = y;
		//	counter++;
		}
		else arr[6][1] = -1;
				
		if(x>0 && x<w-1) { 
			arr[7][0] = x+1;
		//	counter++;
		}
		else arr[7][0] = -1;
		
		if(y>0 && y<h-1) { 
			arr[7][1] = y+1;
		//	counter++;
		}
		else arr[7][1] = -1;
		
		//////////////////////////////////////////
		if(x>0 && x<w-1) { 
			arr[8][0] = x;
		//	counter++;
		}
		else arr[8][0] = -1;
		
		if(y>0 && y<h-1) { 
			arr[8][1] = y;
		//	counter++;
		}
		else arr[8][1] = -1;
		//arr[8][1] = counter;
		//arr[8][0] = counter;
		
		return arr;
		
    }
	


function compareColors(color,color2)
{
	if(
			(color2[0]==color[0]) && 
			(color2[1]==color[1]) && 
			(color2[2]==color[2]) && 
			(color2[3]==color[3]) 
							
						
		)
		{
			return true;
			
		}	
		
		return false;
}

function getColorFromPoint(im0,idx) {
return [im0.data[idx], im0.data[idx+1],im0.data[idx+2],im0.data[idx+3]]; 
}


function countPointNeighSameColor(big_image,x,y,c) {

			let neigh = getWDH(x, y, big_image.width, big_image.height );
			
			let counter=0;
			for(let ii=0;ii<9;ii++) {
				
				let x1 = neigh[ii][0];
				let y1 = neigh[ii][1];
				
				if(x1==-1) continue;
				if(y1==-1) continue;
//					log(""+x1+","+y1);

				let idx = ( big_image.width * y1 + x1 ) << 2;
				let c1 = getColorFromPoint(big_image, idx);
				//int r1 = c1.getRed();
				//int g1 = c1.getGreen();
				//int b1 = c1.getBlue();
				if(compareColors(c,c1)==true) counter++;
			}
			return counter;

}

function fillx( req, res )
{
	
	logger_console_log('\nIn fillx(...)\n');
		
	if(fill_settings == null)
	{
		
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("fillx: error: call /send_seed before");
		req.connection.destroy();
		return;

	}
	
	
	
	var small_image = fill_settings.seed; 
	
	var big_image = new PNG({filterType: 4});
	
	req.pipe(big_image).on('parsed', function() {
		
		if(big_image.width * small_image.width > 1600 || big_image.height *  small_image.height > 1600 )
		{
			
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			logger_console_log("fillx: error: too big size (need result width * height <= 1200)");
			res.end("fillx: error: too big size (need result width * height <= 1200)");
			//req.connection.destroy();
			return;
			
		}
					var newpng = new PNG ( {
						
							width: big_image.width * small_image.width,
							height: big_image.height * small_image.height,
							filterType: 4
					} );
					
					
	
		
		//16%3 = 012
		
		//logger_console_log("big_image.width="+big_image.width);
		//logger_console_log("small_image.width="+small_image.width);
		//logger_console_log("newpng.width="+newpng.width);
		
		//var testError = new Error('for test only');
		//testError.status = 500;
		//throw testError;
		
			for (var y = 0; y < big_image.height; y++) {
				
				for (var x = 0; x < big_image.width; x++) {
					
					
					var idxBig = ( big_image.width * y + x ) << 2;
					
					let col =  getColorFromPoint(big_image,idxBig);
					
					if(countPointNeighSameColor(big_image,x,y,col)<9) {
					
						for (var m = 0; m < small_image.height; m++) {
							
							for (var n = 0; n < small_image.width; n++) {
								
									var idxSim = ( small_image.width * m + n ) << 2;
									
									k=x*small_image.width+n;
									p=y*small_image.height+m;
									var idxRes = newpng.width*p + k << 2;
									
									newpng.data[idxRes+0] = getColDec( big_image.data[idxBig+0] , small_image.data[idxSim+0]);
						
									newpng.data[idxRes+1] = getColDec( big_image.data[idxBig+1] , small_image.data[idxSim+1]);
									
									newpng.data[idxRes+2] = getColDec( big_image.data[idxBig+2] , small_image.data[idxSim+2]);
									
									newpng.data[idxRes+3] = 255;
									
							}
						}
					
					}
					else {
					
					for (var m = 0; m < small_image.height; m++) {
							
							for (var n = 0; n < small_image.width; n++) {
								
									var idxSim = ( small_image.width * m + n ) << 2;
									
									k=x*small_image.width+n;
									p=y*small_image.height+m;
									var idxRes = newpng.width*p + k << 2;
									
									newpng.data[idxRes+0] = big_image.data[idxBig+0];
						
									newpng.data[idxRes+1] = big_image.data[idxBig+1];
									
									newpng.data[idxRes+2] = big_image.data[idxBig+2];
									
									newpng.data[idxRes+3] = 255;
									
							}
						}
					
					
					}
					
					
				}
			}

			fill_settings = null;			
			
			sendImage(newpng,res,'\nImage seeded\n');
		
		
	});
	
}


function filly( req, res )
{
	
	logger_console_log('\nIn filly(...)\n');
		
	if(fill_settings == null)
	{
		
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("filly: error: call /send_seed before");
		req.connection.destroy();
		return;

	}
	
	
	
	var small_image = fill_settings.seed; 
	
	var big_image = new PNG({filterType: 4});
	
	req.pipe(big_image).on('parsed', function() {
		
		if(big_image.width * small_image.width > 1600 || big_image.height *  small_image.height > 1600 )
		{
			
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			logger_console_log("filly: error: too big size (need result width * height <= 1200)");
			res.end("filly: error: too big size (need result width * height <= 1200)");
			//req.connection.destroy();
			return;
			
		}
					var newpng = new PNG ( {
						
							width: big_image.width * small_image.width,
							height: big_image.height * small_image.height,
							filterType: 4
					} );
					
					
	
		
		//16%3 = 012
		
		//logger_console_log("big_image.width="+big_image.width);
		//logger_console_log("small_image.width="+small_image.width);
		//logger_console_log("newpng.width="+newpng.width);
		
		//var testError = new Error('for test only');
		//testError.status = 500;
		//throw testError;
		
			for (var y = 0; y < big_image.height; y++) {
				
				for (var x = 0; x < big_image.width; x++) {
					
					
					var idxBig = ( big_image.width * y + x ) << 2;
					
					let col =  getColorFromPoint(big_image,idxBig);
					
					if(countPointNeighSameColor(big_image,x,y,col)<9) {
					
							for (var m = 0; m < small_image.height; m++) {
							
							for (var n = 0; n < small_image.width; n++) {
								
									var idxSim = ( small_image.width * m + n ) << 2;
									
									k=x*small_image.width+n;
									p=y*small_image.height+m;
									var idxRes = newpng.width*p + k << 2;
									
									newpng.data[idxRes+0] = big_image.data[idxBig+0];
						
									newpng.data[idxRes+1] = big_image.data[idxBig+1];
									
									newpng.data[idxRes+2] = big_image.data[idxBig+2];
									
									newpng.data[idxRes+3] = 255;
									
								}
							}
					
					}
					else {
						
						for (var m = 0; m < small_image.height; m++) {
							
							for (var n = 0; n < small_image.width; n++) {
								
									var idxSim = ( small_image.width * m + n ) << 2;
									
									k=x*small_image.width+n;
									p=y*small_image.height+m;
									var idxRes = newpng.width*p + k << 2;
									
									newpng.data[idxRes+0] = getColDec( big_image.data[idxBig+0] , small_image.data[idxSim+0]);
						
									newpng.data[idxRes+1] = getColDec( big_image.data[idxBig+1] , small_image.data[idxSim+1]);
									
									newpng.data[idxRes+2] = getColDec( big_image.data[idxBig+2] , small_image.data[idxSim+2]);
									
									newpng.data[idxRes+3] = 255;
									
							}
						}
					
					}
					
					
				}
			}

			fill_settings = null;			
			
			sendImage(newpng,res,'\nImage seeded\n');
		
		
	});
	
}


app.post('/get_result_execute_pattern_worker',get_result_execute_pattern_worker);
app.post('/get_cluster_worker',get_cluster_worker);
app.post('/prepare_cluster_worker',prepare_cluster_worker);
app.post('/ident_image_for_cluster',ident_image_for_cluster);
app.post('/test_execute_pattern_worker', test_execute_pattern_worker);	
app.post('/test_execute_pattern_wv', test_execute_pattern_wv);	
app.post('/fill', fill );	
app.post('/fillx', fillx );
app.post('/filly', filly );
app.post('/prepare_combo', prepare_combo );	
app.post('/combo', combo );	
app.post('/right_glue', right_glue );
app.post('/down_glue', down_glue );	
app.post('/acombo', acombo );	
app.post('/prepare_xcombo', prepare_xcombo );	
app.post('/xcombo', xcombo );
app.post('/rio', rio );	
app.post('/get_solana_balance', get_solana_balance );
app.post('/get_json_for_nft', get_json_for_nft );
app.post('/upload_image_to_arweave', upload_image_to_arweave);
app.post('/upload_json_to_arweave', upload_json_to_arweave);
app.post('/mint_nft_solana', mint_nft_solana );	
app.post('/mint_nft_solana_mainnet', mint_nft_solana_mainnet );
app.post('/mint_nft_solana_create_metadata', mint_nft_solana_create_metadata );	
app.post('/mint_nft_solana_get_metadata', mint_nft_solana_get_metadata );	
app.post('/set_num_colors', set_num_colors);
app.post('/min_colors', min_colors);
app.post('/colors', colors);
app.post('/brain', brain);
app.post('/gcombo', gcombo);
app.post('/inverse', inverse);
app.post('/nineth', nineth);
app.post('/smooth', smooth );
app.post('/nonineth', nonineth);
app.post('/razn_colors', razn_colors);		
app.post('/step_colors', step_colors);	
app.post('/paint_over', paint_over);
app.post('/super_paint_over', super_paint_over);
app.post('/destroy_colors', destroy_colors);	
app.post('/odin_dva_colors', odin_dva_colors);	
app.post('/join_colors', join_colors);	
app.post('/send_seed', get_seed );
app.post('/crop', crop );
app.post('/precrop', precrop );
app.post('/random', random );
app.post('/generate_random_seed',generate_random_seed);
app.post('/mdown', mdown );
app.post('/mright', mright );
app.post('/hello_md5', hello_md5);
app.post('/up', up );
app.post('/vortex', vortex );
app.post('/rotate', rotate );
app.post('/pre_rotate_any', pre_rotate_any );
app.post('/rotate_any', rotate_any );
app.post('/half', half );
app.post('/median', median );
//shift shift lt w/2+1
app.post('/axes_minus', axes_minus );
app.post('/axes_plus', axes_plus );
//app.post('/axes', axes );
app.post('/ident', ident );
app.post('/multiply', multiply );
app.post('/maximus', maximus );
app.post('/rotateff', rotateff );
app.post('/plus', plus );
app.post('/plus_nm', plus_nm );
app.post('/minus', minus );
app.post('/execute_script', execute_script );
app.post('/blackwhite', blackwhite );
app.post('/inverse', inverse );
app.post('/borderplus', borderplus );
app.post('/borderminus', borderminus );
//app.get('/get_color_for_pass', get_color_for_pass );
app.post('/rotate_ff', rotate_ff );
app.post('/execute_pattern', execute_pattern );
app.post('/execute_pattern_database', execute_pattern_database );
//app.get('/get_color_for_pass', get_color_for_pass );
app.post('/is_buzzy',is_buzzy);
//app.get('/all_buzy_free',all_buzy_free);
app.post('/clear_stones',clear_stones);
app.get('/show_buzy',show_buzy);
app.get('/show_users',show_users);
app.post('/commit_labirints_changes',commit_labirints_changes);
app.post('/array_buffer_to_server',array_buffer_to_server);
app.post('/blob_to_server_and_echo_from_server',blob_to_server_and_echo_from_server);
app.post('/blob_from_server',blob_from_server);
app.post('/get_array_of_all_generated_stones',get_array_of_all_generated_stones);
app.post('/get_labirint_id', init_pixels );
app.post('/pixels', pixels );
app.post('/get_url_to_ws', get_url_to_ws );
app.post('/test245', test245 );
app.post('/right_pixels', right_pixels );
app.post('/add_boh_pixel', add_boh_pixel );
app.post('/get_qty_neighbours',get_qty_neighbours);
app.post('/set_collected_pixels',set_collected_pixels);	
app.post('/init_pixels', init_pixels );
app.post('/get_error_message', get_error_message );
app.post('/get_xy_labirint', get_xy_labirint);
app.post('/set_xy_labirint', set_xy_labirint);
//app.post('/init_boh_pixels', init_boh_pixels );
app.post('/init_labirint_settings', init_labirint_settings );
app.post('/get_chaosed_labirint',get_chaosed_labirint);
app.post('/get_collected', get_collected );
app.post('/paste',function(request, response) {

				request.pipe(response);
					/*******
					var old_fullpath = './canvas1' + '/' + getCurrentImageCanvasName();
					
					var newname = generateFileName()+".png";
					var new_fullpath = './canvas1' + '/' + newname;
					
					var wstream = fs.createWriteStream( new_fullpath );
					req.pipe(wstream);
					
					request.on('end', function()
					{
						logger_console_log("Stream "+new_fullpath+" is wrote and closed");
						//setCurrentCanvasImageName(newname);
						
						logger_console_log("Now we try to unlink "+old_fullpath);
						fs.unlinkSync(old_fullpath);
						logger_console_log("success");
						
						returnNewCanvasImageName(res);
						
					});
					******/
					
				   
});  

/***==============***/

//-------------------------------------------------------------------
//---------------------  SHOW PIXELS FUNCTIONS ----------------------
//-------------------------------------------------------------------


//var global_memory=[];

function array_buffer_to_server(req, res)
{
		
	var data=[];
	  req.on('data', function(chunk) {
        data.push(chunk); //data is an array of Buffers
    }).on('end', function() {
        
        var buffer = Buffer.concat(data);//make a new Buffer from array of Buffers(all of them together)
		logger_console_log(buffer.length);
		
		/***
		
					var newpng = new PNG ( {
						
							width: 248,
							height: 248,
							filterType: 4
					} );
					
		
					for(var j=0;j<newpng.height;j++)
					{
						for(var i=0;i<newpng.width;i++)
						{
							
								
								var idx = newpng.width * j + i << 2;
								
								newpng.data[idx+0] = buffer[idx];
								newpng.data[idx+1] = buffer[idx+1];
								newpng.data[idx+2] = buffer[idx+2];;
								newpng.data[idx+3] = buffer[idx+3];;
								
								
						}
					}
					
			***/		
					
					// for(var j=0;j<10;j++)
					// {
						// for(var i=0;i<10;i++)
						// {
							
								
								// var idx = newpng.width * j + i << 2;
								
								// newpng.data[idx+0] = 0;
								// newpng.data[idx+1] = 0;
								// newpng.data[idx+2] = 0;
								// newpng.data[idx+3] = 255;
								
								
						// }
					// }
					
					
					//sendImage(newpng,res,'\nBlack square send');
					var md5 = generate_md5_id();	
					var obj = {};
		obj.id = md5;
		obj.png = buffer;
		global_memory.push(obj);
		
		
		logger_console_log('\nIn blob_to_server(...)\nin memory we store buffer\n(and we need w&h for transform to png)\nid of obj='+md5+'\nindex in global_memory unknown');
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end(""+md5);
		
    });
	
				
}


function blob_to_server_and_echo_from_server(req, res)
{
	//
	//  from client
	///
	// var data = new Uint8Array([
  // 137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,8,0,0,
  // 0,8,8,2,0,0,0,75,109,41,220,0,0,0,34,73,68,65,84,8,215,99,120,
  // 173,168,135,21,49,0,241,255,15,90,104,8,33,129,83,7,97,163,136,
  // 214,129,93,2,43,2,0,181,31,90,179,225,252,176,37,0,0,0,0,73,69,
  // 78,68,174,66,96,130]);
// var blob = new Blob([data], { type: "image/png" });
// var url = URL.createObjectURL(blob);
// var img = new Image();
// img.src = url;
// logger_console_log("data length: " + data.length);
// logger_console_log("url: " + url);
// document.body.appendChild(img);
///	
///img { width: 100px; height: 100px; image-rendering: pixelated; }
///	
	
	
	// var big_image = new PNG({filterType: 4});
	
	// req.pipe(big_image).on('parsed', function() {
		
		
		// sendImage(big_image,res,'\nImage got and echoed\n');
		
		
		
	// });
	
	
	
	
	
	var data=[];
	  req.on('data', function(chunk) {
        data.push(chunk);
    }).on('end', function() {
        //at this point data is an array of Buffers
        //so Buffer.concat() can make us a new Buffer
        //of all of them together
        var buffer = Buffer.concat(data);
		logger_console_log(buffer.length);
		//var s='';
		//for(var i=0;i<2500;i++){s+='[';for(var j=0;j<4;j++)s+=buffer[i*4+j]+',';s+=']\n';} logger_console_log(s);
        //logger_console_log(buffer.toString('base64'));
		
		
					var newpng = new PNG ( {
						
							width: 248,
							height: 248,
							filterType: 4
					} );
					
		
					for(var j=0;j<newpng.height;j++)
					{
						for(var i=0;i<newpng.width;i++)
						{
							
								
								var idx = newpng.width * j + i << 2;
								
								newpng.data[idx+0] = buffer[idx];
								newpng.data[idx+1] = buffer[idx+1];
								newpng.data[idx+2] = buffer[idx+2];;
								newpng.data[idx+3] = buffer[idx+3];;
								
								
						}
					}
					
					for(var j=0;j<10;j++)
					{
						for(var i=0;i<10;i++)
						{
							
								
								var idx = newpng.width * j + i << 2;
								
								newpng.data[idx+0] = 0;
								newpng.data[idx+1] = 0;
								newpng.data[idx+2] = 0;
								newpng.data[idx+3] = 255;
								
								
						}
					}
					
					
					sendImage(newpng,res,'\nBlack square send');
							
		
    });
	
	
	
	// var reader = fs.createReadStream();
	// reader.readAsArrayBuffer(req.body);
	
 // reader.addEventListener("loadend", function() {
	// var s='';
   // for(var i=0;i<40;i++)s+=''+reader.result[i]; logger_console_log(s);
 // });
	
	// reader.on('readable', function(){
		// var data = reader.read();
		// logger_console_log('['+data+']');
	// });
	
	// req.pipe(reader).on('end', function(){
		// logger_console_log("THE END");
	// });
	
	/*****************
	req.pipe(reader).on( 'parsed', function()  {
		
	});
	
// reader.addEventListener("loadend", function() {
	
// });
// reader.readAsArrayBuffer(req.body);
	
	var png = new PNG({filterType: 4});
	req.pipe(png).on( 'parsed', function()  {
		
	
		var md5 = generate_md5_id();
		//var obj2 ={};
		//obj2.width=this.width;
		//obj2.height=this.height;
		
			// var arr=[];
						// for(var j=0;j<this.height;j++)
						// {
							// for(var i=0;i<this.width;i++)
							// {
								// var idx = (this.width * j + i) << 2;	
							
								
								// arr.push(this.data[idx]);
								// arr.push(this.data[idx+1]);
								// arr.push(this.data[idx+2]);
								// arr.push(this.data[idx+3]);
							// }
						// }
		
		
		
		
		
		//obj2.data=arr;
		var obj = {};
		obj.id = md5;
		obj.img= png;
		global_memory.push(obj);
		
		
		logger_console_log('\nIn blob_to_server(...)\nin memory (this is not index)md5='+md5);
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end(""+md5);
		
					
	});				
	******************/				
}


function test245(req, res)
{

	var data=[];
	  req.on('data', function(chunk) {
        data.push(chunk); //data is an array of Buffers
    }).on('end', function() {
        //at this point 
        //we can make a new Buffer of all of them 
        var buffer = Buffer.concat(data);
		logger_console_log(buffer.length);
		
		
		var newpng = createPNGfromBuffer(248,248,buffer);
					
					for(var j=0;j<10;j++)
					{
						for(var i=0;i<10;i++)
						{
							
								
								var idx = newpng.width * j + i << 2;
								
								newpng.data[idx+0] = 0;
								newpng.data[idx+1] = 0;
								newpng.data[idx+2] = 0;
								newpng.data[idx+3] = 255;
								
								
						}
					}
				
					var buffer2 = createBufferfromPNG(newpng);
					
					sendImage( createPNGfromBuffer(248,248,buffer2),res,'\nDuble of Black square send');
							
		
    });
	
	
	
}



function blob_from_server(req, res)
{
	var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("blob_from_server: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
					
		
			var post = qs.parse(body);
			
			
			var md5 =  post['md5'];
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('blob_from_server:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end('blob_from_server:error:  not found obj with this md5:'+md5);
				req.connection.destroy();
				return;
			}
		
			var obj = glob_labirint_memory[ind];
			//logger_console_log(obj);
			var pixelsPro_pg_main_image= get_main_image(obj);
			//logger_console_log("----------------->  "+pixelsPro_pg_main_image);
			if(pixelsPro_pg_main_image==null)
			{
				
					logger_console_log('blob_from_server:error: may be white');
					res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('blob_from_server:error: may be white');
					req.connection.destroy();
					return;
				
			}
		
		logger_console_log('\nIn blob_from_server(...)\nmd5='+md5);
		
		sendImage(pixelsPro_pg_main_image,res,'\nLast version send');
					
	});				
					
}

function get_main_image(obj, w, h)
{
	try{
	var id = obj.glob_pixelsPro_pg_main_image_id;
	
	var buf = get_array_buffer_by_id(id);
	
	var ind = get_index_of_main_image(id);
	if((w!=undefined)&&(h!=undefined)&&(ind!=null))
	{
		global_patterns_objects_array[ind].width=w;
		global_patterns_objects_array[ind].height=h;
	}
	return createPNGfromBuffer(global_patterns_objects_array[ind].width, global_patterns_objects_array[ind].height, buf);
	}
	catch(e)
	{
		logger_console_log('catch err in  get_main_image');
		logger_console_log('id='+ obj.glob_pixelsPro_pg_main_image_id);
		logger_console_log('ind='+get_index_of_main_image(id));
	
		return null;
	}
}

function all_buzy_free(req,res)
{
	 global_buzy_object = null;
}

var global_buzy_object = null;
function is_buzy(pat_id,set_id)
{
	if(global_buzy_object==null) { global_buzy_object = [{ pat_id:pat_id,set_id:set_id,buzy:false }]; return false; }
	else if(global_buzy_object.length==0) { global_buzy_object.push({ pat_id:pat_id,set_id:set_id,buzy:false }); return false; }
	else {
		
		for(var i=0;i<global_buzy_object.length;i++)
		{
			if(global_buzy_object[i].buzy)
			{
				if(global_buzy_object[i].pat_id==pat_id)
				{
					if(global_buzy_object[i].set_id!=set_id) return true;
					
					global_buzy_object[i].buzy=false; //we yesterday buzy this channel and now free it
					
					return false; 
				}
			}
		}
		
		for(var i=0;i<global_buzy_object.length;i++)
		{
			
				if(global_buzy_object[i].pat_id==pat_id)
				{
					if(global_buzy_object[i].set_id==set_id) return false;
					
				}
			
		}
		
		global_buzy_object.push({ pat_id:pat_id,set_id:set_id,buzy:false });
		return false;
	}
}

function clear_buzy(pat_id,set_id)
{
	for(var i=0;i<global_buzy_object.length;i++)
	{
		if(global_buzy_object[i].pat_id==pat_id)
		{
			if(global_buzy_object[i].set_id==set_id) {

				//logger_console_log();
				global_buzy_object[i].buzy=false;
				return;
			
			}
			
		}
	}
}
function show_users(req,res)
{
	var s='<div class="flex_container">';
	for(var i=0;i<glob_labirint_memory.length;i++)
	{
		
		s+='<div>'+glob_labirint_memory[i].id+'</div>'+'<div>Image ID: '+glob_labirint_memory[i].glob_pixelsPro_pg_main_image_id+'</div>';
		
		
	}
	s+='</div>';
	res.writeHead( 200, { 'Content-Type':'text/plain' } );
			res.end(""+s);
}

function show_buzy(req,res)
{
	var s='<div class="flex_container">';
	if(global_buzy_object==null){}
	else
	{
	
	for(var i=0;i<global_buzy_object.length;i++)
	{
		
		s+='<div>'+global_buzy_object[i].pat_id+'</div>'+'<div>'+global_buzy_object[i].set_id+'</div>';
		
		
	}
	}
	s+='</div>';
	
	
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
			res.end(""+s);
		
}

function is_buzzy(req,res)
{		
		
		var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("is_buzzy: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
					
		
			var post = qs.parse(body);
			
			
			var md5 =  post['md5'];
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('is_buzzy:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end('is_buzzy:error:  not found obj with this md5:'+md5);
				req.connection.destroy();
				return;
			}
		
			var obj = glob_labirint_memory[ind];
			var buzy = is_buzy(obj.glob_pixelsPro_pg_main_image_id,obj.id);	

				
			//logger_console_log('\nIn is_buzzy(...)\nmd5='+obj.id+'\nresult='+buzy);
			res.writeHead( 200, { 'Content-Type':'text/plain' } );
			res.end(""+buzy);
		
			
		});
}

function commit_labirints_changes(req, res)
{
		var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("commit_labirints_changes: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			
			logger_console_log("changes start to commit");
		
			var post = qs.parse(body);
			
			
			var md5 =  post['md5'];
			// var rnd= post['rnd_pattern_schema'];
			// logger_console_log('height='+he);
			// var wi= post['width'];
			// logger_console_log('width='+wi);
			// var he= post['height'];
			// logger_console_log('height='+he);
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
					logger_console_log('commit_labirints_changes:error: not found obj with this md5:'+md5);
					
					res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end('commit_labirints_changes:error: not found obj with this md5:'+md5);
				req.connection.destroy();
				return;
					
			}
			
		
			var obj = glob_labirint_memory[ind];
			var nm1 =  post['data_id'];
			logger_console_log('nm1='+nm1);
			// logger_console_log(global_memory[nm1]);
			//now we can to check semaphorus of right access
			if(is_buzy(obj.glob_pixelsPro_pg_main_image_id,obj.id)==false)
			{
					var pixelsPro_pg_main_image= get_main_image(obj);;
					if(pixelsPro_pg_main_image==null)
					{
						
						logger_console_log('commit_labirints_changes:error: may be white');
						glob_labirint_memory.splice(ind,1);
						//init_pixels(req,res);
						
						res.writeHead( 200, { 'Content-Type':'text/plain' } );
						res.end('get_chaosed_labirint:error: may be white');
						
						// req.connection.destroy();
						return;
						
					}
					else
					{
						if(combo_old_main_image_and_changed_main_image(obj.glob_pixelsPro_pg_main_image_id,nm1))
						//if(set_buffer_by_id(obj.glob_pixelsPro_pg_main_image_id,nm1))
						{
							clear_buzy(obj.glob_pixelsPro_pg_main_image_id,obj.id);
							logger_console_log(global_buzy_object);
							logger_console_log("changes commited");
						//	when_commit_labirints_changes();
							res.writeHead( 200, { 'Content-Type':'text/plain' } );
							res.end("changes commited");
						}
						else{
							clear_buzy(obj.glob_pixelsPro_pg_main_image_id,obj.id);
							logger_console_log(global_buzy_object);
							logger_console_log("changes commited. new png is not old png");
						//	when_commit_labirints_changes();
							res.writeHead( 200, { 'Content-Type':'text/plain' } );
							res.end("changes commited. png is white");
							return;
							
						}
					}
			}
			
		});
	
	
	
	
	
}

////////////////////////////////////////////
var glob_labirint_memory=[]; 
var global_patterns_objects_array=[];
////////////////////////////////////////////
function get_index_of_main_image(main_image_id)
{
	for(var i=0;i<global_patterns_objects_array.length;i++)
	{
		var obj = global_patterns_objects_array[i];
		if(obj.white) continue;
		if(obj.id==main_image_id) return i;
		
	}
	return null;
}

function get_array_buffer_by_id(main_image_id)
{
	for(var i=0;i<global_patterns_objects_array.length;i++)
	{
		var obj = global_patterns_objects_array[i];
		if(obj.white) continue;
		if(obj.count<5) 
		{
			
			if(obj.id==main_image_id) return obj.png;
			
			
		}
		
	}
	return null;
}
function createBufferfromPNG(newpng)
{
	
	var buffer = new ArrayBuffer(newpng.width*newpng.height*4);
	var buf8 = new Uint8ClampedArray(buffer);
	
					
		
					for(var j=0;j<newpng.height;j++)
					{
						for(var i=0;i<newpng.width;i++)
						{
							
								
								var idx = newpng.width * j + i << 2;
								
								buffer[idx]=newpng.data[idx+0];
								buffer[idx+1]=newpng.data[idx+1];
								buffer[idx+2]=newpng.data[idx+2];
								buffer[idx+3]=newpng.data[idx+3];
								
								
						}
					}
					
					return buffer;
}

function createPNGfromBuffer(w,h,buffer)
{
	var newpng = new PNG ( {
						
							width: w,
							height: h,
							filterType: 4
					} );
					
		
					for(var j=0;j<newpng.height;j++)
					{
						for(var i=0;i<newpng.width;i++)
						{
							
								
								var idx = newpng.width * j + i << 2;
								
								newpng.data[idx+0] = buffer[idx];
								newpng.data[idx+1] = buffer[idx+1];
								newpng.data[idx+2] = buffer[idx+2];;
								newpng.data[idx+3] = buffer[idx+3];;
								
								
						}
					}
					
					return newpng;
}

function colors_equals(old_png,idx,new_png,idx1)
{
	if(  
			(old_png.data[idx] == new_png.data[idx1]) &&
			(old_png.data[idx+1] == new_png.data[idx1+1]) &&
			(old_png.data[idx+2] == new_png.data[idx1+2]) &&
			(old_png.data[idx+3] == new_png.data[idx1+3])
	)
	{
		return true;
	}
	
	return false;
}

function is_white(old_png,idx)
{
	if(  
			(old_png.data[idx] == 255) &&
			(old_png.data[idx+1] == 255) &&
			(old_png.data[idx+2] == 255) &&
			(old_png.data[idx+3] == 255)
	)
	{
		return true;
	}
	
	return false;
}

function combo_by_white_two_array_buffers(old_ab,new_ab,w,h)
{
	var old_png = createPNGfromBuffer(w,h,old_ab);
	var new_png = createPNGfromBuffer(w,h,new_ab);
	
	if(check_is_white(new_png)==true) return null; 
	
	
	var result_png = new PNG ( {
						
							width: w,
							height: h,
							filterType: 4
					} );
					
		
					for(var j=0;j<result_png.height;j++)
					{
						for(var i=0;i<result_png.width;i++)
						{
							
								
								var idx = result_png.width * j + i << 2;
								// if(colors_equals(old_png,idx,new_png,idx)==false)
								// {
									// if(is_white(old_png,idx))
									// {
										// result_png.data[idx] = old_png.data[idx];
										// result_png.data[idx+1] = old_png.data[idx+1];
										// result_png.data[idx+2] = old_png.data[idx+2];
										// result_png.data[idx+3] = old_png.data[idx+3];
									// }
									// else if(is_white(new_png,idx))
									// {
										// result_png.data[idx] = new_png.data[idx];
										// result_png.data[idx+1] = new_png.data[idx+1];
										// result_png.data[idx+2] = new_png.data[idx+2];
										// result_png.data[idx+3] = new_png.data[idx+3];
									// }
									// else
									// {
										// result_png.data[idx] = 0;
										// result_png.data[idx+1] = 0;
										// result_png.data[idx+2] = 0;
										// result_png.data[idx+3] = 255;
									// }
								// }
								// else
							//	{
									result_png.data[idx] = new_png.data[idx];
									result_png.data[idx+1] = new_png.data[idx+1];
									result_png.data[idx+2] = new_png.data[idx+2];
									result_png.data[idx+3] = new_png.data[idx+3];
							//	}
								
								
						}
					}
					
					return createBufferfromPNG(result_png);
}


function old_combo_by_white_two_array_buffers(old_ab,new_ab,w,h)
{
	var old_png = createPNGfromBuffer(w,h,old_ab);
	var new_png = createPNGfromBuffer(w,h,new_ab);
	
	
	
	var result_png = new PNG ( {
						
							width: w,
							height: h,
							filterType: 4
					} );
					
		
					for(var j=0;j<result_png.height;j++)
					{
						for(var i=0;i<result_png.width;i++)
						{
							
								
								var idx = result_png.width * j + i << 2;
								if(colors_equals(old_png,idx,new_png,idx)==false)
								{
									if(is_white(old_png,idx))
									{
										result_png.data[idx] = old_png.data[idx];
										result_png.data[idx+1] = old_png.data[idx+1];
										result_png.data[idx+2] = old_png.data[idx+2];
										result_png.data[idx+3] = old_png.data[idx+3];
									}
									else if(is_white(new_png,idx))
									{
										result_png.data[idx] = new_png.data[idx];
										result_png.data[idx+1] = new_png.data[idx+1];
										result_png.data[idx+2] = new_png.data[idx+2];
										result_png.data[idx+3] = new_png.data[idx+3];
									}
									else
									{
										result_png.data[idx] = 0;
										result_png.data[idx+1] = 0;
										result_png.data[idx+2] = 0;
										result_png.data[idx+3] = 255;
									}
								}
								else
								{
									result_png.data[idx] = new_png.data[idx];
									result_png.data[idx+1] = new_png.data[idx+1];
									result_png.data[idx+2] = new_png.data[idx+2];
									result_png.data[idx+3] = new_png.data[idx+3];
								}
								
								
						}
					}
					
					return createBufferfromPNG(result_png);
}


function combo_old_main_image_and_changed_main_image(where_png_id,in_memory_id)
{

	for(var i=0;i<global_patterns_objects_array.length;i++)
	{
		var obj = global_patterns_objects_array[i];
		if(obj.white) continue;
			
		if(obj.id==where_png_id) {
			//now we found older main as buffer
			
					var ind=isDataPNGObjectByMD5(in_memory_id);
					if(ind!=null)
					{
			
						obj.png=combo_by_white_two_array_buffers(obj.png,global_memory[ind].png,obj.width,obj.height); //we buffer have here, newest buffer
						if(obj.png==null) {obj.white=true;obj.png=global_memory[ind].png; return null;}
						global_patterns_objects_array[i]=obj;
						
						
						return true;
					}
					else
					{
						logger_console_log("combo_old_main_image_and_changed_main_image:in global_memory not found object with id:"+in_memory_id);
						return false;
					}
			
			}
		
	}
	
	
	return false;
}










function set_buffer_by_id(where_png_id,in_memory_id)
{

	for(var i=0;i<global_patterns_objects_array.length;i++)
	{
		var obj = global_patterns_objects_array[i];
		if(obj.white) continue;
			
		if(obj.id==where_png_id) {
			
			
					var ind=isDataPNGObjectByMD5(in_memory_id);
					if(ind!=null)
					{
						//	obj.width=	 //old value or unknown
						//	obj.height=		//old value or unknown			
						obj.png = global_memory[ind].png; //we buffer have here
						return true;
					}
					else
					{
						logger_console_log("set_buffer_by_id:in global_memory not found object with id:"+in_memory_id);
						return false;
					}
			
			}
		
	}
	
	
	return false;
}


function is_white_old(color2)
{
	var color=[255,255,255,255];
	if(
					(color2[0] == color[0]) &&
					(color2[1] == color[1]) &&
					(color2[2] == color[2]) &&
					(color2[3]== color[3])
					
		) 
			{
				return true;
			}
			return false;

}

function check_is_white(png)
{
	
	var imgData0 = png;
	
	for(var ind=0;ind<imgData0.data.length;ind+=4)
	{
		
		var arr0 = [];
		arr0[0] = imgData0.data[ind];	
		arr0[1] = imgData0.data[ind+1];	
		arr0[2] = imgData0.data[ind+2];
		arr0[3] = imgData0.data[ind+3];	
				
		if(is_white(arr0)==false) return false;
	}
	
	return true;
	
}	
	
function  get_allowed_pattern_id(rnd)
{
	var ind=null;
	for(var i=0;i<global_patterns_objects_array.length;i++)
	{
		var obj = global_patterns_objects_array[i];
		if(obj.white) continue;
		if(obj.count<5)
		{
			ind=i; 
			break;
		}
		
	}
	//////////////
	//splice from global_patterns_objects_array all whole white
	/////////////////
	if(ind==null)
	{
		
		var obj = {};
		obj.id=generate_md5_id();
		obj.count=4;
		obj.white=false;
		//var rnd='number of pattern schema';
		var png = generate_new_pattern(rnd); //new PNG({filterType: 4});
		if(png == null) return null;
		
		obj.width = png.width;
		obj.height = png.height;
		
		obj.png=createBufferfromPNG(png);
		global_patterns_objects_array.push(obj);
		
		return obj.id;
	}
	
	
	return global_patterns_objects_array[ind].id;
	
}






function __execute_script(commands)
{
	logger_console_log('In __execute_script:');
		
	var arr = commands.split(",");
	var res_png=null;
	res_png = new PNG({filterType: 4});
		
	
	for(var i=0;i<arr.length;i++)
	{
		arr[i]=arr[i].trim();
		logger_console_log("executing ["+arr[i]+"]"); 
		
		if(arr[i].indexOf("generate random seed")===0)
		{
			var t = arr[i].replace("generate random seed",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				params=t.split(" ");
				if(params.length>0)
				{
					for(var ii=0;ii<params.length;ii++) params[ii]=Number(params[ii]);
					
				}
				else
				{
					params =[15,3];
				}
			}
			else
			{
				params =[15,3];
			}
			res_png = mod_generate_random_seed.generate_random_seed(params);
			
			
		}
		else if(arr[i]=="median")
		{
			
			res_png = mod_median.__median(res_png);
			
		}
		else if(arr[i].indexOf("magik rotate")===0)
		{
			var t = arr[i].replace("magik rotate",'');
			t=t.trim();
			var params=null;
			if(t.length>0)
			{
				params=Number(t);
				
			}
			else
			{
				params =1;
			}
			res_png = mod_magik_rotate.magik_rotate(res_png,params);
			
		}
		else if(arr[i]=="up")
		{
			res_png = mod_up.upForImageData(res_png);
		}
		else if(arr[i]=="smooth")
		{
			
			res_png = mod_smooth.smooth(res_png);
			
		}
		else if(arr[i]=="rotate plus 45")
		{
			res_png = mod_rotate_ff.rotate_ff(res_png);
		}
		else if(arr[i]=="paint over")
		{
		
			res_png = mod_paint_over.paint_over(res_png);
		
		}
		else if(arr[i]=="nineth")
		{
		
			res_png = mod_nineth.nineth(res_png);
		
		}
		else if(arr[i]=="nonineth")
		{
		
			res_png = mod_nineth.nonineth(res_png);
		
		}
		else if(arr[i]=="maximus")
		{
		
			res_png = mod_maximus.maximus(res_png);
		
		}
		else if(arr[i]=="plus")
		{
			if(res_png.width * 2 > 1200 || res_png.height * 2 > 1200 )
			{
				
				
				return null;
				
			}
			
			res_png = __plus(res_png);
			
			
		}
		
		else if(arr[i]=="mirror right")
		{
			if(res_png.width * 2 > 1200  )
			{
				
				
				return null;
				
			}
			
			res_png = mod_mirror.mirror_right(res_png);
			
			
			
		}
		else if(arr[i]=="mirror down")
		{
			
			if( res_png.height * 2 > 1200 )
			{
				
				
				return null;
				
			}
			
			res_png = mod_mirror.mirror_down(res_png);
			
			
		}
		
		else if(arr[i]=="axes minus")
		{
		
		
		
			res_png = mod_axes.bothAxesMinus(res_png);
		
		
		
		}
		
		
	}
	
	return res_png;
	
}

function generate_new_pattern(num)
{
	if(num==undefined) num=0;
	num = ''+num;
	var regexp = /^\d$/;
	logger_console_log( num.search(regexp) );
	if(num.search(regexp)==-1) num='0';
	// var str = "45"//Я люблю56 JavaScript!"; // будем искать в этой строке
    // var regexp = /^\d$/;
    // logger_console_log( str.search(regexp) ); // -1
	num=Number(''+num);
	
	if(num<0) num=0;
	if(num>4) num = 4;
	var txt=[];
	txt[0] = "generate random seed 9 5, mirror right, mirror down, axes minus, axes minus, mirror right, mirror down, axes minus, plus,median,rotate plus 45,median,plus";
	txt[1] = "generate random seed, mirror right, mirror down, axes minus, plus, plus, plus, plus, median, median,rotate plus 45,median, mirror right, mirror down";
	txt[2] = "generate random seed 9 5, mirror right, mirror down, axes minus, axes minus, mirror right, mirror down, axes minus, plus,median,rotate plus 45,median,plus,plus,plus";
	txt[3] = "generate random seed 9 5, plus, mirror right, mirror down, plus, plus,median,plus";
	txt[4] = "generate random seed 9 5, plus, rotate plus 45, median, rotate plus 45, median";
	console.log("[num]="+num);
	
	return __execute_script(txt[num]);
	
	
}


function pixelsPro_array_equals(color,color2)
{
	for (var i = 0;  i < color.length; i++) 
	{
		if(Number(color[i])!=Number(color2[i])) return false;
		
	}
	return true;
}




function getRndColor()
{
	var r = getRandomInt(0, 256);
	var g = getRandomInt(0, 256);
	var b = getRandomInt(0, 256);
	var a = 255;
	
	return [r,g,b,a];
	
}
/***
function copy_image(oldpng)
{
	//logger_console_log('\nIn copy_image(...)\n');
	
		
	var newpng = new PNG(
	{
		width: oldpng.width,
		height: oldpng.height,
		filterType: 4
	});
	
	for(var i=0;i<newpng.width;i++)
	{
		for(var j=0;j<newpng.height;j++)
		{
			
			var index = newpng.width * j + i << 2;
			
			newpng.data[index] = oldpng.data[index];
			newpng.data[index+1] = oldpng.data[index+1];
			newpng.data[index+2] = oldpng.data[index+2];
			newpng.data[index+3] = oldpng.data[index+3];
			
			
		}
	}	
	
	return newpng;
			
}
***/


function set_xy_labirint(request, response) {
	
	logger_console_log(request.body);
	var md5 =  (''+request.body['md5']).trim();
	
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('set_xy_labirint:error: not found obj with this md5:'+md5);
				response.writeHead( 500, { 'Content-Type':'text/plain' } );
					response.end('set_xy_labirint:error:  not found obj with this md5:'+md5);
					request.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];
			var x =  Number(request.body['x']);
		//	console.log("in setxy x="+x);
			var y =  Number(request.body['y']);
			obj.glob_pixelsPro_x_left_top=x;
			obj.glob_pixelsPro_y_left_top=y;
			glob_labirint_memory[ind]=obj;
			
	response.writeHead(200, {  'Content-Type': 'text/html' } );
	response.end('{"x":'+obj.glob_pixelsPro_x_left_top+',"y":'+obj.glob_pixelsPro_y_left_top+',"nn":'+obj.glob_pixelsPro_pg_pixels_scale+'}');
}



function get_xy_labirint(request, response) {
	
	logger_console_log(request.body);
	var md5 =  (''+request.body['md5']).trim();
	
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('get_xy_labirint:error: not found obj with this md5:'+md5);
				response.writeHead( 500, { 'Content-Type':'text/plain' } );
					response.end('get_xy_labirint:error:  not found obj with this md5:'+md5);
					request.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];
	
	response.writeHead(200, {  'Content-Type': 'text/html' } );
	response.end('{"x":'+obj.glob_pixelsPro_x_left_top+',"y":'+obj.glob_pixelsPro_y_left_top+',"nn":'+obj.glob_pixelsPro_pg_pixels_scale+'}');
}





function get_array_of_all_generated_stones(request, response) {

logger_console_log(request.body);
	//var md5 =  post['md5'];
	var md5 =  (''+request.body['md5']).trim();
	
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('get_array_of_all_generated_stones:error: not found obj with this md5:'+md5);
				response.writeHead( 500, { 'Content-Type':'text/plain' } );
					response.end('get_array_of_all_generated_stones:error:  not found obj with this md5:'+md5);
					request.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];

	response.writeHead(200, {  'Content-Type': 'text/html' } );
	var res=JSON.stringify(obj.global_inside_stones);
	response.end(res);
}

function get_chaosed_labirint(req, res)
{
	
	logger_console_log('\nIn get_chaosed_labirint(...)\n');
	logger_console_log(req.body);
		//var md5 =  post['md5'];
		var md5 =  (''+req.body['md5']).trim();
		
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('get_chaosed_labirint:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('get_chaosed_labirint:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];
	
	var pixelsPro_pg_main_image= get_main_image(obj);
			if(pixelsPro_pg_main_image==null)
			{
				
				//logger_console_log('get_chaosed_labirint:error: may be white\n'+JSON.stringify(obj);
				glob_labirint_memory.splice(ind,1); 
				init_pixels(req,res);
			//	res.writeHead( 500, { 'Content-Type':'text/plain' } );
			//		res.end('get_chaosed_labirint:error: may be white');
			//		req.connection.destroy();
					return;
				
			}
	obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
	pixelsPro_pg_main_image = setChaosPixels(obj);
				
	sendImage(obj.copy_image(pixelsPro_pg_main_image), res, '\n get_chaosed_labirint ok\n');	
}

// function init_boh_pixels(req, res)
// {
	// logger_console_log('\nIn init_boh_pixels(...)\n');
	
		// if(glob_pixelsPro_pg_main_image==null)
		// {
			
			
		// }
		// else
		// {
			
			
			// var newpng = new PNG(
			// {
				// width: glob_pixelsPro_pg_main_image.width,
				// height: glob_pixelsPro_pg_main_image.height,
				// filterType: 4
			// });
			
			// for(var i=0;i<glob_pixelsPro_pg_main_image.width;i++)
			// {
				// for(var j=0;j<glob_pixelsPro_pg_main_image.height;j++)
				// {
					
					// var index2 = glob_pixelsPro_pg_main_image.width * j + i << 2;
					
					// newpng.data[index2+0] = 127;
					// newpng.data[index2+1] = 127;
					// newpng.data[index2+2] = 127;
					// newpng.data[index2+3] = 255;
					
					
				// }
			// }	
			// global_karman_stones=[];
			// global_inside_stones=[];
			// var w = glob_pixelsPro_pg_main_image.width;
			// var h = glob_pixelsPro_pg_main_image.height;
			// var n=glob_num_of_strawbery;
			// for(var i=0;i<n;i++)
			// {
				// var rx = getRandomInt(0, w);
				// var ry = getRandomInt(0, h);
				// var rgba = getRndColor();
				// var ind = ry*w + rx << 2;
				// newpng.data[ind] = rgba[0];
				// newpng.data[ind+1] = rgba[1];
				// newpng.data[ind+2] = rgba[2];
				// newpng.data[ind+3] = rgba[3];
				// if(stone_in_array(rx,ry,rgba)==false)
				// addStone(rx,ry,cloneColor(rgba),global_inside_stones);
			// }
	
		
		// }
		
		// glob_pixelsPro_pg_boh_image = newpng;
		
		// /***
		// var x=glob_pixelsPro_x_left_top;
		// var y=glob_pixelsPro_y_left_top;
		
		// var index = glob_pixelsPro_pg_main_image.width * (y) + (x) << 2;
				// var color = [
					// glob_pixelsPro_pg_main_image.data[index],
					// glob_pixelsPro_pg_main_image.data[index+1],
					// glob_pixelsPro_pg_main_image.data[index+2],
					// glob_pixelsPro_pg_main_image.data[index+3]
				// ];
				// glob_pixelsPro_pg_main_color=color;
		// // res.writeHead( 200, { 'Content-Type':'text/plain' } );
		// // res.end("ok");
		// sendImage(glob_pixelsPro_pg_main_image,res,'\nLabirint initiation success\n');
		// ***/
		
				
					
// }

function add_boh_pixel(req, res)
{
	logger_console_log('\nIn add_boh_pixel(...)\n');
	
		
			
			
			var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("add_boh_pixel: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			
			
		
			var post = qs.parse(body);
			
			
			var md5 =  post['md5'];
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('add_boh_pixel:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('add_boh_pixel:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];
			
		
			var x =  +post['x'];
			var y =  +post['y'];
			var nx=6;
			var ny=6;
			logger_console_log("x="+x);
			logger_console_log("y="+y);
			//obj.glob_pixelsPro_x_left_top=x;
			//obj.glob_pixelsPro_y_left_top=y;
			 // +post['scale_koeficient'];
			var nn = obj.glob_pixelsPro_pg_pixels_scale;//=nn;
			obj.glob_num_of_strawbery =  +post['num_of_strawbery'];
			
			
			
			var pixelsPro_pg_main_image= get_main_image(obj);
			if(pixelsPro_pg_main_image==null)
			{
				logger_console_log('add_boh_pixel:error: may be white');
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('add_boh_pixel:error: may be white');
					req.connection.destroy();
					return;
			}
			obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
			
			
			var newpng = new PNG(
			{
				width: pixelsPro_pg_main_image.width,
				height: pixelsPro_pg_main_image.height,
				filterType: 4
			});
			
			for(var i=0;i<pixelsPro_pg_main_image.width;i++)
			{
				for(var j=0;j<pixelsPro_pg_main_image.height;j++)
				{
					
					var index2 = pixelsPro_pg_main_image.width * j + i << 2;
					
					newpng.data[index2+0] = 127;
					newpng.data[index2+1] = 127;
					newpng.data[index2+2] = 127;
					newpng.data[index2+3] = 255;
					
					
				}
			}	
			//global_karman_stones=[];
			//global_inside_stones=[];
			var w = pixelsPro_pg_main_image.width;
			var h = pixelsPro_pg_main_image.height;
			var n=obj.glob_num_of_strawbery;
			
			var rgba = getRndColor();
				var ind = (y)*w + x << 2;
				newpng.data[ind] = rgba[0];
				newpng.data[ind+1] = rgba[1];
				newpng.data[ind+2] = rgba[2];
				newpng.data[ind+3] = rgba[3];
				if(stone_in_array(obj,x,y,rgba)==false)
				addStone(obj,x,y,cloneColor(rgba),obj.global_inside_stones);
			
			
			
			/***
			
			
			
			for(var i=1;i<n;i++)
			{
				var kx = getRandomInt(0, 2);
				var ky = getRandomInt(0, 2);
				if(kx==0)kx=-1;
				if(ky==0)ky=-1;
				var rx = getRandomInt(2, nx)*kx+x;
				var ry = getRandomInt(2, ny)*ky+y;
				var rgba = getRndColor();
				var ind = ry*w + rx << 2;
				newpng.data[ind] = rgba[0];
				newpng.data[ind+1] = rgba[1];
				newpng.data[ind+2] = rgba[2];
				newpng.data[ind+3] = rgba[3];
				if(stone_in_array(obj,rx,ry,rgba)==false)
				addStone(obj,rx,ry,cloneColor(rgba),obj.global_inside_stones);
			}
			
			***/
	
			obj.glob_pixelsPro_pg_boh_image = newpng;
		
		
			pixelsPro_pg_main_image = setChaosPixels(obj);
				
			var result_png = pixelsPro_redrawPixels_main(obj,x,y,pixelsPro_pg_main_image);
								
			sendImage(result_png, res, '\nLabirint initiation step 2 success\n');	
			
			
			
			
			
			
			
		});
			
			
			
		
		
		
		/***
		var x=glob_pixelsPro_x_left_top;
		var y=glob_pixelsPro_y_left_top;
		
		var index = glob_pixelsPro_pg_main_image.width * (y) + (x) << 2;
				var color = [
					glob_pixelsPro_pg_main_image.data[index],
					glob_pixelsPro_pg_main_image.data[index+1],
					glob_pixelsPro_pg_main_image.data[index+2],
					glob_pixelsPro_pg_main_image.data[index+3]
				];
				glob_pixelsPro_pg_main_color=color;
		// res.writeHead( 200, { 'Content-Type':'text/plain' } );
		// res.end("ok");
		sendImage(glob_pixelsPro_pg_main_image,res,'\nLabirint initiation success\n');
		***/
		
				
					
}


function take_stone(req, res)
{
		logger_console_log('\nIn take_stone(...)\n');
		
		var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("take_stone: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			
			
		
			var post = qs.parse(body);
			
			
			var md5 =  post['md5'];
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('take_stone:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('take_stone:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
		
		
			var obj = glob_labirint_memory[ind];
			
			

			console.log('x='+post['x']);
			console.log('y='+post['y']);
			console.log('color='+post['color']);
			
			take_chaos(obj,post['x'],post['y'],post['color']);	
		
			
			
			
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end('new stone taken');
			
			
			
			
		});	
			
}


function clear_stones(req, res)
{
		logger_console_log('\nIn clear_stones(...)\n');
		
		var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("clear_stones: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			
			
		
			var post = qs.parse(body);
			
			
			var md5 =  post['md5'];
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('clear_stones:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('clear_stones:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];
			
			if(obj.global_inside_stones.length==0)
			{logger_console_log('\nIn clear_stones(...)');
				obj.number_of_collected_stones=obj.global_karman_stones.length;
				obj.global_karman_stones=[];
				obj.global_inside_stones=[];
				glob_labirint_memory[ind]=obj;
			}
			
			
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end('counted');
			
			
			
			
		});	
			
}




function stone_in_array(obj,rx,ry,rgba)
{
	for(var n=0;n<obj.global_inside_stones.length;n++)
	{
		
		var i=obj.global_inside_stones[n].x;
		var j=obj.global_inside_stones[n].y;
		var c=obj.global_inside_stones[n].color;
		if((i==rx)&&(j==ry))
		{
			
			if(pixelsPro_array_equals(c,rgba))return true;
		}
	}
		return false;		
}



			
function pixelsPro_getNeighborsColorsAllArray(obj,x,y,pixelsPro_pg_main_image)
{
	var x0=x-1;
	var x1=x+1;
	var y0=y-1;
	var y1=y+1;
	var colors=[];
	//if(color==undefined)colors.push(color);
	
	
		var index = pixelsPro_pg_main_image.width * (y) + (x0) << 2;
				color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];
				
				
	 colors.push(color);
				
				index = pixelsPro_pg_main_image.width * (y) + (x1) << 2;
				color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];

				colors.push(color);
				
				index = pixelsPro_pg_main_image.width * (y0) + (x) << 2;
				color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];
				
	 colors.push(color);
				
				index = pixelsPro_pg_main_image.width * (y1) + (x) << 2;
				var color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];
				
		 colors.push(color);
				
				//color=glob_pixelsPro_pg_main_color;
				
				var grey_color = [127,127,127,255];
				
				for(var i=0;i<colors.length;i++)
				{
					// if((colors[i][0]==color[0])&&(colors[i][1]==color[1])&&(colors[i][2]==color[2])&&(colors[i][3]==color[3]))
					// {
						
						// colors.splice(i,1);
						// break;
						
					// }
					
					if(pixelsPro_array_equals(colors[i],grey_color)) colors.splice(i,1);
				}
				
				return colors;
	
}



			
function pixelsPro_getNeighborsColors(obj,x,y,color,pixelsPro_pg_main_image)
{
	var x0=x-1;
	var x1=x+1;
	var y0=y-1;
	var y1=y+1;
	var colors=[];
	//if(color==undefined)colors.push(color);
	
	
		var index = pixelsPro_pg_main_image.width * (y) + (x0) << 2;
				color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];
				
				
	var f=false;
	for(var i=0;i<colors.length;i++)
	{
		if((colors[i][0]==color[0])&&(colors[i][1]==color[1])&&(colors[i][2]==color[2])&&(colors[i][3]==color[3]))
		{
			f=true;
			break;
		}
	}
	if(f==false) colors.push(color);
				
				index = pixelsPro_pg_main_image.width * (y) + (x1) << 2;
				color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];
				
				f=false;
	for(var i=0;i<colors.length;i++)
	{
		if((colors[i][0]==color[0])&&(colors[i][1]==color[1])&&(colors[i][2]==color[2])&&(colors[i][3]==color[3]))
		{
			f=true;
			break;
		}
	}
	if(f==false) colors.push(color);
				
				index = pixelsPro_pg_main_image.width * (y0) + (x) << 2;
				color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];
				
				f=false;
				for(var i=0;i<colors.length;i++)
				{
					if((colors[i][0]==color[0])&&(colors[i][1]==color[1])&&(colors[i][2]==color[2])&&(colors[i][3]==color[3]))
					{
						f=true;
						break;
					}
				}
				if(f==false) colors.push(color);
				
				index = pixelsPro_pg_main_image.width * (y1) + (x) << 2;
				var color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];
				
				f=false;
				for(var i=0;i<colors.length;i++)
				{
					if((colors[i][0]==color[0])&&(colors[i][1]==color[1])&&(colors[i][2]==color[2])&&(colors[i][3]==color[3]))
					{
						f=true;
						break;
					}
				}
				if(f==false) colors.push(color);
				
				//color=glob_pixelsPro_pg_main_color;
				
				var grey_color = [127,127,127,255];
				
				for(var i=0;i<colors.length;i++)
				{
					// if((colors[i][0]==color[0])&&(colors[i][1]==color[1])&&(colors[i][2]==color[2])&&(colors[i][3]==color[3]))
					// {
						
						// colors.splice(i,1);
						// break;
						
					// }
					
					if(pixelsPro_array_equals(colors[i],grey_color)) colors.splice(i,1);
				}
				
				return colors;
	
}

// function define_color_for_pass(x,y,color)
// {
	// var colors = pixelsPro_getNeighborsColors(x,y,color);
	// if(colors.length==0) return [];
	// return colors[getRandomInt(0,colors.length)];
// }

// function get_color_for_pass(req, res)
// {
	// if(glob_pixelsPro_color_for_pass.length==0) result_text='255,255,255,255';
	// else result_text=glob_pixelsPro_color_for_pass.join(",");
	// sendText(result_text, res, 'get_color_for_pass');
// }

function getIndexObjectByMD5(md5)
{
	
	for(var i=0;i<glob_labirint_memory.length;i++)
	{
		
		if(glob_labirint_memory[i].id===md5)
		{
			
			return i;
		}
	  
	}
	return null;
	
}

function generate_md5_id()
{
	
	var d = new Date();
	var ms = d.getTime();
	var s = '';
	var arr = ['a','b','c','d','e','f','g','h','i','j','K','L','M','N','O','P',')','[',']',')','0','4','7'];
	for(var i=0;i<16;i++)
	{
		var rnd=Math.floor(Math.random() * (arr.length - 0)) + 0;
		
		s += arr[rnd];
	}
	return get_md5_hex(''+s+''+ms);
	
}

function init_pixels(req, res)
{
	logger_console_log('\nIn init_pixels(...)\n');
	
	
	var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("init_pixels: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
				
			var post = qs.parse(body);
			var md5 =  post['md5'];
			var rnd =  post['rnd_pattern_schema'];
			
			logger_console_log('rnd='+rnd);
			if(rnd==undefined) rnd=0;
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
		//	console.log('in init_pixels md5='+md5);
	/////////////////////////////////////////
	//create_glob_labirint_memory_object();
	/////////////////////////////////////////
	logger_console_log('create_glob_labirint_memory_obj');
	var obj = {};
	obj.id = generate_md5_id();
	obj.glob_pixelsPro_x_left_top = 0;
	obj.glob_pixelsPro_y_left_top = 0;
	obj.glob_pixelsPro_point = null;
	obj.glob_pixelsPro_collected = [];
	obj.glob_pixelsPro_pg_main_color = null;
	obj.glob_pixelsPro_showing_scale_div = false;
	obj.glob_pixelsPro_scale_div = null;
	obj.global_karman_stones=[];
	obj.global_inside_stones=[];
	obj.number_of_collected_stones=0;
	obj.glob_pixelsPro_errorMessage='none';
	obj.glob_pixelsPro_pg_boh_image = null;
	obj.glob_pixelsPro_pg_map_image = null;
	obj.glob_pixelsPro_pg_pixels_scale = 2;
	
	obj.copy_image = function(oldpng)
	{
		//logger_console_log('\nIn copy_image(...)\n');
	
		
		var newpng = new PNG(
		{
			width: oldpng.width,
			height: oldpng.height,
			filterType: 4
		});
		
		for(var i=0;i<newpng.width;i++)
		{
			for(var j=0;j<newpng.height;j++)
			{
				
				var index = newpng.width * j + i << 2;
				
				newpng.data[index] = oldpng.data[index];
				newpng.data[index+1] = oldpng.data[index+1];
				newpng.data[index+2] = oldpng.data[index+2];
				newpng.data[index+3] = oldpng.data[index+3];
				
				
			}
		}	
		
		return newpng;
			

	}
	
	obj.glob_pixelsPro_pg_main_image_id = get_allowed_pattern_id(rnd);
	logger_console_log('init_pixels:obj.glob_pixelsPro_pg_main_image_id ='+obj.glob_pixelsPro_pg_main_image_id );	
	if(obj.glob_pixelsPro_pg_main_image_id==null)
	{
		res.writeHead( 500, { 'Content-Type':'text/plain' } );
		res.end("init_pixels: error: something wrong");
		req.connection.destroy();
		return;	
	}
	
	var pixelsPro_pg_main_image = get_main_image(obj);
	if(pixelsPro_pg_main_image==null)
			{
				logger_console_log('init_pixels:error: may be white');
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('init_pixels:error: may be white');
					req.connection.destroy();
					return;
			}
	obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
	//req.pipe(obj.glob_pixelsPro_pg_main_image).on( 'parsed', function()  {
		
	
		var x=obj.glob_pixelsPro_x_left_top;
		var y=obj.glob_pixelsPro_y_left_top;
		
		var index = pixelsPro_pg_main_image.width * (y) + (x) << 2;
				var color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];
				obj.glob_pixelsPro_pg_main_color=color;
				
				obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
				
				obj.glob_pixelsPro_x_left_top = 0;
				obj.glob_pixelsPro_y_left_top = pixelsPro_pg_main_image.height-1;
				
				
				glob_labirint_memory.push(obj);
				
				ind = getIndexObjectByMD5(obj.id);		
			
				//obj.glob_pixelsPro_color_for_pass = obj.define_color_for_pass(x,y,color);
	
				
		}
			
		
				var obj = glob_labirint_memory[ind];
				
						
				res.writeHead( 200, { 'Content-Type':'text/plain' } );
				res.end(""+obj.id);	
						
				return;
			
		});
		
	
}

function get_labirint_settings(req, res)
{
	
	var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("init_labirint_settings: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			
			
		
			var post = qs.parse(body);
			
		var md5 =  post['md5'];
		var ind = getIndexObjectByMD5(md5);
		if(ind==null)
		{
			logger_console_log('get_labirint_settings:error: not found obj with this md5:'+md5);
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end('get_labirint_settings:error:  not found obj with this md5:'+md5);
				req.connection.destroy();
				return;
		}
	
		var obj = glob_labirint_memory[ind];
		
		
		var pixelsPro_pg_main_image= get_main_image(obj);
		if(pixelsPro_pg_main_image==null)
		{
			logger_console_log('get_labirint_settings:error: not found labirint with this md5:'+md5);
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end('get_labirint_settings:error: not found labirint with this md5:'+md5);
			req.connection.destroy();
			return;
			
		}
		obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
		
			// var x =  +post['x'];
			// var y =  +post['y'];
			
			// logger_console_log("x="+x);
			// logger_console_log("y="+y);
			// obj.glob_pixelsPro_x_left_top=x;
			// obj.glob_pixelsPro_y_left_top=y;
			var nn =  +post['scale_koeficient'];
			obj.glob_pixelsPro_pg_pixels_scale = nn;
			obj.glob_num_of_strawbery =  +post['num_of_strawbery'];
				
				var newpng = new PNG(
			{
				width: pixelsPro_pg_main_image.width,
				height: pixelsPro_pg_main_image.height,
				filterType: 4
			});
			
			for(var i=0;i<pixelsPro_pg_main_image.width;i++)
			{
				for(var j=0;j<pixelsPro_pg_main_image.height;j++)
				{
					
					var index2 = pixelsPro_pg_main_image.width * j + i << 2;
					
					newpng.data[index2+0] = 127;
					newpng.data[index2+1] = 127;
					newpng.data[index2+2] = 127;
					newpng.data[index2+3] = 255;
					
					
				}
			}	
			obj.global_karman_stones=[];
			obj.global_inside_stones=[];
			var w = pixelsPro_pg_main_image.width;
			var h = pixelsPro_pg_main_image.height;
			var n=obj.glob_num_of_strawbery;
			for(var i=0;i<n;i++)
			{
				var rx = getRandomInt(0, w);
				var ry = getRandomInt(0, h);
				var rgba = getRndColor();
				var ind = ry*w + rx << 2;
				newpng.data[ind] = rgba[0];
				newpng.data[ind+1] = rgba[1];
				newpng.data[ind+2] = rgba[2];
				newpng.data[ind+3] = rgba[3];
				if(stone_in_array(obj,rx,ry,rgba)==false)
				addStone(obj,rx,ry,cloneColor(rgba),obj.global_inside_stones);
			}
	
		
	
		
		obj.glob_pixelsPro_pg_boh_image = newpng;
	
			pixelsPro_pg_main_image = setChaosPixels(obj);
				
			var result_png = pixelsPro_redrawPixels_main(obj,x,y,pixelsPro_pg_main_image);
								
			sendImage(result_png, res, '\ngetting Labirint ok\n');	
			
			
			
			
		});
		
	
					
}

function init_labirint_settings(req, res)
{
	
	var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("init_labirint_settings: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			
			
		
			var post = qs.parse(body);
			
		var md5 =  post['md5'];
		var ind = getIndexObjectByMD5(md5);
		if(ind==null)
		{
			logger_console_log('init_labirint_settings:error: not found obj with this md5:'+md5);
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end('init_labirint_settings:error:  not found obj with this md5:'+md5);
				req.connection.destroy();
				return;
		}
	
		var obj = glob_labirint_memory[ind];
		
		
		var pixelsPro_pg_main_image= get_main_image(obj);
		if(pixelsPro_pg_main_image==null)
		{
			logger_console_log('init_labirint_settings:error: not found labirint with this md5:'+md5);
			res.writeHead( 500, { 'Content-Type':'text/plain' } );
			res.end('init_labirint_settings:error: not found labirint with this md5:'+md5);
			req.connection.destroy();
			return;
			
		}
		obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
		
			var x =  +post['x'];
			var y =  +post['y'];
			
			logger_console_log("x="+x);
			logger_console_log("y="+y);
			obj.glob_pixelsPro_x_left_top=x;
			obj.glob_pixelsPro_y_left_top=y;
			var nn =  +post['scale_koeficient'];
			obj.glob_pixelsPro_pg_pixels_scale = nn;
			obj.glob_num_of_strawbery =  +post['num_of_strawbery'];
				
				var newpng = new PNG(
			{
				width: pixelsPro_pg_main_image.width,
				height: pixelsPro_pg_main_image.height,
				filterType: 4
			});
			
			for(var i=0;i<pixelsPro_pg_main_image.width;i++)
			{
				for(var j=0;j<pixelsPro_pg_main_image.height;j++)
				{
					
					var index2 = pixelsPro_pg_main_image.width * j + i << 2;
					
					newpng.data[index2+0] = 127;
					newpng.data[index2+1] = 127;
					newpng.data[index2+2] = 127;
					newpng.data[index2+3] = 255;
					
					
				}
			}	
			obj.global_karman_stones=[];
			obj.global_inside_stones=[];
			var w = pixelsPro_pg_main_image.width;
			var h = pixelsPro_pg_main_image.height;
			var n=obj.glob_num_of_strawbery;
			for(var i=0;i<n;i++)
			{
				var rx = getRandomInt(0, w);
				var ry = getRandomInt(0, h);
				var rgba = getRndColor();
				var ind = ry*w + rx << 2;
				newpng.data[ind] = rgba[0];
				newpng.data[ind+1] = rgba[1];
				newpng.data[ind+2] = rgba[2];
				newpng.data[ind+3] = rgba[3];
				if(stone_in_array(obj,rx,ry,rgba)==false)
				addStone(obj,rx,ry,cloneColor(rgba),obj.global_inside_stones);
			}
	
		
	
		
		obj.glob_pixelsPro_pg_boh_image = newpng;
	
			pixelsPro_pg_main_image = setChaosPixels(obj);
				
			var result_png = pixelsPro_redrawPixels_main(obj,x,y,pixelsPro_pg_main_image);
								
			sendImage(result_png, res, '\nLabirint initiation step 2 success\n');	
			
			
			
			
		});
		
	
					
}


function setChaosPixels(obj)
{
		
	var copy_map_image = obj.copy_image(obj.glob_pixelsPro_pg_map_image);
	
	
		
					for(var n=0;n<obj.global_inside_stones.length;n++)
					{
						
						var i=obj.global_inside_stones[n].x;
						var j=obj.global_inside_stones[n].y;
							
						var index = copy_map_image.width * j + i << 2;
						
						copy_map_image.data[index] = obj.global_inside_stones[n].color[0];
						copy_map_image.data[index+1] = obj.global_inside_stones[n].color[1];
						copy_map_image.data[index+2] = obj.global_inside_stones[n].color[2];
						copy_map_image.data[index+3] = obj.global_inside_stones[n].color[3];
						
					
				}
				
			
			return copy_map_image;
}


function get_error_message(req,res)	
{			

var md5 =  (''+req.body['md5']).trim();
		
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('get_error_message:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('get_error_message:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];


					
		logger_console_log("\nIn get_error_message: "+obj.glob_pixelsPro_errorMessage);
		res.writeHead( 200, { 'Content-Type':'text/plain' } );
		res.end(""+obj.glob_pixelsPro_errorMessage);
		req.connection.destroy();
		obj.glob_pixelsPro_errorMessage='none';		
}

function get_qty_neighbours(req,res)	
{
		logger_console_log("\nIn get_qty_neighbours: ");
		
		var body = '';

			req.on('data', function (data) {
				
				//logger_console_log("when req.on data");
				
				body += data;

				// Too much POST data, kill the connection!
				// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
				if (body.length > 99)
				{
					res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end("get_qty_neighbours: error: data.length > 99 too big");
					req.connection.destroy();
					return;
				}
				
			});

			req.on('end', function () {
				
				
				
				
				var post = qs.parse(body);
				var md5 = post['md5'];
				//var md5 =  (''+req.body['md5']).trim();
		
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('get_qty_neighbours:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('get_qty_neighbours:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];
				
			var pixelsPro_pg_main_image= get_main_image(obj);
			if(pixelsPro_pg_main_image==null)
			{
				logger_console_log('get_qty_neighbours:error: may be white');
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('get_qty_neighbours:error: may be white');
					req.connection.destroy();
					return;
			}
			obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);	
				
				logger_console_log(post);
				
				var x =  +post['x'];
				var y =  +post['y'];
				
				
				
				logger_console_log('Before: \n'+pixelsPro_pg_main_image.width);
				
				pixelsPro_pg_main_image = setChaosPixels(obj);
				logger_console_log('After: \n'+pixelsPro_pg_main_image.width);
				logger_console_log('-=7878=-');
				
				var arr = pixelsPro_getNeighborsColorsAllArray(obj,x,y,pixelsPro_pg_main_image);
				logger_console_log("arr.length="+arr.length);
				
				res.writeHead(200, {  'Content-Type': 'text/html' } );
				var res0=JSON.stringify(arr);
				res.end(res0);
				
				req.connection.destroy();
				
				
			});
				
	
}

function pixels(req,res)	
{								
		logger_console_log("\nIn pixels");
		
		
		var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("pixels: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			
			
			
			var post = qs.parse(body);
			
			
			var md5 = post['md5'];
			//var md5 =  (''+req.body['md5']).trim();
		
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('pixels:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('pixels:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];
			
			var pixelsPro_pg_main_image= get_main_image(obj);
				if(pixelsPro_pg_main_image==null)
				{
					
					logger_console_log('pixels:error: may be white');
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('pixels:error: may be white');
					req.connection.destroy();
					return;
					
				}
	obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
			
			
			
			logger_console_log(post);
			
			var x =  +post['x'];
			var y =  +post['y'];
			
			
			
			pixelsPro_pg_main_image = setChaosPixels(obj);
			logger_console_log('-=7878=-');
			
			
			
			if( is_color_ishodn(obj,pixelsPro_getColorArrayFromImageData(obj,x,y,pixelsPro_pg_main_image))==false)
			{
				logger_console_log('-=7979=-');
				var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
				
				obj.glob_pixelsPro_errorMessage='1. labirint not ok';
				sendImage(result_png, res, '\n1. labirint not ok\n');	
				
				return;
			}
			
			else if(x<0||x>=pixelsPro_pg_main_image.width) {
				
				var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
				
				obj.glob_pixelsPro_errorMessage='2. labirint not ok';
				sendImage(result_png, res, '\n2. labirint not ok\n');	
				
				return;
				
			}
			else if(y<0||y>=pixelsPro_pg_main_image.height) {
				
				var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
			obj.glob_pixelsPro_errorMessage='3. labirint not ok';
				sendImage(result_png, res, '\n3. labirint not ok\n');	
				
				return;
			}
			
			
			
			
			
			var color_prev = pixelsPro_getColorArrayFromImageData(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
				var color = pixelsPro_getColorArrayFromImageData(obj,x,y,pixelsPro_pg_main_image);
				if(pixelsPro_array_equals(color_prev,color)==false)
				{
					logger_console_log('-=791791=-');
					
					
					
					if(left(obj,x,y,pixelsPro_pg_main_image)||right(obj,x,y,pixelsPro_pg_main_image)||floor(obj,x,y,pixelsPro_pg_main_image))
					{
						logger_console_log('-=79999=-');
						if(stone_neighbours_of(obj,x,y)==0)
						{
							logger_console_log('-=7988889=-');
							var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
					obj.glob_pixelsPro_errorMessage='6.1.27 stone_neighbours_of not ok';
								sendImage(result_png, res, '\n6.1.27 stone_neighbours_of not ok\n');	
							
							return;
						}
						else{
						
						logger_console_log('-=7988fmhfvuff889=-');
						obj.glob_pixelsPro_x_left_top = x;
						obj.glob_pixelsPro_y_left_top = y;
						 
					
						obj.glob_pixelsPro_pg_main_color = color;
						
						pixelsPro_pg_main_image = setChaosPixels(obj);
			
						var result_png = pixelsPro_redrawPixels_main(obj,x,y,pixelsPro_pg_main_image);
					obj.glob_pixelsPro_errorMessage='6.1.255. labirint ok';
						sendImage(result_png, res, '\n6.1.255. labirint ok\n');	
						
						}
						
					}
					else
					{
					
						
								var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
					obj.glob_pixelsPro_errorMessage='6.1.25 labirint not ok';
								sendImage(result_png, res, '\n6.1.25 labirint not ok\n');	
					}
								
					
					return;
				}
			
			
			
			
			
			
			
			
			
			
			if((Math.abs(x-obj.glob_pixelsPro_x_left_top)>1)||(Math.abs(y-obj.glob_pixelsPro_y_left_top)>1)){
				
				// if(xy_is_near_karman_points(x,y)==false)
			
				
					if(left(obj,x,y,pixelsPro_pg_main_image)||right(obj,x,y,pixelsPro_pg_main_image)||floor(obj,x,y,pixelsPro_pg_main_image))
					{
						
						
						var color_prev = pixelsPro_getColorArrayFromImageData(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
						var color = pixelsPro_getColorArrayFromImageData(obj,x,y,pixelsPro_pg_main_image);
						if(pixelsPro_array_equals(color_prev,color)==false)
						{
						
							
							var neh = pixelsPro_getNeighborsColors(obj,x,y,color,pixelsPro_pg_main_image);
							logger_console_log("neh.length="+neh.length);
							var f=false;
							for(var inh=0;inh<neh.length;inh++)
							{
								for(var in2=0;in2<obj.global_inside_stones.length;in2++)
								{
									if(pixelsPro_array_equals(obj.global_inside_stones[in2].color,neh[inh])==true) {f=true;break;}
								}
								if(f)break;
							}
							
							if(f==false)
							{
								var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
					obj.glob_pixelsPro_errorMessage='6.1.23 labirint not ok';
								sendImage(result_png, res, '\n6.1.23 labirint not ok\n');	
								
								return;
							}
							
							
						
						}
						else{
							
							
							
							
							
								
						obj.glob_pixelsPro_x_left_top = x;
						obj.glob_pixelsPro_y_left_top = y;
						 
						var color =  pixelsPro_getColorArrayFromImageData(obj,x,y,pixelsPro_pg_main_image);
						obj.glob_pixelsPro_pg_main_color = color;
			
						logger_console_log("testing 8888.000");	

						
			
						pixelsPro_pg_main_image = setChaosPixels(obj);
						
						logger_console_log("testing 8888.222");
						
						var result_png = pixelsPro_redrawPixels_main(obj,x,y,pixelsPro_pg_main_image);
						
						logger_console_log("testing 8888.111");
						//obj.glob_pixelsPro_color_for_pass = define_color_for_pass(x,y,color);
				//		logger_console_log("testing 222 "+glob_pixelsPro_color_for_pass);
				logger_console_log("testing 8888.77777");
				obj.glob_pixelsPro_errorMessage='5. labirint ok';
						sendImage(result_png, res, '\n5. labirint ok\n');
							
							
							
						}
									
					
					}
					else
					{
						//var result_png = pixelsPro_redrawPixels_main(glob_pixelsPro_x_left_top,glob_pixelsPro_y_left_top);
						var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
						obj.glob_pixelsPro_errorMessage='6. labirint not ok';
						sendImage(result_png, res, '\n6. labirint not ok\n');	
					}
					return;
				}
				
			
				
				

					if(left(obj,x,y,pixelsPro_pg_main_image)||right(obj,x,y,pixelsPro_pg_main_image)||floor(obj,x,y,pixelsPro_pg_main_image))
					{
						
						
						
							
			var color_prev = pixelsPro_getColorArrayFromImageData(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
				var color = pixelsPro_getColorArrayFromImageData(obj,x,y,pixelsPro_pg_main_image);
				if(pixelsPro_array_equals(color_prev,color)==false)
				{
					
					
					
					
					var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
			obj.glob_pixelsPro_errorMessage='6.4321 labirint not same colors';
						sendImage(result_png, res, '\n6.4321 labirint not same colors\n');	
					
					
					
					return;
					
					
					
				}
					
						
						
						obj.glob_pixelsPro_x_left_top = x;
						obj.glob_pixelsPro_y_left_top = y;
						 
					
						obj.glob_pixelsPro_pg_main_color = color;
						
						pixelsPro_pg_main_image = setChaosPixels(obj);
			
						var result_png = pixelsPro_redrawPixels_main(obj,x,y,pixelsPro_pg_main_image);
					obj.glob_pixelsPro_errorMessage='5.7777ab labirint not ok';
						sendImage(result_png, res, '\n5.7777ab labirint not ok\n');	
					}
					else
					{
						var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
			obj.glob_pixelsPro_errorMessage='6.7777ab labirint not ok';
						sendImage(result_png, res, '\n6.7777ab labirint not ok\n');	
					}
				
			
			
		});
		
}

// function drakon()
// {
	// var colors = pixelsPro_getNeighborsColors(x,y,color);
	// //glob_pixelsPro_pg_main_image
// }






function right_pixels(req,res)	
{								
		logger_console_log("\nIn right_pixels");
		
		
		var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("right_pixels: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			
						
			var post = qs.parse(body);
			
			
			var md5 = post['md5'];
			//var md5 =  (''+req.body['md5']).trim();
		
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('right_pixels:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('right_pixels:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
		
			var obj = glob_labirint_memory[ind];
			
			var pixelsPro_pg_main_image= get_main_image(obj);
			if(pixelsPro_pg_main_image==null)
			{
				
				logger_console_log('right_pixels:error: may be white');
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('right_pixels:error: may be white');
					req.connection.destroy();
					return;
				
			}
	obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
			
			
			logger_console_log(post);
			
			var x =  +post['x'];
			var y =  +post['y'];
			var color = null;
			
			
			
				
			pixelsPro_pg_main_image = setChaosPixels(obj); 
			
			var neh = pixelsPro_getNeighborsColors(obj,x,y,color,pixelsPro_pg_main_image);
			logger_console_log("neh.length="+neh.length);
			
			var color = pixelsPro_getColorArrayFromImageData(obj,x,y,pixelsPro_pg_main_image);
			if( post['color'] ) color = cloneColor( post['color'].split(',') );
			var color_on_place = pixelsPro_getColorArrayFromImageData(obj,x,y,pixelsPro_pg_main_image);
		
			
				
			
			if(x<0||x>=pixelsPro_pg_main_image.width) {
				logger_console_log("y444");
				var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
			obj.glob_pixelsPro_errorMessage='1. chaos not ok';
				sendImage(result_png, res, '\n1. chaos not ok\n');	
				
				return;
				
			}
			else if(y<0||y>=pixelsPro_pg_main_image.height) {
				logger_console_log("y15555");
				var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
			obj.glob_pixelsPro_errorMessage='2. chaos not ok';
				sendImage(result_png, res, '\n2. chaos not ok\n');	
				
				return;
				
				
			}
			
			
			else	
			{
				if(is_color_ishodn(obj,color_on_place)==true)
				{
					
					
					
					 __set__collected__pixels(req,res,obj,x,y,color);
					return;
				
					
				}
				
			
				else
				{ 
				
					if(is_color_ishodn(obj,color_on_place)||is_color_in(getColors(obj.glob_pixelsPro_pg_map_image),color_on_place))
					{
						
						
						logger_console_log("y1888");
						
						var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
					obj.glob_pixelsPro_errorMessage='3. chaos not ok';
						sendImage(result_png, res, '\n3. chaos not ok\n');	
						
						return;
				
					}
					
					var ctrlz = obj.copy_image(pixelsPro_pg_main_image);
					
					
							take_chaos(obj,x,y,color_on_place);	
									
							pixelsPro_pg_main_image = setChaosPixels(obj);
									
							var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
									
						var x2=x;
						var y2=y;
						
						x=obj.glob_pixelsPro_x_left_top;
						y=obj.glob_pixelsPro_y_left_top;
									
					if(left(obj,x,y,pixelsPro_pg_main_image)||right(obj,x,y,pixelsPro_pg_main_image)||floor(obj,x,y,pixelsPro_pg_main_image))
					{
					
							

						obj.glob_pixelsPro_errorMessage='4. chaos ok';
								
							sendImage(result_png, res, '\n4. chaose ok\n');
							
					}
					
					else{
						
						
						
						 throw_collected(obj,x2,y2,color_on_place);
						pixelsPro_pg_main_image=ctrlz;
						var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
						obj.glob_pixelsPro_errorMessage='5. chaos not ok';
							sendImage(result_png, res, '\n5. chaos not ok\n');	
					}
					
					
				
				}
						
						
					
			}								
								
			
			
		});
		
}


function getColors(im0)
{
	
	var w = im0.width;
	var h = im0.height;
	
		
			var obj = {};
			var colors = [];

			for (var y = 0; y < im0.data.length; y+=4) {
		
				
					
					var idx = y;
					
					var key = ""+im0.data[idx]+"-"+im0.data[idx+1]+"-"+im0.data[idx+2]+"-"+im0.data[idx+3];
					
					if (obj[key]==undefined) { 
					
						
						var col = [im0.data[idx], im0.data[idx+1],im0.data[idx+2],im0.data[idx+3]]; 
						colors.push(col); 
						obj[key]= true;
					
					}
					
					
				}
			
			
		//console.log ( "count="+colors.length);
			
			return colors;
}




function is_color_in(colors,color)
{
	for(var i=0;i<colors.length;i++)
	{
		if(pixelsPro_array_equals(colors[i],color)) return true;
	}
	
	return false;
	
}

function is_color_ishodn(obj,color)
{
	var colors=getColors(obj.glob_pixelsPro_pg_map_image);
	
	for(var i=0;i<colors.length;i++)
	{
		if(pixelsPro_array_equals(color,colors[i])) return true;
	}
	
	return false;
	
}

function set_collected_pixels(req,res)	
{								
		logger_console_log("\nIn set_collected_pixels");
		
		
		var body = '';

		req.on('data', function (data) {
			
			//logger_console_log("when req.on data");
			
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("set_collected_pixels: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			var post = qs.parse(body);
			
			
			var md5 = post['md5'];
			//var md5 =  (''+req.body['md5']).trim();
		
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('set_collected_pixels:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('set_collected_pixels:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
	
	
			var obj = glob_labirint_memory[ind];
			
			
			
			//logger_console_log("22");
			logger_console_log(post);
			
			var x =  +post['x'];
			var y =  +post['y'];
			var color = post['color'].split(',');

			 __set__collected__pixels(req,res,obj,x,y,color);
				
			
			
		});
		
}

function __set__collected__pixels(req,res,obj,x,y,color)
{
			color=cloneColor(color);
			
			// logger_console_log("x="+x);
			// logger_console_log("y="+y);
			// logger_console_log("color="+color);
			
			
			var pixelsPro_pg_main_image= get_main_image(obj);
			if(pixelsPro_pg_main_image==null)
			{
				
				logger_console_log('set_collected_pixels:error: may be white');
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('set_collected_pixels:error: may be white');
					req.connection.destroy();
					return;
				
			}
			obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);	
			
			pixelsPro_pg_main_image = setChaosPixels(obj);
			
			if(x<0||x>=pixelsPro_pg_main_image.width) {
				
				var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
			
				sendImage(result_png, res, '\nset_collected_pixels not ok\n');	
				
			}
			else if(y<0||y>=pixelsPro_pg_main_image.height) {
				
				var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
			
				sendImage(result_png, res, '\nset_collected_pixels not ok\n');	
				
			}
			
			// else if((Math.abs(x-glob_pixelsPro_x_left_top)>1)||(Math.abs(y-glob_pixelsPro_y_left_top)>1)){
				
				// var result_png = pixelsPro_redrawPixels_main(glob_pixelsPro_x_left_top,glob_pixelsPro_y_left_top);
			
				// sendImage(result_png, res, '\n444.1 set_collected_pixels not ok\n');	
				
			// }
			
			else if(obj.global_karman_stones.length==0)
			{
				if((is_color_ishodn(obj,color)||is_color_in(getColors(obj.glob_pixelsPro_pg_map_image),color))==false)
				{
						take_chaos(obj,x,y,color);
				
				
						pixelsPro_pg_main_image = setChaosPixels(obj);
						
						var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
						
						sendImage(result_png, res, '\ntake stone ok\n');	
						
				}
				
				else
				
				{
					
					
					
					
								var neh = pixelsPro_getNeighborsColors(obj,x,y,color,pixelsPro_pg_main_image);
							logger_console_log("neh.length="+neh.length);
							var f=false;
							for(var inh=0;inh<neh.length;inh++)
							{
								for(var in2=0;in2<obj.global_inside_stones.length;in2++)
								{
									if(pixelsPro_array_equals(obj.global_inside_stones[in2].color,neh[inh])==true) {f=true;break;}
								}
								if(f)break;
							}
							
							if(f==false)
							{
								
					var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
				
					sendImage(result_png, res, '\n544.1 set_collected_pixels not ok\n');	
					
					
								return;
							}
							
					
					
					
					
					return;
					
					
					
					
				}
			}
			
			else
			{ 
				
						//glob_pixelsPro_pg_boh_image = 
						throw_collected(obj,x,y,color);	
						
						pixelsPro_pg_main_image = setChaosPixels(obj);
						
						var result_png = pixelsPro_redrawPixels_main(obj,obj.glob_pixelsPro_x_left_top,obj.glob_pixelsPro_y_left_top,pixelsPro_pg_main_image);
						
						sendImage(result_png, res, '\nset stone ok\n');	
						
						
				
			}
}

function get_collected(req, res)
{
	
	//var md5 = post['md5'];
			var md5 =  (''+req.body['md5']).trim();
		
			var ind = getIndexObjectByMD5(md5);
			if(ind==null)
			{
				logger_console_log('get_collected:error: not found obj with this md5:'+md5);
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
					res.end('get_collected:error:  not found obj with this md5:'+md5);
					req.connection.destroy();
					return;
			}
		
			var objj = glob_labirint_memory[ind];
	
	
	var s='';
	for(var i=0;i<objj.glob_pixelsPro_collected.length;i++)
	{
		var obj = objj.glob_pixelsPro_collected[i];
		var rgba = 'rgba('+obj.color[0]+','+obj.color[1]+','+obj.color[2]+','+(obj.color[3]/255)+')';
		var idd = 'span_collected_pixels'+i;
		var attr_color=obj.color.join(',');
		s += '<span class=\'flex-item\' attr_color=\''+attr_color+'\' id=\''+idd;
		// s += '\' style=\'margin:2px;border:2px solid '+rgba+';width:20px;height:20px;display: inline-block;background-color: '+rgba+'\' >';
		s += '\' style=\'width:20px;height:20px;display: inline-block;background-color: '+rgba+'\' >';
		s += '</span>';
	}
	 
		  res.writeHead(200, {  'Content-Type': 'text/html' } );
		  res.end(s);

	
}

function throw_collected(objj,x,y,color)
{
	///////////////////////
	addStone(objj,x,y,color,objj.global_inside_stones);
	removeStone(objj,x,y,color,objj.global_karman_stones);
	///////////////////////
	for(var i=0;i<objj.glob_pixelsPro_collected.length;i++)
	{
		var obj = objj.glob_pixelsPro_collected[i];
		if( pixelsPro_array_equals(obj.color,color)==true )
		{
			objj.glob_pixelsPro_collected.splice(i,1);
			break;
		}
	}
	
	// var index2 = glob_pixelsPro_pg_boh_image.width * y + x << 2;
	// glob_pixelsPro_pg_boh_image.data[index2] = color[0];
	// glob_pixelsPro_pg_boh_image.data[index2+1] = color[1];
	// glob_pixelsPro_pg_boh_image.data[index2+2] = color[2];
	// glob_pixelsPro_pg_boh_image.data[index2+3] = color[3];
	

	
	// return glob_pixelsPro_pg_boh_image;
}

function stone_neighbours_of(objj,x,y)
{
	var n=0;
	for(var i=0;i<objj.global_inside_stones.length;i++)
	{
		var obj = objj.global_inside_stones[i];
		if((Math.abs(Number(obj.x)-Number(x))<=1)&&(Math.abs(Number(obj.y)-Number(y))<=1)) n++;
		
	}
	return n;
}

function take_chaos(objj,x,y,color)
{
	// var color = [];
	// var index = glob_pixelsPro_pg_map_image.width * y + x << 2;
	// color[0] = glob_pixelsPro_pg_map_image.data[index];
	// color[1] = glob_pixelsPro_pg_map_image.data[index+1];
	// color[2] = glob_pixelsPro_pg_map_image.data[index+2];
	// color[3] = glob_pixelsPro_pg_map_image.data[index+3];
	
	// var color2 = [];
	// var index2 = glob_pixelsPro_pg_boh_image.width * y + x << 2;
	// color2[0] = glob_pixelsPro_pg_boh_image.data[index2];
	// color2[1] = glob_pixelsPro_pg_boh_image.data[index2+1];
	// color2[2] = glob_pixelsPro_pg_boh_image.data[index2+2];
	// color2[3] = glob_pixelsPro_pg_boh_image.data[index2+3];
	
	var obj = {};
	obj.x = Number(x);
	obj.y = Number(y);
	obj.color = color;
	objj.glob_pixelsPro_collected.push(obj);
	
	////////////////////////
	addStone(objj,x,y,color,objj.global_karman_stones);
	removeStone(objj,x,y,color,objj.global_inside_stones);
	///////////////////////
	
	//var color = [];
	/***
	var index = glob_pixelsPro_pg_boh_image.width * y + x << 2;
	glob_pixelsPro_pg_boh_image.data[index]=color[0];
	glob_pixelsPro_pg_boh_image.data[index+1]=color[1];
	glob_pixelsPro_pg_boh_image.data[index+2]=color[2];
	glob_pixelsPro_pg_boh_image.data[index+3]=color[3];
	***/	
	// glob_pixelsPro_pg_boh_image.data[index]=127;
	// glob_pixelsPro_pg_boh_image.data[index+1]=127;
	// glob_pixelsPro_pg_boh_image.data[index+2]=127;
	// glob_pixelsPro_pg_boh_image.data[index+3]=255;
	
	// return glob_pixelsPro_pg_boh_image;
}

function cloneColor(color2)
{
	return [Number(color2[0]),Number(color2[1]),Number(color2[2]),Number(color2[3])];
}

function addStone(objj,x,y,color7,arr)
{
	arr.push({x:Number(x),y:Number(y),color:cloneColor(color7)});
	
}

function removeStone(objj,x,y,color,arr)
{
	for(var i=0;i<arr.length;i++)
	{
		if( pixelsPro_array_equals(arr[i].color,color)==true )
		{
			arr.splice(i,1);
			break;
		}
	}
}


// function is_grey(x,y)
// {
	// var color = [];
	// var index = glob_pixelsPro_pg_boh_image.width * y + x << 2;
					
					
					// color[0] = glob_pixelsPro_pg_boh_image.data[index];
					// color[1] = glob_pixelsPro_pg_boh_image.data[index+1];
					// color[2] = glob_pixelsPro_pg_boh_image.data[index+2];
					// color[3] = glob_pixelsPro_pg_boh_image.data[index+3];
					
	// var grey_color = [127,127,127,255];
	// return pixelsPro_array_equals(color,grey_color);
// }


function left(obj,x,y,p1)
{
	var color = pixelsPro_getColorArrayFromImageData(obj,x,y,p1);
	if(x-1<0)return true;
	var color2 = pixelsPro_getColorArrayFromImageData(obj,x-1,y,p1);
	return !pixelsPro_array_equals(color,color2);
}

function right(obj,x,y,p1)
{
	var color = pixelsPro_getColorArrayFromImageData(obj,x,y,p1);
	if(x+1>=obj.glob_pixelsPro_pg_map_image.width)return true;
	var color2 = pixelsPro_getColorArrayFromImageData(obj,x+1,y,p1);
	return !pixelsPro_array_equals(color,color2);
}

function floor(obj,x,y,p1)
{
	var color = pixelsPro_getColorArrayFromImageData(obj,x,y,p1);
	if(y+1>=obj.glob_pixelsPro_pg_map_image.height)return true;
	var color2 = pixelsPro_getColorArrayFromImageData(obj,x,y+1,p1);
	return !pixelsPro_array_equals(color,color2);
}

function pixelsPro_getColorArrayFromImageData(obj,x,y,pixelsPro_pg_main_image)
{
	/* var c2 = document.getElementById("pixels");
	var ctx = c2.getContext("2d");
	return ctx.getImageData(x,y,1,1).data; */
	
	var index = pixelsPro_pg_main_image.width * (y) + (x) << 2;
	var color = [
		pixelsPro_pg_main_image.data[index],
		pixelsPro_pg_main_image.data[index+1],
		pixelsPro_pg_main_image.data[index+2],
		pixelsPro_pg_main_image.data[index+3]
	];	
	return color;
}
		
function pixelsPro_redrawPixels_main(obj, x,y,pixelsPro_pg_main_image)
{
	var nn=obj.glob_pixelsPro_pg_pixels_scale;
	var newpng = new PNG ( {
						
			width: 150*nn, //glob_pixelsPro_pg_main_image.width,
			height: 150*nn, //glob_pixelsPro_pg_main_image.height,
			filterType: 4
	} );
		
	for(var i=0;i<newpng.width;i++)
	{
		for(var j=0;j<newpng.height;j++)
		{
			
			var index2 = newpng.width * j + i << 2;
			
			newpng.data[index2+0] = 127;
			newpng.data[index2+1] = 127;
			newpng.data[index2+2] = 127;
			newpng.data[index2+3] = 255;
			
			
		}
	}		
	
	
	
	for(var i=-7;i<	8;i++)
	{
		for(var j=-7;j<	8;j++)
		{
			if((y+j)<0) continue;
			if((y+j)>=pixelsPro_pg_main_image.height) continue;
			if((x+i)<0) continue;
			if((x+i)>=pixelsPro_pg_main_image.width) continue;
			var index = pixelsPro_pg_main_image.width * (y+j) + (x+i) << 2;
			
			var index2 = newpng.width * (j+7)*10*nn + (i+7)*10*nn << 2;
			
			var color = [pixelsPro_pg_main_image.data[index+0],pixelsPro_pg_main_image.data[index+1],pixelsPro_pg_main_image.data[index+2],pixelsPro_pg_main_image.data[index+3]];
			
			fillRectanglePro(newpng, (i+7)*10*nn, (j+7)*10*nn, 10*nn, 10*nn, newpng.width, color);
			
			newpng.data[index2+0] = pixelsPro_pg_main_image.data[index+0];
			newpng.data[index2+1] = pixelsPro_pg_main_image.data[index+1];
			newpng.data[index2+2] = pixelsPro_pg_main_image.data[index+2];
			newpng.data[index2+3] = pixelsPro_pg_main_image.data[index+3];
			
			//logger_console_log('i='+i+' j='+j);
		}
	}
	
	
	

	return drawRedPoint(newpng,(7)*10*nn, (7)*10*nn, 10*nn, 10*nn);
	/***
	for(var i=0;i<150;i++)
	{
		for(var j=0;j<150;j++)
		{
			
			var index2 = newpng.width * j + i << 2;
			
			newpng.data[index2+0] = arr[index2+0];
			newpng.data[index2+1] = arr[index2+1];
			newpng.data[index2+2] = arr[index2+2];
			newpng.data[index2+3] = arr[index2+3];
			
			
		}
	}
	
	return newpng;
	***/
	
}



function fillRectanglePro(imgData2, i0, j0, n, m, width, col)
{
	
	
	for(var j=j0;j<j0+m;j++)
	{
		for(var i=i0;i<i0+n;i++)
		{
			var idx2 = (width * j + i ) << 2;
			imgData2.data[idx2] = col[0];
			imgData2.data[idx2+1] = col[1];
			imgData2.data[idx2+2] = col[2];
			imgData2.data[idx2+3] = col[3];
			
		}
	}
	
	return imgData2;
	
	/***
	
	for(var i=0;i<imgData2.width;i++)
	{
		for(var j=0;j<imgData2.height;j++)
		{
			
			var index2 = imgData2.width * j + i << 2;
			
			data[index2+0] = imgData2.data[index2+0];
			data[index2+1] = imgData2.data[index2+1];
			data[index2+2] = imgData2.data[index2+2];
			data[index2+3] = imgData2.data[index2+3];
			
			
		}
	}
	
	return data;
	
	***/
}


function drawRedPoint(newpng,xn, xm, w, h)
{
	var color = [255,0,0,255];
	return fillRectanglePro(newpng, xn, xm, w, h, newpng.width, color);
}



function get_url_to_ws(req,res)	
{								
		logger_console_log("\nIn get_url_to_ws");
		
		
		var body = '';

		req.on('data', function (data) {
			
					
			body += data;

			// Too much POST data, kill the connection!
			// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
			if (body.length > 99)
			{
				res.writeHead( 500, { 'Content-Type':'text/plain' } );
				res.end("get_url_to_ws: error: data.length > 99 too big");
				req.connection.destroy();
				return;
			}
			
		});

		req.on('end', function () {
			
			var post = qs.parse(body);
			
			
			var md5 = post['md5'];
			
			var data = listener.address();//location.origin.replace(/^http/, 'ws');
			data='{"url":"'+data.address+'","port":"'+data.port+'"}';
			logger_console_log("\nIn get_url_to_ws: url=["+data+"]");
		  res.writeHead(200, {  'Content-Type': 'text/html' } );
		  res.end(data);	
			
			
		});
		
}

/*******
function pixelsPro_whenClickedOnCanvas(e)
{
			
	evt = (e) ? e : event;   
	if(evt.button == 0) 
	{
		
		var x = e.offsetX==undefined?e.layerX:e.offsetX;
		var y = e.offsetY==undefined?e.layerY:e.offsetY;
		
		glob_pixelsPro_x_left_top = x;
		glob_pixelsPro_y_left_top = y;
						
		var context = e.target.getContext("2d");
		var imageData = context.getImageData(x,y,1,1);
			
		glob_pixelsPro_pg_main_color = ""+imageData.data[0]+","+imageData.data[1]+","+imageData.data[2]+","+imageData.data[3];
		
		pixelsPro_showScaleDiv(e.target,x,y);
		pixelsPro_redrawPixels_main(context, x,y);
		
	}
			
}	

function pixelsPro_getColorArrayFromImageData(x,y)
{
	var c2 = document.getElementById("pixels");
	var ctx = c2.getContext("2d");
	return ctx.getImageData(x,y,1,1).data;
}


	
function pixelsPro_setEventListenersOnPixels()
		{
			var pcnv = document.getElementById("pixels");
			pcnv.onclick = function(e)
			{
				//var el = document.getElementById("fixed");
				//if(el.innerHTML == ' FIXED ')
				{
					e = (e) ? e : event;   
					if(e.button == 2) return;
						
					var x = e.offsetX==undefined?e.layerX:e.offsetX;
					var y = e.offsetY==undefined?e.layerY:e.offsetY;
					var n = (x/10|0)-7;
					var m = (y/10|0)-7;
					
					var color = pixelsPro_getColorArrayFromImageData(x,y);
					var all_ok=false;
					if(glob_pixelsPro_point==null)all_ok=true;
					else if(pixelsPro_array_equals(color,glob_pixelsPro_point.color)) all_ok=true;
					
					if(all_ok) {
					
						glob_pixelsPro_point={};
						glob_pixelsPro_point.xy=[x,y];
						glob_pixelsPro_point.nm=[n,m];
						glob_pixelsPro_point.color=color;
						glob_pixelsPro_x_left_top += n;
						glob_pixelsPro_y_left_top += m;
						
						pixelsPro_redrawPixels_main(document.getElementById("canvas").getContext("2d"),  glob_pixelsPro_x_left_top, glob_pixelsPro_y_left_top );
					}
				//	updatePatternProps();
					
				}
			}
		
			pcnv.onmousemove = function(e)
			{
					e = (e) ? e : event;   
								
					var x = e.offsetX==undefined?e.layerX:e.offsetX;
					var y = e.offsetY==undefined?e.layerY:e.offsetY;
					var n = (x/10|0)-7;
					var m = (y/10|0)-7;
					
				//	updatePatternProps(x_left_top + n, y_left_top + m);
				
				
			}
		}
		
		
		
function pixelsPro_initModPixels()
{
	var scale_div = document.getElementById('scale_div');
	scale_div.style.visibility = 'hidden'; //visible
		
	pixelsPro_setEventListenersOnTri_Btns();
	pixelsPro_setEventListenersOnPixels();
}		
		
function pixelsPro_showScaleDiv(target,x,y)
{
	
	var el = document.getElementById('scale_div');
	el.style.border = "";
    el.style.visibility='visible';
	el.style.display="inline-block";
	document.getElementById('canvas_width_height').innerHTML = ""+document.getElementById('canvas').width+" x "+document.getElementById('canvas').height;
	//el.style.position='fixed';
	//el.style.left="200px";
	//el.style.top="200px";
	document.getElementById('selected_x_y').innerHTML = ""+x+", "+y;
	
}



function pixelsPro_setEventListenersOnTri_Btns()
{
		var btn = document.getElementById("btn_lt");
		btn.onclick = function()
		{
			
			server_crop(glob_pixelsPro_x_left_top,glob_pixelsPro_y_left_top,1);
			//document.getElementById("scale_div").style.border = '';
			document.getElementById("scale_div").style.visibility = 'hidden';
			
			
		}
		
		btn = document.getElementById("btn_rb");
		btn.onclick = function()
		{
			
			server_crop(glob_pixelsPro_x_left_top,glob_pixelsPro_y_left_top,2);
			//document.getElementById("scale_div").style.border = '';
			document.getElementById("scale_div").style.visibility = 'hidden';
			
		}
		
		var btn = document.getElementById("btn_esc");
		btn.onclick = function()
		{
			//document.getElementById("scale_div").style.border = '';
			document.getElementById("scale_div").style.visibility = 'hidden'; //visible
		
		}

}


***/

/*******/

// function pixelsPro_crop(x,y,flag)
// {
	
	
	// var sx,sy,w,h;
	// var canvas =  document.getElementById("canvas");
	
	// if(flag == 1)
	// {
		// sx = x;
		// sy = y;
		// w = canvas.width - sx;
		// h = canvas.height - sy;
	// }
	// else
	// {
		// sx = 0;
		// sy = 0;
		// w = x+1;
		// h = y+1;
	// }
	
	
	// var context = canvas.getContext("2d");
	// var imageData = context.getImageData(sx, sy, w, h);
	
	// ///////
	// //var buffer = imageData.data.buffer;  // ArrayBuffer
	// //////
	
	// canvas.width = w;
	// canvas.height = h;
	// canvas.getContext("2d").putImageData(imageData,0,0);
	
	// /*********
	// var imageData = context.createImageData(w, h);
	// imageData.data.set(buffer);
	
	// var params = [];
			
	// params['x']= x;
	// params['y']= y;
	// params['flag']= flag;
	// params['imgdata_base64']= dataurl;
			
	// sendPostWithParametersOnServer( params ); 
	// *********/
	
// }


// function pixelsPro_sendPostWithParametersOnServer( action, params  )
// {
	
				
	// var xhr = new XMLHttpRequest();
	
	// xhr.open('POST', action, true);
////	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	// xhr.responseType = "blob";
	
	// xhr.onload = function(e) {  
		
			// if (xhr.readyState != 4) return;
			
			// if (xhr.status != 200) {  var error = xhr.status + ': ' + xhr.statusText; throw new Error(error);  }

			// /*******
    
            // var buffer = xhr.response;
            // var dataview = new DataView(buffer);
            // var ints = new Uint8ClampedArray(buffer.byteLength);
            // for (var i = 0; i < ints.length; i++) {
                // ints[i] = dataview.getUint8(i);
            // }
			
			// alert(ints[10]);
			
			// ************/
            // var blob = xhr.response;
			// getImageFromBlob( blob, function( img ) {	imageToCanvas( img, "canvas" ); } );
			
	// }

	// xhr.send(params);
	
// }


// function pixelsPro_server_crop(x,y,flag)
// {
	
	// var canvas =  document.getElementById("canvas");

	// var w = canvas.width;
	// var h = canvas.height;
	// var params = 'x='+x+'&y='+y+'&w='+w+'&h='+h+'&flag='+flag;		
	
	// var xhr = new XMLHttpRequest();
	// xhr.open('POST', '/precrop', true);
////	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
	// xhr.onload = function(e) {  
		
			// if (xhr.readyState != 4) return;
			
			// if (xhr.status != 200) {  var error = xhr.status + ': ' + xhr.statusText; throw new Error(error);  }

			// /*******
    
            // var buffer = xhr.response;
            // var dataview = new DataView(buffer);
            // var ints = new Uint8ClampedArray(buffer.byteLength);
            // for (var i = 0; i < ints.length; i++) {
                // ints[i] = dataview.getUint8(i);
            // }
			
			// alert(ints[10]);
			
			// ************/
			
            // transform("canvas",'/crop');
			
	// }

	// xhr.send(params);
	
	
// }




/***==============***/


var listener = app.listen(app.get('port'), function() {
  logger_console_log('Node app is running on port', app.get('port'));
  //console.log('Node app is running on port', listener.address());
});

// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ server:listener });

// // // Broadcast to all.
// // wss.broadcast = function broadcast(data) {
 
// // };

// wss.on('connection', function connection(ws) {
	// ws.on('error', function(error) {
    // console.log(error);
    // // delete clients[id];
   // });
  // ws.on('message', function incoming(data) {
    // // Broadcast to everyone else.
    // wss.clients.forEach(function each(client) {
      // if (client !== ws && client.readyState === WebSocket.OPEN) {
        // client.send(data);
      // }
    // });
  // });
// });

// // var WebSocketServer = new require('ws').Server;

// // // подключенные клиенты
// // var clients = {};
// // //
// // // WebSocket-сервер на порту 8081
// // var webSocketServer = new WebSocketServer({server:app});
// // app.on('upgrade', webSocketServer.handleUpgrade);
// // webSocketServer.on('connection', function(ws) {

  // // var id = Math.random();
  // // clients[id] = ws;
  // // console.log("новое соединение " + id);

  // // ws.on('message', function(message) {
    // // // logger_console_log('получено сообщение ' + message);

    // // // for (var key in clients) {
      // // // clients[key].send(message);
    // // // }
  // // });

  // // ws.on('close', function() {
    // // console.log('соединение закрыто ' + id);
    // // delete clients[id];
  // // });
  
 
  
// // });



// //setInterval(  () => { for (var key in clients) {  clients[key].send(''+new Date());	}  },  1000  );
 function when_commit_labirints_changes()
 {
	 // console.log("when_commit_labirints_changes");
	  // wss.clients.forEach(function each(client) {
    // if (client.readyState === WebSocket.OPEN) {
      // client.send('Take last update, please, from '+new Date());
    // }
  // });
	// // wss.broadcast();
	// //for (var key in clients) {  clients[key].send('Take last update, please, from '+new Date());	}
}











function create_glob_labirint_memory_obj(rnd,wi,he)
{			
				
	console.log('in create_glob_labirint_memory_obj: ');
	
	var obj = {};
	obj.id = generate_md5_id();
	obj.glob_pixelsPro_x_left_top = 0;
	obj.glob_pixelsPro_y_left_top = 0;
	obj.glob_pixelsPro_point = null;
	obj.glob_pixelsPro_collected = [];
	obj.glob_pixelsPro_pg_main_color = null;
	obj.glob_pixelsPro_showing_scale_div = false;
	obj.glob_pixelsPro_scale_div = null;
	obj.global_karman_stones=[];
	obj.global_inside_stones=[];
	obj.number_of_collected_stones=0;
	obj.glob_pixelsPro_errorMessage='none';
	obj.glob_pixelsPro_pg_boh_image = null;
	obj.glob_pixelsPro_pg_map_image = null;
	obj.glob_pixelsPro_pg_pixels_scale = 2;
	
	obj.copy_image = function(oldpng)
	{
		//logger_console_log('\nIn copy_image(...)\n');
	
		
		var newpng = new PNG(
		{
			width: oldpng.width,
			height: oldpng.height,
			filterType: 4
		});
		
		for(var i=0;i<newpng.width;i++)
		{
			for(var j=0;j<newpng.height;j++)
			{
				
				var index = newpng.width * j + i << 2;
				
				newpng.data[index] = oldpng.data[index];
				newpng.data[index+1] = oldpng.data[index+1];
				newpng.data[index+2] = oldpng.data[index+2];
				newpng.data[index+3] = oldpng.data[index+3];
				
				
			}
		}	
		
		return newpng;
			

	}
	
	if(rnd==undefined) rnd=0;
	obj.glob_pixelsPro_pg_main_image_id = get_allowed_pattern_id(rnd);
	logger_console_log('create_glob_labirint_memory_obj:obj.glob_pixelsPro_pg_main_image_id ='+obj.glob_pixelsPro_pg_main_image_id );	
	if(obj.glob_pixelsPro_pg_main_image_id==null)
	{
		
		logger_console_log("create_glob_labirint_memory_obj: error: obj.glob_pixelsPro_pg_main_image_id==null");
		
		return null;;	
	}
	
	var pixelsPro_pg_main_image = get_main_image(obj,wi,he);
	if(pixelsPro_pg_main_image==null)
			{
				logger_console_log('create_glob_labirint_memory_obj:error: pixelsPro_pg_main_image==null');
				
					return null;
			}
	obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
	//req.pipe(obj.glob_pixelsPro_pg_main_image).on( 'parsed', function()  {
		
	
		var x=obj.glob_pixelsPro_x_left_top;
		var y=obj.glob_pixelsPro_y_left_top;
		
		var index = pixelsPro_pg_main_image.width * (y) + (x) << 2;
				var color = [
					pixelsPro_pg_main_image.data[index],
					pixelsPro_pg_main_image.data[index+1],
					pixelsPro_pg_main_image.data[index+2],
					pixelsPro_pg_main_image.data[index+3]
				];
				obj.glob_pixelsPro_pg_main_color=color;
				
				obj.glob_pixelsPro_pg_map_image = obj.copy_image(pixelsPro_pg_main_image);
				
				glob_labirint_memory.push(obj);
				
				return getIndexObjectByMD5(obj.id);		
	}	