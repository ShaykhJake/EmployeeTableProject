/**
 * TODOS:
 *
 * Get DOM Elements
 *
 * Animate Deletion:
 *
 * Spinner for Loading:
 *
 * Helpers & Modals:
 * - Confirm Delete
 *
 * REST API
 * Create
 * Retrieve
 * Update
 * Delate
 */

// Get DOM elements
const tableDiv = document.getElementById("table-div");
const newRecordDiv = document.getElementById("new-record-div");

// Global variables
let employees = [];

// Initial methods after script is loaded
window.onload = () => {
	retrieveAll();
	// renderEmployeeTable();
};

/**
 * Poor man's enum for controlling possible roles
 */
const roles = {
	CEO: "CEO",
	VP: "VP",
	Manager: "Manager",
	Lackey: "Lackey",
};

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
		},
		{
			firstName: "Maria",
			lastName: "Fuentes",
			hireDate: "2005-09-10",
			role: "CEO",
		},
		{
			firstName: "Tom",
			lastName: "Smith",
			hireDate: "2001-03-05",
			role: "VP",
		},
	],
};

function renderActions(target, employee) {
	const td = document.createElement("td");
	td.classList.add("action-cell");
	const editButton = document.createElement("button");
	editButton.innerHTML = "Edit";
	editButton.addEventListener("click", () => {
		renderNewRecordDiv(employee);
	});
	td.appendChild(editButton);

	const deleteButton = document.createElement("button");
	deleteButton.innerHTML = "Delete";
	deleteButton.addEventListener("click", () => {
		deleteEmployee(employee);
	});
	td.appendChild(deleteButton);
	target.appendChild(td);
}

function deleteEmployee(employee) {
	if (confirm(`Do you really want to delete ${employee.firstName}?`)) {
		// deleteRecord(employee);
		deleteRecord(employee.id);
		// removeObjectFromArray(employees, employee);
	}
}

// CRUD Functions
const endpoint = "http://localhost:3000/api/employees";
function retrieveAll() {
	fetch(endpoint)
		.then((res) => res.json())
		.then((data) => {
			employees = data;
			renderEmployeeTable();
		})
		.catch((error) => {
			console.log(error);
			employees = [];
		});
}
function createRecord(package) {
	console.log(package);
	fetch(endpoint, {
		method: "POST",
		body: JSON.stringify(package),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	})
		.then((res) => res.json())
		.then((data) => {
			employees = data;
			renderEmployeeTable();
			newRecordDiv.innerHTML = ``;
			newRecordDiv.style.display = "none";
			return true;
		})
		.catch((error) => {
			console.log(error);
			return false;
		});
}
/**
 * Retrieves an employee record; this function
 * is currently redundant and unnecessary
 * @param {String} target employee id
 */
function retrieveRecord(target) {
	fetch(`${endpoint}/${target}`)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.log(error);
		});
}
function updateRecord(target, package) {
	fetch(`${endpoint}/${target}`, {
		method: "PUT",
		body: JSON.stringify(package),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	})
		.then((res) => res.json())
		.then((data) => {
			employees = data;
			renderEmployeeTable();
			newRecordDiv.innerHTML = ``;
			newRecordDiv.style.display = "none";
			return true;
		})
		.catch((error) => {
			console.log(error);
			return false;
		});
}
function deleteRecord(target) {
	fetch(`${endpoint}/${target}`, {
		method: "DELETE",
	})
		.then((res) => res.json())
		.then((data) => {
			employees = data;
			renderEmployeeTable();
		})
		.catch((error) => {
			console.log(error);
		});
}

function removeObjectFromArray(array, object) {
	const index = array.indexOf(object);
	array.splice(index, 1);
	renderEmployeeTable();
}

// <form>
// <table style="width:100%">
//   <tr>
//     <th>First Name</th>
//     <th>Last Name</th>
//     <th>Hire Date</th>
//     <th>Role</th>
//     <th>ID</th>
//   </tr>
//   <tr>
//     <td><input id="fname1" type="text" value="Alfred"></td>
//     <td><input id="lname1" type="text" value="Hong"></td>
//     <td><input id="hdate1" type="text" value="2012-12-12"></td>
//     <td><input id="role1" type="text" value="Manager"></td>
//     <td>1</td>
//     <td><button>Delete</button></td>
//   </tr>
//   <tr>
//     <td><input id="fname2" type="text" value="Maria"></td>
//     <td><input id="lname2" type="text" value="Fuentes"></td>
//     <td><input id="hdate2" type="text" value="2005-09-10"></td>
//     <td><input id="role2" type="text" value="CEO"></td>
//     <td>2</td>
//     <td><button>Delete</button></td>
//   </tr>
//   <tr>
//     <td><input id="fname3" type="text" value="Tom"></td>
//     <td><input id="lname3" type="text" value="Smith"></td>
//     <td><input id="hdate3" type="text" value="2001-03-05"></td>
//     <td><input id="role3" type="text" value="VP"></td>
//     <td>3</td>
//     <td><button>Delete</button></td>
//   </tr>
// </table>

// renderEmployeeTable(tableDiv, database.employees);

/**
 *
 * @param {DOM element object} targetDiv
 * @param {array of objects} employees
 */
function renderEmployeeTable() {
	tableDiv.innerHTML = "";
	const table = document.createElement("table");
	table.classList.add("employee-table");
	// Add attributes to the table
	tableDiv.appendChild(table);
	const headerRow = document.createElement("tr");
	headerRow.innerHTML = `
    <th>First Name</th>
    <th>Last Name</th>
    <th>Hire Date</th>
    <th>Role</th>
    <th>ID</th>
    <th>Actions</th>
  `;
	table.appendChild(headerRow);
	if (employees.length > 0) {
		employees.forEach((employee) => {
			console.log(employee);
			table.appendChild(renderEmployeeRow(employee));
		});
	} else {
		const tr = document.createElement("tr");
		tr.innerHTML = `<td colspan="6">There are No Records in the Database</td>`;
		table.appendChild(tr);
	}

	const createButton = document.createElement("button");
	createButton.innerHTML = "Create New";
	tableDiv.appendChild(createButton);
	createButton.addEventListener("click", () => {
		renderNewRecordDiv();
	});
}

function renderEmployeeRow(employee) {
	const tr = document.createElement("tr");
	tr.innerHTML = `
    <td>${employee.firstName}</td>
    <td>${employee.lastName}</td>
    <td>${employee.hireDate}</td>
    <td>${employee.role}</td>
    <td>${employee.id}</td>
  `;
	renderActions(tr, employee);
	// tr.appendChild(renderButtons(employee));
	return tr;
}

/**
 * Build the contents of a div element for creating
 * a new employee record
 * @param {object} employee (Optional parameter for updating)
 */
function renderNewRecordDiv(
	employee = {
		firstName: "",
		lastName: "",
		hireDate: "",
		role: "Lackey",
	}
) {
	//
	let editMode = employee.id ? true : false;

	// Inject HTML
	newRecordDiv.innerHTML = `
  <h2>${editMode ? "Update" : "Create a New"} Employee Record</h2>
  <form id="new-record-form">
    <label for="fname">First Name:</label>
    <input
      id="new-fname"
      type="text"
      value="${employee.firstName}"
      placeholder="First Name"
    />

    <label for="lname">Last Name:</label>
    <input
      id="new-lname"
      type="text"
      value="${employee.lastName}"
      placeholder="Last Name"
    />

    <label for="hdate">Hire Date:</label>
    <input
      id="new-hdate"
      type="text"
      value="${employee.hireDate}"
      placeholder="YYYY-MM-DD"
    />

    <label for="role">Role:</label>
    <select name="role" id="new-role">
      <option value="CEO">CEO</option>
      <option value="VP">VP</option>
      <option value="Manager">Manager</option>
      <option value="Lackey" selected>Lackey</option>
    </select>

    <label for="id">ID:</label>
    <input
      id="new-hdate"
      disabled
      type="text"
      value="${employee.id ? employee.id : "(not yet assigned)"}"
    />

  </form>  
  <button id="submit-new-button">Submit</button>
  <button id="cancel-new-button">Cancel</button>
  `;

	document.getElementById("new-role").value = employee.role;

	// Grab the cancel button
	const cancelButton = document.getElementById("cancel-new-button");
	// Add a click listener
	cancelButton.addEventListener("click", () => {
		// Confirm that the user wants to cancel
		if (
			confirm(
				"Are you sure you want to cancel? All changes will be lost."
			)
		) {
			// Clear the contents of the div
			newRecordDiv.innerHTML = "";
			// Hide the div
			newRecordDiv.style.display = "none";
		}
	});
	// Grab the submit button
	const submitButton = document.getElementById("submit-new-button");
	// Add submit event listener
	submitButton.addEventListener("click", () => {
		// Grab the input elements
		const fname = document.getElementById("new-fname");
		const lname = document.getElementById("new-lname");
		const hdate = document.getElementById("new-hdate");
		const role = document.getElementById("new-role");

		// Validate the form contents using regular expressions
		if (
			validateNameInput(fname, /^[a-zA-Z].\D*$/) &&
			validateNameInput(lname, /^[a-zA-Z].\D*$/) &&
			validateDateInput(hdate)
		) {
			// build the package object (ID is added server-side)
			let package = {
				firstName: fname.value,
				lastName: lname.value,
				hireDate: hdate.value,
				role: role.value,
				id: employee.id ? employee.id : null,
			};
			// Submit the package to the REST API
			if (editMode) {
				console.log("HI!");
				updateRecord(employee.id, package);
			} else {
				console.log(package);
				createRecord(package);
			}
		} else {
			return;
		}
	});

	newRecordDiv.style.display = "block";
}

function validateNameInput(target, regex) {
	const inputText = target.value;
	if (regex.test(inputText)) {
		target.classList.remove("error");
		return true;
	} else {
		target.addEventListener("input", () => {
			validateNameInput(target, regex);
		});
		target.classList.add("error");
		return false;
	}
}
/**
 *
 * @param {object} target html element
 * @returns boolean true if valid
 */
function validateDateInput(target) {
	let regex = /\d{4}-\d{2}-\d{2}/;
	const dateString = target.value;
	if (regex.test(dateString) && new Date(dateString) < new Date()) {
		target.classList.remove("error");
		return true;
	} else {
		target.addEventListener("input", () => {
			validateDateInput(target);
		});
		target.classList.add("error");
		return false;
	}
}
/**
 * Ensure's date is in the past
 * @param {String} dateString
 * @returns boolean true if valid
 */
function beforeNow(dateString) {
	return new Date(dateString) < new Date();
}
