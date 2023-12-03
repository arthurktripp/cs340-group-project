// Get objects to modify:

let addEnergySystemForm = document.getElementById('es-add-form');

// Modify the needed objects:
addEnergySystemForm.addEventListener("submit", function(e){
  e.preventDefault();

  // Get the necessary fields:
  let inputSystemName = document.getElementById('input-systemName');
  let inputSystemDescription = document.getElementById('input-systemDescription');
  let inputEstimatedInstallTime = document.getElementById('input-estimatedInstallTime');
  let inputEstimatedCustomerIncome = document.getElementById('input-estimatedCustomerIncome');

  // Get values from form fields:
  let systemNameValue = inputSystemName.value;
  let systemDescriptionValue = inputSystemDescription.value;
  let estimatedInstallTimeValue = inputEstimatedInstallTime.value;
  let estimatedCustomerIncomeValue = inputEstimatedCustomerIncome.value;

  // Add data to a javascript object:
  let data = {
    systemName: systemNameValue,
    systemDescription: systemDescriptionValue,
    estimatedInstallTime: estimatedInstallTimeValue,
    estimatedCustomerIncome: estimatedCustomerIncomeValue
  };

  // AJAX Request:
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-energy-system-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Set how AJAX request resolves:
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add new data to the table:
      addRowToTable(xhttp.response);

      // Clear inputs for another transaction
      inputSystemName.value = '';
      inputSystemDescription.value = '';
      inputEstimatedInstallTime.value = '';
      inputEstimatedCustomerIncome.value = '';
    
    } else if (xhttp.readyState == 4 && xhttp.status !== 200) {
      console.log('There was an error with the input.')
    }
  }
  
  // Send the data and wait for response:
  xhttp.send(JSON.stringify(data));
})


// Create a new row from an Object representing a single record from EnergySystems:
addRowToTable = (data) => {
  // Get a reference to the current table:
  let currentTable = document.getElementById("energy-systems-table");
  // Get location for new row:
  let newRowIndex = currentTable.rows.length;
  // Get reference to the new row from the database query (last object):
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // Create a row and cells
  let row = document.createElement("tr");
  let idCell = document.createElement('td');
  let systemNameCell = document.createElement('td');
  let systemDescriptionCell = document.createElement('td');
  let estimatedInstallTimeCell = document.createElement('td');
  let estimatedCustomerIncomeCell = document.createElement('td');

  // Fill the cells with the new data:
  idCell.innerText = newRow.systemID;
  systemNameCell.innerText = newRow.systemName;
  systemDescriptionCell.innerText = newRow.systemDescription;
  estimatedInstallTimeCell.innerText = newRow.estimatedInstallTime;
  estimatedCustomerIncomeCell.innerText = newRow.estimatedCustomerIncome;

  // Add the cells to the row:
  row.appendChild(idCell);
  row.appendChild(systemNameCell);
  row.appendChild(systemDescriptionCell);
  row.appendChild(estimatedInstallTimeCell);
  row.appendChild(estimatedCustomerIncomeCell);

  // Add the row to the table:
  currentTable.appendChild(row);
}