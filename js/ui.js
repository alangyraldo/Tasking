export function createTaskCard(task, onDelete, onEdit) {// se crea la tarjeta y se reciben la funcion que elimina y la que edita al ejecutar 
  const card = document.createElement("article");// creo el contenedor de la tarjeta 
  card.className = "tarjeta-tarea";// le ponemos la clase que se da en ccs
  card.dataset.id = task.id;// guardamos el id en el html como data-id
  card.dataset.estado = task.estado;// guardamos el estado en el html para poder darle color segun el estado

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

   const editBtn = document.createElement("button");// el boton editar
  editBtn.type = "button";
  editBtn.className = "btn btn-editar btn-sm rounded-pill";
  editBtn.title = "Editar";
  editBtn.setAttribute("aria-label", "Editar");
  editBtn.append(crearIcono("bi-pencil-square"));// icono de lapiz
  editBtn.addEventListener("click", () => onEdit(task.id, card));

 const deleteBtn = document.createElement("button");// el boton eliminar
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-eliminar btn-sm rounded-pill";
  deleteBtn.title = "Eliminar";
  deleteBtn.setAttribute("aria-label", "Eliminar");
  deleteBtn.append(crearIcono("bi-trash"));// icono de papelera
  deleteBtn.addEventListener("click", () => onDelete(task.id, card));

   const doneBtn = document.createElement("button");// el boton para marcar como hecha
  doneBtn.type = "button";
  doneBtn.className = "btn btn-completar btn-outline-success btn-sm rounded-pill";// btn-completar es la clase que busca el listener
  doneBtn.title = "Marcar como hecha";// texto que sale al pasar el mouse
  doneBtn.setAttribute("aria-label", "Marcar como hecha");// para lectores de pantalla
  doneBtn.append(crearIcono("bi-check-lg"));// icono de check

  // Los dos botones juntos, uno al lado del otro
    const actions = document.createElement("div");// un contenedor para los botones
  actions.className = "d-flex flex-wrap gap-2 mt-2";
  actions.append(editBtn, deleteBtn);
  if (task.estado !== "HECHO") actions.prepend(doneBtn);// si ya esta hecha no hace falta el boton

  card.append(title, status, desc, assignee, date, actions);// se meten los elemento sde la tarjeta n orden
  return card;// se devuelve la tarjeta terminada

  // crea un icono de bootstrap icons para meterlo dentro de un boton
function crearIcono(clase) {
  const icono = document.createElement("i");
  icono.className = `bi ${clase}`;
  return icono;
}
}



export function updateCounts(taskManager) {// para actualizar los numero de las columnas 
  document.querySelectorAll(".conteo").forEach((badge) => {// se recorre elcada contador 
    badge.textContent = taskManager.getTasksWithStatus(badge.dataset.estado).length;
    // cada contador tiene un estado, se pregunta cual es y se escribe el numero en el
    });
}   