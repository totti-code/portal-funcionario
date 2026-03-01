const $ = (id) => document.getElementById(id);

const STORE_KEY = "portal_funcionario_v1";
const PREF_KEY  = "portal_prefs_v1";

function loadJSON(key, fallback){
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function saveJSON(key, val){
  localStorage.setItem(key, JSON.stringify(val));
}

function pad(n){ return String(n).padStart(2,"0"); }
function nowISO(){
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function uid(prefix="ID"){
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

const defaultData = {
  comunicados: [
    { id: uid("C"), title:"Boas-vindas ao Portal", cat:"Geral", msg:"Aqui você encontra comunicados, documentos e pode abrir chamados.\n\nEdite os links e personalize com a sua empresa.", at: nowISO(), read:false },
    { id: uid("C"), title:"Política de Senhas", cat:"TI", msg:"Troque sua senha periodicamente e não compartilhe com ninguém.", at: nowISO(), read:false },
  ],
  docs: [
    { id: uid("D"), name:"Manual do Colaborador", type:"PDF", url:"assets/manual.pdf", at: nowISO() },
    { id: uid("D"), name:"Canal de Comunicados (WhatsApp)", type:"Link", url:"#", at: nowISO() },
  ],
  tickets: []
};

const data = loadJSON(STORE_KEY, defaultData);
const prefs = loadJSON(PREF_KEY, { theme:"dark" });

function persist(){ saveJSON(STORE_KEY, data); }
function persistPrefs(){ saveJSON(PREF_KEY, prefs); }

function setTheme(){
  document.body.classList.toggle("light", prefs.theme === "light");
}
setTheme();

function tickClock(){
  const d = new Date();
  $("clock").textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
setInterval(tickClock, 1000);
tickClock();

$("buildInfo").textContent = `Atualizado em ${nowISO()}`;

/* ===== TABS ===== */
const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = {
  home: $("tab-home"),
  comunicados: $("tab-comunicados"),
  documentos: $("tab-documentos"),
  chamados: $("tab-chamados"),
  treinamentos: $("tab-treinamentos"),
  rh: $("tab-rh")
};

function openTab(key){
  tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === key));
  Object.entries(panels).forEach(([k, el]) => { el.hidden = (k !== key); });
  if(key === "home") renderHome();
  if(key === "comunicados") renderComunicados();
  if(key === "documentos") renderDocs();
  if(key === "chamados") renderTickets();
if(key === "treinamentos") renderTreinamentos();
}
tabs.forEach(t => t.addEventListener("click", () => openTab(t.dataset.tab)));

/* ===== THEME BUTTON ===== */
$("btnTheme").addEventListener("click", () => {
  prefs.theme = (prefs.theme === "light") ? "dark" : "light";
  persistPrefs();
  setTheme();
});

/* ===== SHORTCUTS ===== */
document.querySelectorAll("[data-action]").forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const act = a.dataset.action;
    const map = {
      holerite: "Defina o link do Holerite no app.js (map) ou em Documentos.",
      escala: "Coloque o link da escala em Documentos (ex: Google Drive/Sheets).",
      treinamentos: "Crie uma página/links de treinamentos em Documentos.",
      beneficios: "Cadastre os benefícios aqui (links, PDFs).",
      ti: "Abrindo aba Chamados…",
      rh: "Abrindo aba RH…",
      politicas: "Cadastre as políticas em Documentos."
    };
    if(act === "treinamentos") return openTab("treinamentos");
if(act === "ti") return openTab("chamados");
if(act === "rh") return openTab("rh");
alert(map[act] || "Ação não configurada.");
  });
});

/* ===== RENDER HELPERS ===== */
function badge(text, cls=""){
  return `<span class="badge ${cls}">${escapeHtml(text)}</span>`;
}
function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}

/* ===== HOME ===== */
function renderHome(){
  const recent = [...data.comunicados]
    .sort((a,b) => (a.at < b.at ? 1 : -1))
    .slice(0,4);

  $("homeComunicados").innerHTML = recent.map(c => {
    const badges = [
      badge(c.cat),
      c.read ? "" : badge("novo","new")
    ].join("");
    return `
      <div class="item">
        <div class="itemTop">
          <div>
            <p class="itemTitle">${escapeHtml(c.title)}</p>
            <div class="itemMeta">${badges}</div>
          </div>
          <div class="muted small">${escapeHtml(c.at)}</div>
        </div>
        <div class="itemText">${escapeHtml(c.msg)}</div>
      </div>
    `;
  }).join("") || `<div class="muted">Sem comunicados.</div>`;

  renderBirthdays();
}

function renderBirthdays(){
  // Edite aqui os aniversariantes
  const people = [
    { name:"Maria", day: 3, dept:"CPD" },
    { name:"Felipe", day: 12, dept:"TI" },
    { name:"Rayssa", day: 22, dept:"Financeiro" },
  ];

  const month = new Date().getMonth();
  // Exemplo simples: lista fixa (você pode adaptar pra puxar de dados depois)
  $("birthdays").innerHTML = people.map(p => `
    <div class="item">
      <div class="itemTop">
        <div>
          <p class="itemTitle">${escapeHtml(p.name)}</p>
          <div class="itemMeta">${badge(p.dept)} ${badge(`dia ${p.day}`)}</div>
        </div>
        <div class="muted small">Mês ${month+1}</div>
      </div>
    </div>
  `).join("");
}

/* ===== COMUNICADOS ===== */
function renderComunicados(){
  const list = [...data.comunicados].sort((a,b) => (a.at < b.at ? 1 : -1));

  $("comunicadosList").innerHTML = list.map(c => `
    <div class="item">
      <div class="itemTop">
        <div>
          <p class="itemTitle">${escapeHtml(c.title)}</p>
          <div class="itemMeta">
            ${badge(c.cat)}
            ${c.read ? "" : badge("novo","new")}
          </div>
        </div>
        <div class="badges">
          <button class="btn ghost" data-read="${c.id}">${c.read ? "Não lido" : "Marcar lido"}</button>
          <button class="btn danger" data-delc="${c.id}">Excluir</button>
        </div>
      </div>
      <div class="muted small" style="margin-top:6px;">${escapeHtml(c.at)}</div>
      <div class="itemText">${escapeHtml(c.msg)}</div>
    </div>
  `).join("") || `<div class="muted">Sem comunicados.</div>`;

  document.querySelectorAll("[data-read]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.read;
      const it = data.comunicados.find(x => x.id === id);
      if(!it) return;
      it.read = !it.read;
      persist();
      renderComunicados();
      renderHome();
    });
  });
  document.querySelectorAll("[data-delc]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.delc;
      data.comunicados = data.comunicados.filter(x => x.id !== id);
      persist();
      renderComunicados();
      renderHome();
    });
  });
}

$("btnSaveComunicado").addEventListener("click", () => {
  const title = $("cTitle").value.trim();
  const cat = $("cCat").value;
  const msg = $("cMsg").value.trim();
  if(!title || !msg) return alert("Preencha título e mensagem.");
  data.comunicados.unshift({ id: uid("C"), title, cat, msg, at: nowISO(), read:false });
  $("cTitle").value = "";
  $("cMsg").value = "";
  persist();
  renderComunicados();
  renderHome();
});

$("btnNewComunicado").addEventListener("click", () => {
  $("cTitle").focus();
});

$("btnMarkAll").addEventListener("click", () => {
  data.comunicados.forEach(c => c.read = true);
  persist();
  renderHome();
  renderComunicados();
});

/* ===== DOCUMENTOS ===== */
function renderDocs(){
  const list = [...data.docs].sort((a,b) => (a.at < b.at ? 1 : -1));
  $("docsList").innerHTML = list.map(d => `
    <div class="item">
      <div class="itemTop">
        <div>
          <p class="itemTitle">${escapeHtml(d.name)}</p>
          <div class="itemMeta">${badge(d.type)} ${badge(d.at)}</div>
        </div>
        <div class="badges">
          <a class="btn ghost" href="${escapeHtml(d.url)}" target="_blank" rel="noreferrer">Abrir</a>
          <button class="btn danger" data-deld="${d.id}">Excluir</button>
        </div>
      </div>
      <div class="itemText">${escapeHtml(d.url)}</div>
    </div>
  `).join("") || `<div class="muted">Sem documentos.</div>`;

  document.querySelectorAll("[data-deld]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.deld;
      data.docs = data.docs.filter(x => x.id !== id);
      persist();
      renderDocs();
    });
  });
}

$("btnSaveDoc").addEventListener("click", () => {
  const name = $("dName").value.trim();
  const type = $("dType").value;
  const url  = $("dUrl").value.trim();
  if(!name || !url) return alert("Preencha nome e URL.");
  data.docs.unshift({ id: uid("D"), name, type, url, at: nowISO() });
  $("dName").value = "";
  $("dUrl").value = "";
  persist();
  renderDocs();
});

$("btnAddDoc").addEventListener("click", () => $("dName").focus());

/* ===== CHAMADOS (LOCAL) ===== */
function prioClass(p){
  const v = (p||"").toLowerCase();
  if(v.includes("crít")) return "prio-crítica";
  if(v.includes("alta")) return "prio-alta";
  if(v.includes("méd")) return "prio-média";
  return "prio-baixa";
}

function renderTickets(){
  const list = [...data.tickets].sort((a,b) => (a.at < b.at ? 1 : -1));
  $("ticketsList").innerHTML = list.map(t => `
    <div class="item">
      <div class="itemTop">
        <div>
          <p class="itemTitle">${escapeHtml(t.area)} • ${escapeHtml(t.id)}</p>
          <div class="itemMeta">
            ${badge(`prio ${t.prio}`, prioClass(t.prio))}
            ${badge(t.status)}
            ${badge(t.at)}
          </div>
        </div>
        <div class="badges">
          <button class="btn ghost" data-done="${t.id}">${t.status === "Resolvido" ? "Reabrir" : "Resolver"}</button>
          <button class="btn danger" data-delt="${t.id}">Excluir</button>
        </div>
      </div>
      <div class="itemText">${escapeHtml(t.desc)}</div>
    </div>
  `).join("") || `<div class="muted">Sem chamados ainda.</div>`;

  document.querySelectorAll("[data-done]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.done;
      const it = data.tickets.find(x => x.id === id);
      if(!it) return;
      it.status = (it.status === "Resolvido") ? "Aberto" : "Resolvido";
      persist();
      renderTickets();
    });
  });
  document.querySelectorAll("[data-delt]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.delt;
      data.tickets = data.tickets.filter(x => x.id !== id);
      persist();
      renderTickets();
    });
  });
}

$("btnCreateTicket").addEventListener("click", () => {
  const area = $("tArea").value;
  const prio = $("tPrio").value;
  const desc = $("tDesc").value.trim();
  if(!desc) return alert("Descreva o chamado.");
  data.tickets.unshift({ id: uid("T"), area, prio, desc, status:"Aberto", at: nowISO() });
  $("tDesc").value = "";
  persist();
  renderTickets();
});

$("btnClearTickets").addEventListener("click", () => {
  if(!confirm("Apagar todos os chamados locais?")) return;
  data.tickets = [];
  persist();
  renderTickets();
});

/* ===== BUSCA ===== */
function searchAll(){
  const q = $("q").value.trim().toLowerCase();
  const filter = $("filter").value;
  const box = $("searchResults");

  if(!q){
    box.hidden = true;
    box.innerHTML = "";
    return;
  }

  const results = [];

  if(filter === "all" || filter === "comunicados"){
    for(const c of data.comunicados){
      const hay = `${c.title} ${c.cat} ${c.msg}`.toLowerCase();
      if(hay.includes(q)){
        results.push({ kind:"Comunicado", title:c.title, meta:`${c.cat} • ${c.at}`, text:c.msg });
      }
    }
  }

  if(filter === "all" || filter === "documentos"){
    for(const d of data.docs){
      const hay = `${d.name} ${d.type} ${d.url}`.toLowerCase();
      if(hay.includes(q)){
        results.push({ kind:"Documento", title:d.name, meta:`${d.type} • ${d.at}`, text:d.url });
      }
    }
  }

  box.hidden = false;
  box.innerHTML = results.length ? results.map(r => `
    <div class="item" style="margin-top:10px;">
      <div class="itemTop">
        <div>
          <p class="itemTitle">${escapeHtml(r.title)}</p>
          <div class="itemMeta">${badge(r.kind)} ${badge(r.meta)}</div>
        </div>
      </div>
      <div class="itemText">${escapeHtml(r.text)}</div>
    </div>
  `).join("") : `<div class="muted" style="margin-top:10px;">Nada encontrado.</div>`;
}

$("btnSearch").addEventListener("click", searchAll);
$("q").addEventListener("keydown", (e) => {
  if(e.key === "Enter") searchAll();
});

/* ===== INIT ===== */
openTab("home");
