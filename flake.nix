{
  description = "LetterNow web application";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.default = pkgs.buildNpmPackage {
          pname = "letternow";
          version = "1.0.0";

          src = ./.;

          npmDepsHash = "sha256-dpU3zHjbvKLL1b+o6QLGvxiDpAuN3GW+8gGC4K8Ydx0=";

          buildInputs = [ pkgs.nodejs_20 ];

          preBuild = ''
            mkdir -p public/fonts
            cp ${pkgs.roboto}/share/fonts/truetype/*.ttf public/fonts/
            cp ${pkgs.open-sans}/share/fonts/truetype/*.ttf public/fonts/
            cp ${pkgs.lora}/share/fonts/truetype/*.ttf public/fonts/
            cp ${pkgs.merriweather}/share/fonts/truetype/*.ttf public/fonts/
            mkdir -p public/typst
            cp ${pkgs.typstPackages.letter-pro}/lib/typst-packages/letter-pro/3.0.0/src/lib.typ public/typst/letter-pro.typ
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r dist/* $out/
            runHook postInstall
          '';
        };

        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_20
          ];

          shellHook = ''
            echo "LetterNow dev environment loaded"

            # Copy Nix-provided fonts into the public directory for the dev server
            mkdir -p public/fonts
            chmod -R u+w public/fonts 2>/dev/null || true
            cp -f ${pkgs.roboto}/share/fonts/truetype/*.ttf public/fonts/
            cp -f ${pkgs.open-sans}/share/fonts/truetype/*.ttf public/fonts/
            cp -f ${pkgs.lora}/share/fonts/truetype/*.ttf public/fonts/
            cp -f ${pkgs.merriweather}/share/fonts/truetype/*.ttf public/fonts/
            
            mkdir -p public/typst
            chmod -R u+w public/typst 2>/dev/null || true
            cp -f ${pkgs.typstPackages.letter-pro}/lib/typst-packages/letter-pro/3.0.0/src/lib.typ public/typst/letter-pro.typ

            echo "Node.js version: $(node -v)"
            echo "npm version: $(npm -v)"
          '';
        };
      }
    );
}
