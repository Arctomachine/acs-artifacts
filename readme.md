# ACS artifact stats compiler

This app is fan made tool for [ACS](https://store.steampowered.com/app/955900/Amazing_Cultivation_Simulator/) game.

## What it is

It aims to compile all possible artifacts and their stats into one table (`.csv` file).

## What it is not

It is not type of "companion apps" which provides assistance for particular situations in real time based on immediate
input. It is primarily meant for analytical work, however it has potential to be evolved into companion app.

## Requirements and usage

It runs on Node.js, the latest LTS version 18 or newer, and requires one of associated package managers.

To install dependencies
run one of the following commands inside root folder of project:

- `npm install` - if you have no idea what it is
- `yarn install`
- `pnpm install` - recommended, if you are familiar with it

To start app run one of the following commands in root folder:

- `npm run dev`
- `yarn dev`
- `pnpm dev`

It will start console task and attempt to process input files.

## Input and output

Input files should be located inside `./data` folder. All names are predefined. Program expects 4 files:

- `./data/labels.csv` - info to convert item labels into stat bonuses
- `./data/is material.csv` - table of labels for items acting as materials for other items
- `./data/has material.csv` - table of labels for items made from singular material: weapons, tools, some other misc
- `./data/has no material.csv` - table of labels for items not made from singular material or not crafted at all

Files provided with program by default should be valid for current game version (1.24)

If program runs successfully, it will print `ready` in console 2 times. Program can now be stopped by pressing Ctrl+C in
console window (may take few attempts).

Output files will be placed into `./output` folder:

- `./output/artifacts.csv` - main output file suitable for human reading. Multiple names in one cell are separated by
  line brake for better readability. Best opened in spreadsheet programs.
- `./artifacts_with_links.csv` - file prepared to be used in wiki pages. All names contain `[[ ]]` for linking, multiple
  names in one cell are separated with comma space.
