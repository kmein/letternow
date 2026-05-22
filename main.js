// Let's create a minimal setup using vite
import { World, FontInput, SourceInput } from '@brief-jetzt/wasm-typst';

const typstTemplate = `
#let sender = sys.inputs.at("sender", default: "John Doe\\n123 Main St")
#let recipient = sys.inputs.at("recipient", default: "Jane Smith\\n456 Elm St")
#let date = sys.inputs.at("date", default: "")
#let subject = sys.inputs.at("subject", default: "Important Notice")
#let foldmarks = sys.inputs.at("foldmarks", default: "true")
#let pagenumbers = sys.inputs.at("pagenumbers", default: "false")
#let body = sys.inputs.at("body", default: "Dear Jane,\\n\\nThis is a test letter to demonstrate the Wasm Typst integration.\\n\\nBest,\\nJohn")

#let font_family = sys.inputs.at("font_family", default: "Roboto")

#set page(
  paper: "a4",
  margin: (left: 25mm, right: 20mm, top: 27mm, bottom: 20mm),
  footer: [
    #if pagenumbers == "true" {
      align(center)[
        #text(size: 9pt)[--- #context counter(page).display() ---]
      ]
    }
  ]
)
#set text(font: font_family, size: 11pt)

// Fold marks & punch mark (Loch- und Faltmarken)
#if foldmarks == "true" [
  #place(top + left, dx: -25mm, dy: 87mm - 27mm)[
    #line(length: 2mm, stroke: 0.5pt)
  ]
  #place(top + left, dx: -25mm, dy: 148.5mm - 27mm)[
    #line(length: 4mm, stroke: 0.5pt)
  ]
  #place(top + left, dx: -25mm, dy: 192mm - 27mm)[
    #line(length: 2mm, stroke: 0.5pt)
  ]
]

// Sender information block top right
#place(top + right)[
  #align(right)[
    #sender
  ]
]

// DIN 5008 Address Window (Anschriftenfeld)
#v(18mm)
// Return address line (Rücksendeangabe)
#text(size: 8pt)[#underline[#sender.replace("\\n", " · ")]]

#v(5mm)
// Recipient address
#recipient

// Date
#v(15mm)
#align(right)[
  #if date != "" {
    date
  } else {
    datetime.today().display("[day].[month].[year]")
  }
]

// Subject (Betreff)
#v(10mm)
*#subject*

#v(5mm)
// Body
#body
`;

async function fetchFont() {
  const res = await fetch('/Roboto-Regular.ttf');
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}

let world = null;
let robotoFontData = null;

async function setup() {
  world = World.new();
  
  robotoFontData = await fetchFont();
  const font = FontInput.new("Roboto-Regular.ttf", robotoFontData);
  world.setFonts([font]);

  updatePreview();
}

function updatePreview() {
  if (!world) return;

  const sender = document.getElementById('sender').value;
  const recipient = document.getElementById('recipient').value;
  const date = document.getElementById('date').value;
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
  const bundledMap = {
    "Roboto": "/Roboto-Regular.ttf",
    "Open Sans": "/OpenSans-Regular.ttf",
    "Lora": "/Lora-Regular.ttf",
    "Merriweather": "/Merriweather-Regular.ttf"
  };
  
  if (bundledMap[selectedFamily]) {
    if (!bundledFonts[selectedFamily]) {
      bundledFonts[selectedFamily] = await fetchFont(bundledMap[selectedFamily]);
    }
    world.setFonts([FontInput.new(selectedFamily + ".ttf", bundledFonts[selectedFamily])]);
    updatePreview();
  }
});

document.getElementById('body').addEventListener('input', updatePreview);

// Tab switching logic
document.getElementById('tab-editor').addEventListener('click', () => {
  document.getElementById('tab-editor').classList.add('active');
  document.getElementById('tab-preview').classList.remove('active');
  document.getElementById('view-editor').classList.add('active');
  document.getElementById('view-preview').classList.remove('active');
});

document.getElementById('tab-preview').addEventListener('click', () => {
  document.getElementById('tab-preview').classList.add('active');
  document.getElementById('tab-editor').classList.remove('active');
  document.getElementById('view-preview').classList.add('active');
  document.getElementById('view-editor').classList.remove('active');
  // Re-render when switching to preview just to be safe
  updatePreview();
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
        if (selectedFamily === "Roboto") {
          world.setFonts([FontInput.new("Roboto-Regular.ttf", robotoFontData)]); // Restore original Roboto
          updatePreview();
          return;
        }
        
        const familyFonts = familyMap.get(selectedFamily);
        if (familyFonts) {
          const fontInputs = [FontInput.new("Roboto-Regular.ttf", robotoFontData)]; // Always keep Roboto as fallback
          
          for (const localFont of familyFonts) {
            try {
              const blob = await localFont.blob();
              const buffer = await blob.arrayBuffer();
              const fontData = new Uint8Array(buffer);
              // Provide an extension so Typst's internal parser knows how to handle the magic bytes
              const extension = blob.type.includes("truetype") ? ".ttf" : ".otf";
              fontInputs.push(FontInput.new(localFont.postscriptName + extension, fontData));
            } catch (err) {
              console.warn("Failed to load font blob:", err);
            }
          }
          
          world.setFonts(fontInputs);
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
  const date = document.getElementById('date').value;
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
