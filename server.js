var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var fileUpload = require('express-fileupload');

var Task = require('./tasks-model');
var Type = require('./type-model');

//password yoobee123

//setup database connection
var connectionString = 'mongodb://dbAdmin:yoobee123@cluster0-shard-00-00-vmgzu.mongodb.net:27017,cluster0-shard-00-01-vmgzu.mongodb.net:27017,cluster0-shard-00-02-vmgzu.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(connectionString,{ useNewUrlParser: true });
var  db = mongoose.connection;
db.once('open', () => console.log('Database connected'));
db.on('error', () => console.log('Database error'));


//setup express server
var app = express();
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(logger('dev'));
app.use(fileUpload());

app.use(express.static('public'));

//setup routes
var router = express.Router();

router.get('/testing', (req, res) => {
  res.send('<h1>Testing is working</h1>')
})

router.get('/tasks', (req, res) => {

	Task.find()
	.then((i) => {
	    return res.json(i);
	});

})

router.get('/tasks/:id', (req, res) => {

	Task.findOne({id:req.params.id})
	.then((i) => {
	    return res.json(i);
	});
})

router.post('/tasks', (req, res) => {

	var i = new Task();
	i.id = Date.now();
	
	var data = req.body;
	Object.assign(i,data);
	
	i.save()
	.then((i) => {
	  	return res.json(i);
	});
});

router.delete('/tasks/:id', (req, res) => {

	Task.deleteOne({ id: req.params.id })
	.then(() => {
		return res.json('deleted');
	});
});

router.put('/tasks/:id', (req, res) => {

	Task.findOne({id:req.params.id})
	.then((i) => {
		var data = req.body;
		Object.assign(i,data);
		return i.save()	
	})
	.then((i) => {
		return res.json(i);
	});	

});

router.get('/types', (req, res) => {

	Type.find()
	.then((types) => {
	    return res.json(types);
	});
})

router.post('/upload', (req, res) => {

	// res.send(req.files);

	// console.log(req.files)

	var files = Object.values(req.files);
	var uploadedFiles = files[0];

	var fileName = Date.now() + uploadedFiles.name;
	uploadedFiles.mv('public/'+fileName, function(){
		res.send(fileName);
	})
})




app.use('/api', router);

// launch our backend into a port
const apiPort = 4000;
app.listen(apiPort, () => console.log('Listening on port '+apiPort));