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
});

var User = sequelize.define('user', {
	email: Sequelize.STRING	

	// email: {
	// 	type: Sequelize.STRING
	// }
});
//belongsto takes the model that the todo belongs to
Todo.belongsTo(User);
User.hasMany(Todo);

//force:true automatically drops all tables in database and recreates them
sequelize.sync({
	 //force:true
}).then(function(){
	User.findById(1).then(function(user){
		user.getTodos({
			where: {
				completed: false
			}
		}).then(function(todos){ //getTodos takes the exact snytax as findone findall
			todos.forEach(function (todo){
				console.log(todo.toJSON());
			});
		});
	});
	// User.create({
	// 	email: 'andrew@example.com'
	// }).then(function(){
	// 	return Todo.create({
	// 		description:'Clean yard'
	// 	});
	// }).then(function(todo){
	// 	User.findById(1).then(function(user){
	// 		user.addTodo(todo);
	// 	})
	// })
});

