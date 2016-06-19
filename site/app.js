var application_root = __dirname;
var express  = require('express');
var app      = express();          
var mongoose = require('mongoose');        
var path = require('path');
var bodyParser = require('body-parser');   
var methodOverride = require('method-override'); 

app.use(bodyParser());

app.use( express.static( path.join( application_root,'../', 'site') ) );
app.use(bodyParser.urlencoded({'extended':'true'})); 
app.use(bodyParser.json());             
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());

mongoose.connect( 'mongodb://localhost/todo_db' );

var Todo = mongoose.model("Todo", {
	text : String,
	done : Boolean
});


app.get('/api/todos', function(req, res) {
	Todo.find(function(err, todos){
		if(err){
			res.send(err);
		}

		res.json(todos);
	});
});

app.post('/api/todos', function(req, res){
	Todo.create({
		text : req.body.text,
		done: req.body.done
	}, function(err, todo) {
		if(err){
			res.send(err);
		}

		Todo.find(function(err,todos) {
			if(err){
				res.send(err);
			}
			res.json(todos);
		});
	});
});

app.delete('/api/todos/:todo_id', function(req, res){
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if(err){
			res.send(err);
		}

		Todo.find(function(err, todos){
			if(err){
				res.send(err);
			}
			res.json(todos);
		});
	});
});

app.listen(8080);
console.log("App listening on port 8080");

