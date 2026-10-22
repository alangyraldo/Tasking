const errorsBox = document.getElementById("form-errors");// guaradaos donde voy a mostrar los mensajes 

export function clearErrors() {// una funcion par ocultar u vaciar la variable de eroores 
  errorsBox.classList.add("d-none");//dnone es una clase de bootstrap para oculatr elementos 
  errorsBox.innerHTML = "";//aca borramos mensajes anteriores 
}

function showErrors(errors) {// una funcion que muestra la lista de los errores 
  errorsBox.innerHTML = "<ul class='mb-0'>" +// combierto los errores en un listado 
    errors.map((e) => `<li>${e}</li>`).join("") +// y pasan a unorden list creo que asi se llama 
    "</ul>";
  errorsBox.classList.remove("d-none");// quitamos dnon para que la la seccion se vea
}

export function validateTaskForm() {// esta funcion devuelve true si esta ok y fasle si no
  // se lee cada parte y con trim quitmos espacios 
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const asignadoA = document.getElementById("asignadoA").value.trim();
  const fecha = document.getElementById("fechaEntrega").value;// en estos 2 no se neceista usar el trim
  const estado = document.getElementById("estado").value;

  const errors = [];//creamos la lista donde se van a guardar los mensjaaes
  
  // condicion de que no puedeo ir vacion y minimo de letras
  if (nombre === "") errors.push("el nombre no puede estar en blanco");
  else if (nombre.length <= 5) errors.push("el nombre debe tener mas de 5 caracteres");

  
  if (descripcion === "") errors.push("la descripcion no puede estar en blanco");
  else if (descripcion.length <= 5) errors.push("la descripcion debe tener mas de 5 caracteres");

  if (asignadoA === "") errors.push("el campo 'asignado a' no puede estar en blanco");
  else if (asignadoA.length <= 3) errors.push("el campo 'asignado a' debe tener mas de 3 caracteres");

  if (fecha === "") errors.push("debes seleccionar una fecha de entrega");

  if (estado === "") errors.push("debes seleccionar un estado");

  if (errors.length > 0) {// es decir, si hay un error lo mustra y se devueklve false
    showErrors(errors);
    return false;
  }

  clearErrors();// si todo esta ok se limpian los errores 
  return true;
}