# Angular Tetris Game

A simple implementation of the classic Tetris game built with Angular. 
This project showcases basic game mechanics including piece movement, rotation and collision detection.

![image](https://github.com/user-attachments/assets/dd5c9426-1d16-423d-8252-ca686873601b)

## Features

- **Classic Tetris Gameplay**: Drop and rotate tetrominoes to fill rows.
- **Pause and Resume**: Easily pause the game and resume at any time.
- **Game States**: Handle game diffent conditions.

## Acknowledgments

Inspired by the classic Tetris game.
Built using the Angular framework and RxJS.

## Installation

To run the project locally, follow these steps:

Install the dependencies:

`npm install`

## Start the development server

`ng serve`

Open your browser and visit http://localhost:4200 to play the game...

### Controls

- **Arrow Down**: Move the tetromino down.
- **Arrow Up**: Scroll the tetromino down instantly.
- **Arrow Left**: Move the tetromino left.
- **Arrow Right**: Move the tetromino right.
- **Space**: Rotate the tetromino.
- **P**: Pause/Resume the game.

### Game States

The game state is managed through an observable pattern using RxJS. The game can be in three states:

- **INGAME**: The game is currently being played;
- **PAUSE**: The game is paused;
- **GAMEOVER**: The game has ended.

# License

This project is licensed under the MIT License.
