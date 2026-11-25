import { obtenerProyectos, crearProyecto, eliminarProyecto } from "./api.js"; // las funciones que hablan con el backend

export class ProjectManager { // gestiona los proyectos igual que TaskManager con las tareas
  constructor() { // se ejecuta una vez al crear el manager
    this.projects = []; // copia local de los proyectos para dibujar sin pedirlos cada vez
  } // ya no hay currentId: ahora mysql genera los ids

  getAllProjects() { // devuelve todos los proyectos
    return this.projects; // la copia local
  }

  getProject(projectId) { // busca un proyecto por su id
    return this.projects.find((p) => p.id === projectId); // find devuelve el que coincida o undefined
  }

  async cargar() { //trae los proyectos desde la base de datos.
    this.projects = await obtenerProyectos(); // GET /api/projects y espera la respuesta
  }

  async addProject({ nombre, descripcion = "" }) { // crea un proyecto en el servidor
    const creado = await crearProyecto({ nombre, descripcion }); // POST, el servidor responde con el proyecto y su id real
    this.projects.push(creado); // solo lo agrego a la copia local si el servidor lo acepto
    return creado; // lo devuelvo para poder abrirlo despues de crearlo
  }

  async deleteProject(projectId) { // elimina un proyecto en el servidor
    await eliminarProyecto(projectId); // DELETE, si falla lanza un error y no sigue
    this.projects = this.projects.filter((p) => p.id !== projectId); // solo lo saco de la copia local si el servidor lo borro
  }
}