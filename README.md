
# The Child Trainer

## How to compile (In the way I do it)

I'm pretty sure these indications work on Linux and MacOS but I only tested it on Windows.

### You need to install on your OS (minimum requeriments):

- [Tweego](https://www.motoslave.net/tweego/) - Mandatory. To compile all files in the **source** folder to a Twine 2 compatible html (final result). When installed on Windows make sure you leave the "Add to PATH" option checked (It is by default).
- [node.js](https://nodejs.org/) - Needed to transpile the TypeScript in the **ts** folder into Javascript so that Tweego can then compile it into the game.
- [VSCode](https://code.visualstudio.com/) - IDE I use to develop the game. This project is configured to work with this one and it will only compile out of the box with VSCode.

Once all that is installed and the project is cloned or downloaded you can proceed to the first compilation:

1. Open the file **theChildTrainer.code-workspace** with VSCode.
2. Open a terminal (Menu: Terminal -> New Terminal).
3. While connected to the internet, enter the command `npm install` into the terminal to download and install project dependences (specially [Babel js](https://babeljs.io/) transcompiler for the TypeScript).
4. Build the project (by default Ctrl+Shift+B or Cmd+Shift+B).

Once done compiling the terminal will show the phrase "done compiling" and the compiled html will be in the **releases** folder.

## VSCode extensions I use for this project

- **Twee 3 Language Tools** - Extremely useful when working with twee (.tw extension) files easier and faster.
- **open in browser** - With this one, to test the compiled game just right click on it (html) and select "Open in Default Browser".
- **Prettier - Code formatter** - This one is for the Typescript. Press Shift+Alt+F to automatically format it nicely.
- **vscode-icons** - Adds icons to most file types to identify them on VSCode file viewer at a single glance.
- **indent-rainbow** - Adds a different color to the indentation depending on how many tabs or spaces have. It makes it faster to analize it. In my opinion.
- **Noctis** - Just a collection of color themes to please my eyes. I use the *Noctis Minimus* theme.

## Extra recommendations

Due the nature of this game. If you don't like Microsoft obtaining usage information from you, you can disable telemetry in VSCode, clicking File -> Preferences -> Settings and then go to the search/filter box at the top, type telemetry, under that select the User tab, and disable all telemetry.

***

If you have any question don't hesitate to ask me 😁

