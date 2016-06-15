// var person = {
// 	name: 'Andrew',
// 	age: 21
// };

// function updatePerson(obj){
// 	// obj = {
// 	// 	name: 'Andrew',
// 	// 	age: 24
// 	// };
// 	obj.age = 24;
// }

// updatePerson(person);
// console.log(person);

//Array Example

var grades = [15, 37];

function addGrades(grades){
	grades.push(55);
	debugger; //tells node where to stop the program

	//grades = [12, 33, 99]; //does not reference original grades variable
}

addGrades(grades);
console.log(grades);