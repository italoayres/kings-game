// Import stylesheets
import './style.css';
import { Game } from './Game.js';

const appDiv = document.getElementById('app');
appDiv.innerHTML = `<div id='board' ></div>`;
const boardDiv = document.getElementById('board');

let update = () => boardDiv.innerHTML = game.printBoard();

var game = new Game();
game.newGame();
//game.setHero(game.CONFIG.P1, "🐺");
update();

game.moveCmd("c1 b4");
update();
game.resign();
update();
console.log(game.getScore());

//testes
//console.log(`Get 🐧 tier? ${game.getHeroTier("🐧")}. Should be ${0}`);
//console.log(`Get 👻 tier? ${game.getHeroTier("👻")}. Should be ${1}`);
//console.log(`Get 🐋 tier? ${game.getHeroTier("🐋")}. Should be ${1}`);
//game.setRandomHero();
game.setHero(1, 1);
update();

let msg_help =
  `
KINGS.

Uso:
  @new [(<p1_char> <p2_char>)]
  @rules
  @config [hero <player> <char> | board | reset]
  @mate
  @game [new|draw|mate|(win|lose <player>)|(get|set <position>)]
  @info

Exemplos:
  @new                Inicia novo jogo.
  @config hero        Ver Lista de Heróis.
  @config hero 1      Muda herói do jogador 1 para um aleatório.
  @config hero 2 13   Muda herói do jogador 2 para o Herói 13.
  @mate               Da a vitória ao jogador que fez o ultimo lance.

`

let msg_rules = `
╔═════════╗
   -*Como Jogar*-
╚═════════╝
*(\__/) ||*
*(•ㅅ•) ||*
*/ 　 づ*

Para iniciar um novo jogo use o comando *@new*.
Caso o mate seja inevitável, é possivel finalizar a partida com o comando *@mate*. 
O ponto da partida irá para o jogador que fez o último lance.

Kings é um jogo simples. Todas as peças podem se mover na vertical, horizontal ou diagonal, mas sempre até o limite possivel.
As peças sempre param o movimento ou quando alcançam a borda do tabuleiro, ou logo antes de outra peça na mesma coluna, linha ou diagonal.

O jogo é jogado num tabuleiro 5x5, cada jogador começa com 5 peças em lados opostos do tabuleiro. 
O objetivo é se tornar o Rei, ocupando o quadrado central *C3* (▪) com o seu Herói, representado pela peça diferenciada. 
Exemplos de Peças: ⭕🔹 Herois: ♿📛🤖

Uma peça é representada pelas suas coordenadas no formato: <letra da coluna><número da linha> Ex.: *a1*
Para movimentar as peças use as coordenadas do movimento no formato <origem><destino>. Ex.: *a1 e4*

No caso abaixo, o Heroi 📛 se encontra na posição *c5*. 
Os espaços disponiveis para essa peça são: *a3 c2 d4* (marcados com ✖).
┌────────────┐
5 ⭕⭕📛⭕▫
4 ▫▫▫✖▫
3 ✖▫▪▫⭕
2 ▫▫✖▫🔹
1 🔹🔹♿▫🔹
      a    b    c  d  e 
└────────────┘

Peças normais podem atravessar o quadrado central, mas não podem parar nele.
Se o Herói de algum jogador for bloqueado e não possuir movimentos válidos, o jogador perde a partida.


` 
/**
 *       "*Lista de Heróis*" +
        "```" + `
Uso: 
        *@config hero <player> <hero>*
        Ex.: *@config hero 1 23*
 */