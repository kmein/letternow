// Let's create a minimal setup using vite
import { World, FontInput, SourceInput } from '@brief-jetzt/wasm-typst';

const typstTemplate = `
#import "letter-pro.typ": letter-simple

#let sender = sys.inputs.at("sender", default: "Prof. Dr. Ernst Haft\\nHaarspaltergasse 99\\n12345 Pingelheim")
#let recipient = sys.inputs.at("recipient", default: "Zentralamt für unbürokratische Angelegenheiten\\nAbteilung 4b: Formularvermeidung und spontane Entscheidungen\\nTragische-Ironie-Platz 1\\n98765 Schilda")
#let date = sys.inputs.at("date", default: "")
#let subject = sys.inputs.at("subject", default: "Widerspruch gegen die Ablehnung meines Antrags auf Erteilung eines Passierscheins A38")
#let foldmarks = sys.inputs.at("foldmarks", default: "true")
#let pagenumbers = sys.inputs.at("pagenumbers", default: "false")
#let body = sys.inputs.at("body", default: "Sehr geehrte Damen und Herren,\\n\\nhiermit lege ich form- und fristgerecht Widerspruch gegen den Bescheid vom 12. des laufenden Monats ein.\\n\\nDie Begründung, mein Antrag sei \\"zu bürokratisch\\", weise ich mit aller Entschiedenheit zurück. Ich habe das 400-seitige Formular (Anlage 1-73) exakt nach den Vorgaben der DIN 5008 (Form B) ausgefüllt. Wie Sie unschwer erkennen können, sind sogar die Faltmarken dieses Schreibens auf das Nanometer genau kalibriert, um beim Einführen in den Briefumschlag einen optimalen Luftwiderstand zu gewährleisten.\\n\\nZudem möchte ich anmerken, dass Ihr sogenanntes \\"unbürokratisches Vorgehen\\" völlig an den geltenden Richtlinien für die korrekte Abheftung von Schriftgut (Aktenzeichen XY-Ungelöst) vorbeigeht. Ein Lochabstand von 81 statt 80 Millimetern ist für mich nicht nur ein persönlicher Affront, sondern ein klarer Verstoß gegen die guten Sitten der deutschen Locher-Industrie!\\n\\nIch erwarte die umgehende Ausstellung des Passierscheins A38 in dreifacher Ausfertigung, laminiert und notariell beglaubigt.\\n\\nHochachtungsvoll\\n\\n\\n\\nProf. Dr. Ernst Haft\\n\\n#align(bottom)[*Anlagen*\\n- Das besagte 400-seitige Formular\\n- Ein geeichtes Lineal aus dem Jahr 1984]")

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

async function fetchFont(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}

let world = null;
let robotoFonts = {};
let bundledFonts = {};
let letterProData = "";

const defaultVariants = ["Regular", "Bold", "Italic", "BoldItalic"];

async function setup() {
  world = World.new();

  try {
    const letterProRes = await fetch(import.meta.env.BASE_URL + `typst/letter-pro.typ`);
    if (!letterProRes.ok) throw new Error("Failed to fetch letter-pro.typ");
    letterProData = await letterProRes.text();
    // Validate it's not the HTML fallback
    if (letterProData.trim().startsWith("<!DOCTYPE")) {
      console.error("letter-pro.typ fetch returned HTML. Please restart Vite dev server.");
      letterProData = ""; // empty
    } else {
      console.log(`Loaded letter-pro.typ, length: ${letterProData.length}`);
    }
  } catch (e) {
    console.error("Error fetching letter-pro.typ:", e);
  }

  // Load all Roboto variants by default
  const fontInputs = [];
  bundledFonts["Roboto"] = {};

  for (const variant of defaultVariants) {
    try {
      const data = await fetchFont(import.meta.env.BASE_URL + `fonts/Roboto-${variant}.ttf`);
      bundledFonts["Roboto"][variant] = data;
      fontInputs.push(FontInput.new(`Roboto-${variant}.ttf`, data));
    } catch (e) {
      console.warn(`Could not load Roboto ${variant}`, e);
    }
  }

  // Await the font setting to ensure they are available before compiling
  await world.setFonts(fontInputs);

  // We will set Sources dynamically on each compile because main.typ changes,
  // but wait, is setSourcesAndFiles stateful?

  const currentFont = document.getElementById('fontFamily').value;
  if (currentFont !== "Roboto") {
     const event = new Event('change');
     document.getElementById('fontFamily').dispatchEvent(event);
  } else {
    updatePreview();
  }
}

function updatePreview() {
  if (!world) return;

  const sender = document.getElementById('sender').value;
  const recipient = document.getElementById('recipient').value;
  // Let JavaScript handle the today fallback, because the Wasm-Typst datetime
  // might be completely zeroed out to the epoch (1970-01-01) depending on Wasm system bindings
  let date = document.getElementById('date').value;
  if (date === "") {
    date = new Date().toISOString().split('T')[0];
  }

  const subject = document.getElementById('subject').value;
  const foldmarks = document.getElementById('foldmarks').checked ? "true" : "false";
  const pagenumbers = document.getElementById('pagenumbers').checked ? "true" : "false";
  // Trim the font family name to prevent parsing issues
  const fontFamily = document.getElementById('fontFamily').value.trim();
  const body = document.getElementById('body').value;

  const source = SourceInput.new("main.typ", typstTemplate);
  const letterProSource = SourceInput.new("letter-pro.typ", letterProData);
  world.setSourcesAndFiles([source, letterProSource], []);

  const inputs = {
    sender,
    recipient,
    date,
    subject,
    foldmarks,
    pagenumbers,
    font_family: fontFamily,
    body
  };

  const warnings = world.compile(inputs);
  if (warnings) {
    console.warn("Typst preview warnings:", warnings);
  }

  const svg = world.render_svg();
  document.getElementById('previewContainer').innerHTML = svg;
}

document.getElementById('sender').addEventListener('input', updatePreview);
document.getElementById('recipient').addEventListener('input', updatePreview);
document.getElementById('date').addEventListener('input', updatePreview);
document.getElementById('subject').addEventListener('input', updatePreview);
document.getElementById('foldmarks').addEventListener('change', updatePreview);
document.getElementById('pagenumbers').addEventListener('change', updatePreview);
document.getElementById('fontFamily').addEventListener('change', async (e) => {
  if (window.fontListenerAttached) return; // if local fonts loaded, the other listener handles it

  const selectedFamily = e.target.value;
  const bundledPrefixMap = {
    "Roboto": "Roboto",
    "Open Sans": "OpenSans",
    "Lora": "Lora",
    "Merriweather": "Merriweather"
  };

  const prefix = bundledPrefixMap[selectedFamily];
  if (prefix) {
    if (!bundledFonts[selectedFamily]) {
      bundledFonts[selectedFamily] = {};
    }

    const fontInputs = [];

    // Always add Roboto fallback first
    if (bundledFonts["Roboto"]) {
      for (const [variant, data] of Object.entries(bundledFonts["Roboto"])) {
        fontInputs.push(FontInput.new(`Roboto-${variant}.ttf`, data));
      }
    }

    if (selectedFamily !== "Roboto") {
      for (const variant of defaultVariants) {
        if (!bundledFonts[selectedFamily][variant]) {
          try {
            bundledFonts[selectedFamily][variant] = await fetchFont(import.meta.env.BASE_URL + `fonts/${prefix}-${variant}.ttf`);
          } catch(err) {
            console.warn(`Failed to fetch ${selectedFamily} ${variant}`, err);
          }
        }

        if (bundledFonts[selectedFamily][variant]) {
           fontInputs.push(FontInput.new(`${prefix}-${variant}.ttf`, bundledFonts[selectedFamily][variant]));
        }
      }
    }

    await world.setFonts(fontInputs);
    updatePreview();
  }
});

document.getElementById('body').addEventListener('input', updatePreview);

// Tab switching logic
function switchTab(activeTabId, activeViewId) {
  const tabs = ['tab-editor', 'tab-preview', 'tab-about', 'tab-legal'];
  const views = ['view-editor', 'view-preview', 'view-about', 'view-legal'];

  tabs.forEach(tab => {
    if (tab === activeTabId) {
      document.getElementById(tab).classList.add('active');
    } else {
      document.getElementById(tab).classList.remove('active');
    }
  });

  views.forEach(view => {
    if (view === activeViewId) {
      document.getElementById(view).classList.add('active');
    } else {
      document.getElementById(view).classList.remove('active');
    }
  });
}

document.getElementById('tab-editor').addEventListener('click', () => {
  switchTab('tab-editor', 'view-editor');
});

document.getElementById('tab-preview').addEventListener('click', () => {
  switchTab('tab-preview', 'view-preview');
  updatePreview();
});

document.getElementById('tab-about').addEventListener('click', () => {
  switchTab('tab-about', 'view-about');
});

document.getElementById('tab-legal').addEventListener('click', () => {
  switchTab('tab-legal', 'view-legal');
});

document.getElementById('loadLocalFontsBtn').addEventListener('click', async () => {
  if (!window.queryLocalFonts) {
    alert("Your browser does not support the Local Font Access API (try Chrome/Edge).");
    return;
  }

  try {
    const fonts = await window.queryLocalFonts();
    const fontSelect = document.getElementById('fontFamily');

    // Clear and keep Roboto
    fontSelect.innerHTML = '<option value="Roboto">Roboto (Default)</option>';

    // Group by family
    const familyMap = new Map();
    for (const font of fonts) {
      if (!familyMap.has(font.family)) {
        familyMap.set(font.family, []);
      }
      familyMap.get(font.family).push(font);
    }

    // Add to dropdown
    const sortedFamilies = Array.from(familyMap.keys()).sort();
    for (const family of sortedFamilies) {
      if (family === "Roboto") continue;
      const option = document.createElement('option');
      option.value = family;
      option.textContent = family;
      fontSelect.appendChild(option);
    }

    // Store the event listener in a variable so we can avoid duplicating it if the button is clicked twice
    if (!window.fontListenerAttached) {
      fontSelect.addEventListener('change', async (e) => {
        const selectedFamily = e.target.value;
        const fontInputs = [];

        // Always add Roboto fallback
        if (bundledFonts["Roboto"]) {
          for (const [variant, data] of Object.entries(bundledFonts["Roboto"])) {
            fontInputs.push(FontInput.new(`Roboto-${variant}.ttf`, data));
          }
        }

        if (selectedFamily === "Roboto") {
          await world.setFonts(fontInputs);
          updatePreview();
          return;
        }

        const familyFonts = familyMap.get(selectedFamily);
        if (familyFonts) {
          for (const localFont of familyFonts) {
            try {
              const blob = await localFont.blob();
              const buffer = await blob.arrayBuffer();
              const fontData = new Uint8Array(buffer);
              const extension = blob.type.includes("truetype") ? ".ttf" : ".otf";
              fontInputs.push(FontInput.new(localFont.postscriptName + extension, fontData));
            } catch (err) {
              console.warn("Failed to load font blob:", err);
            }
          }

          await world.setFonts(fontInputs);
          updatePreview();
        }
      });
      window.fontListenerAttached = true;
    }

    alert("Local fonts loaded! You can now select them from the dropdown.");
  } catch (err) {
    console.error(err);
    alert("Could not access local fonts. You may need to grant permission.");
  }
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  if (!world) return;

  const sender = document.getElementById('sender').value;
  const recipient = document.getElementById('recipient').value;
  let date = document.getElementById('date').value;
  if (date === "") {
    date = new Date().toISOString().split('T')[0];
  }
  const subject = document.getElementById('subject').value;
  const foldmarks = document.getElementById('foldmarks').checked ? "true" : "false";
  const pagenumbers = document.getElementById('pagenumbers').checked ? "true" : "false";
  // Trim the font family name to prevent parsing issues
  const fontFamily = document.getElementById('fontFamily').value.trim();
  const body = document.getElementById('body').value;

  const source = SourceInput.new("main.typ", typstTemplate);
  const letterProSource = SourceInput.new("letter-pro.typ", letterProData);
  world.setSourcesAndFiles([source, letterProSource], []);

  // Format string correctly for typst evaluation
  const inputs = {
    sender,
    recipient,
    date,
    subject,
    foldmarks,
    pagenumbers,
    font_family: fontFamily,
    body
  };
  const compileLog = world.compile(inputs);
  if (compileLog) console.log("Compile log:", compileLog);

  const pdfBytes = world.render_pdf();
  console.log("PDF size:", pdfBytes.length);

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'letter.pdf';
  a.click();

  URL.revokeObjectURL(url);
});

setup();
