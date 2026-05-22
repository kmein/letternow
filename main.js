// Let's create a minimal setup using vite
import { World, FontInput, SourceInput } from '@brief-jetzt/wasm-typst';

const typstTemplate = `
#set page("a4")
#set text(font: "Roboto", size: 11pt)

#let sender = sys.inputs.at("sender", default: "")
#let recipient = sys.inputs.at("recipient", default: "")
#let subject = sys.inputs.at("subject", default: "")
#let body = sys.inputs.at("body", default: "")

#align(right)[
  #sender
]

#v(2cm)

#recipient

#v(1cm)

*#subject*

#v(0.5cm)

#body
`;

async function fetchFont() {
  const res = await fetch('/Roboto-Regular.ttf');
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}

let world = null;

async function setup() {
  world = World.new();
  
  const fontData = await fetchFont();
  const font = FontInput.new("Roboto-Regular.ttf", fontData);
  world.setFonts([font]);

  updatePreview();
}

function updatePreview() {
  if (!world) return;

  const sender = document.getElementById('sender').value;
  const recipient = document.getElementById('recipient').value;
  const subject = document.getElementById('subject').value;
  const body = document.getElementById('body').value;

  const source = SourceInput.new("main.typ", typstTemplate);
  world.setSourcesAndFiles([source], []);

  const inputs = {
    sender,
    recipient,
    subject,
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
document.getElementById('subject').addEventListener('input', updatePreview);
document.getElementById('body').addEventListener('input', updatePreview);

document.getElementById('downloadBtn').addEventListener('click', () => {
  if (!world) return;

  const sender = document.getElementById('sender').value;
  const recipient = document.getElementById('recipient').value;
  const subject = document.getElementById('subject').value;
  const body = document.getElementById('body').value;

  const source = SourceInput.new("main.typ", typstTemplate);
  world.setSourcesAndFiles([source], []);

  const inputs = { sender, recipient, subject, body };
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
