import {cell_class} from "./cell_module.js";

const flag = "🚩";
const happy_face = "🙂";
const dead_face = "😵";
const sunglasses_face = "😎";

const tile_length = 32;
const tile_border = 2;
const tile_total = tile_length + (tile_border * 2)

let rows = 10;
let cols = 10;
let total_mines = 10;

let mine_list = [];
let board_array = [];

let flag_mode = false;

//Create const from 
const gen_btn = document.getElementById("gen_board_btn");
const dig_btn = document.getElementById("dig");
const flag_btn = document.getElementById("flag");

const row_text = document.getElementById("num_of_rows");
const col_text = document.getElementById("num_of_cols");
const mine_text = document.getElementById("num_of_mines");
const board_div = document.getElementById("board");
const face_div = document.getElementById("face");



const create_Board = () => {
    face_div.innerHTML = happy_face;

    // Creates board array and populates it with 0
    for (let y = 0; y < rows; y++) {
        let row = []
        for (let x = 0; x < cols; x++) {
            row.push(new cell_class(x, y))
        }
        board_array.push(row);
    }

    // Resizing the board div
    const board_width = (tile_total * cols);
    const board_height = (tile_total * rows);

    board_div.style.width = board_width + "px";
    board_div.style.height = board_height + "px";

    // Place mines in the board array
    place_mines(total_mines , null, null);
    print_board();
}

const print_board = () => {
    let print_array = []
    for (let y = 0; y < rows; y++) {
        let row = []
        for (let x = 0; x < cols; x++) {
            row.push(board_array[y][x].return_graphic())
        }
        print_array.push(row)
    }
    console.table(print_array)
}

//Recurssive function that populates the board array with mines
const place_mines = (mines_count, first_x, first_y) =>{
    if (mines_count > 0) {   // Base Case
        // Generates potentual location for a mine
        let random_x = Math.floor(Math.random() * cols);
        let random_y = Math.floor(Math.random() * rows);

        // Creates a mine if potentual location does not contain a mine
        if ((!board_array[random_y][random_x].is_mine) && (random_x != first_x) && (random_y != first_y)) {
            board_array[random_y][random_x].is_mine = true;
            place_mines(mines_count - 1);
            mine_list.push(`${random_x}-${random_y}`);
            increment_surrounding_tiles(random_x, random_y);
        }
        else {
            place_mines(mines_count);
        }
    }
}

// Incremnet the number on surrounding tile if current tile is a mine
const increment_surrounding_tiles = (mine_x, mine_y) => {
    if ((mine_x < cols - 1))        board_array[mine_y][mine_x + 1].number += 1;  // Right
    if ((mine_x > 0))               board_array[mine_y][mine_x - 1].number += 1;  // Left
    if ((mine_y < rows - 1))        board_array[mine_y + 1][mine_x].number += 1;  // Bottom
    if ((mine_y > 0))               board_array[mine_y - 1][mine_x].number += 1;  // Top

    if ((mine_x < cols - 1) && (mine_y < rows - 1))         board_array[mine_y + 1][mine_x + 1].number += 1;  // Bottom-right
    if ((mine_x > 0) && (mine_y < rows - 1))                board_array[mine_y + 1][mine_x - 1].number += 1;  // Bottom-left
    if ((mine_x < cols - 1) && (mine_y > 0))                board_array[mine_y - 1][mine_x + 1].number += 1;  // Top-right
    if ((mine_x > 0) && (mine_y > 0))                       board_array[mine_y - 1][mine_x - 1].number += 1;  // Top-left
}

// Changes surrounding numbers by one (used when a mine is moved)
const decrement_surrounding_tiles = (mine_x, mine_y) => {
    if ((mine_x < cols - 1))        board_array[mine_y][mine_x + 1].number -= 1;  // Right
    if ((mine_x > 0))               board_array[mine_y][mine_x - 1].number -= 1;  // Left
    if ((mine_y < rows - 1))        board_array[mine_y + 1][mine_x].number -= 1;  // Bottom
    if ((mine_y > 0))               board_array[mine_y - 1][mine_x].number -= 1;  // Top

    if ((mine_x < cols - 1) && (mine_y < rows - 1))         board_array[mine_y + 1][mine_x + 1].number -= 1;  // Bottom-right
    if ((mine_x > 0) && (mine_y < rows - 1))                board_array[mine_y + 1][mine_x - 1].number -= 1;  // Bottom-left
    if ((mine_x < cols - 1) && (mine_y > 0))                board_array[mine_y - 1][mine_x + 1].number -= 1;  // Top-right
    if ((mine_x > 0) && (mine_y > 0))                       board_array[mine_y - 1][mine_x - 1].number -= 1;  // Top-left
}

// Show surrouding tiles using the flood fill algorithm 
const show_surrounding_tiles = (x, y) => {
    let clicked_tile = board_array[y][x] // Shows the current cell
    clicked_tile.show()
    if ((clicked_tile.number == 0) && (!clicked_tile.is_mine)) {
        // Recussively showing all surrouding zero cells
        if ((x + 1 < cols) && (!board_array[y][x + 1].showing))                         show_surrounding_tiles(x + 1, y);
        if ((x - 1 >= 0) && (!board_array[y][x - 1].showing))                           show_surrounding_tiles(x - 1, y);
        if ((y + 1 < rows) && (!board_array[y + 1][x].showing))                         show_surrounding_tiles(x, y + 1);
        if ((y - 1 >= 0) && (!board_array[y - 1][x].showing))                           show_surrounding_tiles(x, y - 1);

        if ((x + 1 < cols) && (y + 1 < rows) && (!board_array[y + 1][x + 1].showing))   show_surrounding_tiles(x + 1, y + 1);
        if ((x - 1 >= 0) && (y - 1 >= 0) && (!board_array[y - 1][x - 1].showing))       show_surrounding_tiles(x - 1, y - 1);
        if ((x + 1 < cols) && (y - 1 >= 0) && (!board_array[y - 1][x + 1].showing))     show_surrounding_tiles(x + 1, y - 1);
        if ((x - 1 >= 0) && (y + 1 < rows) && (!board_array[y + 1][x - 1].showing))     show_surrounding_tiles(x - 1, y + 1);
    }
    check_game_won();
}

// Ends the game when the user clicks on a mine
const game_lose = () => {
    face_div.innerText = dead_face;
    board_array.forEach(row => row.forEach(current_tile => current_tile.game_over()));
}

// 
const check_game_won = () => {
    if(board_array.every(row => row.every(current_tile => {
        // Checks to see if all mines have been flagged and all other cells are showing
        return ((!current_tile.is_mine && current_tile.showing) || (current_tile.is_mine && current_tile.flagged))
    }))){
        // If game is 
        face_div.innerText = sunglasses_face;
        board_array.forEach(row => row.forEach(current_tile => current_tile.game_over()));
    }
}

const move_mine = (mine_x, mine_y) => {
    board_array[mine_y][mine_x].is_mine = false;
    decrement_surrounding_tiles(mine_x, mine_y)
    place_mines(1, mine_x, mine_y);
}

const setup_board_gen = () => {
    gen_btn.addEventListener("click", () => {
        //Defines the following variables from the textboxes
        rows = row_text.value
        cols = col_text.value
        total_mines = mine_text.value

        //Insures thats the is atleast 1x1 with 1 mine
        if(rows < 1) alert("Number of rows must be greater than Zero");
        if(cols < 1) alert("Number of columns must be greater than Zero");
        if(total_mines < 1) alert("Number of mines must be greater than Zero");
        if(total_mines > (rows * cols)) alert("Number of mines must be less than the product of the rows and columns");

        if((rows > 0) && (cols > 0) && (total_mines < (rows * cols))) {
            // Deletes all old tile to restart the game
            for (let y = rows - 1; y >= 0; y--) {
                for (let x = cols - 1; x >= 0; x--) {
                    board_array[y][x].delete_tile();
                }
                board_array.pop()
            }
            create_Board();
        }
    })
}

const setup_flag_btn = () => {
    dig_btn.addEventListener("click", () => flag_mode = false);
    flag_btn.addEventListener("click", () => flag_mode = true);
}

window.onload = function () {
    setup_flag_btn();
    setup_board_gen();
    create_Board();
}

export {show_surrounding_tiles, check_game_won, game_lose, move_mine, flag_mode}