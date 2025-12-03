# How to Share Your Extension

To share your "Django Test Manager" extension with friends for testing and feedback, you can package it into a `.vsix` file. They can then install this file directly into their VS Code.

## Prerequisites

You need the `vsce` (Visual Studio Code Extensions) command-line tool.

1.  Open your terminal.
2.  Install `vsce` globally (if you haven't already):
    ```bash
    npm install -g @vscode/vsce
    ```

## Packaging the Extension

1.  Navigate to the root directory of your project in the terminal:
    ```bash
    cd /Users/viseshagarwal/Documents/django-test-agy
    ```
2.  Run the package command:
    ```bash
    vsce package
    ```
3.  This will create a file named something like `django-test-manager-0.1.0.vsix` in your project folder.

## How Your Friends Can Install It

1.  Send the `.vsix` file to your friends.
2.  They should open VS Code.
3.  Go to the **Extensions** view (click the square icon in the sidebar or press `Cmd+Shift+X`).
4.  Click the **"..."** (Views and More Actions) menu at the top right of the Extensions view.
5.  Select **"Install from VSIX..."**.
6.  Choose the `.vsix` file you sent them.
7.  Reload VS Code if prompted.

## Icon

I have automatically generated a modern SVG logo for you (`icon.svg`) and configured the extension to use it. You don't need to do anything manually!

**Note:** While VS Code supports SVG icons, for the official Marketplace, a PNG is preferred. If you decide to publish this globally later, you might want to convert `icon.svg` to a 128x128 PNG. For sharing with friends, the SVG is fine.
