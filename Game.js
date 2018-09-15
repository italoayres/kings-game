export const Game = class {
  constructor() {
    this.CONFIG = {
      NO_PLAYERS: 2,
      NO_PIECES: 5,
      NO_ROWS: 5,
      NO_COLUMNS: 5,
      P1: "a",
      P2: "b",
      P1_PIECE: "a",
      P1_KING: "A",
      P2_PIECE: "b",
      P2_KING: "B",
      P1_PIECE_CHAR: "⭕",
      P1_KING_CHAR: "📛",
      P2_PIECE_CHAR: "🔹",
      P2_KING_CHAR: "♿",
      EMPTY: "0",
      GOAL: "G",
      GOAL_POS: 12,
      START_POSITION_STRING: "aaAaa0000000G0000000bbBbb",
      HEROES: [
        "🌚",  "🐧",  "🎱",  "🖲",  "🐺",  "🤡",  "👻",  "💀",
        "⛄",  "🐨",  "🐤",  "🍁",  "🦁",  "🐡",  "😾",  "♿",
        "🐋",  "🌎",  "👹",  "🤖",  "😡",  "🍄",  "🦀",  "🍅",
        "📛",  "🐻",  "💩",  "🙉"
      ],
      HEROES_DISPLAY: `
        1.🌚 2.🐧 3.🎱 4.🖲 5.🐺
        6.🤡 7.👻 8.💀 9.⛄ 10🐨
        11🐤 12🍁 13🦁 14🐡 15😾
        16♿ 17🐋 18🌎 19👹 20🤖
        21😡 22🍄 23🦀 24🍅 25📛
        26🐻 27💩 28🙉`,
      HERO_MAP: {
        "🌚🐧🎱🖲🐺": "◼",
        "🤡👻💀🐨": "🔘",
        "⛄": "❄",
        "🕷": "🕸",
        "🐻": "🍯",
        "🐤🍁🦁🐡😾💩🙉": "🔸",
        "🐋🌎♿": "🔹",
        "👹🤖😡🍄🦀🍅📛": "⭕"
      }
    }
    this.board = [];
    this.started = false;
    this.score = {};
    this.score[this.CONFIG.P1] = 0;
    this.score[this.CONFIG.P2] = 0;
    //this.setRandomHero();

  }

  newGame({ rnd = false } = {}) {
    let { P1, P2, START_POSITION_STRING } = this.CONFIG;
    this.board = this.setBoardString(START_POSITION_STRING);
    this.turn = P1;
    this.next = P2;
    this.movesHistory = [];
    this.lastMove = null;
    this.playing = true;
    if (rnd) this.setRandomHero();

  }

  // [5][5] => bbBbb7G7aaAaa
  getBoardString() {
    return this.board.join('');
  }

  // bbBbb7G7aaAaa => [5][5]
  setBoardString(s) {
    this.board = s.split('');
    return this.board;
  }

  //"b1 c2"
  moveCmd(cmd) {
    let [a, b] = cmd.split(" ");
    if (!a || !b) {
      console.error(`moveCmd(${cmd}): Invalid arguments`);//throw new Error("Invalid arguments", a, b)
      return false;
    }

    let [x, y] = this.cmd2coor(a);
    let [x2, y2] = this.cmd2coor(b);

    //TODO: isLegal() isTurn()
    let posFrom = this.coor2pos(x, y),
      posTo = this.coor2pos(x2, y2);

    //console.log("from: ",a, "coor:", x, y, " pos: ", posFrom)
    //console.log("to: ",b, "coor:", x2, y2, " pos: ", posTo)
    console.log(`moveCmd(${cmd})`);
    return this.movePiece(posFrom, posTo);
  }

  // 20, 2 => move sucesfull
  movePiece(posFrom, posTo) {
    let { EMPTY, GOAL } = this.CONFIG;

    // Ilegal move if
    if (this.board[posFrom] == EMPTY ||     // from cell is goal
      this.board[posFrom] == GOAL ||     // from cell is empty
      (
        this.board[posTo] != EMPTY &&     // to cell not empty
        this.board[posTo] != GOAL         // and not goal
      )) {
      console.error(`movePiece(${posFrom} ${posTo}): Ilegal move.`);
      return false; //throw new Error("Ilegal move exception");
    }
    let player = this.getPlayerByPiece(this.board[posFrom]);
    this.board[posTo] = this.board[posFrom];
    this.board[posFrom] = EMPTY;

    this.lastMove = player;
    this.movesHistory.push({
      player: player,
      from: posFrom,
      to: posTo
    });    

    return true;
  }

  // b => P2
  getPlayerByPiece(p) {
    let { P1, P1_KING, P1_PIECE, P2, P2_KING, P2_PIECE, } = this.CONFIG;

    if(p==P1_KING || p==P1_PIECE) return P1;
    else if(p==P2_KING || p==P2_PIECE) return P2;

    return false;
  }

  // 1, 1 => 6
  coor2pos(x, y) {
    return y * this.CONFIG.NO_ROWS + x;
  }

  // 6 => 1,1
  pos2coor(c) {
    return [Math.floor(c / this.CONFIG.NO_ROWS), (c % this.CONFIG.NO_ROWS)];
  }

  // a1 => 20
  cmd2coor(cmd) {

    let [x, y] = cmd.split("");

    x = this.getColumnNumber(x);
    y = this.CONFIG.NO_ROWS - parseInt(y);

    return [x, y];
  }

  // a => 1
  getColumnNumber(c) {
    let ref = { "a": 0, "b": 1, "c": 2, "d": 3, "e": 4 };
    let n = parseInt(ref[c.toLowerCase()]);
    if (Number.isNaN(n)) {
      console.error("Invalid column: " + c);
      return -1; //throw new Error("Invalid column:");
    }
    return n;
  }

  //todo: verifyTurn

  //todo: test
  // piece position => array of positions
  getLegalMoves(pos) {
    let { GOAL } = this.CONFIG,
      offsets = [-1, 0, 1],
      legalMoves = [],
      [cellX, cellY] = this.pos2coor(pos),
      piece = this.board(pos);

    for (let i in offsets) {
      for (let j in offsets) {
        let xOff = offsets[i], yOff = offsets[j],
          newX = cellX, newY = cellY, newCellPos, newCellValue, lastEmptyCell = null;
        do {
          newX += xOff;
          newY += yOff;
          newCellPos = this.coor2pos(newX, newY);

          // Out of bounds
          if (!this.isValidCell(newCellPos)) break;

          newCellValue = this.board[newCellPos];

          if (this.isCellEmpty(newCellPos)) {
            lastEmptyCell = newCellPos;
          } else if (newCellValue == GOAL) {
            if (this.isCellKing(newCellPos)) {
              lastEmptyCell = newCellPos;
            } else {
              // Regular pieces cant stop at Goal
              lastEmptyCell = null;
              continue;
            }
          } else if (this.isCellPiece(newCellPos)) {
            break;
          }

        } while (true)
        legalMoves.push(lastEmptyCell);
      }
    }
    return legalMoves;
  }

  isMoveLegal() {

  }

  endTurn() {
    let { P1, P2 } = this.CONFIG;
    this.turn = (this.turn == P1 ? P2 : P1);
    this.checkVictory();
  }

  // "b" || pos: 15 => true
  isCellPiece(p) {
    let { P1_KING, P1_PIECE, P2_KING, P2_PIECE } = this.CONFIG;
    let cell = this.board[p];
    return ([P1_KING, P1_PIECE, P2_KING, P2_PIECE].indexOf(cell) > -1);
  }
  // "B" || pos: 15 => true
  isCellKing(p) {
    let cell = this.board[p];
    return cell == this.CONFIG.P1_KING || cell == this.CONFIG.P2_KING
  }

  // 18 => true
  isCellEmpty(p) {
    let cell = this.board[p];
    return (cell == this.CONFIG.EMPTY);
  }

  isValidCell(p) {
    return (p >= 0 && p < this.board.length);
  }

  checkVictory() {
    let {GOAL, GOAL_POS, P1_KING, P2_KING} = this.CONFIG;

    if(this.board[GOAL_POS] == GOAL) 
      return false;      
    else if(this.board[GOAL_POS] == P1_KING || this.board[GOAL_POS] == P2_KING) {
      let player = this.getPlayerByPiece(this.board[this.CONFIG.GOAL_POS]);
      this.endGame({winner: player});
    }
  }

  getScore() {
    let { P1, P1_KING_CHAR, P2, P2_KING_CHAR } = this.CONFIG;
    console.log(this.score);
    return `${P1_KING_CHAR} ${this.score[P1]} x ${this.score[P1]} ${P2_KING_CHAR}`
  }

  resign() {
    if(this.lastMove) {      
      this.endGame({winner: this.lastMove});
    }
    else {
      this.endGame();
    }
  }

  endGame({winner=false}={}) {
    this.playing = false;
    if(winner) {
      this.score[winner]+=1;
    }
  }

  // P1 => 📛
  getHeroChar(p) {
    let { P1, P1_KING_CHAR, P2, P2_KING_CHAR } = this.CONFIG;
    return (p == P1 ? P1_KING_CHAR :
      p == P2 ? P2_KING_CHAR :
        false);
  }

  // player, char
  setHero(player, char) {
    let { HEROES, P1, P2 } = this.CONFIG;
    if (Number.isInteger(+char)) {
      char = HEROES[char-1];
    }

    if (Number.isInteger(+player)) {
      player = player == 1 ? P1 : P2;
    }

    let piece = this.getHeroPiece(char);
    console.log(char);

    if (piece && piece.length > 0) {
      if (player == P1) {
        this.CONFIG.P1_PIECE_CHAR = piece;
        this.CONFIG.P1_KING_CHAR = char;
        return true;
      } else if (player == P2) {
        this.CONFIG.P2_PIECE_CHAR = piece;
        this.CONFIG.P2_KING_CHAR = char;
        return true;
      } else {
        console.error("Invalid Player.");
        return false;
      }
    } else {
      console.error("Invalid Hero.");
      return false;
    }

  }

  getHeroes() {
    return this.CONFIG.HEROES_DISPLAY;
  }

  getHeroPiece(char) {
    let tier = this.getHeroTier(char);
    
    return this.CONFIG.HERO_MAP[tier];
  }

  getHeroTier(char) {
    let { HERO_MAP } = this.CONFIG;
    for (let tier in HERO_MAP) {
      let arr = tier.match(/.{1,2}/g);  
      //console.log(`${char} ? ${arr.toString()}.length = ${arr.length} -> [${arr.indexOf(char)}]`)
      if(arr.indexOf(char) > -1) {
        return tier;
      }
    }
    return -1;
  }

  // player => If !p randomize both heroes
  setRandomHero(p) {
    let { HEROES, P1, P2, P1_KING_CHAR, P2_KING_CHAR } = this.CONFIG;
    let hero, hero2;;
    let rnd = () => this.rand(HEROES.length);   

    if (p) {
      hero2 = (p == P1 ? P2_KING_CHAR : P1_KING_CHAR);
    } else {
      // Rnd both 
      hero2 = HEROES[rnd()];
      this.setHero(P1, hero2); //todo
      p = P2;
    }

    do {
      hero = HEROES[rnd()];
    } while (this.isSameTier(hero, hero2));

    this.setHero(p, hero);
    return true;
  }

  // hero1, hero2 => true
  isSameTier(h1, h2) {
    return (this.getHeroTier(h1) == this.getHeroTier(h2));
  }

  rand(high, low = 0) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }

  /**  ```
     
     📛 3 x 4 ♿
    ┌────────────┐
  5   🔹🔹♿🔹🔹
  4   ▫▫▫▫▫
  3   ▫▫▫▫▫
  2   ▫▫▫▫▫
  1   ⭕⭕📛⭕⭕
              a    b    c    d    e
    └────────────┘
  Turn: 📛
  @help 
  ``` **/
  printBoard() {
    const { NO_ROWS, P1, P1_PIECE, P1_KING, P2, P2_PIECE, P2_KING, EMPTY, GOAL, 
      P1_PIECE_CHAR, P1_KING_CHAR, P2_PIECE_CHAR, P2_KING_CHAR } = this.CONFIG;

    const EMPTY_CHAR = "▫",//"▫",
      GOAL_CHAR = "▪",//"▪",
      COL_DIVIDER = "",
      BR = `<br/>`,
      Q3 = "```",
      ROW_DIVIDER = "",
      TOP_DIVIDER = "  ┌────────────┐",
      BOT_DIVIDER = "  └────────────┘",
      LETTERS = "      a    b    c  d  e "
    //"╔═╦╬╚╗║╠╣╝╩"

    let result = "";
    result += Q3 + this.getScore() + Q3 + BR;
    result += TOP_DIVIDER + BR;

    for (let row = 0; row < NO_ROWS; row++) {
      let rowChars = [], rowResult = "";
      rowResult += (NO_ROWS - row) + " ";

      for (let col = 0; col < NO_ROWS; col++) {
        let piece = this.board[row * NO_ROWS + col];
        switch (piece) {
          case P1_PIECE: rowChars[col] = P1_PIECE_CHAR; break;
          case P1_KING: rowChars[col] = P1_KING_CHAR; break;
          case P2_PIECE: rowChars[col] = P2_PIECE_CHAR; break;
          case P2_KING: rowChars[col] = P2_KING_CHAR; break;
          case GOAL: rowChars[col] = GOAL_CHAR; break;
          case EMPTY: rowChars[col] = EMPTY_CHAR; break;
        }

        rowResult += COL_DIVIDER + rowChars[col];
      } // col
      result += rowResult + COL_DIVIDER;

      //if (row != NO_ROWS-1) 
      result += ROW_DIVIDER + BR;

    } // row

    let turnPlayer = (this.turn == P1) ? 'P1' : 'P2',
      turnChar = this.getHeroChar(this.turn);

    result += "```" + LETTERS + BR
      + BOT_DIVIDER + BR
      //+ `Turn: ${turnPlayer} ${turnChar}` + BR
      //+ '@he‍‍lp';
    return result;
  }
}