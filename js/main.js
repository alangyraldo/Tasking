import { TaskManager } from "./TaskManager.js";
import { validateTaskForm, clearErrors } from "./validation.js";
import { createTaskCard, updateCounts } from "./ui.js";

const taskManager = new TaskManager();// se crea un solo manager 
const form = document.getElementById("task-form");//gurdamos formuladio para usarlo despues 
const modalEl = document.getElementById("modalTarea");// segun entiendo el modal tambien 

function handleDelete(taskId, card) {// se hace cunado se presiona el eliminar 
  taskManager.deleteTask(taskId); // fuera del array
  card.remove();// fuera de la pantlla
  updateCounts(taskManager);//se actualiza las columnas  
}

form.addEventListener("submit", (event) => {// un envento para guarar tarea 
  event.preventDefault();

  if (!validateTaskForm()) return;// se condisiona si falla se sale

  const task = taskManager.addTask({// para valiar si paso y se crearon con los valores 
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    asignadoA: document.getElementById("asignadoA").value.trim(),
    fechaDeEntrega: document.getElementById("fechaEntrega").value,
    estado: document.getElementById("estado").value,
  });

  const card = createTaskCard(task, handleDelete);// creammos la tarjeta y paso el delete para el boton eliminar
  document// para bucar la lista que coniside con el estado de la tarea y luego agregarla
    .querySelector(`.lista-tareas[data-estado="${task.estado}"]`)
    .append(card);

  updateCounts(taskManager);// se acrualizan los contadores
  form.reset();// se resetea el formulario para un proximo uso 
  bootstrap.Modal.getOrCreateInstance(modalEl).hide();// se cierra el modal usando bs
});

// Limpia los errores cada vez que se cierra el modal para poder abrirlo de nuevo 
modalEl.addEventListener("hidden.bs.modal", () => {
  clearErrors();
  form.reset();
});