/* delete-energy-system.js */
/* --------------
  adapted from CS340 materials:
  https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
  accessed 12/9/2023
*/


function deleteSystem(systemID) {
  let link = '/delete-system-ajax/';
  let data = {
    id: systemID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(systemID);
    }
  });
}

function deleteRow(systemID){
    let table = document.getElementById("energy-systems-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == systemID) {
            table.deleteRow(i);
            break;
       }
    }
}