const $ = id => document.getElementById(id);

const formScreen = $("formScreen");
const adminScreen = $("adminScreen");
const message = $("message");

function showMessage(text, ok = true) {
  message.textContent = text;
  message.className = ok ? "message ok" : "message bad";
}

function showAdmin() {
  formScreen.classList.add("hidden");
  adminScreen.classList.remove("hidden");
  loadAnswers();
}

function showForm() {
  adminScreen.classList.add("hidden");
  formScreen.classList.remove("hidden");
}

$("answerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const respuesta1 = $("respuesta1").value.trim();
  const respuesta2 = $("respuesta2").value.trim();

  if (respuesta1.toLowerCase() === "admin" && respuesta2.toLowerCase() === "admin") {
    $("respuesta1").value = "";
    $("respuesta2").value = "";
    showAdmin();
    return;
  }

  try {
    const res = await fetch("/api/respuestas", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ respuesta1, respuesta2 })
    });

    const data = await res.json();

    if (!data.ok) {
      showMessage(data.message || "No se pudo guardar.", false);
      return;
    }

    $("answerForm").reset();
    showMessage("Respuesta guardada correctamente.", true);
  } catch (err) {
    showMessage("No se pudo contactar al servidor. Abre la app desde http://localhost:3000 o desde tu hosting.", false);
  }
});

async function loadAnswers() {
  const table = $("answersTable");
  table.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';

  try {
    const res = await fetch("/api/respuestas");
    const answers = await res.json();

    if (!answers.length) {
      table.innerHTML = '<tr><td colspan="5">Todavía no hay respuestas.</td></tr>';
      return;
    }

    table.innerHTML = answers.map(a => `
      <tr>
        <td class="mono">${a.fecha || ""}</td>
        <td>${escapeHtml(a.respuesta1 || "")}</td>
        <td>${escapeHtml(a.respuesta2 || "")}</td>
        <td class="mono">${escapeHtml(a.ip || "")}</td>
        <td class="mono">${escapeHtml(a.navegador || "")}</td>
      </tr>
    `).join("");
  } catch {
    table.innerHTML = '<tr><td colspan="5">No se pudo cargar el registro.</td></tr>';
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

$("backBtn").addEventListener("click", showForm);
$("refreshBtn").addEventListener("click", loadAnswers);

$("clearBtn").addEventListener("click", async () => {
  if (!confirm("¿Borrar todas las respuestas?")) return;
  await fetch("/api/respuestas", { method: "DELETE" });
  loadAnswers();
});