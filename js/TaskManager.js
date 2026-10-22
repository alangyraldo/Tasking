
export class TaskManager {// se crea una clase que s eencarga de gestioanr tareas 
  constructor() {// se crea el cosntructor y se jecuta una vez
    this.tasks = [];// creo un array donde guardo las tareas
    this.currentId = 0; // solo sube asi los ids nunca se repiten
  }

  getAllTasks() {// devuelvo el arreglo con las tareas
    return this.tasks;
  }

  getTasksWithStatus(status) {// para verificar el estatus 
    return this.tasks.filter((t) => t.estado === status);// filtro que recorre el array y me quedo con las tareas que coinsidan
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

  etTask(taskId) {
    return this.tasks.find((t) => t.id === taskId);
  }

  editTask(taskId, datos) {
    const task = this.getTask(taskId);
    if (task) Object.assign(task, datos); // reemplaza solo los campos que llegan
    return task;
  }
}