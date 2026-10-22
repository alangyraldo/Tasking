import { TaskManager } from "./TaskManager.js";
import { validateTaskForm, clearErrors } from "./validation.js";
import { createTaskCard, updateCounts } from "./ui.js";

const taskManager = new TaskManager();// se crea un solo manager 
const form = document.getElementById("task-form");//gurdamos formuladio para usarlo despues 
const modalEl = document.getElementById("modalTarea");// segun entiendo el modal tambien 

let editingId = null;// guarda el id de la tarea que se esta editando y si es null es que se esta creando una nueva

function handleDelete(taskId, card) {// se hace cunado se presiona el eliminar 
  taskManager.deleteTask(taskId); // fuera del array
  card.remove();// fuera de la pantlla
  updateCounts(taskManager);//se actualiza las columnas  
}

// abre el mismo modal para crear o para editar
function abrirModal({ tarea = null, estado = "" } = {}) {// si llega una tarea es editar y si no es crear
  clearErrors();// se borran los errores que hayan quedado de antes
  form.reset();// se deja el formulario vacio

  const titulo = modalEl.querySelector(".modal-title");// el titulo del modal para cambiarlo
  const botonGuardar = modalEl.querySelector('[type="submit"]');// el boton guardar para cambiarle el texto

  if (tarea) {// si hay tarea estamos editando
    editingId = tarea.id;// guardamos cual es para usarlo al enviar
    document.getElementById("nombre").value = tarea.nombre;// se llenan los campos con los datos de la tarea
    document.getElementById("descripcion").value = tarea.descripcion;
    document.getElementById("asignadoA").value = tarea.asignadoA;
    document.getElementById("fechaEntrega").value = tarea.fechaDeEntrega;
    document.getElementById("estado").value = tarea.estado;
    if (titulo) titulo.textContent = "Editar tarea";// se cambian los textos para que se note que es editar
    if (botonGuardar) botonGuardar.textContent = "Guardar cambios";
  } else {// si no hay tarea es una nueva
    editingId = null;// no hay ninguna en edicion
    document.getElementById("estado").value = estado;// se deja el estado de la columna donde se dio click
    if (titulo) titulo.textContent = "Nueva tarea";
    if (botonGuardar) botonGuardar.textContent = "Guardar";
  }

  bootstrap.Modal.getOrCreateInstance(modalEl).show();// se abre el modal usando bs
}

function handleEdit(taskId) {// se hace cuando se presiona el editar
  abrirModal({ tarea: taskManager.getTask(taskId) });// buscamos la tarea por id y abrimos el modal con sus datos
}

// un boton de agregar al final de cada columna
document.querySelectorAll(".lista-tareas").forEach((lista) => {// se recorre cada columna
  const btn = document.createElement("button");// creamos el boton
  btn.type = "button";// para que no envie nada solo abra el modal
  btn.className = "btn btn-agregar btn-sm rounded-pill w-100 mt-2";
  btn.textContent = "+ Agregar tarea";
  btn.addEventListener("click", () => abrirModal({ estado: lista.dataset.estado }));// al dar click se abre el modal con el estado de esa columna
  lista.after(btn);// se pone justo debajo de la lista de tareas
});



// Cambia el estado de una tarea y mueve su tarjeta a la columna correcta.
// La usan tanto el selector de la tarjeta como el arrastre.
function moveTask(taskId, newStatus, card) {
  // 1. Actualizo el estado en el array.
  taskManager.updateTask(taskId, newStatus);
  // 2. Actualizo la etiqueta y el selector de la tarjeta.
  card.querySelector(".badge").textContent = newStatus;
  card.querySelector(".selector-estado").value = newStatus;
  // 3. Muevo la tarjeta a la lista de la nueva columna.
  document
    .querySelector(`.lista-tareas[data-estado="${newStatus}"]`)
    .append(card);
  // 4. Actualizo los contadores.
  updateCounts(taskManager);
}







form.addEventListener("submit", (event) => {// un envento para guarar tarea 
  event.preventDefault();

  if (!validateTaskForm()) return;// se condisiona si falla se sale

  const datos = {// los valores del formulario se guardan juntos porque sirven para crear y para editar
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    asignadoA: document.getElementById("asignadoA").value.trim(),
    fechaDeEntrega: document.getElementById("fechaEntrega").value,
    estado: document.getElementById("estado").value,
  };

  if (editingId !== null) {// si hay un id es que estamos editando
    const task = taskManager.editTask(editingId, datos);// se actualizan los datos en el array
    const oldCard = document.querySelector(`.tarjeta-tarea[data-id="${editingId}"]`);// buscamos la tarjeta vieja en la pantalla
    const newCard = createTaskCard(task, handleDelete, handleEdit);// creamos la tarjeta nueva con los datos actualizados
    const lista = document.querySelector(`.lista-tareas[data-estado="${task.estado}"]`);// la lista que le toca por su estado

    if (oldCard.parentElement === lista) {// si sigue en la misma columna
      oldCard.replaceWith(newCard);// se cambia en el mismo lugar
    } else {// si cambio de estado
      oldCard.remove();// se quita de la columna vieja
      lista.append(newCard);// y se pasa a la nueva
    }
  } else {// si no es que es una tarea nueva
    const task = taskManager.addTask(datos);// para valiar si paso y se crearon con los valores 

    const card = createTaskCard(task, handleDelete, handleEdit);// creammos la tarjeta y paso el delete para el boton eliminar y el edit para el boton editar
    document// para bucar la lista que coniside con el estado de la tarea y luego agregarla
      .querySelector(`.lista-tareas[data-estado="${task.estado}"]`)
      .append(card);
  }

  updateCounts(taskManager);// se acrualizan los contadores
  form.reset();// se resetea el formulario para un proximo uso 
  bootstrap.Modal.getOrCreateInstance(modalEl).hide();// se cierra el modal usando bs
});

// Limpia los errores cada vez que se cierra el modal para poder abrirlo de nuevo 
modalEl.addEventListener("hidden.bs.modal", () => {
  clearErrors();
  form.reset();
  editingId = null;// se olvida la tarea en edicion por si cerraron el modal sin guardar
});