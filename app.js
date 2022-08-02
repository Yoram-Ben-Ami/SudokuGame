var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;
var board;
var boardSol;
var boardToSolve;
var checkStatus = false;

window.onload = function () {

    id("SudokuSolver").addEventListener("click", solveIt);
    id("start-btn").addEventListener("click", startGame);
    id("getHint").addEventListener("click", getRandomHint);
    let numCon = id("number-container");
    for (let i = 0; i < numCon.children.length; i++) {
        numCon.children[i].addEventListener("click", function () {
            if (!disableSelect) {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    for (let k = 0; k < 9; k++) {
                        numCon.children[k].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        })
    }
}

//Constructor for a randomly generated sudoku board
function startGame() {
    id("getHint").classList.remove("hidden");
    id("getHint").classList.add("button-19");
    id("PressForSol").classList.remove("button-19");
    id("PressForSol").classList.add("hidden");
    checkStatus = false;

    createTable(parseInt(id("diff-a").value));//Takes the difficulty level from the user

    lives = 5;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: 5";
    generateBoard(board);

    startTimer();
    ChangeColors()

    id("number-container").classList.remove("hidden");
}

//When the user wants to change a color, 
//we will go through all the elements and add a class to them/remove them from a class 
//(so that the class will continue to determine the color element) according to the user's requirement
function ChangeColors() {
    if (id("theme-selector").value == "theme-1") {
        qs("body").classList.remove("dark");
        qs("footer").classList.remove("dark");
        for (let k = 0; k < 3; k++) {
            qsa("select")[k].classList.remove("dark");
        }
        for (let k = 0; k < 81; k++) {
            qsa(".tile")[k].classList.remove("dark1");
        }
    } else {
        qs("body").classList.add("dark");
        qs("footer").classList.add("dark");
        for (let k = 0; k < 81; k++) {
            qsa(".tile")[k].classList.add("dark1");
        }
        for (let k = 0; k < 3; k++) {
            qsa("select")[k].classList.add("dark");
        }
    }
}

//Constructor for an empty sudoku board where the user
// will have to fill it in order for you to solve the sudoku for him
function solveIt() {
    checkStatus = true;
    clearPrevious();
    id("timer").textContent = "Press For solutaion";
    id("lives").textContent = "Fill in the table according to the data you have, then click on 'Solve It'";
    id("PressForSol").classList.remove("hidden");
    id("PressForSol").classList.add("button-19");
    id("getHint").classList.remove("button-19");
    id("getHint").classList.add("hidden");
    board = "---------------------------------------------------------------------------------";
    boardSol = "---------------------------------------------------------------------------------";
    generateBoard(board);
    disableSelect = false;
    ChangeColors()
    id("number-container").classList.remove("hidden");
    id("PressForSol").addEventListener("click", solveFromUser);
}

//After the user has filled in the sudko he wants to solve, 
//we will run an algorithm that solves it using backtracking
function solveFromUser() {
    board = "";
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent == "") {
            board += "-";
        }
        else board += tiles[i].textContent;
    }
    let sol = StringToArray(board);

    solveSudoku(sol);
    board = ArrayToString(sol);
    generateBoard(board);
}
//Updates the table according to the instance of the cells
function upDateBoard() {
    board = "";
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent == "") {
            board += "-";
        }
        else board += tiles[i].textContent;
    }
}
//We will create 81 elements so that each one represents a cell on the sudoku board, 
//and we will give them the classes that will give the board the shape of a sudoku board
function generateBoard(board) {
    clearPrevious();
    let idCount = 0;

    for (let i = 0; i < 81; i++) {
        let tile = document.createElement("p")
        if (board.charAt(i) != "-") {
            tile.textContent = board.charAt(i)
        } else {
            tile.addEventListener("click", function () {
                if (!disableSelect) {
                    if (tile.classList.contains("selected")) {
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        for (let k = 0; k < 81; k++) {
                            qsa(".tile")[k].classList.remove("selected");
                        }
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }

        tile.id = idCount;
        idCount++;
        tile.classList.add("tile");
        if (tile.id > 17 && tile.id < 27 || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        id("board").appendChild(tile);
    }
}
//We will randomly select an element from the solution and run and insert it into the board
function getRandomHint(board) {
    upDateBoard(board);
    let tiles = qsa(".tile");

    for (let i = 0; i < tiles.length; i++) {
        let randomNum = Math.floor(Math.random() * 81);
        if (tiles[randomNum].textContent === "") {
            tiles[randomNum].textContent = boardSol.charAt(tiles[randomNum].id);
            if (checkDone()) {
                endGame();
            }
            break;
        }
    }
}
//For each action of the user we will check if the input is correct,
// we will change the amount of his life, and we will check if he finished the game or not
function updateMove() {
    if (selectedTile && selectedNum) {
        selectedTile.textContent = selectedNum.textContent;
        if (checkCorrect(selectedTile)) {
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            selectedNum = null;
            selectedTile = null;
            if (checkDone()) {
                endGame();
            }
        }
        else {
            selectedTile.classList.add("incorrect");
            setTimeout(function () {
                if (!checkStatus) {
                    lives--;
                    if (lives == 0) {
                        endGame();
                    }
                    else {
                        id("lives").textContent = "Lives Remaining: " + lives;
                        disableSelect = false;
                    }
                }
                if (checkStatus) {
                    disableSelect = false;
                }
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");

                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;

            }, 200)
        }
    }
}
//"checkDone" is Correctness check, going through all the cells in the table, 
//and seeing if there is a missing cell, 
//the table can be filled if and only if the user has entered information that matches the solution.
function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent === "") {
            return false;
        }
    }
    return true;
}

// The function "validNumber" checks if the entry of the table complies with the Sudoku rules,
// with each entry we will check if the member is unique in the row,
// if the member is unique in the column, and if the member is unique in the square to which it belongs.
// This functionality is only relevant if the user chooses to solve a sudoku board, 
// otherwise the test is performed according to the solution.
function validNumber(grid, row, col, num) {

    for (let i = 0; i < 9; i++) {
        if (grid[row][i] == num && i != col) {
            return false;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] == num && i != row) {
            return false;
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[row - row % 3 + i][col - col % 3 + j] == num && ((row - row % 3 + i != row) && (col - col % 3 + j != col))) {
                return false;
            }
        }
    }
    return true;
}

//The function checks if the input is correct depending on the game mode
function checkCorrect(tile) {
    if (checkStatus) {
        upDateBoard();
        let boardAray = StringToArray(board);
        let row = parseInt(tile.id / 9, 10);
        let col = tile.id % 9;
        let valid = validNumber(boardAray, row, col, tile.textContent);
        if (valid) {
            return true;
        }
        else return false;
    }
    else if (boardSol.charAt(tile.id) === tile.textContent) {
        return true;
    }
    return false;
}
//The function "endGame" shows the results according to time, life and result
function endGame() {
    disableSelect = true;
    clearTimeout(timer);
    if (lives === 0 || timeRemaining === 0) {
        id("lives").textContent = "You Lost! You're a loser";
    } else {
        id("lives").textContent = "You Won!";
    }
}

//Depending on the user's input, we will build the timer.
function startTimer() {
    let flag = true;
    timeRemaining = parseInt(id("time-selector").value) * 60;
    if (timeRemaining == 0) {
        flag = false;
    }

    id("timer").textContent = timeConversion(timeRemaining);

    timer = setInterval(function () {
        if (flag) {
            timeRemaining--;
        }
        else {
            timeRemaining++;
        }
        if (timeRemaining === 0) {
            endGame();
        }
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)
}
function timeConversion(time) {
    let min = Math.floor(time / 60);
    if (min < 10) {
        min = "0" + min;
    }
    let sec = time % 60;
    if (sec < 10) {
        sec = "0" + sec;
    }
    return min + ":" + sec;
}
//Clear the previous board
function clearPrevious() {
    let tiles = qsa(".tile");

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    if (timer) clearTimeout(timer);

    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    selectedNum = null;
    selectedTile = null;

}
//getElementById
function id(id) {
    return document.getElementById(id);
}
//querySelector
function qs(selector) {
    return document.querySelector(selector);
}
//querySelectorAll
function qsa(selector) {
    return document.querySelectorAll(selector);
}
//Creating a solution for a sudco board, with a two-dimensional array
function solveSudoku(board) {
    const n = board.length;
    dfs(board, n);
}

function dfs(board, n) {
    // for every cell in the sudoku
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            // if its empty
            if (board[row][col] !== '.') {
                continue;
            }
            // try every number 1-9
            for (let i = 1; i <= 9; i++) {
                const c = i.toString();
                // if that number is valid
                if (isValid(board, row, col, n, c)) {
                    board[row][col] = c;
                    // continue search for that board, ret true if solution is reached
                    if (dfs(board, n)) return true;
                }
            }
            // solution wasnt found for any num 1-9 here, must be a dead end...
            // set the current cell back to empty
            board[row][col] = '.';
            // ret false to signal dead end 
            return false;
        }
    }
    // all cells filled, must be a solution
    return true;
}
//Checks the table entry if it is correct, this check is slightly different from the second function that checks
function isValid(board, row, col, n, c) {
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < n; i++) {
        if (board[row][i] === c || board[i][col] === c) return false;
        const curRow = blockRow + Math.floor(i / 3);
        const curCol = blockCol + Math.floor(i % 3);
        if (board[curRow][curCol] === c) return false;
    }
    return true;
}
//Creating the board randomly according to the required level
function createTable(diff) {
    let grid = [[".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."]];
    boardSol = "";
    board = "";
    for (let i = 1; i < 10; i++) {
        let k = Math.floor(Math.random() * 9);
        let j = Math.floor(Math.random() * 9);
        grid[k][j] = i.toString();
    }
    solveSudoku(grid);
    let count = diff;

    boardSol = ArrayToString(grid);

    while (count > 0) {
        let i = Math.floor(Math.random() * 9);
        let j = Math.floor(Math.random() * 9);
        if (grid[i][j] != '-') {
            grid[i][j] = '-';
            count--;
        }
    }
    board = ArrayToString(grid);
}
//Converts the board from a string representation to an array representation
function StringToArray(table) {
    let array = [[".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."]];
    let k = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (table.charAt(k) == "-") {
                array[i][j] = ".";
            } else array[i][j] = table.charAt(k);
            k++;
        }
    }
    return array;
}
//Converts the board from an array representation to a string representation
function ArrayToString(grid) {
    let res = "";
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {

            res += grid[i][j].toString();
        }
    }
    return res;
}




