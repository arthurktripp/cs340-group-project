function deletePart(partID) {
  let link = '/delete-part-ajax/';
  let data = {
    partID: partID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(partID);
    }
  });
}

function deleteRow(partID) {
    let table = document.getElementById("part-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == partID) {
            table.deleteRow(i);
            break;
       }
    }
}