# LetterNow

The fastest way to write a formal letter directly in your browser.

LetterNow is a privacy-first web application for generating beautifully typeset letters. By default, it perfectly formats your text into the standard **DIN 5008 Type B** letter layout, widely used for formal and business correspondence in Germany and Europe.

Try it out here: [https://kmein.github.io/letternow](https://kmein.github.io/letternow)

## How it works

Under the hood, LetterNow is inspired by the amazing [brief.jetzt](https://brief.jetzt). It is powered by [Typst](https://typst.app), a modern, lightning-fast typesetting system (an alternative to LaTeX).

We use a WebAssembly (Wasm) port of the Typst compiler ([wasm-typst](https://github.com/brief-jetzt/wasm-typst)) combined with the excellent [letter-pro](https://typst.app/universe/package/letter-pro/) package. This means the entire compilation process—turning your text into an SVG preview and a final PDF—runs entirely locally inside your browser's JavaScript engine.

## Features

- **Blazing Fast**: No network requests mean the document compiles instantly as you type.
- **Offline Capable**: Once the page is loaded, you don't even need an internet connection.
- **Total Privacy**: Your data never leaves your computer.
- **Local Font Loading**: Load and use fonts installed locally on your system using the modern Local Font Access API (Chrome/Edge).

## Development

This project uses [Nix](https://nixos.org/) and [Vite](https://vitejs.dev/).

```sh
# Drop into the dev shell
nix develop

# Start the Vite development server
npm run dev

# Build for production
npm run build
```
