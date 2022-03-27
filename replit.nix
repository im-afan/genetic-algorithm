{ pkgs }: {
  deps = [
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
		pkgs.python39
		pkgs.python39Packages.numpy
		pkgs.python39Packages.tensorflow
  ];
}