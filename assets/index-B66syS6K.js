(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]')) o(r);
    new MutationObserver((r) => {
      for (const i of r) if (i.type === "childList") for (const s of i.addedNodes) s.tagName === "LINK" && s.rel === "modulepreload" && o(s);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function n(r) {
      const i = {};
      return r.integrity && (i.integrity = r.integrity), r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? i.credentials = "include" : r.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i;
    }
    function o(r) {
      if (r.ep) return;
      r.ep = true;
      const i = n(r);
      fetch(r.href, i);
    }
  })();
  const X = "" + new URL("wasm_typst_bg-DyEEGais.wasm", import.meta.url).href, Z = async (t = {}, e) => {
    let n;
    if (e.startsWith("data:")) {
      const o = e.replace(/^data:.*?base64,/, "");
      let r;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") r = Buffer.from(o, "base64");
      else if (typeof atob == "function") {
        const i = atob(o);
        r = new Uint8Array(i.length);
        for (let s = 0; s < i.length; s++) r[s] = i.charCodeAt(s);
      } else throw new Error("Cannot decode base64-encoded data URL");
      n = await WebAssembly.instantiate(r, t);
    } else {
      const o = await fetch(e), r = o.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && r.startsWith("application/wasm")) n = await WebAssembly.instantiateStreaming(o, t);
      else {
        const i = await o.arrayBuffer();
        n = await WebAssembly.instantiate(i, t);
      }
    }
    return n.instance.exports;
  };
  let a;
  function Q(t) {
    a = t;
  }
  function H(t) {
    const e = a.__externref_table_alloc();
    return a.__wbindgen_export_2.set(e, t), e;
  }
  function D(t, e) {
    try {
      return t.apply(this, e);
    } catch (n) {
      const o = H(n);
      a.__wbindgen_exn_store(o);
    }
  }
  function M(t) {
    const e = typeof t;
    if (e == "number" || e == "boolean" || t == null) return `${t}`;
    if (e == "string") return `"${t}"`;
    if (e == "symbol") {
      const r = t.description;
      return r == null ? "Symbol" : `Symbol(${r})`;
    }
    if (e == "function") {
      const r = t.name;
      return typeof r == "string" && r.length > 0 ? `Function(${r})` : "Function";
    }
    if (Array.isArray(t)) {
      const r = t.length;
      let i = "[";
      r > 0 && (i += M(t[0]));
      for (let s = 1; s < r; s++) i += ", " + M(t[s]);
      return i += "]", i;
    }
    const n = /\[object ([^\]]+)\]/.exec(toString.call(t));
    let o;
    if (n && n.length > 1) o = n[1];
    else return toString.call(t);
    if (o == "Object") try {
      return "Object(" + JSON.stringify(t) + ")";
    } catch {
      return "Object";
    }
    return t instanceof Error ? `${t.name}: ${t.message}
${t.stack}` : o;
  }
  let _ = 0, A = null;
  function E() {
    return (A === null || A.byteLength === 0) && (A = new Uint8Array(a.memory.buffer)), A;
  }
  const ee = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
  let k = new ee("utf-8");
  const te = typeof k.encodeInto == "function" ? function(t, e) {
    return k.encodeInto(t, e);
  } : function(t, e) {
    const n = k.encode(t);
    return e.set(n), {
      read: t.length,
      written: n.length
    };
  };
  function B(t, e, n) {
    if (n === void 0) {
      const c = k.encode(t), l = e(c.length, 1) >>> 0;
      return E().subarray(l, l + c.length).set(c), _ = c.length, l;
    }
    let o = t.length, r = e(o, 1) >>> 0;
    const i = E();
    let s = 0;
    for (; s < o; s++) {
      const c = t.charCodeAt(s);
      if (c > 127) break;
      i[r + s] = c;
    }
    if (s !== o) {
      s !== 0 && (t = t.slice(s)), r = n(r, o, o = s + t.length * 3, 1) >>> 0;
      const c = E().subarray(r + s, r + o), l = te(t, c);
      s += l.written, r = n(r, o, s, 1) >>> 0;
    }
    return _ = s, r;
  }
  let h = null;
  function m() {
    return (h === null || h.buffer.detached === true || h.buffer.detached === void 0 && h.buffer !== a.memory.buffer) && (h = new DataView(a.memory.buffer)), h;
  }
  const ne = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
  let N = new ne("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  N.decode();
  function R(t, e) {
    return t = t >>> 0, N.decode(E().subarray(t, t + e));
  }
  function P(t) {
    return t == null;
  }
  function V(t, e) {
    const n = e(t.length * 1, 1) >>> 0;
    return E().set(t, n / 1), _ = t.length, n;
  }
  function O(t, e) {
    const n = e(t.length * 4, 4) >>> 0;
    for (let o = 0; o < t.length; o++) {
      const r = H(t[o]);
      m().setUint32(n + 4 * o, r, true);
    }
    return _ = t.length, n;
  }
  function re(t, e) {
    return t = t >>> 0, E().subarray(t / 1, t / 1 + e);
  }
  const C = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => a.__wbg_fileinput_free(t >>> 0, 1));
  class I {
    static __wrap(e) {
      e = e >>> 0;
      const n = Object.create(I.prototype);
      return n.__wbg_ptr = e, C.register(n, n.__wbg_ptr, n), n;
    }
    static __unwrap(e) {
      return e instanceof I ? e.__destroy_into_raw() : 0;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, C.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      a.__wbg_fileinput_free(e, 0);
    }
    static new(e, n) {
      const o = B(e, a.__wbindgen_malloc, a.__wbindgen_realloc), r = _, i = V(n, a.__wbindgen_malloc), s = _, c = a.fileinput_new(o, r, i, s);
      return I.__wrap(c);
    }
  }
  const z = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => a.__wbg_fontinput_free(t >>> 0, 1));
  class g {
    static __wrap(e) {
      e = e >>> 0;
      const n = Object.create(g.prototype);
      return n.__wbg_ptr = e, z.register(n, n.__wbg_ptr, n), n;
    }
    static __unwrap(e) {
      return e instanceof g ? e.__destroy_into_raw() : 0;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, z.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      a.__wbg_fontinput_free(e, 0);
    }
    static new(e, n) {
      const o = B(e, a.__wbindgen_malloc, a.__wbindgen_realloc), r = _, i = V(n, a.__wbindgen_malloc), s = _, c = a.fontinput_new(o, r, i, s);
      return g.__wrap(c);
    }
  }
  const $ = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => a.__wbg_sourceinput_free(t >>> 0, 1));
  class b {
    static __wrap(e) {
      e = e >>> 0;
      const n = Object.create(b.prototype);
      return n.__wbg_ptr = e, $.register(n, n.__wbg_ptr, n), n;
    }
    static __unwrap(e) {
      return e instanceof b ? e.__destroy_into_raw() : 0;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, $.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      a.__wbg_sourceinput_free(e, 0);
    }
    static new(e, n) {
      const o = B(e, a.__wbindgen_malloc, a.__wbindgen_realloc), r = _, i = B(n, a.__wbindgen_malloc, a.__wbindgen_realloc), s = _, c = a.sourceinput_new(o, r, i, s);
      return b.__wrap(c);
    }
  }
  const q = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => a.__wbg_world_free(t >>> 0, 1));
  class j {
    static __wrap(e) {
      e = e >>> 0;
      const n = Object.create(j.prototype);
      return n.__wbg_ptr = e, q.register(n, n.__wbg_ptr, n), n;
    }
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, q.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      a.__wbg_world_free(e, 0);
    }
    static new() {
      const e = a.world_new();
      return j.__wrap(e);
    }
    setFonts(e) {
      const n = O(e, a.__wbindgen_malloc), o = _;
      a.world_setFonts(this.__wbg_ptr, n, o);
    }
    setSourcesAndFiles(e, n) {
      const o = O(e, a.__wbindgen_malloc), r = _, i = O(n, a.__wbindgen_malloc), s = _;
      a.world_setSourcesAndFiles(this.__wbg_ptr, o, r, i, s);
    }
    compile(e) {
      let n, o;
      try {
        const r = a.world_compile(this.__wbg_ptr, e);
        return n = r[0], o = r[1], R(r[0], r[1]);
      } finally {
        a.__wbindgen_free(n, o, 1);
      }
    }
    render_pdf() {
      const e = a.world_render_pdf(this.__wbg_ptr);
      var n = re(e[0], e[1]).slice();
      return a.__wbindgen_free(e[0], e[1] * 1, 1), n;
    }
    render_svg() {
      let e, n;
      try {
        const o = a.world_render_svg(this.__wbg_ptr);
        return e = o[0], n = o[1], R(o[0], o[1]);
      } finally {
        a.__wbindgen_free(e, n, 1);
      }
    }
  }
  function oe(t) {
    return t.buffer;
  }
  function ie() {
    return D(function(t, e) {
      return t.call(e);
    }, arguments);
  }
  function se(t) {
    return t.done;
  }
  function ae(t) {
    return Object.entries(t);
  }
  function ce(t) {
    return I.__unwrap(t);
  }
  function _e(t) {
    return g.__unwrap(t);
  }
  function le() {
    return D(function(t, e) {
      return Reflect.get(t, e);
    }, arguments);
  }
  function de(t, e) {
    return t[e >>> 0];
  }
  function ue(t) {
    let e;
    try {
      e = t instanceof ArrayBuffer;
    } catch {
      e = false;
    }
    return e;
  }
  function fe(t) {
    let e;
    try {
      e = t instanceof Uint8Array;
    } catch {
      e = false;
    }
    return e;
  }
  function ge() {
    return Symbol.iterator;
  }
  function be(t) {
    return t.length;
  }
  function we(t) {
    return t.length;
  }
  function me(t) {
    return new Uint8Array(t);
  }
  function pe(t) {
    return t.next;
  }
  function ye() {
    return D(function(t) {
      return t.next();
    }, arguments);
  }
  function he(t, e, n) {
    t.set(e, n >>> 0);
  }
  function ve(t) {
    return b.__unwrap(t);
  }
  function Ee(t) {
    return t.value;
  }
  function Be(t) {
    const e = t;
    return typeof e == "boolean" ? e ? 1 : 0 : 2;
  }
  function Le(t, e) {
    const n = M(e), o = B(n, a.__wbindgen_malloc, a.__wbindgen_realloc), r = _;
    m().setInt32(t + 4 * 1, r, true), m().setInt32(t + 4 * 0, o, true);
  }
  function Fe(t, e) {
    return new Error(R(t, e));
  }
  function Ie() {
    const t = a.__wbindgen_export_2, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  function xe(t) {
    return typeof t == "function";
  }
  function Ae(t) {
    const e = t;
    return typeof e == "object" && e !== null;
  }
  function ke(t, e) {
    return t == e;
  }
  function Re() {
    return a.memory;
  }
  function je(t, e) {
    const n = e, o = typeof n == "number" ? n : void 0;
    m().setFloat64(t + 8 * 1, P(o) ? 0 : o, true), m().setInt32(t + 4 * 0, !P(o), true);
  }
  function Se(t, e) {
    const n = e, o = typeof n == "string" ? n : void 0;
    var r = P(o) ? 0 : B(o, a.__wbindgen_malloc, a.__wbindgen_realloc), i = _;
    m().setInt32(t + 4 * 1, i, true), m().setInt32(t + 4 * 0, r, true);
  }
  function Te(t, e) {
    throw new Error(R(t, e));
  }
  URL = globalThis.URL;
  const Oe = await Z({
    "./wasm_typst_bg.js": {
      __wbg_fontinput_unwrap: _e,
      __wbg_fileinput_unwrap: ce,
      __wbg_sourceinput_unwrap: ve,
      __wbindgen_string_get: Se,
      __wbindgen_is_object: Ae,
      __wbindgen_jsval_loose_eq: ke,
      __wbindgen_boolean_get: Be,
      __wbindgen_number_get: je,
      __wbindgen_error_new: Fe,
      __wbg_get_b9b93047fe3cf45b: de,
      __wbg_length_e2d2a49132c1b256: we,
      __wbindgen_is_function: xe,
      __wbg_next_25feadfc0913fea9: pe,
      __wbg_next_6574e1a8a62d1055: ye,
      __wbg_done_769e5ede4b31c67b: se,
      __wbg_value_cd1ffa7b1ab794f1: Ee,
      __wbg_iterator_9a24c88df860dc65: ge,
      __wbg_get_67b2ba62fc30de12: le,
      __wbg_call_672a4d21634d4a24: ie,
      __wbg_instanceof_ArrayBuffer_e14585432e3737fc: ue,
      __wbg_entries_3265d4158b33e5dc: ae,
      __wbg_buffer_609cc3eee51ed158: oe,
      __wbg_new_a12002a7f91c75be: me,
      __wbg_set_65595bdd868b3009: he,
      __wbg_length_a446193dc22c12f8: be,
      __wbg_instanceof_Uint8Array_17156bcf118086a9: fe,
      __wbindgen_debug_string: Le,
      __wbindgen_throw: Te,
      __wbindgen_memory: Re,
      __wbindgen_init_externref_table: Ie
    }
  }, X), { memory: Me, __wbg_world_free: Pe, __wbg_fontinput_free: De, __wbg_fileinput_free: Ue, __wbg_sourceinput_free: Ce, fontinput_new: ze, fileinput_new: $e, sourceinput_new: qe, world_new: We, world_setFonts: He, world_setSourcesAndFiles: Ne, world_compile: Ve, world_render_pdf: Ye, world_render_svg: Je, qcms_transform_data_rgb_out_lut_precache: Ge, qcms_transform_data_rgba_out_lut_precache: Ke, qcms_transform_data_bgra_out_lut_precache: Xe, qcms_transform_data_rgb_out_lut: Ze, qcms_transform_data_rgba_out_lut: Qe, qcms_transform_data_bgra_out_lut: et, qcms_transform_release: tt, qcms_profile_precache_output_transform: nt, qcms_enable_iccv4: rt, qcms_profile_is_bogus: ot, qcms_white_point_sRGB: it, lut_interp_linear16: st, lut_inverse_interp16: at, __wbindgen_exn_store: ct, __externref_table_alloc: _t, __wbindgen_export_2: lt, __wbindgen_malloc: dt, __wbindgen_realloc: ut, __wbindgen_free: ft, __wbindgen_start: Y } = Oe, gt = Object.freeze(Object.defineProperty({
    __proto__: null,
    __externref_table_alloc: _t,
    __wbg_fileinput_free: Ue,
    __wbg_fontinput_free: De,
    __wbg_sourceinput_free: Ce,
    __wbg_world_free: Pe,
    __wbindgen_exn_store: ct,
    __wbindgen_export_2: lt,
    __wbindgen_free: ft,
    __wbindgen_malloc: dt,
    __wbindgen_realloc: ut,
    __wbindgen_start: Y,
    fileinput_new: $e,
    fontinput_new: ze,
    lut_interp_linear16: st,
    lut_inverse_interp16: at,
    memory: Me,
    qcms_enable_iccv4: rt,
    qcms_profile_is_bogus: ot,
    qcms_profile_precache_output_transform: nt,
    qcms_transform_data_bgra_out_lut: et,
    qcms_transform_data_bgra_out_lut_precache: Xe,
    qcms_transform_data_rgb_out_lut: Ze,
    qcms_transform_data_rgb_out_lut_precache: Ge,
    qcms_transform_data_rgba_out_lut: Qe,
    qcms_transform_data_rgba_out_lut_precache: Ke,
    qcms_transform_release: tt,
    qcms_white_point_sRGB: it,
    sourceinput_new: qe,
    world_compile: Ve,
    world_new: We,
    world_render_pdf: Ye,
    world_render_svg: Je,
    world_setFonts: He,
    world_setSourcesAndFiles: Ne
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Q(gt);
  Y();
  const J = `
#import "letter-pro.typ": letter-simple

#let sender = sys.inputs.at("sender", default: "Prof. Dr. Ernst Haft\\nHaarspaltergasse 99\\n12345 Pingelheim")
#let recipient = sys.inputs.at("recipient", default: "Beh\xF6rde f\xFCr Formularwesen\\nAbteilung Passierscheine\\nEndlosschleife 42\\n54321 Schilda")
#let date = sys.inputs.at("date", default: "")
#let subject = sys.inputs.at("subject", default: "Widerspruch gegen die Ablehnung meines Antrags auf Erteilung eines Passierscheins A38")
#let foldmarks = sys.inputs.at("foldmarks", default: "true")
#let pagenumbers = sys.inputs.at("pagenumbers", default: "false")
#let body = sys.inputs.at("body", default: "Sehr geehrte Damen und Herren,\\n\\nhiermit lege ich form- und fristgerecht Widerspruch gegen den Bescheid vom 12. des laufenden Monats ein.\\n\\nDie Begr\xFCndung, mein Antrag sei \\"zu b\xFCrokratisch\\", weise ich mit aller Entschiedenheit zur\xFCck. Ich habe das 400-seitige Formular (Anlage 1-73) exakt nach den Vorgaben der DIN 5008 (Form B) ausgef\xFCllt. Wie Sie unschwer erkennen k\xF6nnen, sind sogar die Faltmarken dieses Schreibens auf das Nanometer genau kalibriert, um beim Einf\xFChren in den Briefumschlag einen optimalen Luftwiderstand zu gew\xE4hrleisten.\\n\\nZudem m\xF6chte ich anmerken, dass Ihr sogenanntes \\"unb\xFCrokratisches Vorgehen\\" v\xF6llig an den geltenden Richtlinien f\xFCr die korrekte Abheftung von Schriftgut (Aktenzeichen XY-Ungel\xF6st) vorbeigeht. Ein Lochabstand von 81 statt 80 Millimetern ist f\xFCr mich nicht nur ein pers\xF6nlicher Affront, sondern ein klarer Versto\xDF gegen die guten Sitten der deutschen Locher-Industrie!\\n\\nIch erwarte die umgehende Ausstellung des Passierscheins A38 in dreifacher Ausfertigung, laminiert und notariell beglaubigt.\\n\\nHochachtungsvoll\\n\\n\\n\\nProf. Dr. Ernst Haft\\n\\n#align(bottom)[*Anlagen*\\n- Das besagte 400-seitige Formular\\n- Ein geeichtes Lineal aus dem Jahr 1984]")

#let font_family = sys.inputs.at("font_family", default: "Roboto")

#let resolved_font = font_family

#set text(font: resolved_font, size: 11pt, lang: "de")
#set par(justify: true)

#let senderLines = sender.split("\\n")
#let senderName = senderLines.first()
#let senderAddress = senderLines.slice(1).join(", ")

#show: letter-simple.with(
  font: font_family,
  sender: (
    name: senderName,
    address: senderAddress,
  ),
  recipient: recipient,
  date: if date != "" { date } else { none },
  subject: if subject != "" { eval(subject, mode: "markup") } else { none },
  folding-marks: foldmarks == "true",
  hole-mark: foldmarks == "true",
  page-numbering: if pagenumbers == "true" { "-- 1 --" } else { none },
)

#eval(body, mode: "markup")
`;
  async function G(t) {
    const n = await (await fetch(t)).arrayBuffer();
    return new Uint8Array(n);
  }
  let d = null, u = {}, v = "";
  const K = [
    "Regular",
    "Bold",
    "Italic",
    "BoldItalic"
  ];
  async function bt() {
    d = j.new();
    try {
      const o = await fetch("./typst/letter-pro.typ");
      if (!o.ok) throw new Error("Failed to fetch letter-pro.typ");
      v = await o.text(), v.trim().startsWith("<!DOCTYPE") ? (console.error("letter-pro.typ fetch returned HTML. Please restart Vite dev server."), v = "") : console.log(`Loaded letter-pro.typ, length: ${v.length}`);
    } catch (o) {
      console.error("Error fetching letter-pro.typ:", o), document.getElementById("previewContainer").innerHTML = '<div style="padding: 40px; text-align: center; color: #ef4444;">Failed to load letter template. Please check your connection.</div>';
    }
    const t = [];
    u.Roboto = {};
    let e = false;
    for (const o of K) try {
      const r = await G(`./fonts/Roboto-${o}.ttf`);
      u.Roboto[o] = r, t.push(g.new(`Roboto-${o}.ttf`, r));
    } catch (r) {
      console.warn(`Could not load Roboto ${o}`, r), e = true;
    }
    if (e && (document.getElementById("previewContainer").innerHTML = '<div style="padding: 40px; text-align: center; color: #ef4444;">Failed to load some default fonts. Please check your connection.</div>'), await d.setFonts(t), document.getElementById("fontFamily").value !== "Roboto") {
      const o = new Event("change");
      document.getElementById("fontFamily").dispatchEvent(o);
    } else L();
  }
  function L() {
    if (!d) return;
    const t = document.getElementById("sender").value, e = document.getElementById("recipient").value;
    let n = document.getElementById("date").value;
    n === "" && (n = (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const o = document.getElementById("subject").value, r = document.getElementById("foldmarks").checked ? "true" : "false", i = document.getElementById("pagenumbers").checked ? "true" : "false", s = document.getElementById("fontFamily").value.trim(), c = document.getElementById("body").value, l = b.new("main.typ", J), f = b.new("letter-pro.typ", v);
    d.setSourcesAndFiles([
      l,
      f
    ], []);
    const F = {
      sender: t,
      recipient: e,
      date: n,
      subject: o,
      foldmarks: r,
      pagenumbers: i,
      font_family: s,
      body: c
    }, w = d.compile(F);
    w && console.warn("Typst preview warnings:", w);
    const y = d.render_svg(), x = document.getElementById("previewContainer");
    x.innerHTML = y, x.classList.remove("loading");
  }
  function wt() {
    const t = document.getElementById("previewContainer");
    t.classList.contains("loading") || (t.classList.add("loading"), t.innerHTML = '<div style="padding: 40px; text-align: center; color: #64748b; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 200px;"><svg style="width: 32px; height: 32px; animation: spin 1s linear infinite; margin-bottom: 10px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path></svg>Updating preview...</div>');
  }
  let W;
  function p() {
    wt(), clearTimeout(W), W = setTimeout(() => {
      L();
    }, 250);
  }
  document.getElementById("sender").addEventListener("input", p);
  document.getElementById("recipient").addEventListener("input", p);
  document.getElementById("date").addEventListener("input", p);
  document.getElementById("subject").addEventListener("input", p);
  document.getElementById("foldmarks").addEventListener("change", p);
  document.getElementById("pagenumbers").addEventListener("change", p);
  document.getElementById("fontFamily").addEventListener("change", async (t) => {
    if (window.fontListenerAttached) return;
    const e = t.target.value, o = {
      Roboto: "Roboto",
      "Open Sans": "OpenSans",
      Lora: "Lora",
      Merriweather: "Merriweather"
    }[e];
    if (o) {
      u[e] || (u[e] = {});
      const r = [];
      if (u.Roboto) for (const [i, s] of Object.entries(u.Roboto)) r.push(g.new(`Roboto-${i}.ttf`, s));
      if (e !== "Roboto") for (const i of K) {
        if (!u[e][i]) try {
          u[e][i] = await G(`./fonts/${o}-${i}.ttf`);
        } catch (s) {
          console.warn(`Failed to fetch ${e} ${i}`, s);
        }
        u[e][i] && r.push(g.new(`${o}-${i}.ttf`, u[e][i]));
      }
      await d.setFonts(r), L();
    }
  });
  document.getElementById("body").addEventListener("input", p);
  function S(t, e) {
    const n = [
      "tab-editor",
      "tab-preview",
      "tab-about",
      "tab-legal"
    ], o = [
      "view-editor",
      "view-preview",
      "view-about",
      "view-legal"
    ];
    n.forEach((i) => {
      i === t ? document.getElementById(i).classList.add("active") : document.getElementById(i).classList.remove("active");
    }), o.forEach((i) => {
      i === e ? document.getElementById(i).classList.add("active") : document.getElementById(i).classList.remove("active");
    });
    const r = document.querySelector(".download-wrapper");
    e === "view-editor" || e === "view-preview" ? r.style.display = "block" : r.style.display = "none";
  }
  document.getElementById("tab-editor").addEventListener("click", () => {
    S("tab-editor", "view-editor");
  });
  document.getElementById("tab-preview").addEventListener("click", () => {
    S("tab-preview", "view-preview"), L();
  });
  document.getElementById("tab-about").addEventListener("click", () => {
    S("tab-about", "view-about");
  });
  document.getElementById("tab-legal").addEventListener("click", () => {
    S("tab-legal", "view-legal");
  });
  document.getElementById("loadLocalFontsBtn").addEventListener("click", async () => {
    if (!window.queryLocalFonts) {
      alert("Your browser does not support the Local Font Access API (try Chrome/Edge).");
      return;
    }
    try {
      const t = await window.queryLocalFonts(), e = document.getElementById("fontFamily");
      e.innerHTML = '<option value="Roboto">Roboto (Default)</option>';
      const n = /* @__PURE__ */ new Map();
      for (const r of t) n.has(r.family) || n.set(r.family, []), n.get(r.family).push(r);
      const o = Array.from(n.keys()).sort();
      for (const r of o) {
        if (r === "Roboto") continue;
        const i = document.createElement("option");
        i.value = r, i.textContent = r, e.appendChild(i);
      }
      window.fontListenerAttached || (e.addEventListener("change", async (r) => {
        const i = r.target.value, s = [];
        if (u.Roboto) for (const [l, f] of Object.entries(u.Roboto)) s.push(g.new(`Roboto-${l}.ttf`, f));
        if (i === "Roboto") {
          await d.setFonts(s), L();
          return;
        }
        const c = n.get(i);
        if (c) {
          for (const l of c) try {
            const f = await l.blob(), F = await f.arrayBuffer(), w = new Uint8Array(F), y = f.type.includes("truetype") ? ".ttf" : ".otf";
            s.push(g.new(l.postscriptName + y, w));
          } catch (f) {
            console.warn("Failed to load font blob:", f);
          }
          await d.setFonts(s), L();
        }
      }), window.fontListenerAttached = true), alert("Local fonts loaded! You can now select them from the dropdown.");
    } catch (t) {
      console.error(t), alert("Could not access local fonts. You may need to grant permission.");
    }
  });
  document.getElementById("downloadBtn").addEventListener("click", () => {
    if (!d) return;
    const t = document.getElementById("sender").value, e = document.getElementById("recipient").value;
    let n = document.getElementById("date").value;
    n === "" && (n = (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const o = document.getElementById("subject").value, r = document.getElementById("foldmarks").checked ? "true" : "false", i = document.getElementById("pagenumbers").checked ? "true" : "false", s = document.getElementById("fontFamily").value.trim(), c = document.getElementById("body").value, l = b.new("main.typ", J), f = b.new("letter-pro.typ", v);
    d.setSourcesAndFiles([
      l,
      f
    ], []);
    const F = {
      sender: t,
      recipient: e,
      date: n,
      subject: o,
      foldmarks: r,
      pagenumbers: i,
      font_family: s,
      body: c
    }, w = d.compile(F);
    w && console.log("Compile log:", w);
    const y = d.render_pdf();
    console.log("PDF size:", y.length);
    const x = new Blob([
      y
    ], {
      type: "application/pdf"
    }), U = URL.createObjectURL(x), T = document.createElement("a");
    T.href = U, T.download = "letter.pdf", T.click(), URL.revokeObjectURL(U);
  });
  bt();
})();
