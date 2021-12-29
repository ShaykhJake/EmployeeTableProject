// Import dependencies
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get one employee
app.get("/api/employees/:id", (req, res) => {
	// look up Id
	res.json(getObjectById(req.params.id));
});
// Delete employee
app.delete("/api/employees/:id", (req, res) => {
	removeObjectById(req.params.id);
	res.json(database.employees);
});

// Get all employees
app.get("/api/employees", (req, res) => {
	res.json(database.employees);
});

// Create a new employee
app.post("/api/employees", (req, res) => {
	console.log(req.body);
	const record = { ...req.body };
	record.id = generateID();
	database.employees.push(record);
	res.json(record);
});

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
			id: "1",
		},
		{
			firstName: "Maria",
			lastName: "Fuentes",
			hireDate: "2005-09-10",
			role: "CEO",
			id: "2",
		},
		{
			firstName: "Tom",
			lastName: "Smith",
			hireDate: "2001-03-05",
			role: "VP",
			id: "3",
		},
	],
};

function getObjectById(id) {
	const obj = database.employees.find((emp) => emp.id == id);
	return obj ? obj : null;
}
function removeObjectById(id) {
	const obj = getObjectById(id);
	if (obj) {
		const index = database.employees.indexOf(obj);
		database.employees.splice(index, 1);
	}
}
function insertObject(record) {
	const id = generateID();
	record.id = generateID();
	database.employees.push(record);
}
/**
 * Generates a random, 8-character hedidecimal Id; each ID must be unique
 * this should give us roughly 4.29 billion options to work with.
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
