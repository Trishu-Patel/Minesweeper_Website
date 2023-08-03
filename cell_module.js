import {show_surrounding_tiles, check_game_won, game_lose, move_mine, flag_mode} from "./minesweeper_module.js"

class cell_class {
    static first_click = true;
    static mine = "💣";
    static flag = "🚩";

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.number = 0;
        this.is_mine = false;
        this.showing = false;
        this.id = `${this.x}-${this.y}`
        this.flagged = false

        this.tile = document.createElement("div");
        document.getElementById("board").append(this.tile)
        this.tile.id = this.id;

        // Make the tile white when hovered over
        this.tile.addEventListener("mouseover", this.hover);
        this.tile.addEventListener("mouseout", this.not_hover);

        this.tile.addEventListener("click", this.click_tile);
    }

    click_tile = (e) => {
        if(flag_mode || e.ctrlKey) this.change_flag();   // flags the tile if the ctrl key is pressed
        else if(!this.flagged){             // Prevents you from digging on tile that has a flag on it
            if (cell_class.first_click) {              // if the first click is a mine, that mine will be moved
                cell_class.first_click = false;
                if(this.is_mine) move_mine(this.x, this.y);
            }
            else if(this.is_mine)   game_lose();
            show_surrounding_tiles(this.x, this.y);
        }
        check_game_won();
    }

    game_over = () => {
        this.tile.removeEventListener("click", this.click_tile);
        this.tile.removeEventListener("mouseover", this.hover);
        this.tile.removeEventListener("mouseout", this.not_hover);
    }

    hover = () => this.tile.style.backgroundColor = "white";

    not_hover = () => this.tile.style.backgroundColor = "darkgrey";

    //Shows the cell
    show = () => {
        this.tile.removeEventListener("mouseover", this.hover);
        this.tile.removeEventListener("mouseout", this.not_hover);
        this.flagged = false
        this.showing = true;
        this.tile.style.backgroundColor = "#1E1E1E";
        this.tile.style.cursor = "auto";
        this.tile.innerText = this.return_graphic();
        this.set_color()
    }

    //Return the graphic desplayed on the cell when click
    //Used to print out the table in the inspect menu
    return_graphic = () =>  {
        if (this.is_mine)           return cell_class.mine;
        else if (this.number == 0)  return "";
        else                        return this.number;
    }

    //Deletes the div 
    delete_tile = () => this.tile.remove();

    //Changes the color of the text based of the number of the cell
    set_color = () => {
        if (!this.is_mine) {
            let tile_color;
            switch (this.number) {
                case 0: tile_color = "transparent";
                    break;
                case 1: tile_color = "#00c0c0";
                    break;
                case 2: tile_color = "#ff2f8e";
                    break;
                case 3: tile_color = "#66df48";
                    break;
                case 4: tile_color = "#ffd600";
                    break;
                case 5: tile_color = "#ff9e4c";
                    break;
                case 6: tile_color = "#9803ce";
                    break;
                case 7: tile_color = "#6a77dd";
                    break;
                case 8: tile_color = "5f5f5f";
                    break;
            }
            this.tile.style.color = tile_color;
        }
    }

    // Flips the state of the flag
    change_flag = () => {
       if(!this.showing){ // prevents you from flagging a cell that is showing
            this.flagged = !this.flagged
            if(this.flagged)    this.tile.innerText = cell_class.flag;
            else                this.tile.innerText = "";
        }
    }
}

export {cell_class};