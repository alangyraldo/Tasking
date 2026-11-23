export function createTaskCard(task, onDelete, onEdit) { // crea la tarjeta de una tarea y recibe la funcion de eliminar y la de editar
  const card = document.createElement("article"); // crea el contenedor principal de la tarjeta
  card.className = "tarjeta-tarea"; // le pone la clase que usa el css y que buscan las pruebas
  card.dataset.id = task.id; // guarda el id en el html como data-id para encontrar la tarjeta despues
  card.dataset.estado = task.estado; // guarda el estado en el html por si se quiere dar color segun la columna

  // esto es para arrastrar las cartas 
  card.draggable = true; // le dice al navegador que esta tarjeta se puede agarrar y arrastrar
  card.addEventListener("dragstart", (event) => { // se ejecuta cuando empiezas a arrastrar la tarjeta
    event.dataTransfer.setData("text/plain", task.id); // guarda el id de la tarea dentro del arrastre para leerlo al soltar
    event.dataTransfer.effectAllowed = "move"; // indica que el arrastre es para mover y no para copiar
    card.classList.add("arrastrando"); // le pone una clase para que se vea semitransparente mientras se arrastra
  });
  card.addEventListener("dragend", () => { // se ejecuta cuando sueltas la tarjeta en cualquier lugar
    card.classList.remove("arrastrando"); // le quita el efecto semitransparente
  }); 



  const title = document.createElement("h3"); // crea el titulo de la tarea
  title.className = "tarea-titulo"; // clase para darle estilo de negrita en el css
  title.textContent = task.nombre; // pone el nombre con textContent para que no se pueda inyectar codigo

  const desc = document.createElement("p"); // crea el parrafo de la descripcion
  desc.className = "tarea-desc"; // clase que la pone en gris y la limita a 2 lineas
  desc.textContent = task.descripcion; // pone la descripcion de la tarea

  const date = document.createElement("span"); // crea el contenedor de la fecha
  date.className = "tarea-fecha"; // clase para identificar la fecha en el css
  date.title = `Entrega: ${task.fechaDeEntrega}`; // al pasar el mouse muestra la fecha completa
  const fecha = new Date(`${task.fechaDeEntrega}T00:00:00`); // convierte el texto en fecha real y la hora evita que se corra un dia por la zona horaria
  const fechaCorta = isNaN(fecha) // pregunta si la fecha no es valida
    ? task.fechaDeEntrega // si no es valida deja el texto como llego
    : fecha.toLocaleDateString("es-CO", { day: "numeric", month: "short" }); // si es valida la deja corta en español por ejemplo 26 dic
  date.append(crearIcono("bi-calendar-event"), ` ${fechaCorta}`); // mete el icono de calendario y la fecha corta dentro del span

  const avatar = document.createElement("span"); // crea el circulo de la persona asignada
  avatar.className = "tarea-avatar"; // clase que lo vuelve un circulo
  avatar.title = `Asignado a: ${task.asignadoA}`; // al pasar el mouse muestra el nombre completo
  avatar.textContent = task.asignadoA.charAt(0).toUpperCase(); // muestra solo la primera letra del nombre en mayuscula

  const meta = document.createElement("div"); // crea un contenedor para juntar fecha y avatar
  meta.className = "tarea-meta"; // clase que los pone uno al lado del otro
  meta.append(date, avatar); // mete la fecha y el avatar en ese contenedor

  const editBtn = document.createElement("button"); // crea el boton de editar
  editBtn.type = "button"; // evita que el boton envie el formulario
  editBtn.className = "btn btn-editar btn-sm rounded-pill"; // clases de bootstrap y propias para el estilo
  editBtn.title = "Editar"; // texto que sale al pasar el mouse
  editBtn.setAttribute("aria-label", "Editar"); // nombre del boton para lectores de pantalla
  editBtn.append(crearIcono("bi-pencil-square")); // le pone el icono de lapiz
  editBtn.addEventListener("click", () => onEdit(task.id, card)); // al hacer click llama a la funcion de editar con el id de la tarea

  const deleteBtn = document.createElement("button"); // crea el boton de eliminar
  deleteBtn.type = "button"; // evita que el boton envie el formulario
  deleteBtn.className = "btn btn-eliminar btn-sm rounded-pill"; // clases para el estilo
  deleteBtn.title = "Eliminar"; // texto que sale al pasar el mouse
  deleteBtn.setAttribute("aria-label", "Eliminar"); // nombre del boton para lectores de pantalla
  deleteBtn.append(crearIcono("bi-trash")); // le pone el icono de papelera
  deleteBtn.addEventListener("click", () => onDelete(task.id, card)); // al hacer click llama a la funcion de eliminar con el id y la tarjeta

  const doneBtn = document.createElement("button"); // crea el boton de marcar como hecha
  doneBtn.type = "button"; // evita que el boton envie el formulario
  doneBtn.className = "btn btn-completar btn-outline-success btn-sm rounded-pill"; // btn-completar es la clase que busca el listener de main.js
  doneBtn.title = "Marcar como hecha"; // texto que sale al pasar el mouse
  doneBtn.setAttribute("aria-label", "Marcar como hecha"); // nombre del boton para lectores de pantalla
  doneBtn.append(crearIcono("bi-check-lg")); // le pone el icono de check

  const actions = document.createElement("div"); // crea el contenedor de los botones
  actions.className = "tarea-acciones"; // clase que los pone en fila con espacio entre ellos
  actions.append(editBtn, deleteBtn); // mete los botones de editar y eliminar
  if (task.estado !== "HECHO") actions.prepend(doneBtn); // si la tarea no esta hecha agrega el boton de completar al principio

  const footer = document.createElement("div"); // crea el pie de la tarjeta
  footer.className = "tarea-pie"; // clase que pone la fecha y avatar a la izquierda y los botones a la derecha
  footer.append(meta, actions); // mete la informacion y los botones en el pie

  card.append(title, desc, footer); // arma la tarjeta en orden titulo descripcion y pie
  return card; // devuelve la tarjeta terminada para que quien la llame la ponga en pantalla
} 

function crearIcono(clase) { // crea un icono de bootstrap icons para meterlo en botones y textos
  const icono = document.createElement("i"); // crea la etiqueta i que es la que usa bootstrap icons
  icono.className = `bi ${clase}`; // le pone la clase base bi y la del icono que se pidio
  return icono; // devuelve el icono listo para usar
} 
export function addTaskToList(task, onDelete, onEdit) { // crea la tarjeta y la agrega a la columna que le toca
  const card = createTaskCard(task, onDelete, onEdit); // reutiliza la funcion que arma la tarjeta
  document.querySelector(`.lista-tareas[data-estado="${task.estado}"]`).append(card); // busca la columna segun el estado y mete la tarjeta al final
  return card; // devuelve la tarjeta por si se necesita despues
} 

export function removeTaskFromList(taskId) { // quita la tarjeta de la pantalla segun el id de la tarea
  const card = document.querySelector(`.tarjeta-tarea[data-id="${taskId}"]`); // busca la tarjeta que tenga ese data-id
  if (card) card.remove(); // si la encontro la saca del html y si no existe no hace nada
} 

export function updateCounts(taskManager) { // actualiza los numeros que aparecen al lado del titulo de cada columna
  document.querySelectorAll(".conteo").forEach((badge) => { // recorre cada contador de la pantalla
    badge.textContent = taskManager.getTasksWithStatus(badge.dataset.estado).length; // cuenta las tareas de ese estado y escribe el numero
  }); 
} 