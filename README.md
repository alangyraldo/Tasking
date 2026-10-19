# Tasking | Planificador de tareas

Tasking es un planificador de tareas tipo tablero (como Trello o GitHub Projects) donde puedes crear tareas, verlas organizadas por estado y eliminarlas cuando ya no las necesites.

Proyecto universitario desarrollado con HTML, CSS y JavaScript.

> **Estado del proyecto:** Sprint 2 completado. Las tareas se guardan solo en memoria, así que al recargar la página se pierden. La persistencia se verá en sprints posteriores.

## Funcionalidades

- Formulario para crear tareas dentro de un modal.
- Validación de todos los campos con mensajes de error claros.
- Tablero con 4 columnas: **Por hacer**, **En proceso**, **Revisión** y **Hecho**.
- Cada tarea se muestra como una tarjeta con nombre, descripción, responsable, fecha de entrega y estado.
- Contador de tareas por columna.
- Botón para eliminar tareas (se borran de la pantalla y de la lista interna).
- ID único e incremental para cada tarea.

## Tecnologías

- HTML5
- CSS3
- JavaScript (módulos ES6 y clases)
- Bootstrap 5.3 (por CDN)
- Fuente Poppins (Google Fonts)

## Estructura del proyecto

```
Tasking/
├── index.html           # Estructura de la página, tablero y formulario
├── README.md
├── css/
│   └── style.css        # Estilos personalizados
└── js/
    ├── main.js          # Punto de entrada: conecta el formulario con la lógica
    ├── TaskManager.js   # Clase que gestiona la lista de tareas
    ├── validation.js    # Validación del formulario y mensajes de error
    └── ui.js            # Creación de tarjetas y contadores en el DOM
```

## Cómo ejecutarlo

El proyecto usa módulos de JavaScript, por lo que **no funciona abriendo `index.html` con doble clic**. Hay que servirlo desde un servidor local.

1. Clona el repositorio:
```bash
   git clone https://github.com/alangyraldo/Tasking.git
```
2. Abre la carpeta en Visual Studio Code.
3. Instala la extensión **Live Server**.
4. Click derecho sobre `index.html` y elige **Open with Live Server**.

## Reglas de validación

| Campo | Regla |
|---|---|
| Nombre | No vacío y más de 8 caracteres |
| Descripción | No vacía y más de 15 caracteres |
| Asignado a | No vacío y más de 8 caracteres |
| Fecha de entrega | No vacía |
| Estado | Debe seleccionarse uno |

Si algún campo es inválido, la tarea no se agrega y se muestra un mensaje indicando qué campo falló y por qué.

## Estructura de una tarea

```js
{
  id: 1,
  nombre: "Preparar presentación",
  descripcion: "Armar las diapositivas del proyecto final",
  asignadoA: "Alan Melo",
  fechaDeEntrega: "2026-10-30",
  estado: "POR HACER" // POR HACER | EN PROCESO | REVISIÓN | HECHO
}
```

## Clase `TaskManager`

| Método | Descripción |
|---|---|
| `getAllTasks()` | Devuelve todas las tareas |
| `getTasksWithStatus(status)` | Devuelve las tareas con un estado dado |
| `addTask(task)` | Agrega una tarea y le asigna un ID único |
| `deleteTask(taskId)` | Elimina una tarea por su ID |
| `updateTask(taskId, status)` | Actualiza el estado de una tarea |
| `assignTask(taskId, assignee)` | Cambia la persona asignada |

## Flujo de la aplicación

1. El usuario abre el modal con **+ Nueva tarea** y llena el formulario.
2. Al enviar, `validateTaskForm()` revisa los campos.
3. Si hay errores, se muestran y no se agrega nada.
4. Si todo es válido, `TaskManager.addTask()` guarda la tarea con un ID nuevo.
5. `createTaskCard()` genera la tarjeta y se agrega a su columna.
6. Al presionar **Eliminar**, la tarea se borra del array y la tarjeta del DOM.

## Próximos pasos

- [ ] Persistencia con `localStorage`
- [ ] Editar tareas
- [ ] Mover tareas entre columnas
- [ ] Filtrar por estado o responsable
- [ ] Conexión con base de datos MySQL

## Autor

**Alan Melo Giraldo**
Estudiante de Ingeniería de Software, Universitaria de Colombia
GitHub: [@alangyraldo](https://github.com/alangyraldo)