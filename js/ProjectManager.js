export class ProjectManager { // clase que se encarga de gestionar los proyectos igual que TaskManager con las tareas
  constructor() { // se ejecuta una vez al crear el manager
    this.projects = []; // arreglo donde se guardan los proyectos
    this.currentId = 0; // contador que solo sube para que los ids no se repitan
  } 

  addProject({ nombre, descripcion = "" }) { // crea un proyecto nuevo y la descripcion es opcional por eso trae un valor por defecto
    this.currentId++; // sube el contador para tener un id nuevo
    const project = { id: this.currentId, nombre, descripcion }; // arma el objeto del proyecto
    this.projects.push(project); // lo agrega al final del arreglo
    return project; // lo devuelve para poder abrirlo despues de crearlo
  } 

  getAllProjects() { // devuelve todos los proyectos
    return this.projects; // el arreglo completo
  } 

  getProject(projectId) { // busca un proyecto por su id
    return this.projects.find((p) => p.id === projectId); // find devuelve el que coincida o undefined
  }
  deleteProject(projectId) { // elimina un proyecto de la lista
    this.projects = this.projects.filter((p) => p.id !== projectId); // se queda con todos menos el del id elegido
  }

  guardar() { // guarda los proyectos en el navegador
    localStorage.setItem("projects", JSON.stringify(this.projects)); // el arreglo se pasa a texto porque localstorage solo guarda strings
    localStorage.setItem("projectCurrentId", String(this.currentId)); // guarda el contador para seguir la numeracion al recargar
  } 

  cargar() { // recupera los proyectos guardados
    const saved = localStorage.getItem("projects"); // pide el texto guardado y si no hay nada devuelve null
    if (saved !== null) { // solo se parsea si existe
      try { // por si el texto esta danado
        this.projects = JSON.parse(saved); // convierte el texto de vuelta a arreglo
      } catch { // si falla el parseo
        this.projects = []; // empieza con una lista vacia en vez de romper la app
      } // cierra el catch
    } // cierra el if
    const savedId = localStorage.getItem("projectCurrentId"); // pide el contador guardado
    if (savedId !== null) this.currentId = Number(savedId); // lo pasa a numero para que el ++ funcione
  } 
} 