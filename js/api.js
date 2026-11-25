const API_URL = "http://localhost:8080/api/tasks"; // direccion base de la API, si cambia (por ejemplo al desplegar) solo se edita aqui

async function peticion(url, opciones) { // funcion interna que hace el fetch y maneja los errores, la usan las 4 funciones de abajo
  let response; // la declaro afuera del try para poder usarla despues
  try { // try porque fetch falla de golpe si el servidor esta apagado
    response = await fetch(url, opciones); // espera la respuesta del servidor sin congelar la pagina
  } catch { // entra aqui si no hubo conexion: backend apagado, puerto equivocado o CORS bloqueado
    const error = new Error("no se pudo conectar con el servidor"); // creo el error con un mensaje claro
    error.mensajes = ["no se pudo conectar con el servidor, revisa que el backend este encendido"]; // lo dejo como arreglo porque showErrors de validation.js espera un arreglo
    throw error; // lo lanzo para que quien llamo lo atrape con su propio try-catch
  }

  if (response.status === 204) return null; // 204 es borrado exitoso y no trae cuerpo, si intento leer el json fallaria

  let data = null; // aqui guardo lo que responda el servidor
  try { // el cuerpo no siempre es un json valido
    data = await response.json(); // convierte el texto de la respuesta a objeto de javascript
  } catch { // si no se pudo leer, sigo con null y no rompo la app
    data = null; // sin datos
  }

  if (!response.ok) { // response.ok es false con cualquier codigo 400 o 500, fetch no lanza error por eso solo
    let mensajes; // lista de textos que se van a mostrar al usuario
    if (response.status === 400 && data) mensajes = Object.values(data); // el 400 llega como {campo: mensaje}, Object.values saca solo los mensajes
    else if (response.status === 404 && data) mensajes = [data.error]; // el 404 llega como {error: mensaje}
    else mensajes = ["ocurrio un error en el servidor"]; // cualquier otro caso: mensaje generico
    const error = new Error(mensajes.join(", ")); // junto los mensajes en un solo texto para el Error
    error.mensajes = mensajes; // dejo tambien el arreglo para pintarlo como lista en el formulario
    error.status = response.status; // guardo el codigo por si hay que tratar cada caso distinto
    throw error; // lanzo el error para que lo atrape el catch de main.js
  }

  return data; // si todo salio bien, devuelvo los datos del servidor
}

export function obtenerTareas() { // pide todas las tareas, reemplaza a cargar() de TaskManager
  return peticion(API_URL); // sin opciones, fetch hace GET por defecto
}

export function crearTarea(tarea) { // envia una tarea nueva, reemplaza a addTask
  return peticion(API_URL, { // segundo parametro: la configuracion de la peticion
    method: "POST", // POST es para crear
    headers: { "Content-Type": "application/json" }, // le avisa a Spring que el cuerpo viene en json
    body: JSON.stringify(tarea), // el fetch solo envia texto, por eso el objeto se convierte con JSON.stringify
  });
}

export function actualizarTarea(id, tarea) { // actualiza una tarea completa, reemplaza a updateTask y editTask
  return peticion(`${API_URL}/${id}`, { // el id va en la ruta, por ejemplo /api/tasks/5
    method: "PUT", // PUT es para actualizar
    headers: { "Content-Type": "application/json" }, // el cuerpo tambien es json
    body: JSON.stringify(tarea), // el backend pide la tarea completa, no solo el campo que cambio
  });
}

export function eliminarTarea(id) { // borra una tarea por su id, reemplaza a deleteTask
  return peticion(`${API_URL}/${id}`, { method: "DELETE" }); // DELETE no necesita headers ni cuerpo
}



// para los projects 



const API_PROYECTOS = "http://localhost:8080/api/projects"; // direccion base de los proyectos

export function obtenerProyectos() { // pide todos los proyectos
  return peticion(API_PROYECTOS); // GET por defecto, reutiliza la funcion peticion de arriba con todo su manejo de errores
}

export function crearProyecto(proyecto) { // envia un proyecto nuevo
  return peticion(API_PROYECTOS, { // segundo parametro: la configuracion
    method: "POST", // POST es para crear
    headers: { "Content-Type": "application/json" }, // el cuerpo va en json
    body: JSON.stringify(proyecto), // convierte el objeto a texto
  });
}

export function eliminarProyecto(id) { // borra un proyecto por su id
  return peticion(`${API_PROYECTOS}/${id}`, { method: "DELETE" }); // DELETE no necesita cuerpo
}