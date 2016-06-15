var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'

	//__dirname: current directory that this file sits in
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING, //must be a string
		allowNull: false, //needs to exist
		validate: {
			len: [1, 250] //length is one or greater, less than or equal to 250
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})
//force:true automatically drops all tables in database and recreates them
sequelize.sync({

	// force:true
}).then(function(){
	return Todo.findById(3)
	.then(function(todo){//todo is the content inside the resolve statement
		if(todo){ //if the todo item exists
			console.log(todo.toJSON());
		} else {
			console.log('Todo not found');
		}
	});

	/* 

	Promise {
  _bitField: 131072,
  _fulfillmentHandler0: undefined,
  _rejectionHandler0: undefined,
  _progressHandler0: undefined,
  _promise0: undefined,
  _receiver0: undefined,
  _settledValue: undefined,
  _boundTo: todo }


	*/



	//fetch todo item by id
	//if find, print to screen using toJSON
	//if not, print to screen using error message saying todo not found

	// console.log('Everything is synced');

	// Todo.create({
	// 	description: 'Take out trash'
	// }).then(function(todo){
	// 	return Todo.create({
	// 		description: 'Clean office'
	// 	});
	// }).then(function(){
	// 	//return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where:{
	// 			description: {
	// 				$like: '%trash%'
	// 				//$like lets you look for a word inside attribute
	// 			}
	// 		}
	// 	});
	// }).then(function(todos){
	// 	if(todos){
	// 		todos.forEach(function(todo){
	// 			console.log(todo.toJSON());
	// 		});
	// 	} else {
	// 		console.log('no todo found!');
	// 	}
	// }).catch(function(e){
	// 	console.log(e);
	// });
})

