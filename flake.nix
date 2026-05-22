{
  description = "letternow web application";

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
            mkdir -p public
            cp ${pkgs.roboto}/share/fonts/truetype/*.ttf public/
            cp ${pkgs.open-sans}/share/fonts/truetype/*.ttf public/
            cp ${pkgs.lora}/share/fonts/truetype/*.ttf public/
            cp ${pkgs.merriweather}/share/fonts/truetype/*.ttf public/
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out/share/letternow
            cp -r dist/* $out/share/letternow/
            runHook postInstall
          '';
        };

        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_20
          ];

          shellHook = ''
            echo "letternow dev environment loaded"
            
            # Copy Nix-provided fonts into the public directory for the dev server
            mkdir -p public
            cp ${pkgs.roboto}/share/fonts/truetype/*.ttf public/
            cp ${pkgs.open-sans}/share/fonts/truetype/*.ttf public/
            cp ${pkgs.lora}/share/fonts/truetype/*.ttf public/
            cp ${pkgs.merriweather}/share/fonts/truetype/*.ttf public/
            
            echo "Node.js version: $(node -v)"
            echo "npm version: $(npm -v)"
          '';
        };
      }
    );
}
