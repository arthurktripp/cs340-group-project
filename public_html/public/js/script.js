function displayForm(id) {
  document.getElementById(id).style.display = "block";
}

function hideFormCheck(id) {
  if (document.getElementById(id).checkValidity()) {
    document.getElementById(id).style.display = "none";
  }
}

function hideForm(id) {
  if (document.getElementById(id).checkValidity()) {
    document.getElementById(id).style.display = "none";
  }
}

function confirmDelete(hide1, hide2) {
  confirmation = confirm('Are you sure you want to delete this record? This action cannot be undone.');
  if (confirmation == true ){
    hideForm(hide1);
    hideForm(hide2);      
  }
  return;
};

/* Used for developement */
function displayAllForms(divclass) {
  var forms = document.getElementsByClassName(divclass);
  for (let i=0; i < forms.length; i++) {
    forms[i].style.display = "block"; 
  }
};