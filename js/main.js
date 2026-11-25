import { TaskManager } from "./TaskManager.js"; // el manager de tareas, ahora habla con el backend
import { validateTaskForm, clearErrors, showErrors } from "./validation.js"; // showErrors ahora esta exportada para mostrar los errores 400 del servidor
import { createTaskCard, updateCounts, mostrarAlerta } from "./ui.js"; // mostrarAlerta es para los errores fuera del formulario
import { ProjectManager } from "./ProjectManager.js"; // los proyectos antes estaban con ls ara s ehablan directamente con el bakend y la bsd

const taskManager = new TaskManager(); // se crea un solo manager
// aqui ya no se llama a taskManager.cargar(): ahora es asincrona y se llama dentro de iniciar()
const projectManager = new ProjectManager(); // se crea un solo manager de proyectos
//projectManager.cargar(); // se cargan los proyectos guardados
let currentProjectId = null; // id del proyecto abierto y si es null se esta en la vista de inicio
const form = document.getElementById("task-form"); // guardamos el formulario para usarlo despues
const modalEl = document.getElementById("modalTarea"); // el modal de crear o editar tarea

let editingId = null; // id de la tarea que se esta editando y si es null se esta creando una nueva

async function handleDelete(taskId, card) { // se hace cuando se presiona eliminar, ahora es async porque espera al servidor
  try { // try porque el servidor puede estar apagado o la tarea puede ya no existir
    await taskManager.deleteTask(taskId); // primero se borra en la base de datos
    card.remove(); // la tarjeta solo sale de la pantalla si el servidor confirmo
    updateCounts(taskManager, currentProjectId); // se actualizan los contadores
  } catch (error) { // si algo fallo
    mostrarAlerta(error.mensajes ?? [error.message]); // muestro los mensajes del servidor o el texto del error
  }
}

// abre el mismo modal para crear o para editar
function abrirModal({ tarea = null, estado = "" } = {}) { // si llega una tarea es editar y si no es crear
  clearErrors(); // se borran los errores que hayan quedado de antes
  form.reset(); // se deja el formulario vacio

  const titulo = modalEl.querySelector(".modal-title"); // el titulo del modal para cambiarlo
  const botonGuardar = modalEl.querySelector('[type="submit"]'); // el boton guardar para cambiarle el texto

  if (tarea) { // si hay tarea estamos editando
    editingId = tarea.id; // guardamos cual es para usarlo al enviar
    document.getElementById("nombre").value = tarea.nombre; // se llenan los campos con los datos de la tarea
    document.getElementById("descripcion").value = tarea.descripcion;
    document.getElementById("asignadoA").value = tarea.asignadoA;
    document.getElementById("fechaEntrega").value = tarea.fechaDeEntrega;
    document.getElementById("estado").value = tarea.estado;
    if (titulo) titulo.textContent = "Editar tarea"; // se cambian los textos para que se note que es editar
    if (botonGuardar) botonGuardar.textContent = "Actualizar";
  } else { // si no hay tarea es una nueva
    editingId = null; // no hay ninguna en edicion
    document.getElementById("estado").value = estado; // se deja el estado de la columna donde se dio click
    if (titulo) titulo.textContent = "Nueva tarea";
    if (botonGuardar) botonGuardar.textContent = "Guardar";
  }

  bootstrap.Modal.getOrCreateInstance(modalEl).show(); // se abre el modal usando bootstrap
}

function handleEdit(taskId) { // se hace cuando se presiona editar
  abrirModal({ tarea: taskManager.getTask(taskId) }); // buscamos la tarea por id y abrimos el modal con sus datos
}

// un boton de agregar al final de cada columna
document.querySelectorAll(".lista-tareas").forEach((lista) => { // se recorre cada columna
  const btn = document.createElement("button"); // creamos el boton
  btn.type = "button"; // para que no envie nada solo abra el modal
  btn.className = "btn btn-agregar btn-sm rounded-pill w-100 mt-2";
  btn.textContent = "+ Agregar tarea";
  btn.addEventListener("click", () => abrirModal({ estado: lista.dataset.estado })); // al dar click se abre el modal con el estado de esa columna
  lista.after(btn); // se pone justo debajo de la lista de tareas
});

// la funcion moveTask se elimino: buscaba .badge y .selector-estado que las tarjetas ya no tienen y nadie la llamaba

form.addEventListener("submit", async (event) => { // ahora es async porque espera al servidor
  event.preventDefault(); // evita que la pagina se recargue

  if (!validateTaskForm()) return; // la validacion del front sigue sirviendo para avisar rapido

  const datos = { // los valores del formulario sirven para crear y para editar
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    asignadoA: document.getElementById("asignadoA").value.trim(),
    fechaDeEntrega: document.getElementById("fechaEntrega").value,
    estado: document.getElementById("estado").value,
    proyectoId: currentProjectId, // la tarea queda ligada al proyecto abierto
  };

  const botonGuardar = modalEl.querySelector('[type="submit"]'); // el boton para bloquearlo mientras se espera
  botonGuardar.disabled = true; // evita que un doble clic cree la tarea dos veces

  try { // todo lo que habla con el servidor va dentro del try
    if (editingId !== null) { // si hay un id es que estamos editando
      const task = await taskManager.editTask(editingId, datos); // PUT y espero la tarea que devuelve el servidor
      const oldCard = document.querySelector(`.tarjeta-tarea[data-id="${editingId}"]`); // busco la tarjeta vieja en pantalla
      const newCard = createTaskCard(task, handleDelete, handleEdit); // creo la tarjeta nueva con los datos actualizados
      const lista = document.querySelector(`.lista-tareas[data-estado="${task.estado}"]`); // la lista que le toca por su estado

      if (oldCard.parentElement === lista) { // si sigue en la misma columna
        oldCard.replaceWith(newCard); // se cambia en el mismo lugar
      } else { // si cambio de estado
        oldCard.remove(); // se quita de la columna vieja
        lista.append(newCard); // y se pasa a la nueva
      }
    } else { // si no, es una tarea nueva
      const task = await taskManager.addTask(datos); // POST y espero la tarea con su id real
      const card = createTaskCard(task, handleDelete, handleEdit); // creo la tarjeta
      document
        .querySelector(`.lista-tareas[data-estado="${task.estado}"]`)
        .append(card); // la agrego a la columna de su estado
    }

    updateCounts(taskManager, currentProjectId); // se actualizan los contadores solo si el servidor respondio bien
    form.reset(); // se resetea el formulario para el proximo uso
    bootstrap.Modal.getOrCreateInstance(modalEl).hide(); // se cierra el modal
  } catch (error) { // si el servidor rechazo o esta apagado, el modal queda abierto para corregir
    const mensajes = error.mensajes ?? [error.message]; // los mensajes que armo api.js
    if (error.status === 400) showErrors(mensajes); // si es validacion se muestran dentro del formulario
    else mostrarAlerta(mensajes); // cualquier otro error sale como alerta flotante
  } finally { // se ejecuta siempre, haya salido bien o mal
    botonGuardar.disabled = false; // vuelvo a habilitar el boton
  }
});

modalEl.addEventListener("hidden.bs.modal", () => { // limpia los errores cada vez que se cierra el modal para poder abrirlo de nuevo
  clearErrors();
  form.reset();
  editingId = null; // se olvida la tarea en edicion por si cerraron el modal sin guardar
  modalEl.querySelector(".modal-title").textContent = "Nueva tarea";
  modalEl.querySelector('[type="submit"]').textContent = "Guardar";
});

function renderTasks() { // vuelve a dibujar todas las tarjetas a partir del arreglo local
  document.querySelectorAll(".lista-tareas").forEach((lista) => { // limpio cada columna para no duplicar tarjetas
    lista.innerHTML = "";
  });

  if (currentProjectId !== null) { // solo se dibuja si hay un proyecto abierto
    taskManager.getTasksByProject(currentProjectId).forEach((task) => { // recorre solo las tareas del proyecto abierto
      const card = createTaskCard(task, handleDelete, handleEdit); // crea la tarjeta de cada tarea
      document
        .querySelector(`.lista-tareas[data-estado="${task.estado}"]`)
        .append(card); // la mete en la columna de su estado
    });
  }

  updateCounts(taskManager, currentProjectId); // actualizo los contadores
}

const taskContainer = document.getElementById("task-container"); // un solo listener para todo el tablero (delegacion de eventos)

taskContainer.addEventListener("click", async (event) => { // ahora es async porque espera al servidor
  const doneBtn = event.target.closest(".btn-completar"); // closest sube por el DOM hasta el boton aunque el clic caiga en el icono
  if (doneBtn) { // solo me interesa si el clic fue en completar
    const taskElement = doneBtn.closest(".tarjeta-tarea"); // subo hasta la tarjeta que contiene el boton
    const taskId = Number(taskElement.dataset.id); // el data-id llega como texto, lo paso a numero para que coincida con el id de la base
    try { // el PUT puede fallar
      await taskManager.updateTask(taskId, "HECHO"); // cambia el estado en el servidor y en la copia local
      renderTasks(); // vuelvo a dibujar todo
    } catch (error) { // si fallo, la tarjeta se queda donde estaba
      mostrarAlerta(error.mensajes ?? [error.message]); // aviso al usuario
    }
  }
});

document.querySelectorAll(".columna").forEach((columna) => { // recorre cada columna del tablero
  const estado = columna.querySelector(".lista-tareas").dataset.estado; // saca el estado de esa columna desde su lista

  columna.addEventListener("dragover", (event) => { // se ejecuta mientras una tarjeta pasa por encima de la columna
    event.preventDefault(); // sin esto el navegador no deja soltar la tarjeta aqui
    columna.classList.add("sobre"); // resalta la columna para mostrar donde caeria la tarjeta
  });

  columna.addEventListener("dragleave", (event) => { // se ejecuta cuando la tarjeta sale de la columna
    if (!columna.contains(event.relatedTarget)) columna.classList.remove("sobre"); // solo quita el resaltado si salio de verdad y no si paso a un elemento hijo
  });

  columna.addEventListener("drop", async (event) => { // se ejecuta al soltar la tarjeta, ahora es async
    event.preventDefault(); // evita la accion por defecto del navegador
    columna.classList.remove("sobre"); // quita el resaltado
    const taskId = Number(event.dataTransfer.getData("text/plain")); // lee el id guardado al arrastrar y lo pasa a numero
    const task = taskManager.getTask(taskId); // busca la tarea en la copia local
    if (!task || task.estado === estado) return; // si no existe o se solto en su misma columna no hace nada
    try { // el PUT puede fallar
      await taskManager.updateTask(taskId, estado); // guarda el cambio de columna en la base de datos
      renderTasks(); // redibuja para que la tarjeta aparezca en su nueva columna
    } catch (error) { // si falla, la tarjeta no se mueve
      mostrarAlerta(error.mensajes ?? [error.message]); // aviso al usuario
    }
  });
});

const modalProyecto = document.getElementById("modalProyecto"); // el modal de crear proyecto

function renderProyectos() { // dibuja la barra lateral y las tarjetas de la vista de inicio
  const lista = document.getElementById("lista-proyectos"); // la lista de la barra lateral
  const grid = document.getElementById("grid-proyectos"); // el contenedor de tarjetas de la vista de inicio
  lista.innerHTML = ""; // limpia para no duplicar
  grid.innerHTML = ""; // limpia para no duplicar

  projectManager.getAllProjects().forEach((p) => { // recorre cada proyecto
    const btn = document.createElement("button"); // boton de la barra lateral
    btn.type = "button"; // no envia nada
    btn.className = "item-proyecto" + (p.id === currentProjectId ? " activo" : ""); // marca el que esta abierto
    btn.textContent = p.nombre; // textContent evita inyectar codigo
    btn.addEventListener("click", () => abrirProyecto(p.id)); // al hacer click abre ese proyecto
    const li = document.createElement("li"); // elemento de la lista
    li.append(btn); // mete el boton
    lista.append(li); // lo agrega a la barra

    const col = document.createElement("div"); // columna de la tarjeta grande
    col.className = "col-md-6 col-lg-4"; // tamano responsive de bootstrap
    const tarjeta = document.createElement("article"); // tarjeta del proyecto
    tarjeta.className = "tarjeta-proyecto"; // clase para el estilo
    const nombre = document.createElement("h3"); // nombre del proyecto
    nombre.className = "tarea-titulo"; // reutiliza el estilo del titulo
    nombre.textContent = p.nombre; // pone el nombre
    const desc = document.createElement("p"); // descripcion
    desc.className = "tarea-desc"; // reutiliza el estilo de descripcion
    desc.textContent = p.descripcion || "Sin descripción"; // si no hay descripcion muestra un texto por defecto
    const total = document.createElement("span"); // contador de tareas
    total.className = "text-body-secondary small"; // texto pequeno y gris
    const cantidad = taskManager.getTasksByProject(p.id).length; // cuantas tareas tiene el proyecto
    total.textContent = `${cantidad} ${cantidad === 1 ? "tarea" : "tareas"}`; // singular si es solo una
    const del = document.createElement("button"); // boton eliminar proyecto
    del.type = "button"; // no envia nada
    del.className = "btn btn-eliminar btn-sm rounded-pill"; // mismo estilo que el de tareas
    del.title = "Eliminar proyecto"; // texto al pasar el mouse
    del.innerHTML = '<i class="bi bi-trash"></i>'; // icono de papelera
    del.addEventListener("click", (e) => { e.stopPropagation(); eliminarProyecto(p.id); }); // stopPropagation evita que tambien se abra el proyecto
    const pie = document.createElement("div"); // pie de la tarjeta
    pie.className = "d-flex justify-content-between align-items-center"; // total a la izquierda y boton a la derecha
    pie.append(total, del); // los mete en el pie
    tarjeta.append(nombre, desc, pie); // arma la tarjeta
    tarjeta.addEventListener("click", () => abrirProyecto(p.id)); // click en la tarjeta abre el proyecto
    col.append(tarjeta); // la mete en la columna
    grid.append(col); // la agrega a la vista de inicio
  });
}

function abrirProyecto(projectId) { // muestra el tablero de un proyecto
  currentProjectId = projectId; // guarda cual esta abierto
  const p = projectManager.getProject(projectId); // busca sus datos
  document.getElementById("titulo-proyecto").textContent = p.nombre; // pone el nombre arriba del tablero
  document.getElementById("desc-proyecto").textContent = p.descripcion; // pone la descripcion
  document.getElementById("vista-inicio").classList.add("d-none"); // oculta la vista de inicio
  document.getElementById("vista-tablero").classList.remove("d-none"); // muestra el tablero
  renderTasks(); // dibuja solo las tareas de este proyecto
  renderProyectos(); // actualiza cual aparece marcado en la barra
}

function mostrarInicio() { // vuelve a la vista principal
  currentProjectId = null; // ya no hay proyecto abierto
  document.getElementById("vista-tablero").classList.add("d-none"); // oculta el tablero
  document.getElementById("vista-inicio").classList.remove("d-none"); // muestra el inicio
  renderProyectos(); // redibuja para actualizar los totales
}

let proyectoAEliminar = null; // id del proyecto que se va a eliminar si el usuario confirma
const modalConfirmar = document.getElementById("modalConfirmar"); // el modal de confirmacion

function eliminarProyecto(projectId) { // solo abre el modal de confirmacion
  const p = projectManager.getProject(projectId); // busca el proyecto para mostrar su nombre
  proyectoAEliminar = projectId; // recuerda cual se quiere eliminar
  document.getElementById("confirmar-texto").textContent = `Se eliminará "${p.nombre}" con todas sus tareas. Esta acción no se puede deshacer.`; // textContent evita inyectar codigo
  bootstrap.Modal.getOrCreateInstance(modalConfirmar).show(); // abre el modal
}

document.getElementById("btn-confirmar-eliminar").addEventListener("click", async () => { // async porque habla con el servidor
  if (proyectoAEliminar === null) return; // si no hay proyecto elegido no hace nada
  try { // borrar puede fallar
    await taskManager.deleteTasksByProject(proyectoAEliminar); // primero borra sus tareas en la base de datos
    await projectManager.deleteProject(proyectoAEliminar); // luego borra el proyecto en la base de datos
  } catch (error) { // si algo fallo, el modal queda abierto
    mostrarAlerta(error.mensajes ?? [error.message]); // aviso al usuario
    return; // me salgo sin cerrar nada
  }
  proyectoAEliminar = null; // ya no hay nada pendiente
  document.activeElement.blur(); // quita el foco para evitar el aviso de aria-hidden
  bootstrap.Modal.getOrCreateInstance(modalConfirmar).hide(); // cierra el modal
  mostrarInicio(); // redibuja la vista principal
});

modalConfirmar.addEventListener("hidden.bs.modal", () => { // si cierran el modal sin confirmar
  proyectoAEliminar = null; // se olvida el proyecto elegido
});

document.getElementById("btn-volver").addEventListener("click", mostrarInicio); // el boton volver lleva al inicio

document.getElementById("project-form").addEventListener("submit", async (event) => { // async porque habla con el servidor
  event.preventDefault(); // evita que la pagina se recargue
  const formulario = event.target; // guardo el formulario porque despues de un await event.target puede dar problemas
  const nombre = document.getElementById("proyecto-nombre").value.trim(); // lee el nombre sin espacios sobrantes
  const descripcion = document.getElementById("proyecto-descripcion").value.trim(); // lee la descripcion opcional
  const error = document.getElementById("proyecto-error"); // caja de errores
  if (nombre.length < 3) { // valida el minimo de caracteres antes de molestar al servidor
    error.textContent = "el nombre debe tener minimo 3 caracteres"; // mensaje de error
    error.classList.remove("d-none"); // lo muestra
    return; // se sale sin crear nada
  }
  try { // crear puede fallar
    const project = await projectManager.addProject({ nombre, descripcion }); // POST y espera el proyecto con su id real
    formulario.reset(); // deja el formulario vacio
    error.classList.add("d-none"); // oculta el error
    document.activeElement.blur(); // quita el foco para evitar el aviso de aria-hidden
    bootstrap.Modal.getOrCreateInstance(modalProyecto).hide(); // cierra el modal
    abrirProyecto(project.id); // abre el proyecto recien creado
  } catch (e) { // si el servidor rechazo o esta apagado, el modal queda abierto
    error.textContent = (e.mensajes ?? [e.message]).join(". "); // muestra los mensajes dentro del modal
    error.classList.remove("d-none"); // lo muestra
  }
});

async function iniciar() { // se ejecuta al cargar la pagina
  try { // si el backend esta apagado no se debe romper la pagina
    await Promise.all([taskManager.cargar(), projectManager.cargar()]); // pide tareas y proyectos a la vez y espera a que lleguen los dos
  } catch (error) { // backend apagado o error del servidor
    mostrarAlerta(error.mensajes ?? [error.message]); // aviso al usuario
  }
  mostrarInicio(); // arranca en la vista principal
}

const sidebar = document.getElementById("sidebar"); // la barra lateral
const btnSidebar = document.getElementById("btn-sidebar"); // el boton que la esconde y la muestra

btnSidebar.addEventListener("click", () => { // cada clic alterna entre esconder y mostrar
  const colapsada = sidebar.classList.toggle("colapsada"); // toggle pone la clase si no esta y la quita si esta, y devuelve true si quedo puesta
  btnSidebar.setAttribute("aria-expanded", String(!colapsada)); // avisa a los lectores de pantalla si la barra esta abierta
  btnSidebar.title = colapsada ? "Mostrar barra lateral" : "Ocultar barra lateral"; // el texto al pasar el mouse cambia segun el estado
});

iniciar(); // llama a iniciar cuando ya existe todo lo anterior