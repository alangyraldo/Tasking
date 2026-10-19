export function createTaskCard(task, onDelete) {// se crea la tarjeta y se recibe la funcion que elimina al ejecutar 
  const card = document.createElement("article");// creo el contenedor de la tarjeta 
  card.className = "tarjeta-tarea";// le ponemos la clase que se da en ccs
  card.dataset.id = task.id;// guardamos el id en el html como data-id

  const title = document.createElement("h3");// para el tirtulo de la tarea
  title.textContent = task.nombre;// se una textconten para que no se pueda inyectar codigo 

  const desc = document.createElement("p");// para la descripcion " en parrafo"
  desc.textContent = task.descripcion;

  const assignee = document.createElement("p");//para la persona asignada 
  assignee.className = "text-body-secondary";
  assignee.textContent = `Asignado a: ${task.asignadoA}`;

  const date = document.createElement("p");
  date.className = "text-body-secondary";
  date.textContent = `Entrega: ${task.fechaDeEntrega}`;

  const status = document.createElement("span");// para el estado de la tarea
  status.className = "badge text-bg-secondary mb-2";
  status.textContent = task.estado;

  const deleteBtn = document.createElement("button");// eel boton eliminar
  deleteBtn.type = "button";// para que actue como un botn de envio
  deleteBtn.className = "btn btn-eliminar btn-sm rounded-pill d-block mt-2";
  deleteBtn.textContent = "Eliminar";
  deleteBtn.addEventListener("click", () => onDelete(task.id, card));// cuanod se da click se lla a la funcion delete de arriba y se pasa id 

  card.append(title, status, desc, assignee, date, deleteBtn);// se meten los elemento sde la tarjeta n orden
  return card;// se devuelve la tarjeta terminada
}

export function updateCounts(taskManager) {// para actualizar los numero de las columnas 
  document.querySelectorAll(".conteo").forEach((badge) => {// se recorre elcada contador 
    badge.textContent = taskManager.getTasksWithStatus(badge.dataset.estado).length;
    // cada contador tiene un estado, se pregunta cual es y se escribe el numero en el contador 
    });
}   