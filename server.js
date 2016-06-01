var express = require('express');
var bodyParser = require('body-parser');


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
	res.json(todos); //convert the todos array into json and sent back to whoever called the api
});

// GET /todos/:id
app.get('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10); //req.params.id is always a string
	var matchedTodo;
	todos.forEach(function(todo){
		if(todo.id === todoId){
			matchedTodo = todo;
		}
	})

	if(matchedTodo){
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	
	//res.send('Asking for todo with id of ' + req.params.id);
});

// POST /todos
app.post('/todos', function(req, res){
	var body = req.body;
	body.id = todoNextId ++;
	todos.push(body);

	
	res.json(body);
})



app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});