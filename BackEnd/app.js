const express = require("express");
const cors = require("cors");
const app = express();

/**
 * Initial information for the database for testing; once fully active, this is unecessary;
 * it should ultimately be moved to the main node script
 */
 const database = {
  employees: [
    {firstName: "Alfred", lastName: "Hong", hireDate: "2012-12-12", role: "Manager", id: "1" },
    {firstName: "Maria", lastName: "Fuentes", hireDate: "2005-09-10", role: "CEO", id: "2" },
    {firstName: "Tom", lastName: "Smith", hireDate: "2001-03-05", role: "VP", id: "3" },
  ],
}

function getObjectById(id){
  const obj = database.employees.find(emp => emp.id == id);
  return obj ? obj : null;
}
function removeObjectById(id){
  const obj = getObjectById(id);
  if(obj){
    const index = database.employees.indexOf(obj);
    database.employees.splice(index, 1);
  }
}


app.use(cors());




// Get one employee
app.get("/api/employees/:id", (req, res) => {
  // look up Id
  res.json(getObjectById(req.params.id));
})
// Delete employee
app.delete("/api/employees/:id", (req, res) => {
  removeObjectById(req.params.id);
  res.json(database.employees);
})

// Get all employees
app.get("/api/employees", (req, res) => {
  res.json(database.employees)
})

// Create a new employee
app.post("/", (req, res) => {
})


app.listen(3000, () => {
 console.log("Server Running: Port 3000");
});