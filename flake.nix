{
  description = "letternow dev environment";

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
