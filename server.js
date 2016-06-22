var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;



//a todo is our model
//a set of todos is called a todo collection


//now anytime a json request comes in, express is going to parse it
//and we are going to be able to access it via req.body
app.use(bodyParser.json());


app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true&q=house
app.get('/todos', middleware.requireAuthentication,function(req, res) {
	var query = req.query; //the params: ?completed=true
	var where = {
		userId: req.user.get('id')
	}; //req.user.get('id')

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});

});

// GET /todos/:id
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10); //req.params.id is always a string

	db.todo.findOne({
		where: {
			id: todoId,
			userId:req.user.get('id')
		}
	}).then(function(todo) {
		if (!!todo) { //run if there is a todo item
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});

});

// POST /todos
//middleware is called before the function
app.post('/todos', middleware.requireAuthentication, function(req, res) {

	//middleware.requireAuthentication makes req.user equal to the user with the corresponding AUTH value

	//make body equal to the value in the request body, only include description and completed fields
	//the request body is a javascript object
	var body = _.pick(req.body, 'description', 'completed');

	//create the new todo using this new object
	db.todo.create(body).then(function(todo) {
		//get the corresponding user and addtodo to it
		req.user.addTodo(todo).then(function() {
			//if successful, update the object with current data from the DB and return the same object.
			return todo.reload();
		}).then(function(todo){ 
			res.json(todo.toJSON());
		});
	}, function(e) {
		res.status(400).json(e);
	});

});


// DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	//remove the todo at the id
	//use the 'without' underscore method
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send();
		}
	}, function() {

	});


});

// PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	//get the body with only the description and completed fields
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}
	db.todo.findOne({
		where: {
			id: todoId,
			userId:req.user.get('id')
		}
	}).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send(); //nothing to update
		}
	}, function() {
		res.status(500).send();
	});

	//returns true if it has a completed property
	//body.hasOwnProperty('completed')
});



// POST /users
app.post('/users', function(req, res) {

	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(e) {
		res.status(400).json(e);
	});

});

// POST /users/login
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;
	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token: token
		});

	}).then(function(tokenInstance){
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function(){
		res.status(401).send();
	});

});

// DELETE /users/login
app.delete('/users/login', middleware.requireAuthentication, function(req,res){
	req.token.destroy().then(function(){
		res.status(204).send();
	}).catch(function(){
		res.status(500).send();
	});
});

db.sequelize.sync({force:true}).then(function() { //force: true deletes if they exist
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});