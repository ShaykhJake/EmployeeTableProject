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


// Initial methods after script is loaded
window.onload = () => {
  
  renderEmployeeTable(tableDiv, database.employees);
  testDelete();
}

function testDelete(){
  fetch(`${endpoint}/3`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then((data) => {
      console.log(data);
      employees = data;
      renderEmployeeTable();
    })
    .catch((error) => {
      console.log(error);
    })
}

/**
 * Poor man's enum for controlling possible roles
 */
 const roles = {
  CEO: 'CEO',
  VP: 'VP',
  Manager: 'Manager',
  Lackey: 'Lackey'
}

/**
 * Initial information for the database for testing; once fully active, this is unecessary;
 * it should ultimately be moved to the main node script
 */
const database = {
  employees: [
    {firstName: "Alfred", lastName: "Hong", hireDate: "2012-12-12", role: "Manager" },
    {firstName: "Maria", lastName: "Fuentes", hireDate: "2005-09-10", role: "CEO" },
    {firstName: "Tom", lastName: "Smith", hireDate: "2001-03-05", role: "VP" },
  ],
}

function renderButtons(employee){  
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = "Delete";
  deleteButton.addEventListener('click', () => {
    deleteEmployee(employee);
  });
  return deleteButton;
}

function deleteEmployee(employee){
  if(confirm(`Do you really want to delete ${employee.firstName}?`)){
    // deleteRecord(employee);
    removeObjectFromArray(database.employees,employee);
  }
}



// CRUD Functions
const endpoint = "http://localhost:3000/api/employees";
function retrieveAll(){
  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error)
    })
}
function createRecord(package){
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(package),
      headers: {
        "content-type": "application/json; charset=UTF-8"
      }
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.log(error);
      })
}
function retrieveRecord(target){
  fetch(`${endpoint}/${target}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error)
    })
}
function updateRecord(target, package){
  fetch(`${endpoint}/${target}`, {
    method: 'PUT',
    body: JSON.stringify(package),
    headers: {
      "content-type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.log(error);
    })
}
function deleteRecord(target){
  fetch(`${endpoint}/${target}`, {
    method: 'DELETE'
  })
    .then(res => {
      console.log("Deleted");
    })
    .catch((error) => {
      console.log(error);
    })
}


function removeObjectFromArray(array, object){
  const index = array.indexOf(object);
  array.splice(index,1);
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
function renderEmployeeTable(){
  tableDiv.innerHTML = "";
  const table = document.createElement('table');
  // Add attributes to the table
  tableDiv.appendChild(table);
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>First Name</th>
    <th>Last Name</th>
    <th>Hire Date</th>
    <th>Role</th>
    <th>ID</th>
  `
  table.appendChild(headerRow);
  if(database.employees && database.employees.length > 0){
    database.employees.forEach(employee => {
      console.log(employee)
      table.appendChild(renderEmployeeRow(employee));
    })
  } else {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5">There are No Records in the Database</td>`;
    table.appendChild(tr);
  }
}

function renderEmployeeRow(employee){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input id="fname3" type="text" value="${employee.firstName}"></td>
    <td><input id="lname3" type="text" value="${employee.lastName}"></td>
    <td><input id="hdate3" type="text" value="${employee.hireDate}"></td>
    <td><input id="role3" type="text" value="${employee.role}"></td>
  `
  tr.appendChild(renderButtons(employee));
  return tr;
}
/**
 * Ensure's hiring date is in the past
 * @param {String} dateString
 * @returns boolean
 */
function beforeNow(dateString){
  return (new Date(dateString) < new Date()) ? true : false;
}






