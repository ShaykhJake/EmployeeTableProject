/**
 * designed by, ShaykhJake, (c)2021
 * Note: this Vanilla JS SPA was written in response to an IBM coding
 * challenge to create a simple, full-stack employee table/database.
 */

// Get Static DOM elements
const tableDiv = document.getElementById("table-div");
const newRecordDiv = document.getElementById("new-record-div");
const searchBox = document.getElementById("search-box");
const clearSearchButton = document.getElementById("clear-search");

// Initialize Global variables
let employees = []; // Array of employee objects
let filtered = false; // is the array filtered by search string?
// Object to hold various pagination settings
const pagination = {
	step: 5,
	current: 0,
	currentLength: 0,
};
// Object to hold various sorting settings
const sorting = {
	sorted: false,
	sortDirection: 1,
	sortKey: "firstName",
};

// Call initial functions after page is loaded
window.onload = () => {
	// Database call to retrieve all records
	retrieveAll();
	// Activate the search/filter box with event listener
	searchBox.addEventListener("keyup", () => {
		// reset pagination start
		pagination.current = 0;
		// re-render table of employees
		renderEmployeeTable();
	});
	clearSearchButton.addEventListener("click", clearSearch);
};

/**
 * Filters the Array of employee objects based on what is in the search box
 * @param {Array} elements (employee objects)
 * @returns Array of filtered elements
 */
function updateSearchFilter(elements) {
	let searchText = searchBox.value.toLowerCase();
	if (searchText.length < 1) {
		filtered = false;
		return elements;
	} else {
		filteredElements = elements.filter((employee) => {
			if (employee.firstName.toLowerCase().includes(searchText))
				return true;
			if (employee.lastName.toLowerCase().includes(searchText))
				return true;
			if (employee.hireDate.toLowerCase().includes(searchText))
				return true;
			if (employee.role.toLowerCase().includes(searchText)) return true;
			if (employee.id.toLowerCase().includes(searchText)) return true;
		});
		filtered = true;
		return filteredElements;
	}
}

/**
 * Clears the search box and re-renders employee table
 */
function clearSearch() {
	searchBox.value = "";
	renderEmployeeTable();
}

/**
 * Add a pair of action buttons to the end of an employee row
 * @param {Object} target html element
 * @param {Object} employee
 */
function renderActions(target, employee) {
	const td = document.createElement("td");
	td.classList.add("action-cell");
	const editButton = document.createElement("button");
	editButton.classList.add("edit");
	editButton.innerHTML = `Edit <i class="fas fa-user-edit"></i>`;
	editButton.addEventListener("click", () => {
		renderNewRecordDiv(employee);
	});
	td.appendChild(editButton);

	const deleteButton = document.createElement("button");
	deleteButton.classList.add("warning");
	deleteButton.innerHTML = `Delete <i class="fas fa-trash-alt"></i>`;
	deleteButton.addEventListener("click", () => {
		deleteEmployee(employee);
	});
	td.appendChild(deleteButton);
	target.appendChild(td);
}

/**
 * Simple confirmation for deleting an employee
 * @param {Object} employee
 */
function deleteEmployee(employee) {
	if (confirm(`Do you really want to delete ${employee.firstName}?`)) {
		// Go forward with API call to delete the record
		deleteRecord(employee.id);
	}
}

// CRUD Functions
// Initialize base endpoint
const endpoint = "http://localhost:3000/api/employees";

/**
 * Retrieve all database records
 */
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
/**
 * Submits a creation (post) request to the database
 * @param {Object} package of employee attributes
 */
function createRecord(package) {
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
/**
 * Sends a PUT request to update an employee's record
 * @param {String} target id of employee
 * @param {Object} package new attributes for employee
 */
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
/**
 * Sends a DELETE request to the database
 * @param {String} target employee id
 */
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

/**
 * Main logic for rendering the employee table
 * @param {Object} targetDiv DOM element where table will be rendered
 * @param {Array} employees objects
 */
function renderEmployeeTable() {
	let elements = updateSearchFilter(employees);
	sortElements(elements);

	tableDiv.innerHTML = `
  Total ${filtered ? "<b>Filtered</b> " : ""}Records: ${elements.length}
  `;
	const table = document.createElement("table");
	table.classList.add("employee-table");
	table.innerHTML = `
  <colgroup>
    <col span="1" style="width: 5%;">
    <col span="1" style="width: 15%;">
    <col span="1" style="width: 15%;">
    <col span="1" style="width: 12%;">
    <col span="1" style="width: 12%;">
    <col span="1" style="width: 20%;">
    <col span="1" style="width: 21%;">
  </colgroup>
  `;
	// Add attributes to the table
	tableDiv.appendChild(table);
	const headerRow = document.createElement("tr");
	headerRow.innerHTML = `
    <td></td>
    <th id="fname-header" class="sortable" data-key="firstName">First Name</th>
    <th id="lname-header" class="sortable" data-key="lastName">Last Name</th>
    <th id="hdate-header" class="sortable" data-key="hireDate">Hire Date</th>
    <th id="role-header" class="sortable" data-key="role">Role</th>
    <th id="id-header" class="sortable" data-key="id">ID</th>
    <th>Actions</th>
  `;

	table.appendChild(headerRow);

	const fNameHeader = document.getElementById("fname-header");
	fNameHeader.addEventListener("click", () => {
		changeSort(fNameHeader);
	});
	const lNameHeader = document.getElementById("lname-header");
	lNameHeader.addEventListener("click", () => {
		changeSort(lNameHeader);
	});
	const hDateHeader = document.getElementById("hdate-header");
	hDateHeader.addEventListener("click", () => {
		changeSort(hDateHeader);
	});
	const roleHeader = document.getElementById("role-header");
	roleHeader.addEventListener("click", () => {
		changeSort(roleHeader);
	});
	const idHeader = document.getElementById("id-header");
	idHeader.addEventListener("click", () => {
		changeSort(idHeader);
	});

	highlightSort();

	let start = pagination.current;
	let end = 0;
	if (elements.length > 0) {
		if (start + pagination.step > elements.length) {
			end = elements.length;
		} else {
			end = start + pagination.step;
		}
		for (let i = start; i < end; i++) {
			table.appendChild(renderEmployeeRow(i, elements[i]));
		}
		// set current to either max or next index
		pagination.next = true;
		pagination.previous = true;
	} else {
		const tr = document.createElement("tr");
		tr.innerHTML = `<td colspan="7">There are No Matching Records</td>`;
		table.appendChild(tr);
	}
	renderPaginationBar(start, end, elements);

	const createButton = document.createElement("button");
	createButton.innerHTML = `Create New <i class="fas fa-user-plus"></i>`;
	createButton.classList.add("edit");
	tableDiv.appendChild(createButton);
	createButton.addEventListener("click", () => {
		renderNewRecordDiv();
	});
}

/**
 * Renders out the information for each employee row
 * @param {number} index of array element
 * @param {Object} employee
 * @returns
 */
function renderEmployeeRow(index, employee) {
	const tr = document.createElement("tr");
	tr.innerHTML = `
    <td>${index + 1}</td>
    <td>${employee.firstName}</td>
    <td>${employee.lastName}</td>
    <td>${employee.hireDate}</td>
    <td>${employee.role}</td>
    <td>${employee.id}</td>
  `;
	renderActions(tr, employee);
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
	newRecordDiv.style.animation = "fade-in 0.2s ease-in";
	newRecordDiv.innerHTML = `
  <h2>${editMode ? "Update" : "Create a New"} Employee Record</h2>
  <h3 class="mute">Employee ID: ${
		editMode ? employee.id : "(not yet assigned)"
  }</h3>
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

  </form>  
  <button id="submit-new-button" class="confirm">Submit <i class="fas fa-check"></i></button>
  <button id="cancel-new-button" class="warning">Cancel <i class="fas fa-times"></i></button>
  `;

	document.getElementById("new-role").value = employee.role;

	// Grab the cancel button
	const cancelButton = document.getElementById("cancel-new-button");
	cancelButton.classList.add("warning");
	// Add a click listener
	cancelButton.addEventListener("click", () => {
		// Clear the contents of the div
		newRecordDiv.innerHTML = "";
		// Hide the div
		newRecordDiv.style.display = "none";
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
				updateRecord(employee.id, package);
			} else {
				createRecord(package);
			}
		} else {
			return;
		}
	});
	newRecordDiv.style.display = "block";
}

/**
 * Validates the input of a name field
 * @param {Object} target DOM element
 * @param {RegExp} regex expression for matching
 * @returns true if valid; false if not valid;
 */
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
 * Validates the date input
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

/**
 * Renders a bar for pagination
 * @param {number} start index for range
 * @param {number} end index for range (exclusive)
 * @param {Array} elements
 */
function renderPaginationBar(start, end, elements) {
	const pagiBar = document.createElement("div");
	pagiBar.classList.add("pagi-bar");
	tableDiv.appendChild(pagiBar);
	let plural = end - start > 1;

	pagiBar.innerHTML = `
    <button id="prev-button"><i class="fas fa-arrow-left"></i> Previous</button>
    Record${plural ? "s" : ""} ${start + 1}${plural ? " - " + end : ""} of ${
		elements.length
	}
    <button id="next-button">Next <i class="fas fa-arrow-right"></i></button>

  `;
	const prevButton = document.getElementById("prev-button");
	prevButton.addEventListener("click", () => {
		shiftPage(-1, elements);
	});
	if (start == 0) {
		prevButton.style.display = "none";
	}
	const nextButton = document.getElementById("next-button");
	nextButton.addEventListener("click", () => {
		shiftPage(1, elements);
	});
	if (end >= elements.length) {
		nextButton.style.display = "none";
	}
}

/**
 * Simple function to shift the current pagination index
 * @param {integer} direction (-1 for previous, 1 for next)
 * @param {array} elements of employee records
 */
function shiftPage(direction, elements) {
	step = pagination.step * direction;
	if (pagination.current + step > 0) {
		if (pagination.current + step < elements.length) {
			pagination.current = pagination.current + step;
		}
		// else leave .current alone
	} else {
		pagination.current = 0;
	}
	renderEmployeeTable();
}

/**
 * Sorts the elements of an array based on the attributes
 * of the global "sorting" object
 * @param {Array} elements
 * @returns array
 */
function sortElements(elements) {
	const key = sorting.sortKey;
	const direction = sorting.sortDirection;
	sorting.sorted = true;

	elements.sort((a, b) => {
		if (a[key].toLowerCase() < b[key].toLowerCase()) {
			return -1 * direction;
		}
		if (a[key] > b[key]) {
			return 1 * direction;
		}
		return 0;
	});
	return elements;
}

/**
 * Changing the attributes of the global "sorting" object
 * @param {String} key attribute to sort on
 * @param {Object} header DOM element calling for the sorting
 */
function changeSort(header) {
	const key = header.dataset.key;
	if (sorting.sortKey == key) {
		sorting.sortDirection *= -1;
	} else {
		sorting.sortKey = key;
		sorting.sortDirection = 1;
	}
	renderEmployeeTable();
}

/**
 * Iterates over header rows to style them based on which row
 * is the active sorting row
 */
function highlightSort() {
	const headers = document.getElementsByClassName("sortable");
	for (const header of headers) {
		if (header.dataset.key == sorting.sortKey) {
			const dir = sorting.sortDirection > 0 ? "down" : "up";
			header.classList.add("sorted");
			header.innerHTML += ` <i class="fas fa-arrow-${dir}"></i>`;
		}
	}
}
