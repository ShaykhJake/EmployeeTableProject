/**
 * designed by, ShaykhJake, (c)2021
 * Note: this backend Node server app was written in response to an IBM
 * coding challenge to create a simple, full-stack employee
 * table/database.
 */

// Import dependencies
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// REST API ROUTES

// Get one employee
app.get("/api/employees/:id", (req, res) => {
	// look up Id
	res.json(getEmployeeById(req.params.id));
});
// Update employee
app.put("/api/employees/:id", (req, res) => {
	updateEmployeeById(req.params.id, req.body);
	res.json(database.employees);
});
// Delete employee
app.delete("/api/employees/:id", (req, res) => {
	removeEmployeeById(req.params.id);
	res.json(database.employees);
});
// Get all employees
app.get("/api/employees", (req, res) => {
	res.json(database.employees);
});
// Create a new employee
app.post("/api/employees", (req, res) => {
	const record = { ...req.body };
	record.id = generateID();
	database.employees.push(record);
	res.json(database.employees);
});

// Initialize socket for server
app.listen(3000, () => {
	console.log("Server Running: Port 3000");
});

// Database Content & Helper Functions
/**
 * Initial information for the database for testing; once fully active, this is unecessary;
 * it should ultimately be moved to the main node script
 */
const database = {
	employees: [
		{
			firstName: "Alfred",
			lastName: "Hong",
			hireDate: "2012-12-12",
			role: "Manager",
			id: "7b1719d4",
		},
		{
			firstName: "Maria",
			lastName: "Fuentes",
			hireDate: "2005-09-10",
			role: "CEO",
			id: "1ce8b27c",
		},
		{
			firstName: "Tom",
			lastName: "Smith",
			hireDate: "2001-03-05",
			role: "VP",
			id: "4577f2b4",
		},
		{
			firstName: "Jacob",
			lastName: "Wagner",
			hireDate: "2021-12-25",
			role: "Lackey",
			id: "45fff2b4",
		},
		{
			firstName: "Kelly",
			lastName: "Bauer",
			hireDate: "2011-09-25",
			role: "Manager",
			id: "aafff2b4",
		},
		{
			firstName: "Martin",
			lastName: "Alvarez-Ryan",
			hireDate: "1999-04-25",
			role: "VP",
			id: "ccfff2b4",
		},
	],
};

/**
 * Looks up an employee by id
 * @param {String} id
 * @returns employee object
 */
function getEmployeeById(id) {
	const obj = database.employees.find((emp) => emp.id == id);
	return obj ? obj : null;
}
/**
 * Removes an employee from the database by id
 * @param {String} id
 */
function removeEmployeeById(id) {
	const obj = getEmployeeById(id);
	if (obj) {
		const index = database.employees.indexOf(obj);
		database.employees.splice(index, 1);
	}
}
/**
 * Updates an employee's record by first looking up the
 * current record and replacing it with the object that was
 * sent in the request body
 * @param {String} id
 * @param {Object} employee
 */
function updateEmployeeById(id, employee) {
	const obj = getEmployeeById(id);
	if (obj) {
		const index = database.employees.indexOf(obj);
		database.employees[index] = employee;
	}
}

/**
 * Generates a random, unique, 8-character hedidecimal Id;
 * this should give us roughly 4.29 billion options to work with.
 * @returns String
 */
function generateID() {
	const id = [...Array(8)]
		.map(() => Math.floor(Math.random() * 16).toString(16))
		.join("");
	if (
		database.employees.find((employee) => {
			if (employee.id == id) return true;
		})
	) {
		return generateID();
	} else {
		return id;
	}
}
