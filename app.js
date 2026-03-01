/* =========================
   Martree Portal (Front-end)
   - Login local (demo)
   - Controle de role (admin/user)
   - CRUD Admin: escalas, aniversariantes, treinamentos, comunicados, setores(funcionários), usuários, chamados
   ========================= */

const $ = (id) => document.getElementById(id);

const KEY = "martree_portal_v1";
const SESSION_KEY = "martree_session_v1";

function pad(n){ return String(n).padStart(2,"0"); }
function nowISO(){
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function uid(prefix="ID"){
  return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2,6).toUpperCase();
}

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch{
    return null;
  }
}
function save(db){
  localStorage.setItem(KEY, JSON.stringify(db));
}

function loadSession(){
  try{
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  }catch{
    return null;
  }
}
function saveSession(s){
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}
function clearSession(){
  localStorage.removeItem(SESSION_KEY);
}

/* ===== Seed (dados fictícios) ===== */
function seed(){
  const db = {
    users: [
      { username:"admin", password:"martree123", role:"admin", name:"Administrador Martree", job:"TI / Admin" },
      { username:"maria", password:"1234", role:"user", name:"Maria Oliveira", job:"CPD" },
      { username:"felipe", password:"1234", role:"user", name:"Felipe Santos", job:"TI" },
      { username:"anderson", password:"1234", role:"user", name:"Anderson Lima", job:"CPD" },
    ],
    escalas: [
      { id: uid("ESC"), titulo:"Escala Semana (Loja 01)", texto:"Seg-Sex: 08:00-17:00 | Sáb: 08:00-12:00", updatedAt: nowISO() },
      { id: uid("ESC"), titulo:"Plantão TI", texto:"Quinzenal (sábado): 09:00-13:00", updatedAt: nowISO() },
    ],
    aniversariantes: [
      { id: uid("ANIV"), nome:"Maria Oliveira", dia: 6, mes: new Date().getMonth()+1, setor:"CPD" },
      { id: uid("ANIV"), nome:"Felipe Santos", dia: 14, mes: new Date().getMonth()+1, setor:"TI" },
    ],
    treinamentos: [
      { id: uid("TR"), titulo:"Boas práticas de atendimento", desc:"Como registrar chamados com clareza e prioridade.", link:"", updatedAt: nowISO() },
      { id: uid("TR"), titulo:"Segurança da informação básica", desc:"Dicas rápidas para evitar golpes e vazamentos.", link:"", updatedAt: nowISO() },
    ],

    // 👇 Agora essa lista é a base do "Setores / Organograma"
    funcionarios: [
      // Donos
      { id: uid("F"), nome:"Sr. Itamar", setor:"Donos", cargo:"Sócio Proprietário", email:"itamar@martree.com", telefone:"(85) 99999-1001", ramal:"101",
        sobre:"Define estratégias e decisões principais da empresa." },
      { id: uid("F"), nome:"Dona Virgínia", setor:"Donos", cargo:"Sócia Proprietária", email:"virginia@martree.com", telefone:"(85) 99999-1002", ramal:"102",
        sobre:"Apoia decisões, cultura e organização geral da empresa." },

      // Diretoria
      { id: uid("F"), nome:"Rogério", setor:"Diretoria", cargo:"Diretor Geral", email:"rogerio@martree.com", telefone:"(85) 99999-1101", ramal:"111",
        sobre:"Coordena setores e garante metas e alinhamento geral." },

      // Financeiro
      { id: uid("F"), nome:"Jakeline", setor:"Financeiro", cargo:"Financeiro", email:"jakeline@martree.com", telefone:"(85) 99999-1201", ramal:"121",
        sobre:"Fluxo de caixa, pagamentos e relatórios financeiros." },
      { id: uid("F"), nome:"Rayssa", setor:"Financeiro", cargo:"Financeiro", email:"rayssa@martree.com", telefone:"(85) 99999-1202", ramal:"122",
        sobre:"Conciliações, lançamentos e suporte ao contas a pagar." },
      { id: uid("F"), nome:"Luana", setor:"Financeiro", cargo:"Financeiro", email:"luana@martree.com", telefone:"(85) 99999-1203", ramal:"123",
        sobre:"Cobrança, controle de despesas e apoio na prestação de contas." },

      // RH
      { id: uid("F"), nome:"Jociely Souza", setor:"RH", cargo:"Analista de RH", email:"rh@martree.com", telefone:"(85) 99999-0001", ramal:"201",
        sobre:"Processos de RH, admissões e rotinas internas." },
      { id: uid("F"), nome:"Alani Costa", setor:"RH", cargo:"Assistente de RH", email:"alani@martree.com", telefone:"(85) 99999-0002", ramal:"202",
        sobre:"Apoio em documentações e atendimento ao colaborador." },
      { id: uid("F"), nome:"Beatriz Lima", setor:"RH", cargo:"Auxiliar de RH", email:"beatriz@martree.com", telefone:"(85) 99999-0003", ramal:"203",
        sobre:"Arquivos, formulários e suporte ao setor." },

      // TI
      { id: uid("F"), nome:"Felipe Santos", setor:"TI", cargo:"Suporte", email:"felipe@martree.com", telefone:"(85) 99999-0101", ramal:"301",
        sobre:"Chamados, manutenção e suporte aos usuários." },
      { id: uid("F"), nome:"Ismael Rocha", setor:"TI", cargo:"Infra", email:"ismael@martree.com", telefone:"(85) 99999-0102", ramal:"302",
        sobre:"Rede, servidores, backups e infraestrutura." },

      // CPD
      { id: uid("F"), nome:"Maria Oliveira", setor:"CPD", cargo:"Operadora", email:"maria@martree.com", telefone:"(85) 99999-0201", ramal:"401",
        sobre:"Rotinas do CPD e suporte operacional." },
      { id: uid("F"), nome:"Anderson Lima", setor:"CPD", cargo:"Operador", email:"anderson@martree.com", telefone:"(85) 99999-0202", ramal:"402",
        sobre:"Acompanhamento de processos e apoio ao CPD." },
      { id: uid("F"), nome:"Gladstone Souza", setor:"CPD", cargo:"Operador", email:"gladstone@martree.com", telefone:"(85) 99999-0203", ramal:"403",
        sobre:"Monitoramento e apoio aos sistemas internos." },

      // Marketing (exemplo)
      { id: uid("F"), nome:"Larissa", setor:"Marketing", cargo:"Marketing", email:"larissa@martree.com", telefone:"(85) 99999-1301", ramal:"131",
        sobre:"Conteúdo, comunicação visual e campanhas." },
    ],

    comunicados: [
      { id: uid("COM"), titulo:"Atualização do Wi-Fi visitante", texto:"A rede de cliente foi separada da rede principal. Se precisar de acesso, fale com TI.", data: nowISO() },
      { id: uid("COM"), titulo:"Reunião mensal", texto:"Reunião geral na próxima sexta às 16:30 no auditório.", data: nowISO() },
    ],
    tickets: [
      { id: uid("CH"), createdAt: nowISO(), titulo:"PDV 03 sem internet", desc:"Caiu conexão no caixa 03 (Loja 01).", solicitante:"maria", prioridade:"alta", status:"aberto", resposta:"" },
      { id: uid("CH"), createdAt: nowISO(), titulo:"Impressora fiscal lenta", desc:"Demorando para imprimir cupom.", solicitante:"felipe", prioridade:"media", status:"andamento", resposta:"Verificando driver e rede." },
    ]
  };

  save(db);
  return db;
}

/* ===== Estado ===== */
let db = load() || seed();
let session = loadSession();

/* ===== UI helpers ===== */
function show(el){ el.classList.remove("hidden"); }
function hide(el){ el.classList.add("hidden"); }

function showModal(id){
  const m = $(id);
  m.classList.add("show");
  m.setAttribute("aria-hidden","false");
}
function closeModal(id){
  const m = $(id);
  m.classList.remove("show");
  m.setAttribute("aria-hidden","true");
}

function isAdmin(){
  return session?.role === "admin";
}
function setAdminUI(){
  document.querySelectorAll(".adminOnly").forEach(el=>{
    el.style.display = isAdmin() ? "" : "none";
  });
  $("whoName").textContent = session?.name || session?.username || "—";
  $("whoRole").textContent = session?.role === "admin" ? "admin" : "usuário";
  $("whoRole").style.borderColor = isAdmin() ? "rgba(124,58,237,.55)" : "rgba(76,201,240,.55)";
  $("whoRole").style.background = isAdmin() ? "rgba(124,58,237,.18)" : "rgba(76,201,240,.12)";
}

/* ===== Navegação ===== */
function setActiveTab(view){
  document.querySelectorAll(".tab").forEach(b=>{
    b.classList.toggle("active", b.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach(v=> hide(v));
  show($("view-" + view));
}
function go(view){
  setActiveTab(view);
  if(view === "home") renderHome();
  if(view === "chamados") renderTickets();
  if(view === "treinamentos") renderTreinos();
  if(view === "setores") renderSetores();
  if(view === "comunicados") renderComunicados();
  if(view === "admin") renderAdmin();
}

/* ===== LOGIN ===== */
function openLogin(){
  $("loginMsg").textContent = "";
  $("loginUser").value = "";
  $("loginPass").value = "";
  showModal("loginModal");
}
function doLogin(username, password){
  const u = db.users.find(x => x.username === username && x.password === password);
  if(!u) return { ok:false, msg:"Usuário ou senha inválidos." };
  session = { username: u.username, role: u.role, name: u.name, job: u.job };
  saveSession(session);
  closeModal("loginModal");
  setAdminUI();
  go("home");
  return { ok:true };
}
function logout(){
  clearSession();
  session = null;
  openLogin();
}

/* ===== Render: Home ===== */
function renderHome(){
  // Escalas
  const list = $("escalaList");
  list.innerHTML = "";
  if(db.escalas.length === 0){
    $("escalaEmpty").textContent = "Nenhuma escala cadastrada.";
  }else{
    $("escalaEmpty").textContent = "";
    for(const e of db.escalas){
      const div = document.createElement("div");
      div.className = "listItem";
      div.innerHTML = `
        <div class="listMain">
          <strong>${escapeHtml(e.titulo)}</strong>
          <div class="muted small">${escapeHtml(e.texto)}</div>
          <div class="muted small">Atualizado: ${escapeHtml(e.updatedAt)}</div>
        </div>
        <div class="listActions ${isAdmin() ? "" : "hidden"}">
          <button class="btn small" data-act="edit" data-id="${e.id}">Editar</button>
          <button class="btn small danger" data-act="del" data-id="${e.id}">Remover</button>
        </div>
      `;
      list.appendChild(div);
    }
    list.querySelectorAll("button").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = btn.dataset.id;
        const act = btn.dataset.act;
        if(act==="edit") formEscala(id);
        if(act==="del") delEscala(id);
      });
    });
  }

  // Aniversariantes (mês atual)
  const month = new Date().getMonth()+1;
  const bdays = db.aniversariantes.filter(a=> a.mes === month).sort((a,b)=>a.dia-b.dia);

  const bl = $("bdayList");
  bl.innerHTML = "";
  if(bdays.length === 0){
    $("bdayEmpty").textContent = "Nenhum aniversariante cadastrado para este mês.";
  }else{
    $("bdayEmpty").textContent = "";
    for(const b of bdays){
      const div = document.createElement("div");
      div.className = "listItem";
      div.innerHTML = `
        <div class="listMain">
          <strong>${escapeHtml(b.nome)}</strong>
          <div class="muted small">${pad(b.dia)}/${pad(b.mes)} • ${escapeHtml(b.setor || "")}</div>
        </div>
        <div class="listActions ${isAdmin() ? "" : "hidden"}">
          <button class="btn small" data-act="edit" data-id="${b.id}">Editar</button>
          <button class="btn small danger" data-act="del" data-id="${b.id}">Remover</button>
        </div>
      `;
      bl.appendChild(div);
    }
    bl.querySelectorAll("button").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = btn.dataset.id;
        const act = btn.dataset.act;
        if(act==="edit") formBday(id);
        if(act==="del") delBday(id);
      });
    });
  }
}

/* ===== Render: Chamados ===== */
function statusPill(s){
  const cls = s==="resolvido" ? "ok" : (s==="andamento" ? "warn" : "bad");
  return `<span class="pill ${cls}">${escapeHtml(s)}</span>`;
}
function prioPill(p){
  const cls = p==="alta" ? "bad" : (p==="media" ? "warn" : "ok");
  return `<span class="pill ${cls}">${escapeHtml(p)}</span>`;
}
function renderTickets(){
  const q = ($("ticketSearch").value || "").toLowerCase().trim();
  const st = $("ticketStatus").value;
  const pr = $("ticketPrioridade").value;

  let list = [...db.tickets];

  // usuário comum vê somente os seus chamados
  if(!isAdmin()){
    list = list.filter(t => t.solicitante === session.username);
  }

  if(q){
    list = list.filter(t =>
      (t.id||"").toLowerCase().includes(q) ||
      (t.titulo||"").toLowerCase().includes(q) ||
      (t.desc||"").toLowerCase().includes(q) ||
      (t.solicitante||"").toLowerCase().includes(q)
    );
  }
  if(st !== "all") list = list.filter(t=> t.status === st);
  if(pr !== "all") list = list.filter(t=> t.prioridade === pr);

  // ordena por data (mais recente primeiro)
  list.sort((a,b)=> (b.createdAt||"").localeCompare(a.createdAt||""));

  const tb = $("ticketTbody");
  tb.innerHTML = "";

  if(list.length === 0){
    $("ticketEmpty").textContent = "Nenhum chamado encontrado.";
  }else{
    $("ticketEmpty").textContent = "";
    for(const t of list){
      const canEdit = isAdmin();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><code>${escapeHtml(t.id)}</code></td>
        <td class="muted small">${escapeHtml(t.createdAt)}</td>
        <td><strong>${escapeHtml(t.titulo)}</strong><div class="muted small">${escapeHtml(t.desc)}</div></td>
        <td>${escapeHtml(t.solicitante)}</td>
        <td>${prioPill(t.prioridade)}</td>
        <td>${statusPill(t.status)}</td>
        <td>
          <div class="row gap">
            <button class="btn small" data-act="view" data-id="${t.id}">Ver</button>
            ${canEdit ? `<button class="btn small" data-act="edit" data-id="${t.id}">Editar</button>` : ""}
            ${canEdit ? `<button class="btn small danger" data-act="del" data-id="${t.id}">Remover</button>` : ""}
          </div>
        </td>
      `;
      tb.appendChild(tr);
    }

    tb.querySelectorAll("button").forEach(b=>{
      b.addEventListener("click", ()=>{
        const id = b.dataset.id;
        const act = b.dataset.act;
        if(act==="view") viewTicket(id);
        if(act==="edit") formTicket(id);
        if(act==="del") delTicket(id);
      });
    });
  }
}

/* ===== Render: Treinamentos ===== */
function renderTreinos(){
  const wrap = $("treinoCards");
  wrap.innerHTML = "";

  if(db.treinamentos.length === 0){
    $("treinoEmpty").textContent = "Nenhum treinamento cadastrado.";
    return;
  }
  $("treinoEmpty").textContent = "";

  for(const t of db.treinamentos){
    const div = document.createElement("div");
    div.className = "itemCard";
    div.innerHTML = `
      <h3>${escapeHtml(t.titulo)}</h3>
      <div class="muted small">${escapeHtml(t.desc)}</div>
      <div class="itemMeta">
        <span class="pill">${escapeHtml(t.updatedAt)}</span>
        ${t.link ? `<a class="pill" href="${escapeAttr(t.link)}" target="_blank" rel="noopener">Abrir link</a>` : `<span class="pill warn">Sem link</span>`}
      </div>
      <div class="row gap ${isAdmin() ? "" : "hidden"}" style="margin-top:10px;">
        <button class="btn small" data-act="edit" data-id="${t.id}">Editar</button>
        <button class="btn small danger" data-act="del" data-id="${t.id}">Remover</button>
      </div>
    `;
    wrap.appendChild(div);
  }
  wrap.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.id;
      const act = btn.dataset.act;
      if(act==="edit") formTreino(id);
      if(act==="del") delTreino(id);
    });
  });
}

/* ===== SETORES / ORGANOGRAMA ===== */
let setorFiltro = "all";
let modalFuncionarioId = null;

function setorDotColor(setor){
  // só pra diferenciar um pouco as bolinhas
  const map = {
    "Donos": "rgba(245,158,11,.95)",
    "Diretoria": "rgba(76,201,240,.95)",
    "Financeiro": "rgba(34,197,94,.95)",
    "RH": "rgba(124,58,237,.95)",
    "TI": "rgba(239,68,68,.95)",
    "CPD": "rgba(59,130,246,.95)",
    "Marketing": "rgba(236,72,153,.95)",
  };
  return map[setor] || "rgba(76,201,240,.95)";
}

function renderSetorChips(setores){
  const wrap = $("setorChips");
  wrap.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "chipBtn" + (setorFiltro==="all" ? " active" : "");
  allBtn.textContent = "Todos";
  allBtn.onclick = ()=>{ setorFiltro="all"; renderSetores(); };
  wrap.appendChild(allBtn);

  for(const s of setores){
    const btn = document.createElement("button");
    btn.className = "chipBtn" + (setorFiltro===s ? " active" : "");
    btn.textContent = s;
    btn.onclick = ()=>{ setorFiltro=s; renderSetores(); };
    wrap.appendChild(btn);
  }
}

function renderSetores(){
  const all = [...db.funcionarios];
  const setores = Array.from(new Set(all.map(f=>f.setor))).sort((a,b)=> a.localeCompare(b));

  $("statPessoas").textContent = String(all.length);
  $("statSetores").textContent = String(setores.length);

  renderSetorChips(setores);

  const q = ($("setorSearch").value || "").toLowerCase().trim();

  // filtrar por setor
  let list = all;
  if(setorFiltro !== "all"){
    list = list.filter(f=> f.setor === setorFiltro);
  }
  // filtrar por busca
  if(q){
    list = list.filter(f =>
      (f.nome||"").toLowerCase().includes(q) ||
      (f.cargo||"").toLowerCase().includes(q) ||
      (f.setor||"").toLowerCase().includes(q)
    );
  }

  // agrupar por setor
  const group = new Map();
  for(const f of list){
    if(!group.has(f.setor)) group.set(f.setor, []);
    group.get(f.setor).push(f);
  }

  // ordenar setores por uma ordem "organograma" se existir
  const preferredOrder = ["Donos","Diretoria","Financeiro","RH","TI","CPD","Marketing"];
  const sectorKeys = Array.from(group.keys()).sort((a,b)=>{
    const ia = preferredOrder.indexOf(a);
    const ib = preferredOrder.indexOf(b);
    if(ia === -1 && ib === -1) return a.localeCompare(b);
    if(ia === -1) return 1;
    if(ib === -1) return -1;
    return ia - ib;
  });

  const wrap = $("orgSections");
  wrap.innerHTML = "";

  if(sectorKeys.length === 0){
    $("setoresEmpty").textContent = "Nenhum funcionário encontrado com esses filtros.";
    return;
  }
  $("setoresEmpty").textContent = "";

  for(const setor of sectorKeys){
    const people = group.get(setor).sort((a,b)=> (a.nome||"").localeCompare(b.nome||""));

    const block = document.createElement("div");
    block.className = "sectorBlock";
    block.innerHTML = `
      <div class="sectorHead">
        <div class="sectorTitle">
          <span class="sectorDot" style="background:${setorDotColor(setor)}; box-shadow: 0 0 0 4px ${setorDotColor(setor).replace(".,",",").replace(")",", .12)")};"></span>
          <h3>${escapeHtml(setor)}</h3>
        </div>
        <div class="sectorCount">${people.length} pessoa(s)</div>
      </div>
      <div class="sectorBody">
        <div class="peopleGrid" id="grid-${cssSafe(setor)}"></div>
      </div>
    `;
    wrap.appendChild(block);

    const grid = block.querySelector(`#grid-${cssSafe(setor)}`);
    for(const f of people){
      const card = document.createElement("div");
      card.className = "personCard";
      card.innerHTML = `
        <h4>${escapeHtml(f.nome)}</h4>
        <div class="muted small">${escapeHtml(f.cargo)} • ${escapeHtml(f.setor)}</div>
        <div class="itemMeta">
          <span class="pill">Ramal: ${escapeHtml(f.ramal || "—")}</span>
          <span class="pill">Tel: ${escapeHtml(f.telefone || "—")}</span>
        </div>
        <div class="muted small" style="margin-top:8px; line-height:1.4;">
          ${escapeHtml(f.sobre || "")}
        </div>
      `;
      card.addEventListener("click", ()=> openFuncionarioModal(f.id));
      grid.appendChild(card);
    }
  }
}

function openFuncionarioModal(id){
  const f = db.funcionarios.find(x=>x.id===id);
  if(!f) return;

  modalFuncionarioId = id;

  $("setorModalTitle").textContent = f.nome;
  $("setorModalBody").innerHTML = `
    <p class="muted">${escapeHtml(f.cargo)} • ${escapeHtml(f.setor)}</p>
    <div style="height:10px"></div>

    <div class="list">
      <div class="listItem">
        <div class="listMain">
          <strong>Sobre</strong>
          <div class="muted small">${escapeHtml(f.sobre || "—")}</div>
        </div>
      </div>
      <div class="listItem">
        <div class="listMain">
          <strong>E-mail</strong>
          <div class="muted small">${escapeHtml(f.email || "—")}</div>
        </div>
      </div>
      <div class="listItem">
        <div class="listMain">
          <strong>Telefone</strong>
          <div class="muted small">${escapeHtml(f.telefone || "—")}</div>
        </div>
      </div>
      <div class="listItem">
        <div class="listMain">
          <strong>Ramal</strong>
          <div class="muted small">${escapeHtml(f.ramal || "—")}</div>
        </div>
      </div>
    </div>

    ${isAdmin() ? `
      <div class="row gap" style="margin-top:12px; justify-content:flex-end;">
        <button class="btn small danger" id="btnDelFromModal">Remover</button>
      </div>
    ` : ""}
  `;

  showModal("setorModal");

  const delBtn = $("btnDelFromModal");
  if(delBtn){
    delBtn.onclick = ()=>{
      if(confirm("Remover este funcionário?")){
        db.funcionarios = db.funcionarios.filter(x=>x.id!==id);
        save(db);
        closeModal("setorModal");
        renderSetores();
      }
    };
  }
}

function cssSafe(s){
  return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-");
}

/* ===== Render: Comunicados ===== */
function renderComunicados(){
  const wrap = $("comList");
  wrap.innerHTML = "";

  const list = [...db.comunicados].sort((a,b)=> (b.data||"").localeCompare(a.data||""));

  if(list.length === 0){
    $("comEmpty").textContent = "Nenhum comunicado publicado.";
    return;
  }
  $("comEmpty").textContent = "";

  for(const c of list){
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="listMain">
        <strong>${escapeHtml(c.titulo)}</strong>
        <div class="muted small">${escapeHtml(c.texto)}</div>
        <div class="muted small">Publicado: ${escapeHtml(c.data)}</div>
      </div>
      <div class="listActions ${isAdmin() ? "" : "hidden"}">
        <button class="btn small" data-act="edit" data-id="${c.id}">Editar</button>
        <button class="btn small danger" data-act="del" data-id="${c.id}">Remover</button>
      </div>
    `;
    wrap.appendChild(div);
  }
  wrap.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.id;
      const act = btn.dataset.act;
      if(act==="edit") formComunicado(id);
      if(act==="del") delComunicado(id);
    });
  });
}

/* ===== Admin: usuários ===== */
function renderAdmin(){
  const tb = $("userTbody");
  tb.innerHTML = "";

  for(const u of db.users){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><code>${escapeHtml(u.username)}</code></td>
      <td>${escapeHtml(u.name || "")}</td>
      <td>${escapeHtml(u.role)}</td>
      <td>
        <div class="row gap">
          ${u.username !== "admin" ? `<button class="btn small danger" data-act="del" data-u="${u.username}">Remover</button>` : `<span class="muted small">fixo</span>`}
        </div>
      </td>
    `;
    tb.appendChild(tr);
  }

  tb.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const u = btn.dataset.u;
      if(confirm(`Remover usuário "${u}"?`)){
        db.users = db.users.filter(x=> x.username !== u);
        save(db);
        renderAdmin();
      }
    });
  });
}

/* =========================
   FORM MODAL (genérico)
   ========================= */
function openForm(title, html, onSubmit){
  $("formTitle").textContent = title;
  $("formBody").innerHTML = html;

  showModal("formModal");

  const form = $("formBody").querySelector("form");
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    onSubmit(new FormData(form));
  });
}

/* ===== Escala CRUD ===== */
function formEscala(id=null){
  const item = id ? db.escalas.find(x=>x.id===id) : { titulo:"", texto:"" };
  openForm(id ? "Editar escala" : "Nova escala", `
    <form>
      <label>Título</label>
      <input name="titulo" required value="${escapeAttr(item.titulo)}" />

      <label>Texto</label>
      <textarea name="texto" required>${escapeHtml(item.texto)}</textarea>

      <div class="row gap" style="margin-top:12px;">
        <button class="btn">${id ? "Salvar" : "Adicionar"}</button>
        <button type="button" class="btn ghost" id="cancelEsc">Cancelar</button>
      </div>
    </form>
  `, (fd)=>{
    const obj = { titulo: fd.get("titulo"), texto: fd.get("texto") };
    if(id){
      Object.assign(item, obj, { updatedAt: nowISO() });
    }else{
      db.escalas.unshift({ id: uid("ESC"), ...obj, updatedAt: nowISO() });
    }
    save(db);
    closeModal("formModal");
    renderHome();
  });

  $("cancelEsc").onclick = ()=> closeModal("formModal");
}
function delEscala(id){
  if(!confirm("Remover esta escala?")) return;
  db.escalas = db.escalas.filter(x=>x.id!==id);
  save(db);
  renderHome();
}

/* ===== Aniversariantes CRUD ===== */
function formBday(id=null){
  const item = id ? db.aniversariantes.find(x=>x.id===id) : { nome:"", dia:1, mes:new Date().getMonth()+1, setor:"" };
  openForm(id ? "Editar aniversariante" : "Novo aniversariante", `
    <form>
      <label>Nome</label>
      <input name="nome" required value="${escapeAttr(item.nome)}" />

      <div class="grid2">
        <div>
          <label>Dia</label>
          <input name="dia" type="number" min="1" max="31" required value="${escapeAttr(item.dia)}" />
        </div>
        <div>
          <label>Mês</label>
          <input name="mes" type="number" min="1" max="12" required value="${escapeAttr(item.mes)}" />
        </div>
      </div>

      <label>Setor</label>
      <input name="setor" value="${escapeAttr(item.setor)}" />

      <div class="row gap" style="margin-top:12px;">
        <button class="btn">${id ? "Salvar" : "Adicionar"}</button>
        <button type="button" class="btn ghost" id="cancelB">Cancelar</button>
      </div>
    </form>
  `, (fd)=>{
    const obj = {
      nome: fd.get("nome"),
      dia: Number(fd.get("dia")),
      mes: Number(fd.get("mes")),
      setor: fd.get("setor") || ""
    };
    if(id){
      Object.assign(item, obj);
    }else{
      db.aniversariantes.push({ id: uid("ANIV"), ...obj });
    }
    save(db);
    closeModal("formModal");
    renderHome();
  });

  $("cancelB").onclick = ()=> closeModal("formModal");
}
function delBday(id){
  if(!confirm("Remover este aniversariante?")) return;
  db.aniversariantes = db.aniversariantes.filter(x=>x.id!==id);
  save(db);
  renderHome();
}

/* ===== Treinamentos CRUD ===== */
function formTreino(id=null){
  const item = id ? db.treinamentos.find(x=>x.id===id) : { titulo:"", desc:"", link:"" };
  openForm(id ? "Editar treinamento" : "Novo treinamento", `
    <form>
      <label>Título</label>
      <input name="titulo" required value="${escapeAttr(item.titulo)}" />

      <label>Descrição</label>
      <textarea name="desc" required>${escapeHtml(item.desc)}</textarea>

      <label>Link (opcional)</label>
      <input name="link" placeholder="https://..." value="${escapeAttr(item.link || "")}" />

      <div class="row gap" style="margin-top:12px;">
        <button class="btn">${id ? "Salvar" : "Adicionar"}</button>
        <button type="button" class="btn ghost" id="cancelT">Cancelar</button>
      </div>
    </form>
  `, (fd)=>{
    const obj = { titulo: fd.get("titulo"), desc: fd.get("desc"), link: fd.get("link") || "" };
    if(id){
      Object.assign(item, obj, { updatedAt: nowISO() });
    }else{
      db.treinamentos.unshift({ id: uid("TR"), ...obj, updatedAt: nowISO() });
    }
    save(db);
    closeModal("formModal");
    renderTreinos();
  });

  $("cancelT").onclick = ()=> closeModal("formModal");
}
function delTreino(id){
  if(!confirm("Remover este treinamento?")) return;
  db.treinamentos = db.treinamentos.filter(x=>x.id!==id);
  save(db);
  renderTreinos();
}

/* ===== Funcionários (Setores) CRUD ===== */
function formFuncionario(id=null){
  const item = id ? db.funcionarios.find(x=>x.id===id) : { nome:"", setor:"", cargo:"", email:"", telefone:"", ramal:"", sobre:"" };
  openForm(id ? "Editar funcionário" : "Novo funcionário", `
    <form>
      <label>Nome</label>
      <input name="nome" required value="${escapeAttr(item.nome)}" />

      <div class="grid2">
        <div>
          <label>Setor</label>
          <input name="setor" required value="${escapeAttr(item.setor)}" />
        </div>
        <div>
          <label>Cargo</label>
          <input name="cargo" required value="${escapeAttr(item.cargo)}" />
        </div>
      </div>

      <label>Sobre (funções/responsabilidades)</label>
      <textarea name="sobre" placeholder="Ex.: Coordena equipe, metas, rotinas...">${escapeHtml(item.sobre || "")}</textarea>

      <div class="grid2">
        <div>
          <label>E-mail</label>
          <input name="email" value="${escapeAttr(item.email)}" />
        </div>
        <div>
          <label>Telefone</label>
          <input name="telefone" value="${escapeAttr(item.telefone)}" />
        </div>
      </div>

      <label>Ramal</label>
      <input name="ramal" value="${escapeAttr(item.ramal)}" />

      <div class="row gap" style="margin-top:12px;">
        <button class="btn">${id ? "Salvar" : "Adicionar"}</button>
        <button type="button" class="btn ghost" id="cancelF">Cancelar</button>
      </div>
    </form>
  `, (fd)=>{
    const obj = {
      nome: fd.get("nome"),
      setor: fd.get("setor"),
      cargo: fd.get("cargo"),
      sobre: fd.get("sobre") || "",
      email: fd.get("email") || "",
      telefone: fd.get("telefone") || "",
      ramal: fd.get("ramal") || ""
    };
    if(id){
      Object.assign(item, obj);
    }else{
      db.funcionarios.unshift({ id: uid("F"), ...obj });
    }
    save(db);
    closeModal("formModal");
    renderSetores();
  });

  $("cancelF").onclick = ()=> closeModal("formModal");
}

/* ===== Comunicados CRUD ===== */
function formComunicado(id=null){
  const item = id ? db.comunicados.find(x=>x.id===id) : { titulo:"", texto:"" };
  openForm(id ? "Editar comunicado" : "Novo comunicado", `
    <form>
      <label>Título</label>
      <input name="titulo" required value="${escapeAttr(item.titulo)}" />

      <label>Texto</label>
      <textarea name="texto" required>${escapeHtml(item.texto)}</textarea>

      <div class="row gap" style="margin-top:12px;">
        <button class="btn">${id ? "Salvar" : "Publicar"}</button>
        <button type="button" class="btn ghost" id="cancelC">Cancelar</button>
      </div>
    </form>
  `, (fd)=>{
    const obj = { titulo: fd.get("titulo"), texto: fd.get("texto") };
    if(id){
      Object.assign(item, obj, { data: nowISO() });
    }else{
      db.comunicados.unshift({ id: uid("COM"), ...obj, data: nowISO() });
    }
    save(db);
    closeModal("formModal");
    renderComunicados();
  });

  $("cancelC").onclick = ()=> closeModal("formModal");
}
function delComunicado(id){
  if(!confirm("Remover este comunicado?")) return;
  db.comunicados = db.comunicados.filter(x=>x.id!==id);
  save(db);
  renderComunicados();
}

/* ===== Chamados (tickets) ===== */
function formTicket(id=null){
  const item = id ? db.tickets.find(x=>x.id===id) : null;
  if(!item) return;

  openForm("Editar chamado (Admin)", `
    <form>
      <div class="grid2">
        <div>
          <label>Status</label>
          <select name="status" required>
            ${opt(item.status, ["aberto","andamento","resolvido"])}
          </select>
        </div>
        <div>
          <label>Prioridade</label>
          <select name="prioridade" required>
            ${opt(item.prioridade, ["baixa","media","alta"])}
          </select>
        </div>
      </div>

      <label>Resposta/Observação</label>
      <textarea name="resposta">${escapeHtml(item.resposta || "")}</textarea>

      <div class="row gap" style="margin-top:12px;">
        <button class="btn">Salvar</button>
        <button type="button" class="btn ghost" id="cancelCH">Cancelar</button>
      </div>
    </form>
  `, (fd)=>{
    item.status = fd.get("status");
    item.prioridade = fd.get("prioridade");
    item.resposta = fd.get("resposta") || "";
    save(db);
    closeModal("formModal");
    renderTickets();
  });

  $("cancelCH").onclick = ()=> closeModal("formModal");
}
function viewTicket(id){
  const t = db.tickets.find(x=>x.id===id);
  if(!t) return;

  openForm("Detalhes do chamado", `
    <form>
      <div class="list">
        <div class="listItem">
          <div class="listMain">
            <strong>${escapeHtml(t.titulo)}</strong>
            <div class="muted small">${escapeHtml(t.desc)}</div>
          </div>
          <div class="listActions">
            ${prioPill(t.prioridade)}
            ${statusPill(t.status)}
          </div>
        </div>
        <div class="listItem">
          <div class="listMain">
            <strong>Solicitante</strong>
            <div class="muted small">${escapeHtml(t.solicitante)}</div>
          </div>
        </div>
        <div class="listItem">
          <div class="listMain">
            <strong>Data</strong>
            <div class="muted small">${escapeHtml(t.createdAt)}</div>
          </div>
        </div>
        <div class="listItem">
          <div class="listMain">
            <strong>Resposta</strong>
            <div class="muted small">${escapeHtml(t.resposta || "—")}</div>
          </div>
        </div>
      </div>

      <div class="row gap" style="margin-top:12px;">
        <button type="button" class="btn ghost" id="closeView">Fechar</button>
        ${isAdmin() ? `<button type="button" class="btn" id="goEdit">Editar</button>` : ""}
      </div>
    </form>
  `, ()=>{
    // não usa submit aqui
  });

  $("closeView").onclick = ()=> closeModal("formModal");
  const goEdit = $("goEdit");
  if(goEdit) goEdit.onclick = ()=>{
    closeModal("formModal");
    formTicket(id);
  };
}
function delTicket(id){
  if(!confirm("Remover este chamado?")) return;
  db.tickets = db.tickets.filter(x=>x.id!==id);
  save(db);
  renderTickets();
}
function newTicket(){
  openForm("Abrir chamado", `
    <form>
      <label>Título</label>
      <input name="titulo" required placeholder="Ex.: PDV sem conexão" />

      <label>Descrição</label>
      <textarea name="desc" required placeholder="Explique o problema e onde ocorreu..."></textarea>

      <label>Prioridade</label>
      <select name="prioridade" required>
        ${opt("media", ["baixa","media","alta"])}
      </select>

      <div class="row gap" style="margin-top:12px;">
        <button class="btn">Criar chamado</button>
        <button type="button" class="btn ghost" id="cancelNew">Cancelar</button>
      </div>
    </form>
  `, (fd)=>{
    const t = {
      id: uid("CH"),
      createdAt: nowISO(),
      titulo: fd.get("titulo"),
      desc: fd.get("desc"),
      solicitante: session.username,
      prioridade: fd.get("prioridade"),
      status: "aberto",
      resposta: ""
    };
    db.tickets.unshift(t);
    save(db);
    closeModal("formModal");
    go("chamados");
  });

  $("cancelNew").onclick = ()=> closeModal("formModal");
}

/* ===== Admin users ===== */
function addUser(){
  const username = ($("newU").value || "").trim().toLowerCase();
  const password = ($("newP").value || "").trim();
  const name = ($("newName").value || "").trim();
  const job = ($("newJob").value || "").trim();

  if(!username || !password){
    alert("Informe usuário e senha.");
    return;
  }
  if(db.users.some(u=>u.username===username)){
    alert("Usuário já existe.");
    return;
  }
  db.users.push({ username, password, role:"user", name: name || username, job: job || "" });
  save(db);

  $("newU").value = "";
  $("newP").value = "";
  $("newName").value = "";
  $("newJob").value = "";

  renderAdmin();
}

/* ===== Reset ===== */
function resetAll(){
  if(!confirm("Isso vai resetar TODOS os dados do portal no seu navegador. Continuar?")) return;
  localStorage.removeItem(KEY);
  db = seed();
  alert("Dados resetados.");
  go("home");
}

/* ===== Escape ===== */
function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}
function escapeAttr(s){
  return escapeHtml(s).replaceAll("'","&#39;");
}
function opt(selected, arr){
  return arr.map(v => `<option value="${escapeAttr(v)}" ${v===selected?"selected":""}>${escapeHtml(v)}</option>`).join("");
}

/* =========================
   Eventos / Boot
   ========================= */
function boot(){
  // Tabs
  document.querySelectorAll(".tab").forEach(b=>{
    b.addEventListener("click", ()=>{
      const v = b.dataset.view;
      go(v);
    });
  });

  // Login
  $("btnLogin").addEventListener("click", ()=>{
    const u = $("loginUser").value.trim().toLowerCase();
    const p = $("loginPass").value;
    const res = doLogin(u,p);
    $("loginMsg").textContent = res.ok ? "" : res.msg;
  });
  $("btnUseDemo").addEventListener("click", ()=>{
    const res = doLogin("admin","martree123");
    $("loginMsg").textContent = res.ok ? "" : res.msg;
  });

  // Logout
  $("btnLogout").addEventListener("click", logout);

  // Fechar modais
  $("btnFormClose").addEventListener("click", ()=> closeModal("formModal"));

  // Home actions
  $("btnAddEscala").addEventListener("click", ()=> isAdmin() && formEscala(null));
  $("btnAddBday").addEventListener("click", ()=> isAdmin() && formBday(null));

  // Chamados actions
  $("btnNewTicket").addEventListener("click", newTicket);
  ["ticketSearch","ticketStatus","ticketPrioridade"].forEach(id=>{
    $(id).addEventListener("input", renderTickets);
    $(id).addEventListener("change", renderTickets);
  });

  // Treinos actions
  $("btnAddTreino").addEventListener("click", ()=> isAdmin() && formTreino(null));

  // Setores actions
  $("btnAddFuncionario").addEventListener("click", ()=> isAdmin() && formFuncionario(null));
  $("setorSearch").addEventListener("input", renderSetores);
  $("btnClearSetor").addEventListener("click", ()=>{
    $("setorSearch").value = "";
    setorFiltro = "all";
    renderSetores();
  });
  $("btnSetorClose").addEventListener("click", ()=> closeModal("setorModal"));
  $("btnEditFromModal").addEventListener("click", ()=>{
    if(!isAdmin() || !modalFuncionarioId) return;
    closeModal("setorModal");
    formFuncionario(modalFuncionarioId);
  });

  // Comunicados actions
  $("btnAddComunicado").addEventListener("click", ()=> isAdmin() && formComunicado(null));

  // Admin actions
  $("btnAddUser").addEventListener("click", ()=> isAdmin() && addUser());
  $("btnResetAll").addEventListener("click", ()=> isAdmin() && resetAll());

  // Sessão
  if(!session){
    openLogin();
  }else{
    setAdminUI();
    go("home");
  }
}

boot();
