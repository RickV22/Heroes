window.addEventListener('DOMContentLoaded', cargarHeroes);

document.getElementById('imagen').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function () {
            const base64Url = reader.result;
            document.getElementById('vista-previa-imagen').src = base64Url;
            console.log(base64Url);
        };

        reader.readAsDataURL(file);
    } else {
        console.error('Please select a valid image file.');
    }
});

document.getElementById('formulario-heroe').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const habilidad = document.getElementById('habilidad').value;
    const compania = document.getElementById('compania').value;
    const genero = document.getElementById('genero').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagen = document.getElementById('vista-previa-imagen').src;

    const heroData = {
        nombre,
        habilidad,
        compania,
        genero,
        descripcion,
        imagen,
    };
    axios.post('http://127.0.0.1/api/heroes', heroData)
        .then((res) => {
            alert('Héroe registrado exitosamente');  
            document.getElementById('formulario-heroe').reset();  
            document.getElementById('vista-previa-imagen').src = "";  
            cargarHeroes();  
        })
        .catch((error) => {
            console.error('Error al registrar héroe:', error);
            alert('Ocurrió un error al registrar el héroe.');
        });
});

function cargarHeroes() {
    const listaHeroes = document.querySelector('#lista-heroes')
    axios.get('http://127.0.0.1/api/heroes')
        .then((response) => response.data)
        .then((heroes) => {
            listaHeroes.innerHTML = '';
            heroes.forEach((heroe) => {
                const tarjetaHeroe = `
                  <div class="col-12 mb-4"> <!-- Ocupa todo el ancho de la fila -->
                      <div class="card tarjeta-heroe">
                          <img src="${heroe.imagen}" alt="Imagen de ${heroe.nombre}" class="imagen-heroe">
                          <div class="card-body">
                              <h5 class="card-title">${heroe.nombre}</h5>
                              <p class="card-text">Habilidad: ${heroe.habilidad}</p>
                              <p class="card-text">Compañía: ${heroe.compania}</p>
                              <p class="card-text">Género: ${heroe.genero}</p>
                              <p class="card-text">Descripción: ${heroe.descripcion}</p>
                              <button class="btn btn-danger" onclick="eliminarHeroe(${heroe.id})">Eliminar</button>
                              <button class="btn btn-secondary" onclick="editarHeroe(${heroe.id})">Editar</button>
                          </div>
                      </div>
                  </div>
              `;
                listaHeroes.insertAdjacentHTML('beforeend', tarjetaHeroe);
            });
        });
}


function editarHeroe(id) {
    axios.get(`http://127.0.0.1/api/heroes/${id}`)
        .then((response) => {
            const heroe = response.data;

            // Cargar datos en el formulario del modal
            document.getElementById('editar-nombre').value = heroe.nombre;
            document.getElementById('editar-habilidad').value = heroe.habilidad;
            document.getElementById('editar-compania').value = heroe.compania;
            document.getElementById('editar-genero').value = heroe.genero;
            document.getElementById('editar-descripcion').value = heroe.descripcion;
            document.getElementById('vista-previa-editar-imagen').src = heroe.imagen;

            // Abrir el modal
            const modalEditarHeroe = new bootstrap.Modal(document.getElementById('modalEditarHeroe'));
            modalEditarHeroe.show();

            // Asignar evento de guardado
            document.getElementById('formulario-editar-heroe').onsubmit = (event) => {
                event.preventDefault();
                actualizarHeroe(id);  // Llamada para actualizar el héroe
            };
        })
        .catch((error) => {
            console.error('Error al obtener datos del héroe:', error);
            alert('Ocurrió un error al cargar los datos del héroe.');
        });
}

function actualizarHeroe(id) {
    const nombre = document.getElementById('editar-nombre').value;
    const habilidad = document.getElementById('editar-habilidad').value;
    const compania = document.getElementById('editar-compania').value;
    const genero = document.getElementById('editar-genero').value;
    const descripcion = document.getElementById('editar-descripcion').value;
    const imagen = document.getElementById('vista-previa-editar-imagen').src;

    const heroData = {
        nombre,
        habilidad,
        compania,
        genero,
        descripcion,
        imagen,
    };

    axios.put(`http://127.0.0.1/api/heroes/${id}`, heroData)
        .then(() => {
            alert('Héroe actualizado exitosamente');
            cargarHeroes();  // Refresca la lista con los datos actualizados

            // Cerrar el modal
            const modalEditarHeroe = bootstrap.Modal.getInstance(document.getElementById('modalEditarHeroe'));
            modalEditarHeroe.hide();
        })
        .catch((error) => {
            console.error('Error al actualizar héroe:', error);
            alert('Ocurrió un error al actualizar el héroe.');
        });
}

function guardarCambios(id) {
    const nombre = document.getElementById(`nombre-${id}`).value;
    const habilidad = document.getElementById(`habilidad-${id}`).value;
    const compania = document.getElementById(`compania-${id}`).value;
    const genero = document.getElementById(`genero-${id}`).value;
    const descripcion = document.getElementById(`descripcion-${id}`).value;

    const heroeActualizado = {
        nombre,
        habilidad,
        compania,
        genero,
        descripcion,
    };

    axios.put(`http://127.0.0.1/api/heroes/${id}`, heroeActualizado)
        .then((response) => {
            alert('Héroe actualizado exitosamente');
            cargarHeroes();
        })
        .catch((error) => {
            console.error('Error al actualizar el héroe:', error);
            alert('Ocurrió un error al actualizar el héroe.');
        });
}


function eliminarHeroe(id) {
    if (confirm('¿Está seguro de eliminar este héroe?')) {
        axios.delete(`http://127.0.0.1/api/heroes/${id}`)
            .then((res) => {
                alert(res.data.msg || 'Héroe eliminado exitosamente');
                cargarHeroes();
            })
            .catch((error) => {
                console.error('Error al eliminar héroe:', error);
                alert('Ocurrió un error al eliminar el héroe.');
            });
    }
}

