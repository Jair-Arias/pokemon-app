const input = document.getElementById("pokemonInput");
const searchBtn = document.getElementById("searchBtn");
const searchResult = document.getElementById("searchResult");
const captureList = document.getElementById("captureList");
const errorMessage = document.getElementById("errorMessage");

// Lista de pokémon (se guarda aquí)
captured = JSON.parse(localStorage.getItem("capturedList")) || [];
renderCaptureList();

// Buscar Pokémon
searchBtn.addEventListener("click", async () => {
  const name = input.value.trim().toLowerCase();
  if (!name) return;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!res.ok) throw new Error("Pokémon no encontrado");

    const data = await res.json();
    errorMessage.textContent = "";

    // Mostrar la tarjeta del Pokémon encontrado
    const types = data.types.map(t => t.type.name).join(", ");
    const altura = data.height / 10; // en metros
    const peso = data.weight / 10; // en kg

    searchResult.innerHTML = `
    <div class="pokemon-card">
    <img src="${data.sprites.front_default}" alt="${data.name}" />
    <div>
      <h3>${data.name}</h3>
      <p><strong>Tipo:</strong> ${types}</p>
      <p><strong>Altura:</strong> ${altura} m</p>
      <p><strong>Peso:</strong> ${peso} kg</p>
      <button class="btn-agregar" onclick="addToCapture('${data.name}', '${data.sprites.front_default}')">Agregar</button>
        </div>
    </div>
    `;

  } catch (err) {
    errorMessage.textContent = err.message;
    searchResult.innerHTML = "";
  }
});

// Agregar Pokémon a la lista
function addToCapture(name, img, types, height, weight) {
  const exists = captured.find(p => p.name === name);
  if (!exists) {
    captured.push({ name, img, types, height, weight, status: false });
    renderCaptureList();
  } else {
    alert("Este Pokémon ya está en la lista.");
  }
}

// Mostrar la lista
function renderCaptureList() {
    localStorage.setItem("capturedList", JSON.stringify(captured));
    captureList.innerHTML = "";
    captured.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <span>${p.name}</span>
      <label>
        <input type="checkbox" ${p.status ? "checked" : ""} onchange="toggleStatus(${index})" />
        ${p.status ? "✔ Capturado" : "✖ Pendiente"}
      </label>
    `;
    captureList.appendChild(card);

    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <span>${p.name}</span>
      <label>
        <input type="checkbox" ${p.status ? "checked" : ""} onchange="toggleStatus(${index})" />
        ${p.status ? "✔ Capturado" : "✖ Pendiente"}
      </label>
      <button onclick="deleteOne(${index})">❌</button>
    `;

  });
}

// Filtro de búsqueda
function mostrarListaCaptura() {
  const lista = document.getElementById("listaCaptura");
  lista.innerHTML = "";

  const filtro = document.getElementById("filtro").value;
  const capturados = JSON.parse(localStorage.getItem("capturados")) || [];

  capturados.forEach(pokemon => {
    const estado = pokemon.estado; // 'capturado' o 'pendiente'
    if (
      filtro === "todos" ||
      (filtro === "capturados" && estado === "capturado") ||
      (filtro === "pendientes" && estado === "pendiente")
    ) {
      const li = document.createElement("li");
      li.textContent = `${pokemon.nombre} - ${estado}`;
      lista.appendChild(li);
    }
  });
}

function deleteOne(index) {
  if (confirm(`¿Eliminar a ${captured[index].name} de la lista?`)) {
    captured.splice(index, 1);
    renderCaptureList();
  }
}

function deleteAll() {
  if (confirm("¿Estás seguro de eliminar toda la lista de captura?")) {
    captured = [];
    localStorage.removeItem("capturedList");
    renderCaptureList();
  }
}





