// update_energy_system.js

// Constructed using course materials in CS340
// accessed 12/9/2023
// Adapted from https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Target the edit form:
let updateSystemForm = document.getElementById('es-edit-form');

// Modify the necessary objects:
updateSystemForm.addEventListener("submit", function(e) {
  e.preventDefault();

  let inputSystemID = document.getElementById('edit-system-id');
  let inputSystemName = document.getElementById('edit-system-name');
  let inputSystemDescription = document.getElementById('edit-system-description');
  let inputEstimatedInstallTime = document.getElementById('edit-install-time');
  let inputEstimatedCustomerIncome = document.getElementById('edit-customer-income');
  let updatedSystemParts = document.getElementsByName('edit-system-parts');

  let systemIDValue = inputSystemID.dataset.systemid;  // this is accessed via the data-systemID attribute
  let systemNameValue = inputSystemName.value;
  let systemDescriptionValue = inputSystemDescription.value;
  let estimatedInstallTimeValue = inputEstimatedInstallTime.value;
  let estimatedCustomerIncomeValue = inputEstimatedCustomerIncome.value;
  let updatedPartIDValues = []
    // populate the list of selected systemParts
    updatedSystemParts.forEach(function(each){
      if (each.checked) {
        updatedPartIDValues.push(each.value)
      }
    });
  let updatedSystemPartsCount = updatedPartIDValues.length;
    

  // EnergySystems.systemName cannot be Null
  /* if (isNaN(systemNameValue)) {
    return;
  } */

  let data = {
    systemID: systemIDValue,
    systemName: systemNameValue,
    systemDescription: systemDescriptionValue,
    estimatedInstallTime: estimatedInstallTimeValue,
    estimatedCustomerIncome: estimatedCustomerIncomeValue,
    updatedPartIDValues: updatedPartIDValues,
    updatedSystemPartsCount: updatedSystemPartsCount
  }

  // AJAX request:
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/put-energy-system-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      updateRow(xhttp.response, systemNameValue);
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.")
    } 
  }

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
})


function updateRow(data, systemID) {
  let parsedData = JSON.parse(data);
  let table = document.getElementById('es-edit-table');

}