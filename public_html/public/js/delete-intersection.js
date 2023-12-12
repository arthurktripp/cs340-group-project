// Constructed using course materials in CS340
// accessed 12/9/2023
// Adapted from https://github.com/osu-cs340-ecampus/nodejs-starter-app

function deleteIntersection(systemPartsID) {
  let link = '/delete-intersection-ajax/';
  let data = {
    systemPartsID: systemPartsID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(systemPartsID);
    }
  });
}

function deleteRow(systemPartsID) {
    let table = document.getElementById("intersection-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == systemPartsID) {
            table.deleteRow(i);
            break;
       }
    }
}