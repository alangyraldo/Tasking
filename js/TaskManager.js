import { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea } from "./api.js"; // traigo las 4 funciones que hablan con el backend

export class TaskManager { // sigue siendo la clase que gestiona las tareas, pero ahora la verdad esta en la base de datos
  constructor() { // se ejecuta una vez al crear el manager
    this.tasks = []; // copia local de las tareas, sirve para dibujar sin pedirlas al servidor cada vez
  } // ya no hay currentId porque ahora mysql genera los ids con auto_increment

  getAllTasks() { // devuelve el arreglo con las tareas
    return this.tasks; // la copia local
  }

  getTasksWithStatus(status, projectId) { // filtra por estado y tambien por proyecto si llega uno
    return this.tasks.filter((t) => t.estado === status && (projectId === undefined || t.proyectoId === projectId)); // si no llega proyecto cuenta todas como antes
  }

  getTasksByProject(projectId) { // devuelve solo las tareas de un proyecto
    return this.tasks.filter((t) => t.proyectoId === projectId); // se queda con las que tienen ese proyectoId
  }

  getTask(taskId) { // busca una tarea por su id en la copia local
    return this.tasks.find((t) => t.id === taskId); // find devuelve la que coincida o undefined
  }

  async cargar() { //  trae todas las tareas desde la base de dato
    this.tasks = await obtenerTareas(); // GET /api/tasks y espero la respuesta antes de seguir
  }

  async addTask(task) { // crea una tarea nueva en el servidor
    const creada = await crearTarea(task); // POST, el servidor responde con la tarea ya con su id real
    this.tasks.push(creada); // solo la agrego a la copia local si el servidor la acepto
    return creada; // devuelvo la tarea para poder dibujar su tarjeta
  }

  async editTask(taskId, datos) { // actualiza una tarea en el servidor y luego en la copia local
    const actual = this.getTask(taskId); // busco la tarea completa porque el PUT del backend pide todos los campos
    const guardada = await actualizarTarea(taskId, { ...actual, ...datos }); // mezclo lo viejo con lo nuevo y lo envio
    this.tasks = this.tasks.map((t) => (t.id === taskId ? guardada : t)); // reemplazo la version vieja por la que devolvio el servidor
    return guardada; // devuelvo la tarea ya guardada para dibujar la tarjeta
  }

  updateTask(taskId, status) { // cambia solo el estado, por ejemplo al marcar como hecha o al arrastrar
    return this.editTask(taskId, { estado: status }); // reutilizo editTask para no repetir la logica del PUT
  }

  assignTask(taskId, assignee) { // cambia la persona asignada
    return this.editTask(taskId, { asignadoA: assignee }); // mismo PUT, cambiando solo ese campo
  }

  async deleteTask(taskId) { // elimina una tarea en el servidor
    await eliminarTarea(taskId); // DELETE, si el servidor falla lanza un error y no sigue
    this.tasks = this.tasks.filter((t) => t.id !== taskId); // solo la saco de la copia local si el servidor la borro
  }

  async deleteTasksByProject(projectId) { // borra todas las tareas de un proyecto cuando se elimina el proyecto
    const ids = this.getTasksByProject(projectId).map((t) => t.id); // saco solo los ids de las tareas de ese proyecto
    await Promise.all(ids.map((id) => this.deleteTask(id))); // lanzo todos los DELETE a la vez y espero a que terminen
  }
}