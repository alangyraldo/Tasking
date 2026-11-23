
export class TaskManager {// se crea una clase que s eencarga de gestioanr tareas 
  constructor() {// se crea el cosntructor y se jecuta una vez
    this.tasks = [];// creo un array donde guardo las tareas
    this.currentId = 0; // solo sube asi los ids nunca se repiten
  }

  getAllTasks() {// devuelvo el arreglo con las tareas
    return this.tasks;
  }

 getTasksWithStatus(status, projectId) { // filtra por estado y ahora tambien por proyecto si llega uno
    return this.tasks.filter((t) => t.estado === status && (projectId === undefined || t.proyectoId === projectId)); // si no llega proyecto cuenta todas como antes y asi las pruebas no se rompen
  } 

  getTasksByProject(projectId) { // devuelve solo las tareas de un proyecto
    return this.tasks.filter((t) => t.proyectoId === projectId); // se queda con las que tienen ese proyectoId
  }

  deleteTasksByProject(projectId) { // borra todas las tareas de un proyecto cuando se elimina el proyecto
    this.tasks = this.tasks.filter((t) => t.proyectoId !== projectId); // se queda con las de los demas proyectos
  } 
  addTask(task) {// para agregar una nueva tareaa a la lista 
    this.currentId++;// genero un aumento en el contador para que cada tareas sea diferente id
    const newTask = { id: this.currentId, ...task }; // creo la tarea final y arrastro todo lo que piden
    this.tasks.push(newTask); // lo agregamos al final de la fika
    return newTask;// me muesta el idpar poder usarla despues 
  }

  deleteTask(taskId) {// para eliminar la tarea dela lista 
    this.tasks = this.tasks.filter((t) => t.id !== taskId);//me quedo con las tareas menos con el id que elegi
  }

  updateTask(taskId, status) {// par cambiar el estado de una tarea 
    const task = this.tasks.find((t) => t.id === taskId);// busco la tarea por id 
    // con find me devuelve la que coincida 
    if (task) task.estado = status;// una condicional si la encuentro me cambia el estdo sino pues no
  }

  assignTask(taskId, assignee) {//para cambiar la asignacion de una tarea
    const task = this.tasks.find((t) => t.id === taskId);//de buenvo buscamos la tarea por id con find 
    if (task) task.asignadoA = assignee;// otro if para ver si existe cambiar sino pues no 
  }

  getTask(taskId) {// busca una tarea por su id y la devuelve
    return this.tasks.find((t) => t.id === taskId);
  }

  editTask(taskId, datos) {
    const task = this.getTask(taskId);
    if (task) Object.assign(task, datos); // reemplaza solo los campos que llegan
    return task;
  }

  
  guardar() {// guarda las tareas y el contador en el navegador
    localStorage.setItem("tasks", JSON.stringify(this.tasks));// localStorage solo guarda strings, por eso el arreglo se pasa a texto con JSON.stringify
    localStorage.setItem("currentId", String(this.currentId));// el contador tambien se guarda para que las tareas nuevas sigan la numeracion despues de recargar
  }

  cargar() {// recupera lo guardado y lo deja en this.tasks y this.currentId
  const savedTasks = localStorage.getItem("tasks");// pedimos el texto guardado, si no hay nada devuelve null
  if (savedTasks !== null) {// solo se parsea si existe
    try {
      this.tasks = JSON.parse(savedTasks);// convierte el texto de vuelta a arreglo
    } catch {
      this.tasks = [];// si el texto está dañado, se empieza con una lista vacía en vez de romper la app
    }
  }
    const savedId = localStorage.getItem("currentId");// pedimos el contador guardado
    if (savedId !== null) this.currentId = Number(savedId);// localStorage lo devuelve como string, asi que se pasa a numero para que el ++ de addTask funcione bien
  }
}

