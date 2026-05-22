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
            echo "Node.js version: $(node -v)"
            echo "npm version: $(npm -v)"
          '';
        };
      }
    );
}
