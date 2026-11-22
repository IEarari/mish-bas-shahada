/* طبقة البيانات: Firebase عند إضافة الإعدادات في config.js، وإلا وضع تجريبي على الجهاز نفسه.
   المجموعات: results و registrations (للمسؤولة فقط)، workshops و opportunities (يقرأها الكل وتعدّلها المسؤولة). */
(function () {
  const C = window.MBS_CONFIG || {};
  const live = !!(C.firebase && C.firebase.apiKey && C.firebase.projectId);
  const BASE = "https://www.gstatic.com/firebasejs/11.0.2/";
  let fb = null;

  const LS = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  async function init() {
    if (!live) return null;
    if (fb) return fb;
    const [appM, fs, authM] = await Promise.all([
      import(BASE + "firebase-app.js"),
      import(BASE + "firebase-firestore.js"),
      import(BASE + "firebase-auth.js")
    ]);
    const app = appM.initializeApp(C.firebase);
    fb = { fs, db: fs.getFirestore(app), authM, auth: authM.getAuth(app) };
    return fb;
  }
  const iso = v => v && v.toDate ? v.toDate().toISOString() : (v || null);
  const sortContent = a => a.sort((x, y) => (x.order ?? 999) - (y.order ?? 999) || String(x.createdAt || "").localeCompare(String(y.createdAt || "")));

  /* ---- demo store ---- */
  const key = col => "mbs_demo_" + col;
  function demoAll(col) {
    let v = LS.get(key(col), null);
    if (v === null) {
      if (col === "workshops") v = (C.defaultWorkshops || []).map((w, i) => ({ ...w, id: "demo-ws-" + (i + 1), registered: 0 }));
      else if (col === "opportunities") v = (C.demoOpportunities || []).map((o, i) => ({ ...o, id: "demo-op-" + (i + 1), active: true, order: i + 1 }));
      else v = [];
      LS.set(key(col), v);
    }
    return v;
  }
  const demoPut = (col, v) => { if (!LS.set(key(col), v)) throw new Error("storage"); };

  /* ---- public content: workshops, opportunities ---- */
  async function getAll(col) {
    if (live) {
      const f = await init();
      const snap = await f.fs.getDocs(f.fs.collection(f.db, col));
      return sortContent(snap.docs.map(d => { const x = d.data(); return { ...x, id: d.id, createdAt: iso(x.createdAt) }; }));
    }
    return sortContent(demoAll(col).slice());
  }

  /* ---- admin: create / update / delete ---- */
  async function save(col, id, data) {
    if (live) {
      const f = await init();
      if (id) await f.fs.updateDoc(f.fs.doc(f.db, col, id), data);
      else await f.fs.addDoc(f.fs.collection(f.db, col), { ...data, createdAt: f.fs.serverTimestamp() });
      return;
    }
    const all = demoAll(col);
    if (id) { const i = all.findIndex(x => x.id === id); if (i > -1) all[i] = { ...all[i], ...data }; }
    else all.push({ ...data, id: "demo-" + Date.now(), createdAt: new Date().toISOString() });
    demoPut(col, all);
  }
  async function remove(col, id) {
    if (live) { const f = await init(); await f.fs.deleteDoc(f.fs.doc(f.db, col, id)); return; }
    demoPut(col, demoAll(col).filter(x => x.id !== id));
  }

  /* ---- visitors: anonymous test result ---- */
  async function add(col, data) {
    if (live) {
      const f = await init();
      await f.fs.addDoc(f.fs.collection(f.db, col), { ...data, createdAt: f.fs.serverTimestamp() });
      return { mode: "live" };
    }
    const all = demoAll(col); all.push({ ...data, id: "demo-" + Date.now(), createdAt: new Date().toISOString() });
    demoPut(col, all);
    return { mode: "demo" };
  }

  /* ---- visitors: workshop registration + seat counter, in one atomic write ---- */
  async function register(data) {
    if (live) {
      const f = await init();
      const b = f.fs.writeBatch(f.db);
      b.set(f.fs.doc(f.fs.collection(f.db, "registrations")), { ...data, createdAt: f.fs.serverTimestamp() });
      b.update(f.fs.doc(f.db, "workshops", data.workshop), { registered: f.fs.increment(1) });
      await b.commit();
      return { mode: "live" };
    }
    const ws = demoAll("workshops"), w = ws.find(x => x.id === data.workshop);
    if (!w || w.open === false || (w.seats > 0 && (w.registered || 0) >= w.seats)) throw new Error("full");
    w.registered = (w.registered || 0) + 1; demoPut("workshops", ws);
    const regs = demoAll("registrations"); regs.push({ ...data, id: "demo-" + Date.now(), createdAt: new Date().toISOString() });
    demoPut("registrations", regs);
    return { mode: "demo" };
  }

  /* ---- admin: private lists, newest first ---- */
  async function list(col) {
    if (live) {
      const f = await init();
      const snap = await f.fs.getDocs(f.fs.query(f.fs.collection(f.db, col), f.fs.orderBy("createdAt", "desc")));
      return snap.docs.map(d => { const x = d.data(); return { ...x, id: d.id, createdAt: iso(x.createdAt) }; });
    }
    return demoAll(col).slice().reverse();
  }

  async function signIn(email, password) { const f = await init(); return f.authM.signInWithEmailAndPassword(f.auth, email, password); }
  async function signOut() { const f = await init(); if (f) return f.authM.signOut(f.auth); }
  async function onAuth(cb) {
    if (!live) { cb({ demo: true }); return; }
    const f = await init();
    f.authM.onAuthStateChanged(f.auth, cb);
  }

  window.MBSDB = { live, getAll, save, remove, add, register, list, signIn, signOut, onAuth, LS };
})();
