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
  if (nombre === "") errors.push("El nombre no puede estar en blanco.");
  else if (nombre.length <= 8) errors.push("El nombre debe tener más de 8 caracteres.");

  
  if (descripcion === "") errors.push("La descripción no puede estar en blanco.");
  else if (descripcion.length <= 15) errors.push("La descripción debe tener más de 15 caracteres.");

  if (asignadoA === "") errors.push("El campo 'Asignado a' no puede estar en blanco.");
  else if (asignadoA.length <= 8) errors.push("El campo 'Asignado a' debe tener más de 8 caracteres.");

  if (fecha === "") errors.push("Debes seleccionar una fecha de entrega.");

  if (estado === "") errors.push("Debes seleccionar un estado.");

  if (errors.length > 0) {// es decir, si hay un error lo mustra y se devueklve false
    showErrors(errors);
    return false;
  }

  clearErrors();// si todo esta ok se limpian los errores 
  return true;
}