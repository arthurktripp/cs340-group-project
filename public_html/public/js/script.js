const pageQuery = window.location.search


function displayForm(id) {
  document.getElementById(id).style.display = "block";
}

function hideFormCheck(id) {
  if (document.getElementById(id).checkValidity()) {
    document.getElementById(id).style.display = "none";
  }
}

function hideForm(id) {
  // if (document.getElementById(id).checkValidity()) {
    document.getElementById(id).style.display = "none";
  // }
};

/*


/* Used for developement */
function displayAllForms(divclass) {
  var forms = document.getElementsByClassName(divclass);
  for (let i=0; i < forms.length; i++) {
    forms[i].style.display = "block"; 
  }
};



                                      