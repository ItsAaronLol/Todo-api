var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//a todo is our model
//a set of todos is called a todo collection


//now anytime a json request comes in, express is going to parse it
//and we are going to be able to access it via req.body
app.use(bodyParser.json()); 


app.get('/', function(req, res){
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req,res){
	var queryParams = req.query; //the params: ?completed=true
	var filteredTodos = todos;
	//_.findWhere returns first value
	//_.where returns all values
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	
	res.json(filteredTodos); //convert the todos array into json and sent back to whoever called the api
});

// GET /todos/:id
app.get('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10); //req.params.id is always a string
	
	var matchedTodo = _.findWhere(todos, {id: todoId});

	// var matchedTodo;
	// todos.forEach(function(todo){
	// 	if(todo.id === todoId){
	// 		matchedTodo = todo;
	// 	}
	// })

	if(matchedTodo){
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	
	//res.send('Asking for todo with id of ' + req.params.id);
});

// POST /todos
app.post('/todos', function(req, res){

	var body = _.pick(req.body, 'description', 'completed');

	// if(typeof body.completed !== 'boolean' || typeof body.description !== 'string' || body.description.trim().length === 0){
	// 	return res.status(400).send();
	// }
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = todoNextId ++;

	todos.push(body);

	
	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req,res){
//remove the todo at the id
//use the 'without' underscore method
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		return res.status(400).json({"error": "no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}

});

// PUT /todos/:id
app.put('/todos/:id', function(req,res){
	//get the body with only the description and completed fields
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		return res.status(404).send();
	}

	var body = _.pick(req.body, 'description', 'completed'); 
	var validAttributes = {};

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes); //override matchedtodo with the valid attributes
	res.json(matchedTodo);

	//returns true if it has a completed property
	//body.hasOwnProperty('completed')
})





app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});