// Let's create a minimal setup using vite
import { World, FontInput, SourceInput } from '@brief-jetzt/wasm-typst';

const typstTemplate = `
#let sender = sys.inputs.at("sender", default: "Dr. Max Mustermann\\nNormenausschussweg 42\\n10115 Berlin")
#let recipient = sys.inputs.at("recipient", default: "Behörde für standardisierte Korrespondenz\\nAbteilung für Briefformate und Falztechniken\\nAm Aktenzeichen 1\\n10115 Berlin")
#let date = sys.inputs.at("date", default: "")
#let subject = sys.inputs.at("subject", default: "Lobende Erwähnung der korrekten Umsetzung der DIN 5008 (Form B)")
#let foldmarks = sys.inputs.at("foldmarks", default: "true")
#let pagenumbers = sys.inputs.at("pagenumbers", default: "false")
#let body = sys.inputs.at("body", default: "Sehr geehrte Damen und Herren,\\n\\nmit großer Freude und außerordentlicher Genugtuung habe ich festgestellt, dass das Layout dieses Schreibens nun exakt den Vorgaben der *DIN 5008 (Form B)* entspricht. Es ist mir stets ein tiefes inneres Bedürfnis, darauf hinzuweisen, dass die Loch- und Faltmarken auf den Millimeter genau sitzen (105 mm und 210 mm vom oberen Rand, selbstverständlich).\\n\\nIn einer Welt, die zunehmend im typografischen Chaos versinkt, ist die korrekte Positionierung des Anschriftenfeldes ein Fels in der Brandung. Ich möchte hiermit formvollendet beantragen, dass dieses erlesene Stück Software in das Register der vorbildlichsten digitalen Büroanwendungen aufgenommen wird.\\n\\nBitte bestätigen Sie mir den Eingang dieses Schreibens unter Angabe der exakten Zeitzone und in einem fensterlosen Umschlag, der per Einschreiben mit Rückschein versandt wird.\\n\\nMit vorzüglicher Hochachtung\\n\\n\\n\\nDr. Max Mustermann \\\n(Beauftragter für Normen und Standards)\\n\\n#align(bottom)[*Anlagen*\\n- Zertifikat der Formtreue")

#let font_family = sys.inputs.at("font_family", default: "Roboto")

#set page(
  paper: "a4",
  // Standard text area starts at approx 98.4mm from top for Type B.
  // Left margin (Fluchtlinie) is exactly 25mm.
  // Right margin is typically 20mm (Deutsche Post minimum is 10mm).
  margin: (left: 25mm, right: 20mm, top: 100mm, bottom: 20mm),
  footer: [
    #if pagenumbers == "true" {
      align(center)[
        #text(size: 9pt)[-- #context counter(page).display() --]
      ]
    }
  ],
  background: [
    // Use the background layer to place absolute elements independent of margins

    // Fold marks & punch mark (Loch- und Faltmarken) for Type B
    // Per typst-letter-pro and print standards, slightly offset from the exact edge
    #if foldmarks == "true" [
      #place(top + left, dx: 5mm, dy: 105mm)[
        #line(length: 2.5mm, stroke: 0.25pt + black)
      ]
      #place(top + left, dx: 5mm, dy: 148.5mm)[
        #line(length: 4mm, stroke: 0.25pt + black)
      ]
      #place(top + left, dx: 5mm, dy: 210mm)[
        #line(length: 2.5mm, stroke: 0.25pt + black)
      ]
    ]

    // Sender Information / Letterhead (Top Right)
    #place(top + right, dx: -20mm, dy: 27mm)[
      #align(right)[
        #text(font: font_family, size: 11pt)[#sender]
      ]
    ]

    // DIN 5008 Type B Address Window (Anschriftenfeld)
    // Starts exactly 45mm from the top.
    // The text aligns with the "Fluchtlinie" at 25mm from the left edge.
    // The printable area inside the window is 40mm high and 85mm wide (per Deutsche Post).
    #place(top + left, dx: 25mm, dy: 45mm)[
      #block(width: 85mm, height: 40mm)[
        #grid(
          columns: 1,
          // 3 lines Zusatzzone (~12.7mm) + 6 lines Anschrift (~27.3mm) = 40mm
          rows: (12.7mm, 27.3mm),
          [
            // Zusatzzone (return address)
            #align(bottom)[
              #pad(bottom: 0.65em)[
                #text(font: font_family, size: 8pt)[#underline[#sender.replace("\\n", " · ")]]
              ]
            ]
          ],
          [
            // Anschriftenzone (recipient)
            #text(font: font_family, size: 11pt)[#recipient]
          ]
        )
      ]
    ]

    // Date (Datum) / Informationsblock
    // According to DIN 5008, the date is often placed flush right on the same line as the destination
    // or as part of the information block. By placing it at roughly 85mm from top (bottom of the address block),
    // it appears ~2 lines above the subject (which starts at 100mm).
    #place(top + right, dx: -20mm, dy: 85mm)[
      #align(right)[
        #text(font: font_family, size: 11pt)[#date]
      ]
    ]
  ]
)

#set text(font: font_family, size: 11pt)

// Set justified text for the body to match typst-letter-pro standard
#set par(justify: true)

// The main text area must start two lines below the address window.
// Address window ends at 90mm. Top margin is 100mm.

// Subject (Betreff)
#pad(right: 10%)[
  #strong(eval(subject, mode: "markup"))
]

// The salutation follows with two blank lines spacing to the subject line.
#v(8.46mm)
// Body (contains salutation, text, greeting, signature, enclosures)
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

const defaultVariants = ["Regular", "Bold", "Italic", "BoldItalic"];

async function setup() {
  world = World.new();

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
  updatePreview();
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
  const fontFamily = document.getElementById('fontFamily').value;
  const body = document.getElementById('body').value;

  const source = SourceInput.new("main.typ", typstTemplate);
  world.setSourcesAndFiles([source], []);

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
           const safeName = selectedFamily.replace(" ", "");
           fontInputs.push(FontInput.new(`${safeName}-${variant}.ttf`, bundledFonts[selectedFamily][variant]));
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
  const fontFamily = document.getElementById('fontFamily').value;
  const body = document.getElementById('body').value;

  const source = SourceInput.new("main.typ", typstTemplate);
  world.setSourcesAndFiles([source], []);

  const inputs = { sender, recipient, date, subject, foldmarks, pagenumbers, font_family: fontFamily, body };
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
